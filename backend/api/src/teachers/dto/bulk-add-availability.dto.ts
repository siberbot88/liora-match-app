import { IsArray, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AddAvailabilityDto } from './add-availability.dto';

export class BulkAddAvailabilityDto {
    @ApiPropertyOptional({
        description: 'Array of availability slots to add',
        type: [AddAvailabilityDto],
    })
    @IsArray()
    @IsOptional()
    slots: AddAvailabilityDto[];
}
