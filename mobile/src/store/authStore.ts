import { create } from 'zustand';

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    studentProfile?: any;
    teacherProfile?: any;
}

interface AuthStore {
    user: User | null;
    token: string | null;
    role: UserRole | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    role: null,
    isAuthenticated: false,
    isLoading: false,

    login: (user, token) =>
        set({
            user,
            token,
            role: user.role,
            isAuthenticated: true,
            isLoading: false,
        }),

    logout: () =>
        set({
            user: null,
            token: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
        }),

    setLoading: (loading) =>
        set({ isLoading: loading }),
}));
