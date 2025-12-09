'use client';

import { useList } from "@refinedev/core";
import { Table, Space, Button, Tag, Input, Avatar } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";

const { Search } = Input;

export default function StudentsPage() {
    const [searchText, setSearchText] = useState('');

    const { result, query } = useList({
        resource: "students",
        filters: [
            ...(searchText ? [{
                field: "search", // Assumes backend supports 'search' generic filter
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
            title: 'Avatar',
            key: 'avatar',
            width: 60,
            render: (_: any, record: any) => (
                <Avatar src={record.user?.avatar} icon={<UserOutlined />} />
            ),
        },
        {
            title: 'Name',
            dataIndex: ['user', 'name'],
            key: 'name',
            render: (name: string) => <strong>{name}</strong>,
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            key: 'email',
        },
        {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
            render: (grade: string) => grade ? <Tag color="blue">{grade}</Tag> : '-',
        },
        {
            title: 'School',
            dataIndex: 'school',
            key: 'school',
            render: (school: string) => school || '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Link href={`/admin/students/edit/${record.id}`}>
                        <Button type="link" size="small" icon={<EditOutlined />}>Edit</Button>
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Students Management</h1>
                <Link href="/admin/students/create">
                    <Button type="primary" icon={<PlusOutlined />}>Add Student</Button>
                </Link>
            </div>

            <div style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Search students..."
                    allowClear
                    onSearch={setSearchText}
                    style={{ width: 300 }}
                />
            </div>

            <Table
                dataSource={result?.data}
                columns={columns}
                loading={query.isLoading}
                rowKey="id"
                pagination={{
                    total: result?.total,
                    pageSize: 10,
                    showTotal: (total) => `Total ${total} students`,
                }}
            />
        </div>
    );
}
