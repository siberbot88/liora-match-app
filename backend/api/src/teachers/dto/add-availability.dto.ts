import { IsInt, Min, Max, IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class AddAvailabilityDto {
    @IsInt()
    @Min(0)
    @Max(6)
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    @IsString()
    @IsNotEmpty()
    startTime: string; // Format: "HH:mm" (e.g., "09:00")

    @IsString()
    @IsNotEmpty()
    endTime: string; // Format: "HH:mm" (e.g., "17:00")

    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}
