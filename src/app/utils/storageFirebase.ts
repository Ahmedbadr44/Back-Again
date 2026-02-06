import { db, auth } from "./firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth";
import { Exercise, User } from "./storage"; // Import types

const EXERCISES_COLLECTION = "exercises";
const USERS_COLLECTION = "users";
const ACTIVATION_CODES_COLLECTION = "activation_codes";
const SITE_STATS_COLLECTION = "site_stats";
const VISITS_DOC_ID = "visits";
const CLOUDINARY_CLOUD_NAME = "ddpgrdt8u";
const CLOUDINARY_UPLOAD_PRESET = "exercises-imges";

// Default data (fallback)
const DEFAULT_USER: User = {
    name: "مشترك جديد",
    email: "",
    currentDay: 1,
    streak: 0,
    xp: 0,
    completedDays: [],
    isPremium: false,
    badges: [
        { id: 1, name: "البداية القوية", icon: "🎯", earned: false, description: "أكمل أول يوم" },
        { id: 2, name: "أسبوع كامل", icon: "🔥", earned: false, description: "أكمل 7 أيام متتالية" },
        { id: 3, name: "نصف الطريق", icon: "⭐", earned: false, description: "أكمل 14 يوم" },
        { id: 4, name: "بطل التحدي", icon: "👑", earned: false, description: "أكمل 28 يوم" },
    ],
};

const buildDefaultUser = (name?: string, email?: string): User => ({
    ...DEFAULT_USER,
    name: name || DEFAULT_USER.name,
    email: email || ""
});

const ensureUserDoc = async (uid: string, name?: string, email?: string): Promise<User> => {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as User;
    }

    const newUser = buildDefaultUser(name, email);
    await setDoc(docRef, newUser);
    return newUser;
};

const buildExerciseImagePath = (exerciseId: number, kind: "start" | "end", file: File) => {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const extensionMatch = safeName.match(/\.([a-zA-Z0-9]+)$/);
    const extension = extensionMatch ? extensionMatch[1] : "jpg";
    return `exercises/${exerciseId}/${kind}.${extension}`;
};

const compressImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith("image/")) {
        return file;
    }

    try {
        const imageBitmap = await createImageBitmap(file);
        const maxSize = 1600;
        const scale = Math.min(1, maxSize / Math.max(imageBitmap.width, imageBitmap.height));
        const targetWidth = Math.round(imageBitmap.width * scale);
        const targetHeight = Math.round(imageBitmap.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return file;
        }

        ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, "image/jpeg", 0.8);
        });

        if (!blob) {
            return file;
        }

        return new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" });
    } catch {
        return file;
    }
};

