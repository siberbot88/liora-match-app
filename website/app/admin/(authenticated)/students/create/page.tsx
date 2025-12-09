'use client';

import { useState } from "react";
import { useForm } from "@refinedev/core";
import { Form, Input, Select, Button, Card, Row, Col, Divider, Space } from "antd";
import { SaveOutlined, ArrowLeftOutlined, UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { FancyAlert } from "@/src/components/common/FancyAlert";

export default function StudentCreatePage() {
    const router = useRouter();
    const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', message: string, description?: string } | null>(null);

    const { onFinish, mutation } = useForm({
        action: "create",
        resource: "students",
        redirect: false,
        onMutationSuccess: (data) => {
            setAlertMessage({
                type: 'success',
                message: 'Student Created Successfully',
                description: `Student account for ${data?.data?.name} has been created. They can now login with their email.`
            });
            // Optional: Redirect after delay
            setTimeout(() => {
                router.push("/admin/students");
            }, 2000);
        },
        onMutationError: (error) => {
            setAlertMessage({
                type: 'error',
                message: 'Failed to Create Student',
                description: error?.message || "Please check your input and try again."
            });
        }
    });

    return (
        <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ marginBottom: 24 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.back()}
                    style={{ marginBottom: 16 }}
                >
                    Back to List
                </Button>
                <h1>Register New Student</h1>
                <p style={{ color: '#666' }}>Create a new student account manually. Detailed profile can be updated later.</p>
            </div>

            {alertMessage && (
                <FancyAlert
                    type={alertMessage.type}
                    message={alertMessage.message}
                    description={alertMessage.description}
                    closable
                    onClose={() => setAlertMessage(null)}
                />
            )}

            <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        role: 'STUDENT',
                        grade: 'SMA',
                    }}
                >
                    <Divider orientation="left" style={{ borderColor: '#f0f0f0' }}>
                        <Space><UserOutlined /> Account Information</Space>
                    </Divider>

                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Full Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter the student name' }]}
                            >
                                <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="e.g. Budi Santoso" size="large" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Email Address"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter an email' },
                                    { type: 'email', message: 'Please enter a valid email' }
                                ]}
                            >
                                <Input prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} placeholder="student@example.com" size="large" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please check password' }]}
                                help="Initial password for the student"
                            >
                                <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Min. 6 characters" size="large" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Phone Number"
                                name="phone"
                            >
                                <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} placeholder="+62..." size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" style={{ borderColor: '#f0f0f0' }}>
                        <Space><SafetyCertificateOutlined /> Academic Profile</Space>
                    </Divider>

                    <Row gutter={24}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Jenjang (Level)"
                                name="grade"
                                rules={[{ required: true }]}
                            >
                                <Select size="large">
                                    <Select.Option value="SD">SD (Elementary)</Select.Option>
                                    <Select.Option value="SMP">SMP (Junior High)</Select.Option>
                                    <Select.Option value="SMA">SMA (Senior High)</Select.Option>
                                    <Select.Option value="UMUM">Umum (General)</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={16}>
                            <Form.Item
                                label="School Name"
                                name="school"
                            >
                                <Input placeholder="e.g. SMA Negeri 1 Jakarta" size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" style={{ borderColor: '#f0f0f0' }}>
                        <Space><UserOutlined /> Parent / Guardian (Optional)</Space>
                    </Divider>

                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Parent Name"
                                name="parentName"
                            >
                                <Input placeholder="Parent's Name" size="large" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Parent Phone"
                                name="parentPhone"
                            >
                                <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} placeholder="Parent's Contact" size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
                        <Space>
                            <Button size="large" onClick={() => router.back()}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                icon={<SaveOutlined />}
                                loading={mutation?.isLoading}
                            >
                                Create Student
                            </Button>
                        </Space>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    );
}
