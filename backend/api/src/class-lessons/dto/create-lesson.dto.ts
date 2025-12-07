import {
    IsString,
    IsNotEmpty,
    IsInt,
    Min,
    IsEnum,
    IsOptional,
    IsBoolean,
    IsUrl,
} from 'class-validator';
import { LessonContentType } from '@prisma/client';

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    sectionId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    durationMinutes?: number;

    @IsEnum(LessonContentType)
    @IsOptional()
    contentType?: LessonContentType = LessonContentType.VIDEO;

    @IsUrl()
    @IsOptional()
    videoUrl?: string;

    @IsUrl()
    @IsOptional()
    contentUrl?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    isLocked?: boolean = false;

    @IsBoolean()
    @IsOptional()
    isPreviewable?: boolean = false;

    @IsInt()
    @Min(1)
    order: number;
}
