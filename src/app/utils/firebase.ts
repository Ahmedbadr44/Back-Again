import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAjNyePNYrSSeCZoqpdQFi0XnAem_jxbHE",
    authDomain: "back-again-af13f.firebaseapp.com",
    projectId: "back-again-af13f",
    storageBucket: "back-again-af13f.firebasestorage.app",
    messagingSenderId: "649352200198",
    appId: "1:649352200198:web:b76011ad84d4959c8e0387",
    measurementId: "G-ERQ070ZPK4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Analytics can throw in unsupported environments (e.g., some dev setups).
let analytics: ReturnType<typeof getAnalytics> | null = null;
try {
    if (typeof window !== "undefined") {
        analytics = getAnalytics(app);
    }
} catch {
    analytics = null;
}
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { analytics };

export default app;
