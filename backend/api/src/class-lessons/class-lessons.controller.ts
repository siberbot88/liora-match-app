import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ClassLessonsService } from './class-lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ReorderLessonsDto } from './dto/reorder-lessons.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Class Lessons')
@Controller('class-lessons')
export class ClassLessonsController {
    constructor(private readonly lessonsService: ClassLessonsService) { }

    @Post()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Create a new lesson for a section' })
    async create(@Body() dto: CreateLessonDto) {
        return this.lessonsService.create(dto);
    }

    @Get('section/:sectionId')
    @ApiOperation({ summary: 'Get all lessons for a section' })
    async findBySection(@Param('sectionId') sectionId: string) {
        return this.lessonsService.findBySection(sectionId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get lesson detail' })
    async findOne(@Param('id') id: string) {
        return this.lessonsService.findOne(id);
    }

    @Patch(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Update lesson' })
    async update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
        return this.lessonsService.update(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Delete lesson' })
    async remove(@Param('id') id: string) {
        return this.lessonsService.remove(id);
    }

    @Post('section/:sectionId/reorder')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Reorder lessons in a section' })
    async reorder(@Param('sectionId') sectionId: string, @Body() dto: ReorderLessonsDto) {
        return this.lessonsService.reorder(sectionId, dto);
    }
}
