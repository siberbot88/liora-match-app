'use client';

import { useList } from "@refinedev/core";
import { List, Table, Space, Button } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function TeachersPage() {
    const { data, isLoading } = useList({
        resource: "teachers",
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Subject',
            dataIndex: 'subjects',
            key: 'subjects',
            render: (subjects: any[]) => subjects?.[0]?.subject?.name || '-',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating: number) => `⭐ ${rating?.toFixed(1) || '0.0'}`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => {
                const handleDelete = async () => {
                    if (window.confirm(`Delete teacher ${record.user?.name}?`)) {
                        try {
                            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teachers/${record.id}`, {
                                method: 'DELETE',
                            });
                            window.location.reload();
                        } catch (error) {
                            alert('Failed to delete teacher');
                        }
                    }
                };

                return (
                    <Space>
                        <Link href={`/admin/teachers/edit/${record.id}`}>
                            <Button type="link" icon={<EditOutlined />}>Edit</Button>
                        </Link>
                        <Button
                            type="link"
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
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h1>Teachers Management</h1>
                <Link href="/admin/teachers/create">
                    <Button type="primary" icon={<PlusOutlined />}>Add Teacher</Button>
                </Link>
            </div>
            <Table
                dataSource={data?.data}
                columns={columns}
                loading={isLoading}
                rowKey="id"
            />
        </div>
    );
}
