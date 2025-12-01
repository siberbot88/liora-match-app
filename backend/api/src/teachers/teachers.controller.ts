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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Teachers')
@Controller('teachers')
export class TeachersController {
    constructor(private readonly teachersService: TeachersService) { }

    @Get()
    @ApiOperation({ summary: 'List all teachers with filters' })
    @ApiResponse({ status: 200, description: 'Teachers list retrieved' })
    async findAll(@Query() query: QueryTeachersDto) {
        return this.teachersService.findAll(query);
    }

    @Get('me')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get my teacher profile' })
    @ApiResponse({ status: 200, description: 'Teacher profile retrieved' })
    async getMyProfile(@CurrentUser() user: any) {
        return this.teachersService.getMyProfile(user.userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.teachersService.findOne(id);
    }

    @Patch('me')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    async updateProfile(
        @CurrentUser() user: any,
        @Body() dto: UpdateTeacherProfileDto,
    ) {
        return this.teachersService.updateProfile(user.userId, dto);
    }

    @Post('me/subjects')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    async addSubject(@CurrentUser() user: any, @Body() dto: AddSubjectDto) {
        return this.teachersService.addSubject(user.userId, dto);
    }

    @Delete('me/subjects/:teacherSubjectId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    async removeSubject(
        @CurrentUser() user: any,
        @Param('teacherSubjectId') teacherSubjectId: string,
    ) {
        return this.teachersService.removeSubject(user.userId, teacherSubjectId);
    }

    @Post('me/availability')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    async addAvailability(
        @CurrentUser() user: any,
        @Body() dto: AddAvailabilityDto,
    ) {
        return this.teachersService.addAvailability(user.userId, dto);
    }

    @Get('me/availability')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    async getAvailability(@CurrentUser() user: any) {
        return this.teachersService.getAvailability(user.userId);
    }
}
