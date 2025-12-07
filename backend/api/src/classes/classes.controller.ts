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
import { PublishClassDto } from './dto/publish-class.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) { }

    // =============== PUBLIC/ADMIN ENDPOINTS ===============

    @Get()
    @ApiOperation({ summary: 'List all classes with filters and search' })
    @ApiResponse({ status: 200, description: 'Classes list retrieved with pagination' })
    async findAll(@Query() query: QueryClassesDto) {
        return this.classesService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get class detail with full information' })
    @ApiResponse({ status: 200, description: 'Class detail retrieved' })
    @ApiResponse({ status: 404, description: 'Class not found' })
    async findOne(@Param('id') id: string) {
        return this.classesService.findOne(id);
    }

    @Get(':id/statistics')
    @ApiOperation({ summary: 'Get calculated statistics for a class' })
    @ApiResponse({ status: 200, description: 'Statistics retrieved' })
    async getStatistics(@Param('id') id: string) {
        return this.classesService.calculateStatistics(id);
    }

    @Get(':id/curriculum')
    @ApiOperation({ summary: 'Get curriculum structure (sections + lessons) for ONLINE_COURSE' })
    @ApiResponse({ status: 200, description: 'Curriculum retrieved' })
    @ApiResponse({ status: 400, description: 'Not an ONLINE_COURSE type' })
    async getCurriculum(@Param('id') id: string) {
        return this.classesService.getCurriculum(id);
    }

    // =============== ADMIN/TEACHER ENDPOINTS ===============

    @Post()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Create a new class (Admin/Teacher only)' })
    @ApiResponse({ status: 201, description: 'Class created successfully' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    async create(@Body() dto: CreateClassDto) {
        return this.classesService.create(dto);
    }

    @Patch(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Update class (Admin/Teacher only)' })
    @ApiResponse({ status: 200, description: 'Class updated successfully' })
    @ApiResponse({ status: 404, description: 'Class not found' })
    async update(@Param('id') id: string, @Body() dto: UpdateClassDto) {
        return this.classesService.update(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Soft delete class (Admin/Teacher only)' })
    @ApiResponse({ status: 200, description: 'Class deleted successfully' })
    async remove(@Param('id') id: string) {
        return this.classesService.remove(id);
    }

    @Post(':id/publish')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Publish or unpublish a class with validation' })
    @ApiResponse({ status: 200, description: 'Publish status updated' })
    @ApiResponse({ status: 400, description: 'Validation failed (missing content)' })
    async publish(@Param('id') id: string, @Body() dto: PublishClassDto) {
        return this.classesService.publish(id, dto);
    }
}
