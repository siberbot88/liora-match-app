import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { FirebaseLoginDto } from './dto/firebase-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('firebase-login')
    @ApiOperation({ summary: 'Login with Firebase token' })
    @ApiResponse({ status: 200, description: 'Successfully authenticated' })
    @ApiResponse({ status: 401, description: 'Invalid Firebase token' })
    async firebaseLogin(@Body() dto: FirebaseLoginDto) {
        return this.authService.firebaseLogin(dto);
    }

    @Get('me')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Current user data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getCurrentUser(@CurrentUser() user: any) {
        return this.authService.getCurrentUser(user.userId);
    }
}
