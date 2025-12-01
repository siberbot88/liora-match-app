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
    NotFoundException,
    ForbiddenException,
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
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
    constructor(
        private readonly classesService: ClassesService,
        private readonly prisma: PrismaService,
    ) { }

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
    @ApiResponse({ status: 400, description: 'Already enrolled or class full' })
    async enroll(@Param('id') classId: string, @CurrentUser() user: any) {
        return this.classesService.enroll(user.userId, classId);
    }

    @Delete(':id/unenroll')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Unenroll from a class (Student only)' })
    @ApiResponse({ status: 200, description: 'Successfully unenrolled' })
    async unenroll(@Param('id') classId: string, @CurrentUser() user: any) {
        return this.classesService.unenroll(user.userId, classId);
    }

    // =============== TEACHER ENDPOINTS ===============

    @Post()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Create a new class (Teachers only)' })
    @ApiResponse({ status: 201, description: 'Class created successfully' })
    async create(@CurrentUser() user: any, @Body() dto: CreateClassDto) {
        return this.classesService.create(user.userId, dto);
    }

    @Patch(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Update class (Teachers only)' })
    @ApiResponse({ status: 200, description: 'Class updated successfully' })
    async update(
        @Param('id') id: string,
        @CurrentUser() user: any,
        @Body() dto: UpdateClassDto,
    ) {
        return this.classesService.update(user.userId, id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Delete class (Teachers only)' })
    @ApiResponse({ status: 200, description: 'Class deleted successfully' })
    async remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.classesService.remove(user.userId, id);
    }

    // =============== CLASS SESSION ENDPOINTS ===============

    @Get(':id/sessions')
    @ApiOperation({ summary: 'Get all sessions for a class' })
    @ApiResponse({ status: 200, description: 'Sessions list retrieved' })
    async getSessions(@Param('id') classId: string) {
        return this.classesService.getSessions(classId);
    }

    @Post(':id/sessions')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Create session for class (Teachers only)' })
    @ApiResponse({ status: 201, description: 'Session created successfully' })
    async createSession(
        @Param('id') classId: string,
        @CurrentUser() user: any,
        @Body() dto: CreateSessionDto,
    ) {
        return this.classesService.createSession(classId, user.userId, dto);
    }

    @Get('sessions/:sessionId')
    @ApiOperation({ summary: 'Get session detail' })
    @ApiResponse({ status: 200, description: 'Session detail retrieved' })
    async getSession(@Param('sessionId') sessionId: string) {
        return this.classesService.getSessionDetail(sessionId);
    }

    @Patch('sessions/:sessionId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Update session (Teachers only)' })
    @ApiResponse({ status: 200, description: 'Session updated successfully' })
    async updateSession(
        @Param('sessionId') sessionId: string,
        @CurrentUser() user: any,
        @Body() dto: CreateSessionDto,
    ) {
        return this.classesService.updateSession(sessionId, user.userId, dto);
    }

    @Delete('sessions/:sessionId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Delete session (Teachers only)' })
    @ApiResponse({ status: 200, description: 'Session deleted successfully' })
    async deleteSession(
        @Param('sessionId') sessionId: string,
        @CurrentUser() user: any,
    ) {
        return this.classesService.deleteSession(sessionId, user.userId);
    }

    // ==================== CLASS MATERIALS ====================

    @Get(':id/materials')
    @ApiOperation({ summary: 'Get all materials for a class' })
    @ApiResponse({ status: 200, description: 'Returns list of class materials' })
    async getClassMaterials(@Param('id') classId: string) {
        const materials = await this.prisma.classMaterial.findMany({
            where: { classId },
            orderBy: { createdAt: 'desc' },
        });

        // Add full URL to each material
        const baseUrl = process.env.API_URL || 'http://localhost:3000';
        return materials.map((m) => ({
            ...m,
            fileUrl: baseUrl + m.fileUrl,
        }));
    }

    @Delete('materials/:materialId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Delete class material (Teachers only)' })
    @ApiResponse({ status: 200, description: 'Material deleted successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - not material owner' })
    async deleteMaterial(
        @CurrentUser() user: any,
        @Param('materialId') materialId: string,
    ) {
        const material = await this.prisma.classMaterial.findUnique({
            where: { id: materialId },
            include: { class: true },
        });

        if (!material) {
            throw new NotFoundException('Material not found');
        }

        // Verify ownership
        const teacherProfile = await this.prisma.teacherProfile.findFirst({
            where: { userId: user.userId },
        });

        if (!teacherProfile || material.class.teacherProfileId !== teacherProfile.id) {
            throw new ForbiddenException('You can only delete your own materials');
        }

        // Delete physical file
        const uploadRoot = process.env.UPLOAD_ROOT || './uploads';
        const filePath = material.fileUrl.replace('/uploads/', '');
        const fullPath = path.join(uploadRoot, filePath);

        if (fs.existsSync(fullPath)) {
            try {
                fs.unlinkSync(fullPath);
                console.log(`Deleted material file: ${fullPath}`);
            } catch (error) {
                console.error('Failed to delete file:', error);
            }
        }

        // Delete from database
        await this.prisma.classMaterial.delete({
            where: { id: materialId },
        });

        return { message: 'Material deleted successfully' };
    }
}
