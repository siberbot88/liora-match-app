import { useQuery } from '@tanstack/react-query';
import { getTeachers, getTeacherDetail } from '../services/teachersService';
import { GetTeachersParams } from '../types/api';

/**
 * Get list of teachers with optional filters
 */
export function useTeachers(params?: GetTeachersParams) {
    return useQuery({
        queryKey: ['teachers', params],
        queryFn: () => getTeachers(params),
    });
}

/**
 * Get single teacher detail
 */
export function useTeacherDetail(id: string) {
    return useQuery({
        queryKey: ['teacher', id],
        queryFn: () => getTeacherDetail(id),
        enabled: !!id,
    });
}
