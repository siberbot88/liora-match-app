'use client';

import { useOne, useCustomMutation } from "@refinedev/core";
import { Card, Descriptions, Tag, Button, Space, Timeline, Modal, Form, Input, InputNumber, Checkbox, message, Spin } from "antd";
import { ArrowLeftOutlined, DollarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useState } from "react";

type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';

export default function TransactionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [refundModalOpen, setRefundModalOpen] = useState(false);
    const [form] = Form.useForm();

    const { result, query } = useOne({
        resource: "admin/transactions",
        id,
    });

    const { mutate: processRefund, mutation } = useCustomMutation();

    const transaction = result;

    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case 'PAID': return 'success';
            case 'PENDING': return 'warning';
            case 'FAILED': return 'error';
            case 'REFUNDED': return 'default';
            default: return 'default';
        }
    };

    const handleRefund = async (values: any) => {
        try {
            await processRefund({
                url: `${process.env.NEXT_PUBLIC_API_URL}/admin/transactions/${id}/refund`,
                method: 'post',
                values: {
                    reason: values.reason,
                    amount: values.amount || transaction?.amount,
                },
                successNotification: () => ({
                    message: 'Refund processed successfully',
                    type: 'success',
                }),
                errorNotification: () => ({
                    message: 'Failed to process refund',
                    type: 'error',
                }),
            });
            setRefundModalOpen(false);
            form.resetFields();
            router.refresh();
        } catch (error) {
            message.error('Failed to process refund');
        }
    };

    if (query.isLoading) {
        return (
            <div style={{ padding: 24, textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!transaction) {
        return (
            <div style={{ padding: 24 }}>
                <h3>Transaction not found</h3>
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Space style={{ marginBottom: 16 }}>
                <Link href="/admin/transactions">
                    <Button icon={<ArrowLeftOutlined />}>Back to List</Button>
                </Link>
                {transaction.status === 'PAID' && !transaction.isRefunded && (
                    <Button
                        type="primary"
                        danger
                        icon={<DollarOutlined />}
                        onClick={() => setRefundModalOpen(true)}
                    >
                        Process Refund
                    </Button>
                )}
            </Space>

            <h1>Transaction Details</h1>

            {/* Transaction Information */}
            <Card title="Transaction Information" style={{ marginBottom: 16 }}>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Transaction ID" span={2}>
                        <span style={{ fontFamily: 'monospace' }}>{transaction.providerRef}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={getStatusColor(transaction.status)}>{transaction.status}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Amount">
                        <strong style={{ color: '#52c41a', fontSize: '16px' }}>
                            Rp {transaction.amount.toLocaleString('id-ID')}
                        </strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Provider">
                        <Tag color="blue">{transaction.provider.toUpperCase()}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Provider Reference">
                        {transaction.providerRef}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At" span={2}>
                        {dayjs(transaction.createdAt).format('DD MMMM YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>

                {transaction.isRefunded && (
                    <Card
                        type="inner"
                        title="Refund Information"
                        style={{ marginTop: 16 }}
                        headStyle={{ backgroundColor: '#fff1f0' }}
                    >
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Refunded Amount">
                                <strong style={{ color: '#ff4d4f' }}>
                                    Rp {transaction.refundedAmount?.toLocaleString('id-ID')}
                                </strong>
                            </Descriptions.Item>
                            <Descriptions.Item label="Refunded At">
                                {dayjs(transaction.refundedAt).format('DD MMMM YYYY HH:mm:ss')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Reason" span={2}>
                                {transaction.refundReason}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                )}
            </Card>

            {/* Booking Information */}
            <Card title="Booking Information" style={{ marginBottom: 16 }}>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Booking ID">
                        <Link href={`/admin/bookings/${transaction.booking?.id}`}>
                            {transaction.booking?.id?.substring(0, 8)}...
                        </Link>
                    </Descriptions.Item>
                    <Descriptions.Item label="Class">
                        {transaction.booking?.class?.title || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Subject">
                        {transaction.booking?.subject?.name || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Scheduled At">
                        {dayjs(transaction.booking?.scheduledAt).format('DD MMM YYYY HH:mm')}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Student & Teacher Info */}
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Card title="Student Information">
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Name">
                            {transaction.booking?.student?.user?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {transaction.booking?.student?.user?.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phone">
                            {transaction.booking?.student?.user?.phone || '-'}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card title="Teacher Information">
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Name">
                            {transaction.booking?.teacher?.user?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {transaction.booking?.teacher?.user?.email}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Space>

            {/* Refund Modal */}
            <Modal
                title="Process Refund"
                open={refundModalOpen}
                onCancel={() => {
                    setRefundModalOpen(false);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleRefund}
                    initialValues={{ amount: transaction.amount }}
                >
                    <Form.Item
                        label="Refund Reason"
                        name="reason"
                        rules={[
                            { required: true, message: 'Please provide a refund reason' },
                            { min: 10, message: 'Reason must be at least 10 characters' },
                        ]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Explain why this transaction is being refunded..."
                        />
                    </Form.Item>

                    <Form.Item
                        label="Refund Amount (Leave empty for full refund)"
                        name="amount"
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            max={transaction.amount}
                            formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/Rp\s?|(,*)/g, '') as any}
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('You must confirm')),
                            },
                        ]}
                    >
                        <Checkbox>I confirm this refund action</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => {
                                setRefundModalOpen(false);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                danger
                                htmlType="submit"
                                loading={mutation.isPending}
                                icon={<CheckCircleOutlined />}
                            >
                                Process Refund
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
