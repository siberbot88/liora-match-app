import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) { }

    @Get()
    @ApiOperation({ summary: 'Health check endpoint' })
    @ApiResponse({
        status: 200,
        description: 'System health status',
        schema: {
            example: {
                status: 'ok',
                checks: {
                    mysql: 'up',
                    redis: 'up',
                    firebase: 'up',
                },
                timestamp: '2025-12-02T00:00:00.000Z',
            },
        },
    })
    async checkHealth() {
        return this.healthService.checkHealth();
    }
}
