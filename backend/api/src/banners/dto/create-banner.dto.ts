import { IsString, IsOptional, IsBoolean, IsInt, Min, Max, IsUrl, IsIn, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBannerDto {
    @ApiProperty({ description: 'Banner title', example: 'Flash Sale - 50% Off Math Classes!' })
    @IsString()
    title: string;

    @ApiPropertyOptional({ description: 'Banner description', example: 'Limited time offer for new students' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Banner image URL', example: 'https://cdn.example.com/banners/flash-sale.jpg' })
    @IsUrl()
    imageUrl: string;

    @ApiPropertyOptional({ description: 'Link type', enum: ['none', 'class', 'teacher', 'external'], example: 'class' })
    @IsString()
    @IsOptional()
    @IsIn(['none', 'class', 'teacher', 'external'])
    linkType?: string;

    @ApiPropertyOptional({ description: 'Link ID (class or teacher ID)', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsString()
    @IsOptional()
    @ValidateIf(o => o.linkType === 'class' || o.linkType === 'teacher')
    linkId?: string;

    @ApiPropertyOptional({ description: 'External link URL', example: 'https://example.com/promo' })
    @IsUrl()
    @IsOptional()
    @ValidateIf(o => o.linkType === 'external')
    linkUrl?: string;

    @ApiPropertyOptional({ description: 'Banner priority (higher = shown first)', example: 10, default: 0 })
    @IsInt()
    @Min(0)
    @Max(100)
    @IsOptional()
    priority?: number;

    @ApiPropertyOptional({ description: 'Is banner active?', example: true, default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Banner start date (ISO format)', example: '2025-12-01T00:00:00Z' })
    @IsOptional()
    startDate?: Date;

    @ApiPropertyOptional({ description: 'Banner end date (ISO format)', example: '2025-12-31T23:59:59Z' })
    @IsOptional()
    endDate?: Date;
}
