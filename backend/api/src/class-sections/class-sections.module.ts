import { Module } from '@nestjs/common';
import { ClassSectionsService } from './class-sections.service';
import { ClassSectionsController } from './class-sections.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ClassSectionsController],
    providers: [ClassSectionsService],
    exports: [ClassSectionsService],
})
export class ClassSectionsModule { }
