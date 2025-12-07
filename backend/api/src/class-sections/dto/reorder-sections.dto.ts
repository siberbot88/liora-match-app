import { IsArray, ArrayMinSize } from 'class-validator';

export class ReorderSectionsDto {
    @IsArray()
    @ArrayMinSize(1)
    sectionIds: string[]; // New order of section IDs
}
