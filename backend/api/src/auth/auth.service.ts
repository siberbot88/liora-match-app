import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseLoginDto } from './dto/firebase-login.dto';
import { UserRole } from '@prisma/client';

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
            const decodedToken = await this.firebaseService.verifyIdToken(dto.firebaseToken);

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
                        phone: decodedToken.phone_number,
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
            if (!user.isActive) {
                throw new UnauthorizedException('User account is inactive');
            }

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

    async getCurrentUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentProfile: true,
                teacherProfile: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
            isActive: user.isActive,
            createdAt: user.createdAt,
            studentProfile: user.studentProfile,
            teacherProfile: user.teacherProfile,
        };
    }
}
