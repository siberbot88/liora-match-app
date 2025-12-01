import { UserRole } from '@prisma/client';

/**
 * Authenticated user interface from JWT payload
 * Used in @CurrentUser() decorator across controllers
 */
export interface AuthUser {
    userId: string;
    email: string;
    role: UserRole;
}