export const firebaseStorage = {
    initialize: async (): Promise<void> => {
        // Firebase is initialized in firebase.ts
        console.log("Firebase Storage Driver Initialized");
    },

    uploadExerciseImage: async (
        file: File,
        exerciseId: number,
        kind: "start" | "end",
        onProgress?: (progress: number) => void
    ): Promise<string> => {
        const compressedFile = await compressImage(file);
        const path = buildExerciseImagePath(exerciseId, kind, compressedFile);
        const formData = new FormData();
        formData.append("file", compressedFile);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("public_id", path.replace(/\.[^/.]+$/, ""));
        formData.append("folder", "exercises");

        const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

        return await new Promise<string>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", url);

            xhr.upload.onprogress = (event) => {
                if (!event.lengthComputable) return;
                const progress = Math.min(100, Math.round((event.loaded / event.total) * 100));
                onProgress?.(progress);
            };

            xhr.onload = () => {
                if (xhr.status < 200 || xhr.status >= 300) {
                    reject(new Error(`CLOUDINARY_UPLOAD_FAILED:${xhr.status}:${xhr.responseText || ""}`));
                    return;
                }
                try {
                    const data = JSON.parse(xhr.responseText) as { secure_url?: string; url?: string };
                    if (!data.secure_url && !data.url) {
                        reject(new Error("CLOUDINARY_NO_URL"));
                        return;
                    }
                    resolve(data.secure_url || data.url!);
                } catch (parseError) {
                    reject(parseError);
                }
            };

            xhr.onerror = () => {
                reject(new Error("CLOUDINARY_UPLOAD_NETWORK_ERROR"));
            };

            xhr.send(formData);
        });
    },

    getAllExercises: async (): Promise<Exercise[]> => {
        try {
            const cacheKey = "backagain_exercises_cache";
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                // Refresh cache in the background
                getDocs(collection(db, EXERCISES_COLLECTION))
                    .then((querySnapshot) => {
                        const exercises: Exercise[] = [];
                        querySnapshot.forEach((docItem) => {
                            exercises.push(docItem.data() as Exercise);
                        });
                        localStorage.setItem(cacheKey, JSON.stringify(exercises));
                    })
                    .catch((error) => {
                        console.error("Error refreshing exercises cache:", error);
                    });
                return JSON.parse(cached) as Exercise[];
            }

            const querySnapshot = await getDocs(collection(db, EXERCISES_COLLECTION));
            const exercises: Exercise[] = [];
            querySnapshot.forEach((docItem) => {
                exercises.push(docItem.data() as Exercise);
            });
            localStorage.setItem(cacheKey, JSON.stringify(exercises));
            return exercises;
        } catch (error) {
            console.error("Error fetching exercises:", error);
            return [];
        }
    },

    getVisitorCount: async (): Promise<number> => {
        try {
            const snap = await getDoc(doc(db, SITE_STATS_COLLECTION, VISITS_DOC_ID));
            if (!snap.exists()) return 0;
            const data = snap.data() as { count?: number };
            return data.count || 0;
        } catch (error) {
            console.error("Error fetching visitor count:", error);
            return 0;
        }
    },

    trackSiteVisit: async (): Promise<void> => {
        if (typeof window === "undefined") return;
        try {
            const today = new Date().toISOString().slice(0, 10);
            const cacheKey = "backagain_last_visit_day";
            const lastVisit = localStorage.getItem(cacheKey);
            if (lastVisit === today) {
                return;
            }

            await setDoc(
                doc(db, SITE_STATS_COLLECTION, VISITS_DOC_ID),
                { count: increment(1), updatedAt: serverTimestamp() },
                { merge: true }
            );

            localStorage.setItem(cacheKey, today);
        } catch (error) {
            console.error("Error tracking site visit:", error);
        }
    },

    saveExercise: async (exercise: Exercise): Promise<Exercise[]> => {
        try {
            await setDoc(doc(db, EXERCISES_COLLECTION, exercise.id.toString()), exercise);
            localStorage.removeItem("backagain_exercises_cache");
            return await firebaseStorage.getAllExercises();
        } catch (error) {
            console.error("Error saving exercise:", error);
            throw error;
        }
    },

    deleteExercise: async (id: number): Promise<Exercise[]> => {
        try {
            await deleteDoc(doc(db, EXERCISES_COLLECTION, id.toString()));
            localStorage.removeItem("backagain_exercises_cache");
            return await firebaseStorage.getAllExercises();
        } catch (error) {
            console.error("Error deleting exercise:", error);
            throw error;
        }
    },

    getUser: async (): Promise<User> => {
        const currentUser = auth.currentUser;
        if (!currentUser) return DEFAULT_USER;

        try {
            const cacheKey = `backagain_user_cache_${currentUser.uid}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                // Refresh cache in background
                ensureUserDoc(
                    currentUser.uid,
                    currentUser.displayName || "User",
                    currentUser.email || ""
                ).then((freshUser) => {
                    localStorage.setItem(cacheKey, JSON.stringify(freshUser));
                }).catch((error) => {
                    console.error("Error refreshing user cache:", error);
                });
                return JSON.parse(cached) as User;
            }

            const freshUser = await ensureUserDoc(
                currentUser.uid,
                currentUser.displayName || "User",
                currentUser.email || ""
            );
            localStorage.setItem(cacheKey, JSON.stringify(freshUser));
            return freshUser;
        } catch (error) {
            console.error("Error fetching user:", error);
            return DEFAULT_USER;
        }
    },

    saveUser: async (user: User): Promise<void> => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        try {
            await setDoc(doc(db, USERS_COLLECTION, currentUser.uid), user);
            localStorage.setItem(`backagain_user_cache_${currentUser.uid}`, JSON.stringify(user));
        } catch (error) {
            console.error("Error saving user:", error);
        }
    },

    getUserQuick: (): User | null => {
        const currentUser = auth.currentUser;
        if (!currentUser) return null;
        const cacheKey = `backagain_user_cache_${currentUser.uid}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            return JSON.parse(cached) as User;
        }
        return buildDefaultUser(
            currentUser.displayName || "مشترك جديد",
            currentUser.email || ""
        );
    },

    isLoggedIn: async (): Promise<boolean> => {
        // Return a promise that resolves when auth state is known
        return new Promise((resolve) => {
            // First, if user is already here, we are definitely logged in
            if (auth.currentUser) {
                localStorage.setItem("backagain_is_logged_in", "true");
                resolve(true);
                return;
            }

            // Otherwise, check local storage for a "hint"
            const cachedLogin = localStorage.getItem("backagain_is_logged_in") === "true";

            // Set up a listener to get the definitive answer from Firebase
            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe();
                if (user) {
                    localStorage.setItem("backagain_is_logged_in", "true");
                    resolve(true);
                } else {
                    localStorage.removeItem("backagain_is_logged_in");
                    resolve(false);
                }
            });

            // If we have a hint, we can assume true to speed up UI loading, 
            // but we'll wait a tiny bit for Firebase if possible to avoids dummy data
            if (cachedLogin) {
                // We don't resolve immediately here anymore to ensure auth.currentUser is populated
                // if Firebase is quick. But we could if we want extreme speed.
                // To fix the "not entering" issue, let's trust the cache but ensure getUser waits.
                resolve(true);
            }
        });
    },

    login: async (): Promise<void> => {
        console.warn("Use loginWithGoogle instead");
    },

    loginWithGoogle: async (): Promise<User | null> => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userData = buildDefaultUser(
                user.displayName || "مشترك جديد",
                user.email || ""
            );

            // Instant cache update
            localStorage.setItem("backagain_is_logged_in", "true");
            localStorage.setItem(`backagain_user_cache_${user.uid}`, JSON.stringify(userData));

            // Sync with Firestore in the background to avoid blocking login UX
            ensureUserDoc(user.uid, userData.name, userData.email).catch((firestoreError: any) => {
                console.error("Firestore Error (Login proceeds loosely):", firestoreError);
            });

            return userData;
        } catch (error) {
            console.error("Google Login Error:", error);
            throw error;
        }
    },

    getAllUsers: async (): Promise<Array<User & { id: string }>> => {
        try {
            const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
            const users: Array<User & { id: string }> = [];
            querySnapshot.forEach((docItem) => {
                users.push({ id: docItem.id, ...(docItem.data() as User) });
            });
            return users;
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    },

    updateUserById: async (id: string, updates: Partial<User>): Promise<void> => {
        try {
            await updateDoc(doc(db, USERS_COLLECTION, id), updates);
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },

    deleteUserById: async (id: string): Promise<void> => {
        try {
            await deleteDoc(doc(db, USERS_COLLECTION, id));
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    },

    getAllActivationCodes: async (): Promise<Array<{ id: string; code: string; used?: boolean; usedByEmail?: string; createdAt?: any; usedAt?: any }>> => {
        try {
            const querySnapshot = await getDocs(collection(db, ACTIVATION_CODES_COLLECTION));
            const codes: Array<{ id: string; code: string; used?: boolean; usedByEmail?: string; createdAt?: any; usedAt?: any }> = [];
            querySnapshot.forEach((docItem) => {
                const data = docItem.data() as { code: string; used?: boolean; usedByEmail?: string; createdAt?: any; usedAt?: any };
                codes.push({ id: docItem.id, ...data });
            });
            return codes;
        } catch (error) {
            console.error("Error fetching activation codes:", error);
            return [];
        }
    },

    createActivationCode: async (code: string): Promise<void> => {
        try {
            const normalizedCode = code.trim().toUpperCase();
            await setDoc(doc(db, ACTIVATION_CODES_COLLECTION, normalizedCode), {
                code: normalizedCode,
                used: false,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error creating activation code:", error);
            throw error;
        }
    },

    markActivationCodeUsed: async (code: string, email?: string): Promise<void> => {
        try {
            const normalizedCode = code.trim().toUpperCase();
            await updateDoc(doc(db, ACTIVATION_CODES_COLLECTION, normalizedCode), {
                used: true,
                usedByEmail: email || "",
                usedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating activation code:", error);
            throw error;
        }
    },

    deleteActivationCode: async (code: string): Promise<void> => {
        try {
            const normalizedCode = code.trim().toUpperCase();
            await deleteDoc(doc(db, ACTIVATION_CODES_COLLECTION, normalizedCode));
        } catch (error) {
            console.error("Error deleting activation code:", error);
            throw error;
        }
    },
    redeemActivationCode: async (code: string): Promise<void> => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error("AUTH_REQUIRED");
        }

        const normalizedCode = code.trim().toUpperCase();
        const codeRef = doc(db, ACTIVATION_CODES_COLLECTION, normalizedCode);
        const codeSnap = await getDoc(codeRef);

        if (!codeSnap.exists()) {
            throw new Error("CODE_NOT_FOUND");
        }

        const codeData = codeSnap.data() as { used?: boolean };
        if (codeData.used) {
            throw new Error("CODE_USED");
        }

        await updateDoc(codeRef, {
            used: true,
            usedByEmail: currentUser.email || "",
            usedByUid: currentUser.uid,
            usedAt: serverTimestamp()
        });

        await updateDoc(doc(db, USERS_COLLECTION, currentUser.uid), {
            isPremium: true
        });

        // Update local cache for instant UI update
        const cacheKey = `backagain_user_cache_${currentUser.uid}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const parsed = JSON.parse(cached) as User;
            localStorage.setItem(cacheKey, JSON.stringify({ ...parsed, isPremium: true }));
        }
    },

    logout: async (): Promise<void> => {
        await signOut(auth);
        localStorage.removeItem("backagain_is_logged_in");
    },

    resetData: async (): Promise<void> => {
        console.log("Reset not implemented for Firebase");
    }
};
