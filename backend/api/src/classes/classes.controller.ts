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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) { }

    @Get()
    @ApiOperation({ summary: 'List all classes with filters' })
    @ApiResponse({ status: 200, description: 'Classes list retrieved' })
    async findAll(@Query() query: QueryClassesDto) {
        return this.classesService.findAll(query);
    }

    @Get('teacher/me')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Get my classes (teacher only)' })
    @ApiResponse({ status: 200, description: 'Teacher classes retrieved' })
    async getMyClasses(@CurrentUser() user: any) {
        return this.classesService.getTeacherClasses(user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get class detail' })
    @ApiResponse({ status: 200, description: 'Class detail retrieved' })
    async findOne(@Param('id') id: string) {
        return this.classesService.findOne(id);
    }

    @Post()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Create class (teacher only)' })
    @ApiResponse({ status: 201, description: 'Class created successfully' })
    async create(@CurrentUser() user: any, @Body() dto: CreateClassDto) {
        return this.classesService.create(user.userId, dto);
    }

    @Patch(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Update class (owner only)' })
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
    @ApiOperation({ summary: 'Delete class (owner only)' })
    @ApiResponse({ status: 200, description: 'Class deleted successfully' })
    async remove(@CurrentUser() user: any, @Param('id') id: string) {
        return this.classesService.remove(user.userId, id);
    }

    @Post(':id/enroll')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Enroll in class (student only)' })
    @ApiResponse({ status: 201, description: 'Enrolled successfully' })
    async enroll(@CurrentUser() user: any, @Param('id') id: string) {
        return this.classesService.enroll(user.userId, id);
    }
}
