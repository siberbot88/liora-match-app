import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
    imports: [PrismaModule, FirebaseModule],
    controllers: [HealthController],
    providers: [HealthService],
})
export class HealthModule { }
