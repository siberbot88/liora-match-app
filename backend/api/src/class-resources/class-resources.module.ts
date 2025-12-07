import { Module } from '@nestjs/common';
import { ClassResourcesService } from './class-resources.service';
import { ClassResourcesController } from './class-resources.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ClassResourcesController],
    providers: [ClassResourcesService],
    exports: [ClassResourcesService],
})
export class ClassResourcesModule { }
