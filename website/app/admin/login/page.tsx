'use client';

import { useLogin } from "@refinedev/core";
import { Form, Input, Button, Card, Typography, Checkbox, message, theme } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { colors } from "../theme/colors";

const { Title, Text } = Typography;

export default function LoginPage() {
    const { mutate: login, isLoading } = useLogin();
    const { token } = theme.useToken();

    const onFinish = (values: any) => {
        login(values);
    };

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: `linear-gradient(135deg, ${colors.secondary} 0%, #1a1f2e 100%)`, // Using theme colors
            padding: 24
        }}>
            <Card
                style={{
                    width: "100%",
                    maxWidth: 400,
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    overflow: 'hidden'
                }}
                bodyStyle={{ padding: 40 }}
            >
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 64,
                        height: 64,
                        background: colors.primary,
                        borderRadius: 16,
                        marginBottom: 16,
                        color: 'white',
                        fontSize: 32,
                        fontWeight: 'bold',
                        boxShadow: `0 4px 12px ${colors.primary}66`
                    }}>
                        L
                    </div>
                    <Title level={2} style={{ margin: 0, color: colors.secondary }}>Welcome Back</Title>
                    <Text type="secondary">Sign in to Liora Admin Dashboard</Text>
                </div>

                <Form
                    name="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "Please input your email!" },
                            { type: "email", message: "Please enter a valid email!" }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                            placeholder="Email"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                            placeholder="Password"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a href="#" onClick={(e) => { e.preventDefault(); message.info("Please contact IT support to reset password."); }} style={{ color: colors.primary }}>
                            Forgot password?
                        </a>
                    </div>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                width: "100%",
                                height: 48,
                                borderRadius: 8,
                                fontSize: 16,
                                fontWeight: 500,
                                background: colors.primary,
                                borderColor: colors.primary
                            }}
                            loading={isLoading}
                        >
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
