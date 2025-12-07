import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    firebaseUid: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        // Check if it's an admin based on role or specific payload claim
        if (payload.role === 'SUPER_ADMIN' || payload.role === 'EDITOR' || payload.role === 'VIEWER') { // Simple check, better to use a 'type' claim
            const admin = await this.prisma.admin.findUnique({
                where: { id: payload.sub },
            });

            if (!admin) {
                throw new UnauthorizedException('Admin not found or inactive');
            }

            return {
                userId: payload.sub,
                email: payload.email,
                role: payload.role,
                ...admin
            };
        }

        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: {
                studentProfile: true,
                teacherProfile: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found or inactive');
        }

        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
            firebaseUid: payload.firebaseUid,
            user,
        };
    }
}
