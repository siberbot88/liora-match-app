import { Controller, Post, Get, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { FirebaseLoginDto } from './dto/firebase-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly prisma: PrismaService,
    ) { }

    @Post('firebase-login')
    @ApiOperation({ summary: 'Login with Firebase token' })
    @ApiResponse({ status: 200, description: 'Successfully authenticated' })
    @ApiResponse({ status: 401, description: 'Invalid Firebase token' })
    async firebaseLogin(@Body() dto: FirebaseLoginDto) {
        return this.authService.firebaseLogin(dto);
    }

    @Get('profile')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get current user profile with full avatar URL' })
    @ApiResponse({ status: 200, description: 'Returns current user profile' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getProfile(@CurrentUser() user: any) {
        const profile = await this.prisma.user.findUnique({
            where: { id: user.userId },
            include: {
                studentProfile: true,
                teacherProfile: {
                    include: {
                        subjects: {
                            include: {
                                subject: true,
                            },
                        },
                    },
                },
            },
        });

        if (!profile) {
            throw new NotFoundException('User not found');
        }

        // Build full avatar URL
        const baseUrl = process.env.API_URL || 'http://localhost:3000';
        const avatarUrl = profile.avatarUrl
            ? baseUrl + profile.avatarUrl
            : null;

        return {
            ...profile,
            avatarUrl,
        };
    }
}
