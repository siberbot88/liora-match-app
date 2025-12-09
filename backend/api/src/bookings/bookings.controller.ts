import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    // =============== STUDENT ENDPOINTS ===============

    @Post()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Create booking (Student only)' })
    @ApiResponse({ status: 201, description: 'Booking created with PENDING status' })
    @ApiResponse({ status: 400, description: 'Teacher not available at requested time' })
    async create(
        @CurrentUser() user: any,
        @Body() dto: CreateBookingDto,
    ) {
        return this.bookingsService.create(user.userId, dto);
    }

    @Get('me')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT, UserRole.TEACHER)
    @ApiOperation({ summary: 'Get my bookings (Role-aware)' })
    @ApiResponse({ status: 200, description: 'Student: bookings made, Teacher: bookings received' })
    async getMyBookings(
        @CurrentUser() user: any,
        @Query('status') status?: string,
    ) {
        return this.bookingsService.getMyBookings(user.userId, user.role, status);
    }

    @Patch(':id/cancel')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT, UserRole.TEACHER)
    @ApiOperation({ summary: 'Cancel booking (Student or Teacher)' })
    @ApiResponse({ status: 200, description: 'Booking cancelled' })
    async cancel(
        @CurrentUser() user: any,
        @Param('id') bookingId: string,
    ) {
        return this.bookingsService.cancel(user.userId, user.role, bookingId);
    }

    // =============== TEACHER ENDPOINTS ===============

    @Patch(':id/confirm')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Confirm booking (Teacher only)' })
    @ApiResponse({ status: 200, description: 'Booking confirmed' })
    @ApiResponse({ status: 403, description: 'Only teacher can confirm their own bookings' })
    async confirm(
        @CurrentUser() user: any,
        @Param('id') bookingId: string,
    ) {
        return this.bookingsService.confirm(user.userId, bookingId);
    }

    @Patch(':id/complete')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Mark booking as completed (Teacher only)' })
    @ApiResponse({ status: 200, description: 'Booking marked as completed' })
    async complete(
        @CurrentUser() user: any,
        @Param('id') bookingId: string,
    ) {
        return this.bookingsService.complete(user.userId, bookingId);
    }

    // =============== COMMON ENDPOINTS ===============

    @Get(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT, UserRole.TEACHER)
    @ApiOperation({ summary: 'Get booking detail' })
    @ApiResponse({ status: 200, description: 'Booking detail retrieved' })
    async findOne(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.bookingsService.findOne(user.userId, user.role, id);
    }

    // =============== ADMIN ENDPOINTS ===============

    @Get()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all bookings with filters (Admin only)' })
    @ApiResponse({ status: 200, description: 'List of all bookings' })
    async findAll(
        @Query('status') status?: string,
        @Query('studentId') studentId?: string,
        @Query('teacherId') teacherId?: string,
        @Query('classId') classId?: string,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
        @Query('search') search?: string,
    ) {
        const filters: any = {};

        if (status) filters.status = status;
        if (studentId) filters.studentId = studentId;
        if (teacherId) filters.teacherId = teacherId;
        if (classId) filters.classId = classId;
        if (dateFrom) filters.dateFrom = dateFrom;
        if (dateTo) filters.dateTo = dateTo;
        if (search) filters.search = search;

        return this.bookingsService.findAllAdmin(filters);
    }

    @Patch('admin/:id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update booking (Admin only)' })
    @ApiResponse({ status: 200, description: 'Booking updated' })
    async updateAdmin(
        @Param('id') id: string,
        @Body() updateData: any,
    ) {
        return this.bookingsService.updateAdmin(id, updateData);
    }

    @Patch('admin/:id/status')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update booking status (Admin only)' })
    @ApiResponse({ status: 200, description: 'Status updated' })
    async updateStatusAdmin(
        @Param('id') id: string,
        @Body('status') status: string,
    ) {
        return this.bookingsService.updateStatusAdmin(id, status as any);
    }

    @Patch('admin/:id/delete')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete booking (Admin only)' })
    @ApiResponse({ status: 200, description: 'Booking deleted' })
    async deleteAdmin(@Param('id') id: string) {
        return this.bookingsService.deleteAdmin(id);
    }
}
