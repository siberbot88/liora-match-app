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
import { TeachersService } from './teachers.service';
import { QueryTeachersDto } from './dto/query-teachers.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';
import { AddSubjectDto } from './dto/add-subject.dto';
import { AddAvailabilityDto } from './dto/add-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { BulkAddAvailabilityDto } from './dto/bulk-add-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Teachers')
@Controller('teachers')
export class TeachersController {
    constructor(private readonly teachersService: TeachersService) { }

    // =============== PUBLIC ENDPOINTS ===============

    @Get()
    @ApiOperation({ summary: 'List all teachers with filters' })
    @ApiResponse({ status: 200, description: 'Teachers list retrieved' })
    async findAll(@Query() query: QueryTeachersDto) {
        return this.teachersService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get teacher detail by ID' })
    @ApiResponse({ status: 200, description: 'Teacher detail retrieved' })
    async findOne(@Param('id') id: string) {
        return this.teachersService.findOne(id);
    }

    // =============== TEACHER PROFILE MANAGEMENT ===============

    @Get('profile/me')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get my complete teacher profile' })
    @ApiResponse({ status: 200, description: 'Teacher profile retrieved' })
    async getMyProfile(@CurrentUser() user: any) {
        return this.teachersService.getMyProfile(user.userId);
    }

    @Patch('profile/me')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Update my teacher profile' })
    @ApiResponse({ status: 200, description: 'Profile updated successfully' })
    async updateProfile(
        @CurrentUser() user: any,
        @Body() dto: UpdateTeacherProfileDto,
    ) {
        return this.teachersService.updateProfile(user.userId, dto);
    }

    @Get('dashboard/stats')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get dashboard statistics' })
    @ApiResponse({ status: 200, description: 'Dashboard stats retrieved' })
    async getDashboard(@CurrentUser() user: any) {
        return this.teachersService.getDashboardStats(user.userId);
    }

    // =============== SUBJECT MANAGEMENT ===============

    @Get('subjects/available')
    @ApiOperation({ summary: 'Get all available subjects' })
    @ApiResponse({ status: 200, description: 'Available subjects list' })
    async getAvailableSubjects() {
        return this.teachersService.getAvailableSubjects();
    }

    @Get('subjects/me')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get my teaching subjects with stats' })
    @ApiResponse({ status: 200, description: 'My subjects retrieved' })
    async getMySubjects(@CurrentUser() user: any) {
        return this.teachersService.getMySubjects(user.userId);
    }

    @Post('subjects')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Add teaching subject' })
    @ApiResponse({ status: 201, description: 'Subject added successfully' })
    async addSubject(@CurrentUser() user: any, @Body() dto: AddSubjectDto) {
        return this.teachersService.addSubject(user.userId, dto);
    }

    @Delete('subjects/:teacherSubjectId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Remove teaching subject' })
    @ApiResponse({ status: 200, description: 'Subject removed successfully' })
    async removeSubject(
        @CurrentUser() user: any,
        @Param('teacherSubjectId') teacherSubjectId: string,
    ) {
        return this.teachersService.removeSubject(user.userId, teacherSubjectId);
    }

    // =============== AVAILABILITY & SCHEDULE ===============

    @Get('availability')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get all my availability slots' })
    @ApiResponse({ status: 200, description: 'Availability slots retrieved' })
    async getAvailability(@CurrentUser() user: any) {
        return this.teachersService.getAvailability(user.userId);
    }

    @Post('availability')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Add availability slot' })
    @ApiResponse({ status: 201, description: 'Availability slot added' })
    async addAvailability(
        @CurrentUser() user: any,
        @Body() dto: AddAvailabilityDto,
    ) {
        return this.teachersService.addAvailability(user.userId, dto);
    }

    @Post('availability/bulk')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Bulk add availability slots' })
    @ApiResponse({ status: 201, description: 'Slots added successfully' })
    async bulkAddAvailability(
        @CurrentUser() user: any,
        @Body() dto: BulkAddAvailabilityDto,
    ) {
        return this.teachersService.bulkAddAvailability(user.userId, dto);
    }

