import { IsArray, ArrayMinSize } from 'class-validator';

export class ReorderLessonsDto {
    @IsArray()
    @ArrayMinSize(1)
    lessonIds: string[]; // New order of lesson IDs
}
