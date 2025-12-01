import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Bookings')
@ApiBearerAuth('JWT-auth')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Get('me')
    @ApiOperation({ summary: 'Get my bookings' })
    @ApiResponse({ status: 200, description: 'My bookings (student or teacher)' })
    async getMyBookings(@CurrentUser() user: any) {
        return this.bookingsService.findMyBookings(user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get booking detail' })
    @ApiResponse({ status: 200, description: 'Booking detail retrieved' })
    async getBooking(@CurrentUser() user: any, @Param('id') id: string) {
        return this.bookingsService.findOne(user.userId, id);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Create booking (student only)' })
    @ApiResponse({ status: 201, description: 'Booking created successfully' })
    async createBooking(@CurrentUser() user: any, @Body() dto: CreateBookingDto) {
        return this.bookingsService.create(user.userId, dto);
    }

    @Patch(':id/confirm')
    @UseGuards(RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Confirm booking (teacher only)' })
    @ApiResponse({ status: 200, description: 'Booking confirmed' })
    async confirmBooking(@CurrentUser() user: any, @Param('id') id: string) {
        return this.bookingsService.confirm(user.userId, id);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel booking (student or teacher)' })
    @ApiResponse({ status: 200, description: 'Booking cancelled' })
    async cancelBooking(@CurrentUser() user: any, @Param('id') id: string) {
        return this.bookingsService.cancel(user.userId, id);
    }
}
