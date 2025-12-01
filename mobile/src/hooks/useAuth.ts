import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { loginWithEmail, registerWithEmail, logout as logoutService } from '../services/authService';

export type UserRole = 'STUDENT' | 'TEACHER';

export function useAuth() {
    const { user, token, isAuthenticated, isLoading, login, logout: storeLogout, setLoading } = useAuthStore();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (email: string, password: string, role: UserRole = 'STUDENT') => {
        try {
            setLoading(true);
            setError(null);

            const response = await loginWithEmail(email, password, role);
            login(response.user, response.accessToken);

            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (email: string, password: string, role: UserRole = 'STUDENT') => {
        try {
            setLoading(true);
            setError(null);

            const response = await registerWithEmail(email, password, role);
            login(response.user, response.accessToken);

            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logoutService();
            storeLogout();
        } catch (err: any) {
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
    };
}
