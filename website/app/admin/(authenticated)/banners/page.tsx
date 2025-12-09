'use client';

import { useState } from 'react';
import { useList, useDelete, useUpdate } from '@refinedev/core';
import { Table, Card, Button, Space, Popconfirm, Typography, message, Image, Tag, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function BannersListPage() {
    const { data, isLoading, refetch } = useList({
        resource: 'banners',
    });

    const { mutate: deleteBanner } = useDelete();
    const { mutate: toggleBanner } = useUpdate();

    const handleDelete = (id: string) => {
        deleteBanner({
            resource: 'banners',
            id,
        }, {
            onSuccess: () => {
                message.success('Banner deleted successfully');
                refetch();
            },
            onError: () => {
                message.error('Failed to delete banner');
            },
        });
    };

    const handleToggle = (id: string, currentStatus: boolean) => {
        toggleBanner({
            resource: `banners/${id}/toggle`,
            id,
            values: {},
        }, {
            onSuccess: () => {
                message.success(`Banner ${currentStatus ? 'deactivated' : 'activated'}`);
                refetch();
            },
            onError: () => {
                message.error('Failed to toggle banner status');
            },
        });
    };

    const columns = [
        {
            title: 'Preview',
            dataIndex: 'imageUrl',
            key: 'preview',
            width: 120,
            render: (url: string) => (
                <Image
                    src={url}
                    width={100}
                    height={56}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                    alt="Banner"
                />
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 200,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 300,
            render: (text: string) => text?.substring(0, 100) + (text?.length > 100 ? '...' : ''),
        },
        {
            title: 'Link Type',
            dataIndex: 'linkType',
            key: 'linkType',
            width: 100,
            render: (type: string) => {
                const colors: Record<string, string> = {
                    none: 'default',
                    class: 'blue',
                    teacher: 'green',
                    external: 'orange',
                };
                return type ? <Tag color={colors[type]}>{type.toUpperCase()}</Tag> : <Tag>NONE</Tag>;
            },
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            width: 80,
            sorter: (a: any, b: any) => a.priority - b.priority,
            render: (priority: number) => <Tag color="purple">{priority}</Tag>,
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 80,
            render: (isActive: boolean, record: any) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleToggle(record.id, isActive)}
                />
            ),
        },
        {
            title: 'Schedule',
            key: 'schedule',
            width: 180,
            render: (_: any, record: any) => {
                if (!record.startDate && !record.endDate) {
                    return <Tag>Always Active</Tag>;
                }
                return (
                    <div style={{ fontSize: 12 }}>
                        {record.startDate && <div>From: {dayjs(record.startDate).format('DD MMM YYYY')}</div>}
                        {record.endDate && <div>To: {dayjs(record.endDate).format('DD MMM YYYY')}</div>}
                    </div>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            fixed: 'right' as const,
            render: (_: any, record: any) => (
                <Space>
                    <Link href={`/admin/banners/edit/${record.id}`}>
                        <Button icon={<EditOutlined />} size="small" type="link">
                            Edit
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Delete banner?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger type="link">
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
                <Title level={2} style={{ margin: 0 }}>Banner Management</Title>
                <Link href="/admin/banners/create">
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Create Banner
                    </Button>
                </Link>
            </div>

            <Card>
                <Table
                    dataSource={data?.data || []}
                    columns={columns}
                    loading={isLoading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} banners`,
                    }}
                    scroll={{ x: 1300 }}
                />
            </Card>
        </div>
    );
}
