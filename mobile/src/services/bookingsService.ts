import { api } from '../api/client';
import { Booking, CreateBookingDTO } from '../types/api';

/**
 * Create a new booking
 */
export async function createBooking(dto: CreateBookingDTO): Promise<Booking> {
    const { data } = await api.post<Booking>('/bookings', dto);
    return data;
}

/**
 * Get current user's bookings
 * Note: Response is array, not paginated
 */
export async function getMyBookings(): Promise<Booking[]> {
    const { data } = await api.get<Booking[]>('/bookings/me');
    return data;
}
