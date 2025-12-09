'use client';

import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Badge, Timeline, Spin, Alert } from "antd";
import {
    UserOutlined,
    BookOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    RiseOutlined,
    DatabaseOutlined,
} from "@ant-design/icons";

export default function DashboardPage() {
    // Local state for bypassing Refine hooks
    const [stats, setStats] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Hardcoded URL to ensure correctness
    const apiUrl = 'http://localhost:3333/api';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch Stats
                const statsRes = await fetch(`${apiUrl}/admin/dashboard/stats`);
                if (!statsRes.ok) throw new Error(`Stats API failed: ${statsRes.statusText}`);
                const statsData = await statsRes.json();

                // Fetch Activities
                const activitiesRes = await fetch(`${apiUrl}/admin/dashboard/activity-recent`);
                if (!activitiesRes.ok) throw new Error(`Activities API failed: ${activitiesRes.statusText}`);
                const activitiesData = await activitiesRes.json();

                console.log('✅ Manual Fetch - Stats:', statsData);
                console.log('✅ Manual Fetch - Activities:', activitiesData);

                setStats(statsData);
                setActivities(activitiesData || []);
                setLoading(false);
            } catch (err: any) {
                console.error('❌ Manual Fetch Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Spin size="large" tip="Loading dashboard..." />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: 24 }}>
                <Alert
                    message="Error Loading Dashboard"
                    description={error}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    // Prepare data
    const { users, classes, transactions, bookings, systemHealth } = stats || {};

    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, marginBottom: 8 }}>Dashboard Overview</h1>
                <p style={{ color: '#666', margin: 0 }}>
                    Monitor your platform's key metrics and system health
                </p>
            </div>

            {/* System Health Banner */}
            {systemHealth && (
                <Alert
                    message={
                        <span>
                            System Health: API{' '}
                            <Badge status={systemHealth.api === 'ok' ? 'success' : 'error'} />
                            {' | '}Database{' '}
                            <Badge status={systemHealth.database === 'ok' ? 'success' : 'error'} />
                            {' | '}Redis{' '}
                            <Badge status={systemHealth.redis === 'ok' ? 'success' : 'error'} />
                            {' | '}Uptime: {Math.floor(systemHealth.uptime / 3600)}h{' '}
                            {Math.floor((systemHealth.uptime % 3600) / 60)}m
                        </span>
                    }
                    type={systemHealth.api === 'ok' && systemHealth.database === 'ok' && systemHealth.redis === 'ok' ? 'success' : 'warning'}
                    showIcon
                    style={{ marginBottom: 24 }}
                    icon={<CheckCircleOutlined />}
                />
            )}

            {/* Stat Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={users?.total || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                            <div>Students: {users?.students || 0}</div>
                            <div>Teachers: {users?.teachers || 0}</div>
                            <div style={{ marginTop: 4, color: '#52c41a' }}>
                                <RiseOutlined /> +{users?.growth?.weekly || 0} this week
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Active Classes"
                            value={classes?.active || 0}
                            prefix={<BookOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                            suffix={`/ ${classes?.total || 0}`}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                            <div>Published: {classes?.active || 0}</div>
                            <div>Draft: {classes?.draft || 0}</div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Revenue (Month)"
                            value={transactions?.month?.amount || 0}
                            prefix="Rp"
                            valueStyle={{ color: '#cf1322' }}
                            precision={0}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                            <div>Transactions: {transactions?.month?.count || 0}</div>
                            <div>Today: Rp {(transactions?.today?.amount || 0).toLocaleString('id-ID')}</div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Bookings"
                            value={
                                (bookings?.pending || 0) +
                                (bookings?.confirmed || 0) +
                                (bookings?.completed || 0)
                            }
                            prefix={<DatabaseOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                            <div>Pending: {bookings?.pending || 0}</div>
                            <div>Confirmed: {bookings?.confirmed || 0}</div>
                            <div>Completed: {bookings?.completed || 0}</div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Teaching Type Distribution */}
            {classes?.byTeachingType && (
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col span={24}>
                        <Card title="Classes by Teaching Type">
                            <Row gutter={[16, 16]}>
                                {Object.entries(classes.byTeachingType).map(([type, count]) => (
                                    <Col key={type} xs={12} sm={6}>
                                        <Statistic
                                            title={type.replace(/_/g, ' ')}
                                            value={count as number}
                                            valueStyle={{ fontSize: 24 }}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Recent Activity Feed */}
            <Card
                title="Recent Activity"
                loading={loading}
                extra={
                    <span style={{ color: '#666', fontSize: 12 }}>
                        Last 50 activities
                    </span>
                }
            >
                {activities.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                        No recent activities
                    </div>
                ) : (
                    <Timeline
                        mode="left"
                        items={activities.slice(0, 20).map((activity: any) => ({
                            label: new Date(activity.createdAt).toLocaleString('id-ID', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                            children: (
                                <div>
                                    <strong>{activity.user?.name || 'System'}</strong>
                                    <span style={{ color: '#666', marginLeft: 8 }}>
                                        {activity.action.toLowerCase().replace(/_/g, ' ')}
                                    </span>
                                    {activity.entity && (
                                        <span style={{ color: '#999', marginLeft: 4 }}>
                                            ({activity.entity})
                                        </span>
                                    )}
                                    {activity.ipAddress && (
                                        <div style={{ fontSize: 11, color: '#ccc', marginTop: 2 }}>
                                            IP: {activity.ipAddress}
                                        </div>
                                    )}
                                </div>
                            ),
                        }))}
                    />
                )}
            </Card>
        </div>
    );
}