    @Patch('availability/:slotId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Update availability slot' })
    @ApiResponse({ status: 200, description: 'Slot updated successfully' })
    async updateAvailability(
        @CurrentUser() user: any,
        @Param('slotId') slotId: string,
        @Body() dto: UpdateAvailabilityDto,
    ) {
        return this.teachersService.updateAvailability(user.userId, slotId, dto);
    }

    @Delete('availability/:slotId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Delete availability slot' })
    @ApiResponse({ status: 200, description: 'Slot deleted successfully' })
    async deleteAvailability(
        @CurrentUser() user: any,
        @Param('slotId') slotId: string,
    ) {
        return this.teachersService.deleteAvailability(user.userId, slotId);
    }

    @Get('calendar')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get calendar view of all sessions' })
    @ApiResponse({ status: 200, description: 'Calendar data retrieved' })
    async getCalendar(
        @CurrentUser() user: any,
        @Query('month') month?: number,
        @Query('year') year?: number,
    ) {
        return this.teachersService.getCalendar(user.userId, month, year);
    }

    // =============== CLASS MANAGEMENT ===============

    @Get('classes/me')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get my classes with students count' })
    @ApiResponse({ status: 200, description: 'My classes retrieved' })
    async getMyClasses(@CurrentUser() user: any) {
        return this.teachersService.getMyClasses(user.userId);
    }

    @Get('classes/:classId/students')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get enrolled students in my class' })
    @ApiResponse({ status: 200, description: 'Students list retrieved' })
    async getClassStudents(
        @CurrentUser() user: any,
        @Param('classId') classId: string,
    ) {
        return this.teachersService.getClassStudents(user.userId, classId);
    }

    @Delete('classes/:classId/students/:studentProfileId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Remove student from class' })
    @ApiResponse({ status: 200, description: 'Student removed successfully' })
    async removeStudentFromClass(
        @CurrentUser() user: any,
        @Param('classId') classId: string,
        @Param('studentProfileId') studentProfileId: string,
    ) {
        return this.teachersService.removeStudentFromClass(user.userId, classId, studentProfileId);
    }

    // =============== BOOKING MANAGEMENT ===============

    @Get('bookings')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get all my bookings with filters' })
    @ApiResponse({ status: 200, description: 'Bookings retrieved' })
    async getMyBookings(
        @CurrentUser() user: any,
        @Query('status') status?: string,
    ) {
        return this.teachersService.getMyBookings(user.userId, status);
    }

    @Get('bookings/pending')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get pending bookings only' })
    @ApiResponse({ status: 200, description: 'Pending bookings retrieved' })
    async getPendingBookings(@CurrentUser() user: any) {
        return this.teachersService.getPendingBookings(user.userId);
    }

    // =============== REVIEWS & RATINGS ===============

    @Get('reviews')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get all reviews received' })
    @ApiResponse({ status: 200, description: 'Reviews retrieved' })
    async getMyReviews(@CurrentUser() user: any) {
        return this.teachersService.getMyReviews(user.userId);
    }

    @Get('rating/stats')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get rating statistics' })
    @ApiResponse({ status: 200, description: 'Rating stats retrieved' })
    async getRatingStats(@CurrentUser() user: any) {
        return this.teachersService.getRatingStats(user.userId);
    }

    // =============== EARNINGS & REPORTS ===============

    @Get('earnings')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get earnings summary' })
    @ApiResponse({ status: 200, description: 'Earnings summary retrieved' })
    async getEarnings(@CurrentUser() user: any) {
        return this.teachersService.getEarningsSummary(user.userId);
    }

    @Get('earnings/monthly')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get monthly earnings breakdown' })
    @ApiResponse({ status: 200, description: 'Monthly earnings retrieved' })
    async getMonthlyEarnings(
        @CurrentUser() user: any,
        @Query('month') month?: number,
        @Query('year') year?: number,
    ) {
        return this.teachersService.getMonthlyEarnings(user.userId, month, year);
    }
}
