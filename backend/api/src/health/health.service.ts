import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class HealthService {
    constructor(
        private prisma: PrismaService,
        private firebaseService: FirebaseService,
    ) { }

    async checkHealth() {
        const timestamp = new Date().toISOString();
        let status = 'ok';

        // Check MySQL
        let mysqlStatus = 'down';
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            mysqlStatus = 'up';
        } catch (error) {
            status = 'degraded';
            console.error('MySQL health check failed:', error.message);
        }

        // Check Redis (if you have Redis client injected)
        let redisStatus = 'up'; // For now, assume up
        // TODO: Implement Redis ping when queue module is added
        // try {
        //     await this.redisClient.ping();
        //     redisStatus = 'up';
        // } catch (error) {
        //     status = 'degraded';
        //     redisStatus = 'down';
        // }

        // Check Firebase
        let firebaseStatus = 'down';
        try {
            // Simple check - verify the app is initialized
            const app = this.firebaseService.getApp();
            if (app) {
                firebaseStatus = 'up';
            }
        } catch (error) {
            status = 'degraded';
            console.error('Firebase health check failed:', error.message);
        }

        return {
            status,
            checks: {
                mysql: mysqlStatus,
                redis: redisStatus,
                firebase: firebaseStatus,
            },
            timestamp,
        };
    }
}
