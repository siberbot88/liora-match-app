'use client';

import { useState, useEffect } from 'react';
import { useCreate, useUpdate, useOne, useList } from '@refinedev/core';
import { useParams, useRouter } from 'next/navigation';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Button,
    Card,
    Upload,
    DatePicker,
    Space,
    message,
    Spin,
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function BannerFormPage() {
    const params = useParams();
    const router = useRouter();
    const bannerId = params.id as string;
    const isEdit = !!bannerId;

    const [form] = Form.useForm();
    const [linkType, setLinkType] = useState<string>('none');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const { data: bannerData, isLoading: loadingBanner } = useOne({
        resource: 'banners',
        id: bannerId,
        queryOptions: { enabled: isEdit },
    });

    const { data: classesData } = useList({ resource: 'classes', pagination: { pageSize: 100 } });
    const { data: teachersData } = useList({ resource: 'teachers', pagination: { pageSize: 100 } });

    const { mutate: createBanner, isLoading: creating } = useCreate();
    const { mutate: updateBanner, isLoading: updating } = useUpdate();

    useEffect(() => {
        if (bannerData?.data) {
            const banner = bannerData.data;
            form.setFieldsValue({
                ...banner,
                schedule: banner.startDate && banner.endDate
                    ? [dayjs(banner.startDate), dayjs(banner.endDate)]
                    : undefined,
            });
            setLinkType(banner.linkType || 'none');

            if (banner.imageUrl) {
                setFileList([{
                    uid: '-1',
                    name: 'banner.jpg',
                    status: 'done',
                    url: banner.imageUrl,
                }]);
            }
        }
    }, [bannerData, form]);

    const handleSubmit = async (values: any) => {
        const bannerData = {
            ...values,
            imageUrl: values.imageUrl || fileList[0]?.url || fileList[0]?.response?.url,
            startDate: values.schedule?.[0]?.toISOString(),
            endDate: values.schedule?.[1]?.toISOString(),
            linkType: values.linkType || 'none',
            linkId: values.linkType === 'class' || values.linkType === 'teacher' ? values.linkId : null,
            linkUrl: values.linkType === 'external' ? values.linkUrl : null,
        };

        delete bannerData.schedule;

        if (isEdit) {
            updateBanner({
                resource: 'banners',
                id: bannerId,
                values: bannerData,
            }, {
                onSuccess: () => {
                    message.success('Banner updated successfully');
                    router.push('/admin/banners');
                },
                onError: () => message.error('Failed to update banner'),
            });
        } else {
            createBanner({
                resource: 'banners',
                values: bannerData,
            }, {
                onSuccess: () => {
                    message.success('Banner created successfully');
                    router.push('/admin/banners');
                },
                onError: () => message.error('Failed to create banner'),
            });
        }
    };

    const uploadProps = {
        name: 'file',
        action: '/api/files/upload',
        fileList,
        onChange: ({ fileList: newFileList }: any) => setFileList(newFileList),
        beforeUpload: (file: File) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('You can only upload image files!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must be smaller than 2MB!');
            }
            return isImage && isLt2M;
        },
    };

    if (isEdit && loadingBanner) {
        return <div style={{ padding: 24, textAlign: 'center' }}><Spin size="large" /></div>;
    }

    return (
        <div style={{ padding: 24 }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push('/admin/banners')}
                style={{ marginBottom: 16 }}
            >
                Back to Banners
            </Button>

            <Card title={isEdit ? 'Edit Banner' : 'Create New Banner'}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        priority: 0,
                        isActive: true,
                        linkType: 'none',
                    }}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please enter banner title' }]}
                    >
                        <Input placeholder="e.g., Flash Sale - 50% Off Math Classes!" size="large" />
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <TextArea rows={3} placeholder="Limited time offer for new students" />
                    </Form.Item>

                    <Form.Item
                        label="Banner Image"
                        name="imageUrl"
                        extra="Recommended aspect ratio: 16:9, Max size: 2MB"
                    >
                        <Upload {...uploadProps} listType="picture-card" maxCount={1}>
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Link Type" name="linkType">
                        <Select onChange={(value) => setLinkType(value)}>
                            <Select.Option value="none">None</Select.Option>
                            <Select.Option value="class">Class</Select.Option>
                            <Select.Option value="teacher">Teacher</Select.Option>
                            <Select.Option value="external">External URL</Select.Option>
                        </Select>
                    </Form.Item>

                    {linkType === 'class' && (
                        <Form.Item
                            label="Select Class"
                            name="linkId"
                            rules={[{ required: true, message: 'Please select a class' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select class"
                                filterOption={(input, option: any) =>
                                    option?.label?.toLowerCase().includes(input.toLowerCase())
                                }
                                options={classesData?.data?.map((cls: any) => ({
                                    label: cls.title,
                                    value: cls.id,
                                }))}
                            />
                        </Form.Item>
                    )}

                    {linkType === 'teacher' && (
                        <Form.Item
                            label="Select Teacher"
                            name="linkId"
                            rules={[{ required: true, message: 'Please select a teacher' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select teacher"
                                filterOption={(input, option: any) =>
                                    option?.label?.toLowerCase().includes(input.toLowerCase())
                                }
                                options={teachersData?.data?.map((teacher: any) => ({
                                    label: teacher.user?.name || 'Unknown',
                                    value: teacher.id,
                                }))}
                            />
                        </Form.Item>
                    )}

                    {linkType === 'external' && (
                        <Form.Item
                            label="External URL"
                            name="linkUrl"
                            rules={[
                                { required: true, message: 'Please enter URL' },
                                { type: 'url', message: 'Please enter a valid URL' },
                            ]}
                        >
                            <Input placeholder="https://example.com/promo" />
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Priority"
                        name="priority"
                        extra="Higher numbers appear first (0-100)"
                    >
                        <InputNumber min={0} max={100} style={{ width: 120 }} />
                    </Form.Item>

                    <Form.Item
                        label="Active Status"
                        name="isActive"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        label="Schedule (Optional)"
                        name="schedule"
                        extra="Leave empty for always active"
                    >
                        <RangePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                size="large"
                                loading={creating || updating}
                            >
                                {isEdit ? 'Update Banner' : 'Create Banner'}
                            </Button>
                            <Button onClick={() => router.push('/admin/banners')} size="large">
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
