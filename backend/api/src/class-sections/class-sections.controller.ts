import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ClassSectionsService } from './class-sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Class Sections')
@Controller('class-sections')
export class ClassSectionsController {
    constructor(private readonly sectionsService: ClassSectionsService) { }

    @Post()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Create a new section for a class' })
    async create(@Body() dto: CreateSectionDto) {
        return this.sectionsService.create(dto);
    }

    @Get('class/:classId')
    @ApiOperation({ summary: 'Get all sections for a class' })
    async findByClass(@Param('classId') classId: string) {
        return this.sectionsService.findByClass(classId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get section detail' })
    async findOne(@Param('id') id: string) {
        return this.sectionsService.findOne(id);
    }

    @Patch(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Update section' })
    async update(@Param('id') id: string, @Body() dto: UpdateSectionDto) {
        return this.sectionsService.update(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Delete section (cascade deletes lessons)' })
    async remove(@Param('id') id: string) {
        return this.sectionsService.remove(id);
    }

    @Post('class/:classId/reorder')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Reorder sections for a class' })
    async reorder(@Param('classId') classId: string, @Body() dto: ReorderSectionsDto) {
        return this.sectionsService.reorder(classId, dto);
    }
}
