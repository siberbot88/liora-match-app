export interface DashboardStatsDto {
    users: {
        total: number;
        students: number;
        teachers: number;
        admins: number;
        growth: {
            daily: number;
            weekly: number;
            monthly: number;
        };
    };
    classes: {
        total: number;
        active: number;
        draft: number;
        byTeachingType: Record<string, number>;
    };
    transactions: {
        today: {
            count: number;
            amount: number;
        };
        week: {
            count: number;
            amount: number;
        };
        month: {
            count: number;
            amount: number;
        };
        total: {
            count: number;
            amount: number;
        };
    };
    bookings: {
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
    };
    systemHealth: {
        api: 'ok' | 'degraded' | 'down';
        database: 'ok' | 'degraded' | 'down';
        redis: 'ok' | 'degraded' | 'down';
        uptime: number;
    };
}
