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
import { ClassesService } from './classes.service';
import { QueryClassesDto } from './dto/query-classes.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) { }

    // =============== PUBLIC/STUDENT ENDPOINTS ===============

    @Get()
    @ApiOperation({ summary: 'List all active classes' })
    @ApiResponse({ status: 200, description: 'Classes list retrieved' })
    async findAll(@Query() query: QueryClassesDto) {
        return this.classesService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get class detail' })
    @ApiResponse({ status: 200, description: 'Class detail retrieved' })
    async findOne(@Param('id') id: string) {
        return this.classesService.findOne(id);
    }

    @Post(':id/enroll')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Enroll in a class (Student only)' })
    @ApiResponse({ status: 201, description: 'Successfully enrolled' })
    @ApiResponse({ status: 400, description: 'Class is full or already enrolled' })
    async enroll(
        @CurrentUser() user: any,
        @Param('id') classId: string,
    ) {
        return this.classesService.enroll(user.userId, classId);
    }

    @Delete(':id/unenroll')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Unenroll from a class (Student only)' })
    @ApiResponse({ status: 200, description: 'Successfully unenrolled' })
    async unenroll(
        @CurrentUser() user: any,
        @Param('id') classId: string,
    ) {
        return this.classesService.unenroll(user.userId, classId);
    }

    // =============== TEACHER ENDPOINTS ===============

    @Get('teacher/me')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get my classes as teacher' })
    @ApiResponse({ status: 200, description: 'My classes retrieved' })
    async getMyClasses(@CurrentUser() user: any) {
        return this.classesService.getTeacherClasses(user.userId);
    }

    @Post()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Create new class (Teacher only)' })
    @ApiResponse({ status: 201, description: 'Class created successfully' })
    async create(
        @CurrentUser() user: any,
        @Body() dto: CreateClassDto,
    ) {
        return this.classesService.create(user.userId, dto);
    }

    @Patch(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Update class (Teacher owner only)' })
    @ApiResponse({ status: 200, description: 'Class updated successfully' })
    async update(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body() dto: UpdateClassDto,
    ) {
        return this.classesService.update(user.userId, id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Delete class (Teacher owner only)' })
    @ApiResponse({ status: 200, description: 'Class deleted successfully' })
    async remove(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.classesService.remove(user.userId, id);
    }

    // =============== SESSION MANAGEMENT (TEACHER) ===============

    @Post(':id/session')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Create session for class (Teacher owner only)' })
    @ApiResponse({ status: 201, description: 'Session created successfully' })
    async createSession(
        @CurrentUser() user: any,
        @Param('id') classId: string,
        @Body() dto: CreateSessionDto,
    ) {
        return this.classesService.createSession(user.userId, classId, dto);
    }

    @Get(':id/sessions')
    @ApiOperation({ summary: 'Get all sessions for a class' })
    @ApiResponse({ status: 200, description: 'Sessions retrieved' })
    async getSessions(@Param('id') classId: string) {
        return this.classesService.getSessions(classId);
    }

    @Get('sessions/:sessionId')
    @ApiOperation({ summary: 'Get session detail' })
    @ApiResponse({ status: 200, description: 'Session detail retrieved' })
    async getSessionDetail(@Param('sessionId') sessionId: string) {
        return this.classesService.getSessionDetail(sessionId);
    }

    @Patch('sessions/:sessionId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Update session (Teacher owner only)' })
    @ApiResponse({ status: 200, description: 'Session updated' })
    async updateSession(
        @CurrentUser() user: any,
        @Param('sessionId') sessionId: string,
        @Body() dto: Partial<CreateSessionDto>,
    ) {
        return this.classesService.updateSession(user.userId, sessionId, dto);
    }

    @Delete('sessions/:sessionId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Cancel/delete session (Teacher owner only)' })
    @ApiResponse({ status: 200, description: 'Session deleted' })
    async deleteSession(
        @CurrentUser() user: any,
        @Param('sessionId') sessionId: string,
    ) {
        return this.classesService.deleteSession(user.userId, sessionId);
    }
}
