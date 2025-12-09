'use client';

import { useList } from "@refinedev/core";
import { Table, Tag, Button, Space, DatePicker, Select, Input, Card, Row, Col, Statistic } from "antd";
import { EyeOutlined, DollarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;
const { Search } = Input;

type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';

export default function TransactionsPage() {
    const [status, setStatus] = useState<PaymentStatus | undefined>();
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [search, setSearch] = useState('');

    const filters = [
        ...(status ? [{ field: 'status', operator: 'eq' as const, value: status }] : []),
        ...(dateRange ? [
            { field: 'dateFrom', operator: 'eq' as const, value: dateRange[0].toISOString() },
            { field: 'dateTo', operator: 'eq' as const, value: dateRange[1].toISOString() },
        ] : []),
        ...(search ? [{ field: 'search', operator: 'contains' as const, value: search }] : []),
    ];

    const { result, query } = useList({
        resource: "admin/transactions",
        filters,
        pagination: {
            pageSize: 10,
        },
    });

    const summary = (result as any)?.summary || {};

    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case 'PAID': return 'success';
            case 'PENDING': return 'warning';
            case 'FAILED': return 'error';
            case 'REFUNDED': return 'default';
            default: return 'default';
        }
    };

    const columns = [
        {
            title: 'Transaction ID',
            dataIndex: 'providerRef',
            key: 'providerRef',
            render: (ref: string) => (
                <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                    {ref}
                </span>
            ),
        },
        {
            title: 'Student',
            key: 'student',
            render: (_: any, record: any) => record.booking?.student?.user?.name || '-',
        },
        {
            title: 'Teacher',
            key: 'teacher',
            render: (_: any, record: any) => record.booking?.teacher?.user?.name || '-',
        },
        {
            title: 'Class',
            key: 'class',
            render: (_: any, record: any) => record.booking?.class?.title || '-',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => (
                <strong style={{ color: '#52c41a' }}>
                    Rp {amount.toLocaleString('id-ID')}
                </strong>
            ),
        },
        {
            title: 'Provider',
            dataIndex: 'provider',
            key: 'provider',
            render: (provider: string) => (
                <Tag color="blue">{provider.toUpperCase()}</Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: PaymentStatus) => (
                <Tag color={getStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('DD MMM YYYY HH:mm'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Link href={`/admin/transactions/${record.id}`}>
                        <Button type="link" size="small" icon={<EyeOutlined />}>
                            View
                        </Button>
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h1>Transaction Management</h1>

            {/* Summary Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={summary.totalRevenue || 0}
                            precision={0}
                            prefix="Rp"
                            valueStyle={{ color: '#3f8600' }}
                            suffix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Paid"
                            value={summary.totalPaid || 0}
                            precision={0}
                            prefix="Rp"
                            valueStyle={{ color: '#52c41a' }}
                            suffix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Pending"
                            value={summary.totalPending || 0}
                            precision={0}
                            prefix="Rp"
                            valueStyle={{ color: '#faad14' }}
                            suffix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Failed"
                            value={summary.totalFailed || 0}
                            precision={0}
                            prefix="Rp"
                            valueStyle={{ color: '#ff4d4f' }}
                            suffix={<CloseCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: 16 }}>
                <Space wrap style={{ width: '100%' }}>
                    <Select
                        placeholder="Filter by Status"
                        allowClear
                        style={{ width: 200 }}
                        onChange={(value) => setStatus(value)}
                        value={status}
                    >
                        <Select.Option value="PAID">Paid</Select.Option>
                        <Select.Option value="PENDING">Pending</Select.Option>
                        <Select.Option value="FAILED">Failed</Select.Option>
                        <Select.Option value="REFUNDED">Refunded</Select.Option>
                    </Select>

                    <RangePicker
                        placeholder={['Start Date', 'End Date']}
                        onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
                        value={dateRange}
                    />

                    <Search
                        placeholder="Search by Transaction ID, Student, Teacher..."
                        allowClear
                        onSearch={setSearch}
                        style={{ width: 350 }}
                    />
                </Space>
            </Card>

            {/* Table */}
            <Table
                dataSource={result?.data}
                columns={columns}
                loading={query.isLoading}
                rowKey="id"
                pagination={{
                    total: result?.total,
                    pageSize: 10,
                    showTotal: (total) => `Total ${total} transactions`,
                }}
            />
        </div>
    );
}
