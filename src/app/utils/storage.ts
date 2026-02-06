export interface Exercise {
    id: number;
    day: number;
    nameAr: string;
    nameEn: string;
    duration: string;
    instructions: string;
    benefits?: string;
    videoUrl: string;
    startImageUrl?: string;
    endImageUrl?: string;
    thumbnail?: string;
    completed?: boolean;
}

export interface Badge {
    id: number;
    name: string;
    icon: string;
    earned: boolean;
    description: string;
}

export type User = {
    name: string;
    email: string;
    currentDay: number;
    streak: number;
    xp: number;
    completedDays: number[];
    isPremium: boolean;
    badges: Badge[];
};

const STORAGE_KEYS = {
    EXERCISES: 'backagain_exercises',
    USER: 'backagain_user',
    IS_LOGGED_IN: 'backagain_is_logged_in'
};

const DEFAULT_EXERCISES: Exercise[] = [
    {
        id: 1,
        day: 1,
        nameAr: "تمدد القطة والبقرة",
        nameEn: "Cat-Cow Stretch",
        duration: "2 دقيقة",
        videoUrl: "",
        startImageUrl: "https://images.unsplash.com/photo-1544367563-121542f83d98?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        endImageUrl: "https://images.unsplash.com/photo-1544367563-121542f83d98?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        thumbnail: "https://images.unsplash.com/photo-1544367563-121542f83d98?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        instructions: "على أربع، قوس ظهرك لأعلى ثم لأسفل ببطء",
    },
    {
        id: 2,
        day: 1,
        nameAr: "تمدد الطفل",
        nameEn: "Child's Pose",
        duration: "3 دقائق",
        videoUrl: "",
        startImageUrl: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        endImageUrl: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        instructions: "اجلس على الكعبين ومد يديك للأمام",
    },
    {
        id: 3,
        day: 2,
        nameAr: "تمرين الجسر",
        nameEn: "Bridge Exercise",
        duration: "3 دقائق",
        videoUrl: "",
        startImageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        endImageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        instructions: "استلقِ على ظهرك وارفع حوضك لأعلى",
    },
    {
        id: 4,
        day: 1,
        nameAr: "تمدد الظهر السفلي",
        nameEn: "Lower Back Stretch",
        duration: "2 دقيقة",
        videoUrl: "",
        startImageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        endImageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        instructions: "اسحب ركبتيك نحو صدرك",
    },
    {
        id: 5,
        day: 1,
        nameAr: "تمرين السوبرمان",
        nameEn: "Superman Exercise",
        duration: "2 دقيقة",
        videoUrl: "",
        startImageUrl: "https://images.unsplash.com/photo-1588286840104-e356c3397931?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        endImageUrl: "https://images.unsplash.com/photo-1588286840104-e356c3397931?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        thumbnail: "https://images.unsplash.com/photo-1588286840104-e356c3397931?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        instructions: "استلقِ على بطنك وارفع يديك وقدميك",
    },
    {
        id: 6,
        day: 1,
        nameAr: "تمدد نهائي",
        nameEn: "Cool Down Stretch",
        duration: "3 دقائق",
        videoUrl: "",
        startImageUrl: "https://images.unsplash.com/photo-1544367563-121542f83d98?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        endImageUrl: "https://images.unsplash.com/photo-1544367563-121542f83d98?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        thumbnail: "https://images.unsplash.com/photo-1544367563-121542f83d98?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        instructions: "تمددات خفيفة للاسترخاء",
    }
];

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

export const storage = {
    initialize: async (): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!localStorage.getItem(STORAGE_KEYS.EXERCISES)) {
            localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(DEFAULT_EXERCISES));
        }
    },

    getAllExercises: async (): Promise<Exercise[]> => {
        const data = localStorage.getItem(STORAGE_KEYS.EXERCISES);
        return data ? JSON.parse(data) : DEFAULT_EXERCISES;
    },

    saveExercise: async (exercise: Exercise): Promise<Exercise[]> => {
        const exercises = await storage.getAllExercises();
        const existingIndex = exercises.findIndex(e => e.id === exercise.id);

        if (existingIndex >= 0) {
            exercises[existingIndex] = exercise;
        } else {
            exercises.push(exercise);
        }

        localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
        return exercises;
    },

    deleteExercise: async (id: number): Promise<Exercise[]> => {
        const allExercises = await storage.getAllExercises();
        const exercises = allExercises.filter(e => e.id !== id);
        localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
        return exercises;
    },

    getUser: async (): Promise<User> => {
        const data = localStorage.getItem(STORAGE_KEYS.USER);
        return data ? JSON.parse(data) : DEFAULT_USER;
    },

    saveUser: async (user: User): Promise<void> => {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },

    isLoggedIn: async (): Promise<boolean> => {
        return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
    },

    login: async (): Promise<void> => {
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
        if (!localStorage.getItem(STORAGE_KEYS.USER)) {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
        }
    },

    logout: async (): Promise<void> => {
        localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    },

    resetData: async (): Promise<void> => {
        localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(DEFAULT_EXERCISES));
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    }
};
