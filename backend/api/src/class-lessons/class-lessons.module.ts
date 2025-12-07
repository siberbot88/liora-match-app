import { Module } from '@nestjs/common';
import { ClassLessonsService } from './class-lessons.service';
import { ClassLessonsController } from './class-lessons.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ClassLessonsController],
    providers: [ClassLessonsService],
    exports: [ClassLessonsService],
})
export class ClassLessonsModule { }
