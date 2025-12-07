import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseLoginDto } from './dto/firebase-login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private firebaseService: FirebaseService,
    ) { }

    async firebaseLogin(dto: FirebaseLoginDto) {
        try {
            // Verify Firebase token
            const decodedToken = await this.firebaseService.verifyToken(dto.firebaseToken);

            if (!decodedToken.uid || !decodedToken.email) {
                throw new UnauthorizedException('Invalid Firebase token');
            }

            // Find or create user
            let user = await this.prisma.user.findUnique({
                where: { firebaseUid: decodedToken.uid },
                include: {
                    studentProfile: true,
                    teacherProfile: true,
                },
            });

            if (!user) {
                // Create new user
                const role = dto.role || UserRole.STUDENT; // Default to STUDENT if not specified

                user = await this.prisma.user.create({
                    data: {
                        email: decodedToken.email,
                        name: decodedToken.name || decodedToken.email.split('@')[0],
                        firebaseUid: decodedToken.uid,
                        role: role,
                        phone: dto.phone || decodedToken.phone_number,
                        avatar: decodedToken.picture,
                    },
                    include: {
                        studentProfile: true,
                        teacherProfile: true,
                    },
                });

                // Create role-specific profile
                if (role === UserRole.STUDENT) {
                    await this.prisma.studentProfile.create({
                        data: {
                            userId: user.id,
                        },
                    });
                } else if (role === UserRole.TEACHER) {
                    await this.prisma.teacherProfile.create({
                        data: {
                            userId: user.id,
                            bio: '',
                            education: '',
                            experience: 0,
                            hourlyRate: 50000,
                        },
                    });
                }

                // Reload user with profile
                user = await this.prisma.user.findUnique({
                    where: { id: user.id },
                    include: {
                        studentProfile: true,
                        teacherProfile: true,
                    },
                });
            }

            // Check if user is active
            // Generate internal JWT
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role,
                firebaseUid: user.firebaseUid,
            };

            const accessToken = this.jwtService.sign(payload);

            return {
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    avatar: user.avatar,
                    studentProfile: user.studentProfile,
                    teacherProfile: user.teacherProfile,
                },
                role: user.role,
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Failed to verify Firebase token');
        }
    }

    async adminLogin(dto: AdminLoginDto) {
        const admin = await this.prisma.admin.findUnique({
            where: { email: dto.email },
        });

        if (!admin) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, admin.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: admin.id,
            email: admin.email,
            role: admin.role, // e.g. "SUPER_ADMIN"
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                avatar: admin.avatar,
            },
        };
    }

    async getCurrentUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentProfile: {
                    include: {
                        enrollments: {
                            where: { isActive: true },
                            include: {
                                class: {
                                    include: {
                                        // TEMP FIX: subjectRel: true,
                                        teacher: {
                                            include: {
                                                user: {
                                                    select: {
                                                        id: true,
                                                        name: true,
                                                        avatar: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            take: 10,
                            orderBy: { enrolledAt: 'desc' },
                        },
                        bookings: {
                            where: {
                                status: { in: ['PENDING', 'CONFIRMED'] },
                            },
                            include: {
                                class: {
                                    include: {
                                        // TEMP FIX: subjectRel: true,
                                    },
                                },
                                teacher: {
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                name: true,
                                                avatar: true,
                                            },
                                        },
                                    },
                                },
                            },
                            take: 10,
                            orderBy: { scheduledAt: 'desc' },
                        },
                    },
                },
                teacherProfile: {
                    include: {
                        subjects: {
                            include: {
                                // TEMP FIX: subjectRel: true,
                            },
                        },
                        availabilitySlots: {
                            where: { isActive: true },
                            orderBy: [
                                { dayOfWeek: 'asc' },
                                { startTime: 'asc' },
                            ],
                        },
                        classes: {
                            where: { isActive: true },
                            include: {
                                // TEMP FIX: subjectRel: true,
                                _count: {
                                    select: {
                                        enrollments: true,
                                    },
                                },
                            },
                            take: 10,
                            orderBy: { createdAt: 'desc' },
                        },
                        bookings: {
                            where: {
                                status: { in: ['PENDING', 'CONFIRMED'] },
                            },
                            include: {
                                student: {
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                name: true,
                                                avatar: true,
                                            },
                                        },
                                    },
                                },
                                // TEMP FIX: subjectRel: true,
                            },
                            take: 10,
                            orderBy: { scheduledAt: 'desc' },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        // Return structured response based on role
        const response: any = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        if (user.role === UserRole.STUDENT && user.studentProfile) {
            response.studentProfile = {
                id: user.studentProfile.id,
                grade: user.studentProfile.grade,
                school: user.studentProfile.school,
                address: user.studentProfile.address,
                parentName: user.studentProfile.parentName,
                parentPhone: user.studentProfile.parentPhone,
                learningGoals: user.studentProfile.learningGoals,
                enrolledClasses: user.studentProfile.enrollments?.map((e) => ({
                    ...e.class,
                    enrollmentProgress: e.progress,
                    enrolledAt: e.enrolledAt,
                })) || [],
                upcomingBookings: user.studentProfile.bookings || [],
            };
        } else if (user.role === UserRole.TEACHER && user.teacherProfile) {
            response.teacherProfile = {
                id: user.teacherProfile.id,
                bio: user.teacherProfile.bio,
                education: user.teacherProfile.education,
                experience: user.teacherProfile.experience,
                hourlyRate: user.teacherProfile.hourlyRate,
                rating: user.teacherProfile.rating,
                totalReviews: user.teacherProfile.totalReviews,
                isVerified: user.teacherProfile.isVerified,
                city: user.teacherProfile.city,
                province: user.teacherProfile.province,
                subjects: user.teacherProfile.subjects || [],
                availabilitySlots: user.teacherProfile.availabilitySlots || [],
                activeClasses: user.teacherProfile.classes || [],
                pendingBookings: user.teacherProfile.bookings || [],
            };
        }

        return response;
    }
}
