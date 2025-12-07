import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ClassResourcesService } from './class-resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Class Resources')
@Controller('class-resources')
export class ClassResourcesController {
    constructor(private readonly resourcesService: ClassResourcesService) { }

    @Post()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Create a new resource for a class' })
    async create(@Body() dto: CreateResourceDto) {
        return this.resourcesService.create(dto);
    }

    @Get('class/:classId')
    @ApiOperation({ summary: 'Get all resources for a class' })
    async findByClass(@Param('classId') classId: string) {
        return this.resourcesService.findByClass(classId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get resource detail' })
    async findOne(@Param('id') id: string) {
        return this.resourcesService.findOne(id);
    }

    @Patch(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Update resource' })
    async update(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
        return this.resourcesService.update(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiOperation({ summary: 'Delete resource' })
    async remove(@Param('id') id: string) {
        return this.resourcesService.remove(id);
    }
}
