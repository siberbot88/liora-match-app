import { api } from '../api/client';
import { Teacher, TeachersListResponse, GetTeachersParams } from '../types/api';

/**
 * Get paginated list of teachers with optional filters
 */
export async function getTeachers(params?: GetTeachersParams): Promise<TeachersListResponse> {
    const { data } = await api.get<TeachersListResponse>('/teachers', { params });
    return data;
}

/**
 * Get single teacher detail by ID
 */
export async function getTeacherDetail(id: string): Promise<Teacher> {
    const { data } = await api.get<Teacher>(`/teachers/${id}`);
    return data;
}
