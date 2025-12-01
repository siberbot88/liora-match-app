import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAvailabilityDto {
    @ApiPropertyOptional({ description: 'Day of week (0=Sunday, 6=Saturday)', minimum: 0, maximum: 6 })
    @IsInt()
    @Min(0)
    @Max(6)
    @IsOptional()
    dayOfWeek?: number;

    @ApiPropertyOptional({ description: 'Start time (HH:mm format)', example: '09:00' })
    @IsOptional()
    startTime?: string;

    @ApiPropertyOptional({ description: 'End time (HH:mm format)', example: '12:00' })
    @IsOptional()
    endTime?: string;

    @ApiPropertyOptional({ description: 'Is slot active' })
    @IsOptional()
    isActive?: boolean;
}
