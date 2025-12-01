import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Calendar')
@ApiBearerAuth('JWT-auth')
@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) { }

    @Get('my')
    @ApiOperation({ summary: 'Get my calendar (role-aware)' })
    @ApiResponse({ status: 200, description: 'Calendar retrieved' })
    async getMyCalendar(
        @CurrentUser() user: any,
        @Query('month') month: string,
        @Query('year') year: string,
    ) {
        const monthNum = month ? parseInt(month) : new Date().getMonth() + 1;
        const yearNum = year ? parseInt(year) : new Date().getFullYear();

        return this.calendarService.getMyCalendar(user.userId, monthNum, yearNum);
    }

    @Get('teacher/:teacherId')
    @ApiOperation({ summary: 'Get teacher public calendar' })
    @ApiResponse({ status: 200, description: 'Teacher calendar retrieved' })
    async getTeacherCalendar(
        @Param('teacherId') teacherId: string,
        @Query('month') month: string,
        @Query('year') year: string,
    ) {
        const monthNum = month ? parseInt(month) : new Date().getMonth() + 1;
        const yearNum = year ? parseInt(year) : new Date().getFullYear();

        return this.calendarService.getTeacherPublicCalendar(teacherId, monthNum, yearNum);
    }

    @Get('booking/:bookingId/calendar-link')
    @ApiOperation({ summary: 'Generate Google Calendar link for booking' })
    @ApiResponse({ status: 200, description: 'Calendar link generated' })
    async getBookingCalendarLink(
        @CurrentUser() user: any,
        @Param('bookingId') bookingId: string,
    ) {
        return this.calendarService.generateBookingCalendarLink(user.userId, bookingId);
    }
}
