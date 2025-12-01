import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStudentPreferencesDto {
    @ApiPropertyOptional({ description: 'Grade/class level', example: 'SMA 12' })
    @IsString()
    @IsOptional()
    grade?: string;

    @ApiPropertyOptional({ description: 'School name' })
    @IsString()
    @IsOptional()
    school?: string;

    @ApiPropertyOptional({ description: 'Address' })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiPropertyOptional({ description: 'Parent/guardian name' })
    @IsString()
    @IsOptional()
    parentName?: string;

    @ApiPropertyOptional({ description: 'Parent/guardian phone' })
    @IsString()
    @IsOptional()
    parentPhone?: string;

    @ApiPropertyOptional({ description: 'Learning goals/objectives' })
    @IsString()
    @IsOptional()
    learningGoals?: string;

    @ApiPropertyOptional({ description: 'Preferred subjects', type: [String] })
    @IsArray()
    @IsOptional()
    preferredSubjects?: string[];

    @ApiPropertyOptional({ description: 'Preferred learning mode' })
    @IsString()
    @IsOptional()
    preferredMode?: string;
}
