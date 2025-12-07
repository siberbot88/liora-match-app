'use client';

import { useList } from "@refinedev/core";
import { Table, Space, Button, Tag, Select, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";

const { Search } = Input;

export default function ClassesPage() {
    const [filters, setFilters] = useState<any>({});
    const [searchText, setSearchText] = useState('');

    const { result, query } = useList({
        resource: "classes",
        filters: [
            ...Object.entries(filters)
                .filter(([_, value]) => value)
                .map(([key, value]) => ({
                    field: key,
                    operator: "eq" as const,
                    value,
                })),
            ...(searchText ? [{
                field: "search",
                operator: "contains" as const,
                value: searchText,
            }] : []),
        ],
        pagination: {
            pageSize: 10,
        },
    });

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: '25%',
            render: (title: string) => <strong>{title}</strong>,
        },
        {
            title: 'Teacher',
            dataIndex: ['teacher', 'user', 'name'],
            key: 'teacher',
            render: (_: any, record: any) => record.teacher?.user?.name || '-',
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Jenjang',
            dataIndex: 'jenjang',
            key: 'jenjang',
            render: (jenjang: string) => (
                <Tag color={
                    jenjang === 'SD' ? 'green' :
                        jenjang === 'SMP' ? 'blue' :
                            jenjang === 'SMA' ? 'orange' : 'purple'
                }>
                    {jenjang}
                </Tag>
            ),
        },
        {
            title: 'Teaching Type',
            dataIndex: 'teachingType',
            key: 'teachingType',
            render: (type: string) => {
                const typeMap: any = {
                    'ONLINE_COURSE': { label: 'Online Course', color: 'cyan' },
                    'TAKE_HOME': { label: 'Take Home', color: 'green' },
                    'ONLINE_PRIVATE': { label: 'Online Private', color: 'blue' },
                    'PUBLIC_LESSON': { label: 'Public Lesson', color: 'orange' },
                };
                const config = typeMap[type] || { label: type, color: 'default' };
                return <Tag color={config.color}>{config.label}</Tag>;
            },
        },
        {
            title: 'Published',
            dataIndex: 'isPublished',
            key: 'isPublished',
            render: (isPublished: boolean) => (
                <Tag color={isPublished ? 'success' : 'default'}>
                    {isPublished ? 'Published' : 'Draft'}
                </Tag>
            ),
        },
        {
            title: 'Price',
            key: 'price',
            render: (_: any, record: any) => {
                const fmt = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                });

                if (record.teachingType === 'ONLINE_COURSE') {
                    return (
                        <div>
                            <div style={{ fontWeight: 500 }}>{record.price === 0 ? 'FREE' : fmt.format(record.price)}</div>
                            <div style={{ fontSize: 11, color: '#666' }}>One-time</div>
                        </div>
                    );
                }

                return (
                    <div>
                        <div style={{ fontWeight: 500 }}>{fmt.format(record.price)}</div>
                        <div style={{ fontSize: 11, color: '#666' }}>per 60 min</div>
                    </div>
                );
            },
        },
        {
            title: 'Stats',
            key: 'stats',
            render: (_: any, record: any) => {
                const stats = record.statistics || {};
                return (
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        <div>👥 {stats.totalEnrollments || 0} students</div>
                        <div>⭐ {stats.averageRating?.toFixed(1) || '0.0'} ({stats.totalReviews || 0})</div>
                        {stats.totalLessons > 0 && (
                            <div>📚 {stats.totalLessons} lessons ({stats.totalDurationHours}h)</div>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right' as const,
            width: 180,
            render: (_: any, record: any) => {
                const handleDelete = async () => {
                    if (window.confirm(`Delete class "${record.title}"?`)) {
                        try {
                            const token = localStorage.getItem('auth_token');
                            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/${record.id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });
                            window.location.reload();
                        } catch (error) {
                            alert('Failed to delete class');
                        }
                    }
                };

                return (
                    <Space>
                        <Link href={`/admin/classes/${record.id}`}>
                            <Button type="link" size="small" icon={<EyeOutlined />}>View</Button>
                        </Link>
                        <Link href={`/admin/classes/edit/${record.id}`}>
                            <Button type="link" size="small" icon={<EditOutlined />}>Edit</Button>
                        </Link>
                        <Button
                            type="link"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </Space>
                );
            },
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Classes Management</h1>
                <Link href="/admin/classes/create">
                    <Button type="primary" icon={<PlusOutlined />}>Add Class</Button>
                </Link>
            </div>

            {/* Filters */}
            <div style={{
                marginBottom: 16,
                padding: 16,
                background: '#fafafa',
                borderRadius: 8,
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
            }}>
                <Search
                    placeholder="Search by title or description..."
                    allowClear
                    onSearch={setSearchText}
                    style={{ width: 300 }}
                />
                <Select
                    placeholder="Filter by Jenjang"
                    allowClear
                    style={{ width: 150 }}
                    onChange={(value) => setFilters({ ...filters, jenjang: value })}
                    options={[
                        { label: 'SD', value: 'SD' },
                        { label: 'SMP', value: 'SMP' },
                        { label: 'SMA', value: 'SMA' },
                        { label: 'UMUM', value: 'UMUM' },
                    ]}
                />
                <Select
                    placeholder="Filter by Teaching Type"
                    allowClear
                    style={{ width: 180 }}
                    onChange={(value) => setFilters({ ...filters, teachingType: value })}
                    options={[
                        { label: 'Online Course', value: 'ONLINE_COURSE' },
                        { label: 'Take Home', value: 'TAKE_HOME' },
                        { label: 'Online Private', value: 'ONLINE_PRIVATE' },
                        { label: 'Public Lesson', value: 'PUBLIC_LESSON' },
                    ]}
                />
                <Select
                    placeholder="Published Status"
                    allowClear
                    style={{ width: 150 }}
                    onChange={(value) => setFilters({ ...filters, isPublished: value })}
                    options={[
                        { label: 'Published', value: true },
                        { label: 'Draft', value: false },
                    ]}
                />
            </div>

            <Table
                dataSource={result?.data}
                columns={columns}
                loading={query.isLoading}
                rowKey="id"
                scroll={{ x: 1200 }}
                pagination={{
                    total: result?.total,
                    pageSize: 10,
                    showSizeChanger: false,
                    showTotal: (total) => `Total ${total} classes`,
                }}
            />
        </div>
    );
}
