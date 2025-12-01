import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Students')
@ApiBearerAuth('JWT-auth')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Get('me')
    @ApiOperation({ summary: 'Get my student profile' })
    @ApiResponse({ status: 200, description: 'Student profile retrieved' })
    async getMyProfile(@CurrentUser() user: any) {
        return this.studentsService.getMyProfile(user.userId);
    }

    @Get('me/classes')
    @ApiOperation({ summary: 'Get my enrolled classes' })
    @ApiResponse({ status: 200, description: 'Enrolled classes list' })
    async getMyClasses(@CurrentUser() user: any) {
        return this.studentsService.getMyClasses(user.userId);
    }

    @Get('me/bookings')
    @ApiOperation({ summary: 'Get my bookings' })
    @ApiResponse({ status: 200, description: 'Bookings list' })
    async getMyBookings(@CurrentUser() user: any) {
        return this.studentsService.getMyBookings(user.userId);
    }
}
