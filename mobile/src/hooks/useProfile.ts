import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../services/authService';
import { useAuthStore } from '../store/authStore';

/**
 * Get current user profile
 */
export function useProfile() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    return useQuery({
        queryKey: ['profile'],
        queryFn: getCurrentUser,
        enabled: isAuthenticated,
    });
}
