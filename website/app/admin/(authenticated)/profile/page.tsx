'use client';

import { useState } from 'react';
import { Card, Row, Col, Avatar, Typography, Tabs, Form, Input, Button, Descriptions, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, SafetyOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function AdminProfilePage() {
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    // Mock initial data - in real app this would come from useGetIdentity()
    const [user, setUser] = useState({
        name: 'Admin User',
        email: 'admin@liora.com',
        role: 'Administrator',
        phone: '+62 812 3456 7890',
        bio: 'Super admin managing the Liora platform.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        joinedAt: '2025-01-01',
    });

    const handleProfileUpdate = (values: any) => {
        // Simulate API call
        setTimeout(() => {
            setUser({ ...user, ...values });
            setIsEditing(false);
            message.success('Profile updated successfully');
        }, 1000);
    };

    const handlePasswordChange = (values: any) => {
        // Simulate API call
        setTimeout(() => {
            passwordForm.resetFields();
            message.success('Password changed successfully');
        }, 1000);
    };

    const items = [
        {
            key: '1',
            label: 'Profile Details',
            children: (
                <div style={{ padding: '24px 0' }}>
                    {isEditing ? (
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={user}
                            onFinish={handleProfileUpdate}
                        >
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                                        <Input size="large" prefix={<UserOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="phone" label="Phone Number">
                                        <Input size="large" prefix={<PhoneOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name="bio" label="Bio">
                                        <Input.TextArea rows={4} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Save Changes</Button>
                            </div>
                        </Form>
                    ) : (
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="Full Name">{user.name}</Descriptions.Item>
                            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                            <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
                            <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
                            <Descriptions.Item label="Bio">{user.bio}</Descriptions.Item>
                            <Descriptions.Item label="Joined">{user.joinedAt}</Descriptions.Item>
                        </Descriptions>
                    )}
                </div>
            )
        },
        {
            key: '2',
            label: 'Security',
            children: (
                <div style={{ padding: '24px 0', maxWidth: 600 }}>
                    <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handlePasswordChange}
                    >
                        <Form.Item
                            name="currentPassword"
                            label="Current Password"
                            rules={[{ required: true, message: 'Please input your current password!' }]}
                        >
                            <Input.Password size="large" prefix={<SafetyOutlined />} />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label="New Password"
                            rules={[
                                { required: true, message: 'Please input your new password!' },
                                { min: 8, message: 'Password must be at least 8 characters' }
                            ]}
                        >
                            <Input.Password size="large" prefix={<SafetyOutlined />} />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Confirm New Password"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Please confirm your new password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password size="large" prefix={<SafetyOutlined />} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Change Password</Button>
                    </Form>
                </div>
            )
        }
    ];

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>My Profile</Title>
                <Text type="secondary">Manage your account settings and preferences</Text>
            </div>

            <Row gutter={24}>
                <Col xs={24} md={8}>
                    <Card style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Avatar size={100} src={user.avatar} style={{ marginBottom: 16 }} />
                        <Title level={4} style={{ margin: 0 }}>{user.name}</Title>
                        <Text type="secondary">{user.role}</Text>
                        <div style={{ marginTop: 24, textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                                <MailOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                                <Text>{user.email}</Text>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <PhoneOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                                <Text>{user.phone}</Text>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={16}>
                    <Card
                        title="Account Settings"
                        extra={!isEditing && <Button type="link" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>Edit Profile</Button>}
                    >
                        <Tabs defaultActiveKey="1" items={items} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
