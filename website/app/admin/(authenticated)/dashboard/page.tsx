'use client';

import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Progress, Table, Spin } from 'antd';
import {
    TeamOutlined,
    BookOutlined,
    UserOutlined,
    RiseOutlined,
    ArrowUpOutlined,
} from '@ant-design/icons';

interface DashboardStats {
    totalTeachers: number;
    totalClasses: number;
    totalStudents: number;
    activeSessions: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

            // Fetch real data from APIs
            const [teachersRes, classesRes, studentsRes] = await Promise.all([
                fetch(`${apiUrl}/teachers`),
                fetch(`${apiUrl}/classes`),
                fetch(`${apiUrl}/students`),
            ]);

            const teachers = await teachersRes.json();
            const classes = await classesRes.json();
            const students = await studentsRes.json();

            setStats({
                totalTeachers: Array.isArray(teachers) ? teachers.length : 0,
                totalClasses: Array.isArray(classes) ? classes.length : 0,
                totalStudents: Array.isArray(students) ? students.length : 0,
                activeSessions: 0, // Will be implemented later
            });
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            // Fallback to default values
            setStats({
                totalTeachers: 0,
                totalClasses: 0,
                totalStudents: 0,
                activeSessions: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    // Mock data for recent activities
    const recentActivities = [
        {
            key: '1',
            activity: 'New Teacher Added',
            user: 'Admin',
            time: '2 hours ago',
        },
        {
            key: '2',
            activity: 'Class Updated',
            user: 'Admin',
            time: '5 hours ago',
        },
        {
            key: '3',
            activity: 'Student Enrolled',
            user: 'System',
            time: '1 day ago',
        },
    ];

    const columns = [
        {
            title: 'Activity',
            dataIndex: 'activity',
            key: 'activity',
        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Dashboard</h2>
                <p style={{ color: '#666', marginTop: 8 }}>Welcome back, here's what's happening with your platform</p>
            </div>

            {/* Stats Cards - Real Data */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title={<span style={{ fontSize: 14, color: '#666' }}>Total Teachers</span>}
                            value={stats?.totalTeachers || 0}
                            prefix={<TeamOutlined style={{ color: '#4CAF50' }} />}
                            suffix={
                                <span style={{ fontSize: 14, color: '#4CAF50' }}>
                                    <ArrowUpOutlined /> 12%
                                </span>
                            }
                            valueStyle={{ fontSize: 30, fontWeight: 600 }}
                        />
                        <Progress
                            percent={75}
                            strokeColor="#4CAF50"
                            showInfo={false}
                            style={{ marginTop: 8 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title={<span style={{ fontSize: 14, color: '#666' }}>Total Classes</span>}
                            value={stats?.totalClasses || 0}
                            prefix={<BookOutlined style={{ color: '#2196F3' }} />}
                            suffix={
                                <span style={{ fontSize: 14, color: '#2196F3' }}>
                                    <ArrowUpOutlined /> 8%
                                </span>
                            }
                            valueStyle={{ fontSize: 30, fontWeight: 600 }}
                        />
                        <Progress
                            percent={60}
                            strokeColor="#2196F3"
                            showInfo={false}
                            style={{ marginTop: 8 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title={<span style={{ fontSize: 14, color: '#666' }}>Total Students</span>}
                            value={stats?.totalStudents || 0}
                            prefix={<UserOutlined style={{ color: '#9C27B0' }} />}
                            suffix={
                                <span style={{ fontSize: 14, color: '#4CAF50' }}>
                                    <ArrowUpOutlined /> 24%
                                </span>
                            }
                            valueStyle={{ fontSize: 30, fontWeight: 600 }}
                        />
                        <Progress
                            percent={85}
                            strokeColor="#9C27B0"
                            showInfo={false}
                            style={{ marginTop: 8 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title={<span style={{ fontSize: 14, color: '#666' }}>Active Sessions</span>}
                            value={stats?.activeSessions || 0}
                            prefix={<RiseOutlined style={{ color: '#FF9800' }} />}
                            valueStyle={{ fontSize: 30, fontWeight: 600 }}
                        />
                        <Progress
                            percent={45}
                            strokeColor="#FF9800"
                            showInfo={false}
                            style={{ marginTop: 8 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions & Recent Activity */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Recent Activity" bordered={false}>
                        <Table
                            dataSource={recentActivities}
                            columns={columns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Quick Actions" bordered={false}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <a
                                href="/admin/teachers/create"
                                style={{
                                    padding: '12px 16px',
                                    background: '#f0f2f5',
                                    borderRadius: 8,
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#e3f2fd'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#f0f2f5'}
                            >
                                <TeamOutlined style={{ fontSize: 20, color: '#2196F3' }} />
                                <span style={{ fontWeight: 500 }}>Add New Teacher</span>
                            </a>
                            <a
                                href="/admin/classes/create"
                                style={{
                                    padding: '12px 16px',
                                    background: '#f0f2f5',
                                    borderRadius: 8,
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#e8f5e9'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#f0f2f5'}
                            >
                                <BookOutlined style={{ fontSize: 20, color: '#4CAF50' }} />
                                <span style={{ fontWeight: 500 }}>Add New Class</span>
                            </a>
                            <a
                                href="/admin/students"
                                style={{
                                    padding: '12px 16px',
                                    background: '#f0f2f5',
                                    borderRadius: 8,
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f3e5f5'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#f0f2f5'}
                            >
                                <UserOutlined style={{ fontSize: 20, color: '#9C27B0' }} />
                                <span style={{ fontWeight: 500 }}>View All Students</span>
                            </a>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
