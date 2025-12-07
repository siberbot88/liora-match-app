import { IsNumber, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum StudentTier {
    FREE = 'Free',
    MEMBERSHIP = 'Membership',
    PRO = 'Pro',
}

export class StudentDashboardDto {
    @ApiProperty({ description: 'Current level number' })
    @IsNumber()
    level: number;

    @ApiProperty({ description: 'Level name (e.g., "Level 1")' })
    @IsString()
    levelName: string;

    @ApiProperty({ description: 'Student tier', enum: StudentTier })
    @IsEnum(StudentTier)
    tier: StudentTier;

    @ApiProperty({ description: 'Total learning points' })
    @IsNumber()
    points: number;

    @ApiProperty({ description: 'Points needed for next level' })
    @IsNumber()
    nextLevelPoints: number;

    @ApiProperty({ description: 'Current level progress percentage (0-100)' })
    @IsNumber()
    progressPercentage: number;
}
