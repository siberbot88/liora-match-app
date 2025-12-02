import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking, getMyBookings } from '../services/bookingsService';

/**
 * Get current user's bookings
 */
export function useMyBookings() {
    return useQuery({
        queryKey: ['bookings', 'me'],
        queryFn: getMyBookings,
    });
}

/**
 * Create a new booking
 */
export function useCreateBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            // Invalidate and refetch bookings list
            queryClient.invalidateQueries({ queryKey: ['bookings', 'me'] });
        },
    });
}
