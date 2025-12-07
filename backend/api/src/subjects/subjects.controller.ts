import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

interface Subject {
    id: string;
    name: string;
    icon: string;
}

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
    private readonly subjects: Subject[] = [
        { id: '1', name: 'Geografi', icon: 'geografi' },
        { id: '2', name: 'Biologi', icon: 'Biologi' },
        { id: '3', name: 'Kimia', icon: 'Kimia' },
        { id: '4', name: 'PKN', icon: 'PKN' },
        { id: '5', name: 'Sejarah', icon: 'sejarah' },
        { id: '6', name: 'Matematika', icon: 'Matematika' },
        { id: '7', name: 'Ekonomi', icon: 'Ekonomi' },
        { id: '8', name: 'Fisika', icon: 'Fisika' },
        { id: '9', name: 'Komputer', icon: 'TIK' },
        { id: '10', name: 'B. Indonesia', icon: 'Bahasa Indonesia' },
    ];

    @Get()
    @ApiOperation({ summary: 'Get all subjects for Minat & Bakat' })
    @ApiResponse({ status: 200, description: 'Subjects retrieved' })
    async getAllSubjects() {
        return this.subjects;
    }
}
