'use client';

import { useState } from 'react';
import { useOne, useUpdate } from '@refinedev/core';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag, Button, Select, Space, message, Spin, Alert } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const BOOKING_STATUS_COLORS = {
    PENDING: 'warning',
    CONFIRMED: 'processing',
    COMPLETED: 'success',
    CANCELLED: 'error',
};

export default function BookingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const bookingId = params.id as string;
    const [status, setStatus] = useState<string>();

    const { data, isLoading } = useOne({
        resource: 'bookings',
        id: bookingId,
    });

    const { mutate: updateStatus, isLoading: isUpdating } = useUpdate();

    const booking = data?.data;

    const handleStatusUpdate = () => {
        if (!status) return;

        updateStatus({
            resource: 'bookings/admin',
            id: bookingId,
            values: { status },
        }, {
            onSuccess: () => {
                message.success('Booking status updated');
                router.push('/admin/bookings');
            },
            onError: () => {
                message.error('Failed to update status');
            },
        });
    };

    if (isLoading) {
        return (
            <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div style={{ padding: 24 }}>
                <Alert type="error" message="Booking not found" />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push('/admin/bookings')}
                style={{ marginBottom: 16 }}
            >
                Back to Bookings
            </Button>

            <Card title="Booking Details">
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Booking ID" span={2}>
                        {booking.id}
                    </Descriptions.Item>

                    <Descriptions.Item label="Student">
                        {booking.student?.user?.name || 'N/A'}
                        <br />
                        <small style={{ color: '#666' }}>{booking.student?.user?.email}</small>
                    </Descriptions.Item>

                    <Descriptions.Item label="Teacher">
                        {booking.teacher?.user?.name || 'N/A'}
                        <br />
                        <small style={{ color: '#666' }}>{booking.teacher?.user?.email}</small>
                    </Descriptions.Item>

                    <Descriptions.Item label="Class">
                        {booking.class?.title || 'N/A'}
                    </Descriptions.Item>

                    <Descriptions.Item label="Subject">
                        {booking.subject?.name || 'N/A'}
                    </Descriptions.Item>

                    <Descriptions.Item label="Scheduled Date">
                        {dayjs(booking.scheduledAt).format('DD MMM YYYY, HH:mm')}
                    </Descriptions.Item>

                    <Descriptions.Item label="Duration">
                        {booking.duration} minutes
                    </Descriptions.Item>

                    <Descriptions.Item label="Mode">
                        <Tag>{booking.mode}</Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Price">
                        Rp {booking.totalPrice.toLocaleString('id-ID')}
                    </Descriptions.Item>

                    <Descriptions.Item label="Status">
                        <Tag color={BOOKING_STATUS_COLORS[booking.status as keyof typeof BOOKING_STATUS_COLORS]}>
                            {booking.status}
                        </Tag>
                    </Descriptions.Item>

                    {booking.notes && (
                        <Descriptions.Item label="Notes" span={2}>
                            {booking.notes}
                        </Descriptions.Item>
                    )}

                    {booking.transaction && (
                        <Descriptions.Item label="Transaction" span={2}>
                            <Alert
                                type="info"
                                message="This booking has an associated transaction"
                                description={`Transaction ID: ${booking.transaction.id}`}
                            />
                        </Descriptions.Item>
                    )}

                    <Descriptions.Item label="Created">
                        {dayjs(booking.createdAt).format('DD MMM YYYY, HH:mm')}
                    </Descriptions.Item>

                    <Descriptions.Item label="Last Updated">
                        {dayjs(booking.updatedAt).format('DD MMM YYYY, HH:mm')}
                    </Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 24 }}>
                    <Card title="Update Status" size="small">
                        <Space>
                            <Select
                                style={{ width: 200 }}
                                placeholder="Select new status"
                                value={status}
                                onChange={setStatus}
                                options={[
                                    { label: 'Pending', value: 'PENDING' },
                                    { label: 'Confirmed', value: 'CONFIRMED' },
                                    { label: 'Completed', value: 'COMPLETED' },
                                    { label: 'Cancelled', value: 'CANCELLED' },
                                ]}
                            />
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleStatusUpdate}
                                loading={isUpdating}
                                disabled={!status}
                            >
                                Update Status
                            </Button>
                        </Space>
                    </Card>
                </div>
            </Card>
        </div>
    );
}
