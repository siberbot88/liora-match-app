import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PublishClassDto {
    @IsBoolean()
    @IsNotEmpty()
    isPublished: boolean;
}
