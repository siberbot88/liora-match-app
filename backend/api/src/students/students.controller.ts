import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { UpdateStudentPreferencesDto } from './dto/update-student-preferences.dto';
import { SearchTeachersDto } from './dto/search-teachers.dto';
import { SearchClassesDto } from './dto/search-classes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Students')
@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    // =============== ADMIN ENDPOINTS ===============

    @Get()
    @ApiOperation({ summary: 'List all students (Admin)' })
    @ApiResponse({ status: 200, description: 'Students list retrieved' })
    async findAll() {
        return this.studentsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get student detail by ID (Admin)' })
    @ApiResponse({ status: 200, description: 'Student detail retrieved' })
    async findOne(@Param('id') id: string) {
        return this.studentsService.findOne(id);
    }

    // =============== STUDENT PROFILE ===============

    @Get('profile/me')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get my complete student profile' })
    @ApiResponse({ status: 200, description: 'Student profile retrieved' })
    async getMyProfile(@CurrentUser() user: any) {
        return this.studentsService.getMyProfile(user.userId);
    }

    @Patch('profile/me')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Update my student preferences' })
    @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
    async updatePreferences(
        @CurrentUser() user: any,
        @Body() dto: UpdateStudentPreferencesDto,
    ) {
        return this.studentsService.updatePreferences(user.userId, dto);
    }

    @Get('dashboard')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get student dashboard data (level, points, tier)' })
    @ApiResponse({ status: 200, description: 'Dashboard data retrieved' })
    async getStudentDashboard(@CurrentUser() user: any) {
        return this.studentsService.getStudentDashboardData(user.userId);
    }

    // =============== TEACHER DISCOVERY ===============

    @Get('teachers/search')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Search teachers with advanced filters' })
    @ApiResponse({ status: 200, description: 'Teachers found' })
    async searchTeachers(
        @CurrentUser() user: any,
        @Query() query: SearchTeachersDto,
    ) {
        return this.studentsService.searchTeachers(query);
    }

    @Get('teachers/:teacherId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get teacher detail with reviews' })
    @ApiResponse({ status: 200, description: 'Teacher detail retrieved' })
    async getTeacherDetail(@Param('teacherId') teacherId: string) {
        return this.studentsService.getTeacherDetail(teacherId);
    }

    @Get('teachers/recommended')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get recommended teachers based on preferences' })
    @ApiResponse({ status: 200, description: 'Recommended teachers retrieved' })
    async getRecommendedTeachers(@CurrentUser() user: any) {
        return this.studentsService.getRecommendedTeachers(user.userId);
    }

    @Post('teachers/:teacherId/favorite')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Add teacher to favorites' })
    @ApiResponse({ status: 201, description: 'Teacher added to favorites' })
    async addToFavorites(
        @CurrentUser() user: any,
        @Param('teacherId') teacherId: string,
    ) {
        return this.studentsService.addToFavorites(user.userId, teacherId);
    }

    @Delete('teachers/:teacherId/favorite')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Remove teacher from favorites' })
    @ApiResponse({ status: 200, description: 'Teacher removed from favorites' })
    async removeFromFavorites(
        @CurrentUser() user: any,
        @Param('teacherId') teacherId: string,
    ) {
        return this.studentsService.removeFromFavorites(user.userId, teacherId);
    }

    @Get('teachers/favorites')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get my favorite teachers' })
    @ApiResponse({ status: 200, description: 'Favorite teachers retrieved' })
    async getFavoriteTeachers(@CurrentUser() user: any) {
        return this.studentsService.getFavoriteTeachers(user.userId);
    }

    // =============== CLASS DISCOVERY & ENROLLMENT ===============

    @Get('classes/search')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Search classes with filters' })
    @ApiResponse({ status: 200, description: 'Classes found' })
    async searchClasses(@Query() query: SearchClassesDto) {
        return this.studentsService.searchClasses(query);
    }

    @Get('classes/:classId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get class detail' })
    @ApiResponse({ status: 200, description: 'Class detail retrieved' })
    async getClassDetail(@Param('classId') classId: string) {
        return this.studentsService.getClassDetail(classId);
    }

    @Get('classes/enrolled')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get my enrolled classes' })
    @ApiResponse({ status: 200, description: 'Enrolled classes retrieved' })
    async getEnrolledClasses(@CurrentUser() user: any) {
        return this.studentsService.getEnrolledClasses(user.userId);
    }

    @Get('classes/:classId/progress')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get my progress in a class' })
    @ApiResponse({ status: 200, description: 'Class progress retrieved' })
    async getClassProgress(
        @CurrentUser() user: any,
        @Param('classId') classId: string,
    ) {
        return this.studentsService.getClassProgress(user.userId, classId);
    }

    // =============== BOOKING MANAGEMENT ===============

    @Get('bookings')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get all my bookings' })
    @ApiResponse({ status: 200, description: 'Bookings retrieved' })
    async getMyBookings(
        @CurrentUser() user: any,
        @Query('status') status?: string,
    ) {
        return this.studentsService.getMyBookings(user.userId, status);
    }

    @Get('bookings/history')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get booking history (past bookings)' })
    @ApiResponse({ status: 200, description: 'Booking history retrieved' })
    async getBookingHistory(@CurrentUser() user: any) {
        return this.studentsService.getBookingHistory(user.userId);
    }

    @Get('bookings/:bookingId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get booking detail' })
    @ApiResponse({ status: 200, description: 'Booking detail retrieved' })
    async getBookingDetail(
        @CurrentUser() user: any,
        @Param('bookingId') bookingId: string,
    ) {
        return this.studentsService.getBookingDetail(user.userId, bookingId);
    }

    // =============== LEARNING PROGRESS ===============

    @Get('progress')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get overall learning progress' })
    @ApiResponse({ status: 200, description: 'Learning progress retrieved' })
    async getLearningProgress(@CurrentUser() user: any) {
        return this.studentsService.getLearningProgress(user.userId);
    }

    @Get('progress/subjects')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get progress by subject' })
    @ApiResponse({ status: 200, description: 'Subject progress retrieved' })
    async getSubjectProgress(@CurrentUser() user: any) {
        return this.studentsService.getSubjectProgress(user.userId);
    }
}
