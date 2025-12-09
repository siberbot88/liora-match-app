'use client';

import { useState } from 'react';
import { useList, useDelete } from '@refinedev/core';
import { Table, Card, Tag, Button, Input, Select, DatePicker, Space, Popconfirm, Typography, message } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const BOOKING_STATUS_COLORS = {
    PENDING: 'warning',
    CONFIRMED: 'processing',
    COMPLETED: 'success',
    CANCELLED: 'error',
};

export default function BookingsListPage() {
    const [filters, setFilters] = useState({
        status: undefined,
        search: '',
        dateFrom: undefined,
        dateTo: undefined,
    });

    const { data, isLoading, refetch } = useList({
        resource: 'bookings',
        filters: [
            { field: 'status', operator: 'eq', value: filters.status },
            { field: 'search', operator: 'contains', value: filters.search },
            { field: 'dateFrom', operator: 'gte', value: filters.dateFrom },
            { field: 'dateTo', operator: 'lte', value: filters.dateTo },
        ].filter(f => f.value),
    });

    const { mutate: deleteBooking } = useDelete();

    const handleDelete = (id: string) => {
        deleteBooking({
            resource: 'bookings/admin',
            id,
        }, {
            onSuccess: () => {
                message.success('Booking deleted successfully');
                refetch();
            },
            onError: () => {
                message.error('Failed to delete booking');
            },
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (id: string) => id.substring(0, 8),
        },
        {
            title: 'Student',
            dataIndex: ['student', 'user', 'name'],
            key: 'student',
            width: 150,
        },
        {
            title: 'Teacher',
            dataIndex: ['teacher', 'user', 'name'],
            key: 'teacher',
            width: 150,
        },
        {
            title: 'Class',
            dataIndex: ['class', 'title'],
            key: 'class',
            width: 200,
        },
        {
            title: 'Scheduled',
            dataIndex: 'scheduledAt',
            key: 'scheduledAt',
            width: 180,
            render: (date: string) => dayjs(date).format('DD MMM YYYY, HH:mm'),
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            width: 100,
            render: (duration: number) => `${duration} min`,
        },
        {
            title: 'Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 120,
            render: (price: number) => `Rp ${price.toLocaleString('id-ID')}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => (
                <Tag color={BOOKING_STATUS_COLORS[status as keyof typeof BOOKING_STATUS_COLORS]}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            fixed: 'right' as const,
            render: (_: any, record: any) => (
                <Space>
                    <Link href={`/admin/bookings/${record.id}`}>
                        <Button icon={<EyeOutlined />} size="small" type="link">
                            View
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Delete booking?"
                        description="Are you sure you want to delete this booking?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            type="link"
                            disabled={!!record.transaction}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>Booking Management</Title>
            </div>

            <Card>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {/* Filters */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: 16 }}>
                        <Select
                            placeholder="Filter by status"
                            allowClear
                            value={filters.status}
                            onChange={(value) => setFilters({ ...filters, status: value })}
                            options={[
                                { label: 'Pending', value: 'PENDING' },
                                { label: 'Confirmed', value: 'CONFIRMED' },
                                { label: 'Completed', value: 'COMPLETED' },
                                { label: 'Cancelled', value: 'CANCELLED' },
                            ]}
                        />

                        <Input
                            placeholder="Search student/teacher"
                            prefix={<SearchOutlined />}
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />

                        <RangePicker
                            value={filters.dateFrom && filters.dateTo
                                ? [dayjs(filters.dateFrom), dayjs(filters.dateTo)]
                                : undefined
                            }
                            onChange={(dates) => {
                                if (dates) {
                                    setFilters({
                                        ...filters,
                                        dateFrom: dates[0]?.toISOString(),
                                        dateTo: dates[1]?.toISOString(),
                                    });
                                } else {
                                    setFilters({ ...filters, dateFrom: undefined, dateTo: undefined });
                                }
                            }}
                        />

                        <Button onClick={() => refetch()}>Apply Filters</Button>
                    </div>

                    {/* Table */}
                    <Table
                        dataSource={data?.data || []}
                        columns={columns}
                        loading={isLoading}
                        rowKey="id"
                        pagination={{
                            pageSize: 20,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} bookings`,
                        }}
                        scroll={{ x: 1500 }}
                    />
                </Space>
            </Card>
        </div>
    );
}
