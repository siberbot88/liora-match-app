import { apiClient } from './client';

// Types
export interface StudentDashboard {
    level: number;
    levelName: string;
    tier: 'Free' | 'Membership' | 'Pro';
    points: number;
    nextLevelPoints: number;
    progressPercentage: number;
}

export interface Subject {
    id: string;
    name: string;
    icon: string;
}

export interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    type: string;
    isActive: boolean;
}

// API Methods
export const dashboardApi = {
    // Get student dashboard data (level, points, tier)
    getStudentDashboard: async (): Promise<StudentDashboard> => {
        const response = await apiClient.get<StudentDashboard>('/students/dashboard');
        return response.data;
    },

    // Get all subjects for Minat & Bakat
    getSubjects: async (): Promise<Subject[]> => {
        const response = await apiClient.get<Subject[]>('/subjects');
        return response.data;
    },

    // Get promotional banners
    getBanners: async (type: string = 'HERO'): Promise<Banner[]> => {
        const response = await apiClient.get<Banner[]>('/banners', {
            params: { type },
        });
        return response.data;
    },
};
