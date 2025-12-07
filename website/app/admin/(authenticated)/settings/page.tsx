'use client';

import { useState } from 'react';
import { Card, Typography, Tabs, Form, Input, Button, Switch, List, Tag, Select, Divider, message } from 'antd';
import {
    GlobalOutlined,
    BellOutlined,
    ApiOutlined,
    SafetyCertificateOutlined,
    DatabaseOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminSettingsPage() {
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);

    const handleSaveGeneral = (values: any) => {
        message.success('General settings saved');
    };

    const isMapboxConfigured = !!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    const items = [
        {
            key: '1',
            label: <span><GlobalOutlined /> General</span>,
            children: (
                <div style={{ padding: '24px 0', maxWidth: 600 }}>
                    <Form layout="vertical" onFinish={handleSaveGeneral} initialValues={{
                        siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Liora',
                        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
                        language: 'en',
                        timezone: 'Asia/Jakarta'
                    }}>
                        <Form.Item name="siteName" label="Site Name">
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item name="siteUrl" label="Site URL">
                            <Input size="large" disabled />
                        </Form.Item>
                        <Form.Item name="language" label="Default Language">
                            <Select size="large">
                                <Option value="en">English</Option>
                                <Option value="id">Indonesian</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="timezone" label="Timezone">
                            <Select size="large">
                                <Option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</Option>
                                <Option value="Asia/Makassar">Asia/Makassar (GMT+8)</Option>
                                <Option value="Asia/Jayapura">Asia/Jayapura (GMT+9)</Option>
                            </Select>
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Save Changes</Button>
                    </Form>
                </div>
            )
        },
        {
            key: '2',
            label: <span><BellOutlined /> Notifications</span>,
            children: (
                <div style={{ padding: '24px 0' }}>
                    <List
                        header={<Text strong>Email Notifications</Text>}
                        bordered
                        dataSource={[
                            { title: 'New Booking Request', desc: 'Receive email when a student requests a booking', state: emailNotif, setter: setEmailNotif },
                            { title: 'Payment Confirmation', desc: 'Receive email when payment is confirmed', state: emailNotif, setter: setEmailNotif },
                        ]}
                        renderItem={item => (
                            <List.Item actions={[<Switch checked={item.state} onChange={item.setter} />]}>
                                <List.Item.Meta
                                    title={item.title}
                                    description={item.desc}
                                />
                            </List.Item>
                        )}
                        style={{ marginBottom: 24 }}
                    />
                    <List
                        header={<Text strong>Push Notifications (Mobile App)</Text>}
                        bordered
                        dataSource={[
                            { title: 'New Message', desc: 'Receive push notification for new chat messages', state: pushNotif, setter: setPushNotif },
                            { title: 'Session Reminder', desc: 'Remind 15 minutes before class starts', state: pushNotif, setter: setPushNotif },
                        ]}
                        renderItem={item => (
                            <List.Item actions={[<Switch checked={item.state} onChange={item.setter} />]}>
                                <List.Item.Meta
                                    title={item.title}
                                    description={item.desc}
                                />
                            </List.Item>
                        )}
                    />
                </div>
            )
        },
        {
            key: '3',
            label: <span><ApiOutlined /> Integrations</span>,
            children: (
                <div style={{ padding: '24px 0' }}>
                    <List
                        bordered
                        dataSource={[
                            {
                                title: 'Mapbox API',
                                desc: 'Maps and Location Services',
                                connected: isMapboxConfigured,
                                env: 'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN'
                            },
                            {
                                title: 'Midtrans Payment Gateway',
                                desc: 'Payment processing (To be implemented)',
                                connected: false,
                                env: 'MIDTRANS_SERVER_KEY'
                            },
                            {
                                title: 'Firebase Storage',
                                desc: 'File and image storage (To be implemented)',
                                connected: false,
                                env: 'FIREBASE_CONFIG'
                            },
                        ]}
                        renderItem={item => (
                            <List.Item actions={[
                                item.connected ?
                                    <Tag color="success" icon={<CheckCircleOutlined />}>Connected</Tag> :
                                    <Tag color="error" icon={<CloseCircleOutlined />}>Not Configured</Tag>
                            ]}>
                                <List.Item.Meta
                                    title={item.title}
                                    description={
                                        <div>
                                            <div>{item.desc}</div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Env: {item.env}</Text>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>
            )
        },
        {
            key: '4',
            label: <span><SafetyCertificateOutlined /> Security</span>,
            children: (
                <div style={{ padding: '24px 0' }}>
                    <List
                        bordered
                        dataSource={[
                            { title: 'Two-Factor Authentication (2FA)', desc: 'Add an extra layer of security to your account', state: twoFactor, setter: setTwoFactor },
                        ]}
                        renderItem={item => (
                            <List.Item actions={[<Switch checked={item.state} onChange={item.setter} />]}>
                                <List.Item.Meta
                                    title={item.title}
                                    description={item.desc}
                                />
                            </List.Item>
                        )}
                    />
                    <div style={{ marginTop: 24, maxWidth: 600 }}>
                        <Form layout="vertical">
                            <Form.Item label="Session Timeout">
                                <Select defaultValue="30" size="large">
                                    <Option value="15">15 minutes</Option>
                                    <Option value="30">30 minutes</Option>
                                    <Option value="60">1 hour</Option>
                                    <Option value="0">Never</Option>
                                </Select>
                            </Form.Item>
                            <Button>Update Policy</Button>
                        </Form>
                    </div>
                </div>
            )
        },
        {
            key: '5',
            label: <span><DatabaseOutlined /> Data Management</span>,
            children: (
                <div style={{ padding: '24px 0' }}>
                    <Card type="inner" title="Export Data">
                        <Text>Download a copy of your platform data including users, teachers, and classes.</Text>
                        <div style={{ marginTop: 16 }}>
                            <Button onClick={() => message.info('Export started...')}>Export as CSV</Button>
                            <Button style={{ marginLeft: 12 }} onClick={() => message.info('Export started...')}>Export as JSON</Button>
                        </div>
                    </Card>
                </div>
            )
        }
    ];

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>System Settings</Title>
                <Text type="secondary">Manage platform configuration and integrations</Text>
            </div>

            <Card>
                <Tabs defaultActiveKey="1" items={items} tabPosition="left" />
            </Card>
        </div>
    );
}
