import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'Liora Backend API',
            version: '0.0.1',
        };
    }
}
