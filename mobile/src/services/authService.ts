import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { api } from '../api/client';

export type UserRole = 'STUDENT' | 'TEACHER';

interface BackendAuthResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        avatar?: string;
        studentProfile?: any;
        teacherProfile?: any;
    };
    role: string;
}

/**
 * Login with Firebase and get backend JWT
 */
export async function loginWithEmail(
    email: string,
    password: string,
    role: UserRole = 'STUDENT'
): Promise<BackendAuthResponse> {
    try {
        // Step 1: Sign in with Firebase
        const credential = await signInWithEmailAndPassword(auth, email, password);

        // Step 2: Get Firebase ID Token
        const firebaseToken = await credential.user.getIdToken(true);

        // Step 3: Exchange with backend for internal JWT
        const response = await loginToBackend(firebaseToken, role);

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Fail to login');
    }
}

/**
 * Register new user with Firebase and create profile in backend
 */
export async function registerWithEmail(
    email: string,
    password: string,
    role: UserRole = 'STUDENT'
): Promise<BackendAuthResponse> {
    try {
        // Step 1: Create user in Firebase
        const credential = await createUserWithEmailAndPassword(auth, email, password);

        // Step 2: Get Firebase ID Token
        const firebaseToken = await credential.user.getIdToken(true);

        // Step 3: Send to backend to create user profile
        const response = await loginToBackend(firebaseToken, role);

        return response;
    } catch (error: any) {
        console.error('Registration error:', error);
        throw new Error(error.message || 'Failed to register');
    }
}

/**
 * Exchange Firebase token for backend JWT
 */
export async function loginToBackend(
    firebaseToken: string,
    role: UserRole
): Promise<BackendAuthResponse> {
    try {
        const { data } = await api.post<BackendAuthResponse>('/auth/firebase-login', {
            firebaseToken,
            role,
        });

        return data;
    } catch (error: any) {
        console.error('Backend login error:', error);
        throw new Error(error.response?.data?.message || 'Failed to authenticate with backend');
    }
}

/**
 * Get current user from backend
 */
export async function getCurrentUser() {
    try {
        const { data } = await api.get('/auth/profile'); // Fixed: was /auth/me
        return data;
    } catch (error: any) {
        console.error('Get current user error:', error);
        throw new Error(error.response?.data?.message || 'Failed to get user');
    }
}

/**
 * Logout user from Firebase
 */
export async function logout() {
    try {
        await auth.signOut();
    } catch (error: any) {
        console.error('Logout error:', error);
        throw new Error(error.message || 'Failed to logout');
    }
}
