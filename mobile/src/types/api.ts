// API Response Types

export interface Teacher {
    id: string;
    userId: string;
    bio: string;
    education: string;
    experience: number;
    hourlyRate: number;
    city: string | null;
    rating: number;
    totalReviews: number;
    user: {
        id: string;
        name: string;
        email: string;
        avatar: string | null;
    };
    subjects: TeacherSubject[];
    availabilitySlots?: AvailabilitySlot[];
    classes?: any[];
}

export interface TeacherSubject {
    id: string;
    teacherProfileId: string;
    subjectId: string;
    subject: {
        id: string;
        name: string;
        icon: string;
    };
}

export interface AvailabilitySlot {
    id: string;
    teacherProfileId: string;
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    isActive: boolean;
}

export interface Booking {
    id: string;
    studentId: string;
    teacherProfileId: string;
    subjectId: string;
    scheduledAt: string; // ISO date string
    duration: number; // minutes
    mode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    totalPrice: number;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    // Populated in responses
    teacher?: {
        id: string;
        user: {
            name: string;
            avatar: string | null;
        };
    };
    subject?: {
        id: string;
        name: string;
        icon: string;
    };
    student?: {
        user: {
            name: string;
            avatar: string | null;
        };
    };
}

// Paginated response for teachers
export interface TeachersListResponse {
    data: Teacher[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// DTOs
export interface CreateBookingDTO {
    teacherId: string;
    subjectId: string;
    scheduledAt: string;
    duration: number;
    mode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
    notes?: string;
}

export interface GetTeachersParams {
    subjectId?: string;
    city?: string;
    mode?: string;
    priceMin?: number;
    priceMax?: number;
    page?: number;
    limit?: number;
}
