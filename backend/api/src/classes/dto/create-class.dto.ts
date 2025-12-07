import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsBoolean,
    IsArray,
    MinLength,
    IsNumber,
    Min
} from 'class-validator';
import { Jenjang, TeachingType, PriceModel } from '@prisma/client';

export class CreateClassDto {
    // Basic Info
    @IsString()
    @IsNotEmpty()
    teacherProfileId: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10, { message: 'Title must be at least 10 characters' })
    title: string;

    @IsString()
    @IsOptional()
    subtitle?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(50, { message: 'Short description must be at least 50 characters' })
    descriptionShort: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(100, { message: 'Long description must be at least 100 characters' })
    descriptionLong: string;

    @IsString()
    @IsNotEmpty()
    subject: string;

    // Categorization
    @IsEnum(Jenjang, { message: 'Invalid jenjang value' })
    @IsNotEmpty()
    jenjang: Jenjang;

    @IsString()
    @IsOptional()
    levelRange?: string;

    @IsEnum(TeachingType, { message: 'Invalid teaching type' })
    @IsOptional()
    teachingType?: TeachingType = TeachingType.ONLINE_COURSE;

    // Features
    @IsString()
    @IsOptional()
    mainLanguage?: string = 'Indonesian';

    @IsBoolean()
    @IsOptional()
    captionAvailable?: boolean = false;

    @IsBoolean()
    @IsOptional()
    certificateAvailable?: boolean = false;

    @IsArray()
    @IsOptional()
    features?: string[];

    // Pricing
    @IsNumber()
    @Min(0, { message: 'Price cannot be negative' })
    @IsOptional()
    price?: number = 0;

    @IsEnum(PriceModel, { message: 'Invalid price model' })
    @IsOptional()
    priceModel?: PriceModel; // Auto-determined from teachingType if not provided


    // Status
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean = false;

    @IsBoolean()
    @IsOptional()
    isPremium?: boolean = false;
}
