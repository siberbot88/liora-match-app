'use client';

import { useState } from 'react';
import { useForm } from "@refinedev/react-hook-form";
import { useList } from "@refinedev/core";
import { Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
    Input, Button, Card, Typography, Steps, Select,
    Switch, Space, Alert, Divider, InputNumber
} from "antd";
import { SaveOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import CurriculumBuilder from '../../../components/CurriculumBuilder';
import ResourcesUploader from '../../../components/ResourcesUploader';

const { TextArea } = Input;
const { Title, Text } = Typography;

const JENJANG_OPTIONS = [
    { label: 'SD', value: 'SD' },
    { label: 'SMP', value: 'SMP' },
    { label: 'SMA', value: 'SMA' },
    { label: 'UMUM', value: 'UMUM' },
];

const TEACHING_TYPE_OPTIONS = [
    { label: 'Online Course', value: 'ONLINE_COURSE', description: 'Structured video course with sections & lessons' },
    { label: 'Take Home', value: 'TAKE_HOME', description: 'Assignments to complete at home' },
    { label: 'Online Private', value: 'ONLINE_PRIVATE', description: '1-on-1 online tutoring' },
    { label: 'Public Lesson', value: 'PUBLIC_LESSON', description: 'Group classes' },
];

const COMMON_SUBJECTS = [
    'Matematika', 'Fisika', 'Kimia', 'Biologi',
    'Bahasa Indonesia', 'Bahasa Inggris', 'Sejarah',
    'Geografi', 'Ekonomi', 'Sosiologi', 'PKn',
];

export default function CreateClassPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);

    // Fetch teachers for selection
    const { result: teachersResult } = useList({
        resource: "teachers",
        pagination: { pageSize: 100 },
    });

    const {
        refineCore: { onFinish },
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        refineCoreProps: {
            resource: "classes",
            action: "create",
            redirect: "list",
        },
        defaultValues: {
            title: '',
            teacherProfileId: '',
            subtitle: '',
            descriptionShort: '',
            descriptionLong: '',
            subject: '',
            jenjang: '',
            teachingType: 'ONLINE_COURSE',
            levelRange: '',
            mainLanguage: 'Indonesian',
            captionAvailable: false,
            certificateAvailable: false,
            price: 0,
            isPublished: false,
            isPremium: false,
            features: [],
            sections: [],
            resources: [],
        },
        mode: 'onBlur',
    });

    const watchTeachingType = watch('teachingType');

    const handleFormSubmit = (data: any) => {
        onFinish(data);
    };

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    const steps = [
        {
            title: 'Basic Info',
            description: 'Class details',
        },
        {
            title: watchTeachingType === 'ONLINE_COURSE' ? 'Curriculum' : 'Resources',
            description: watchTeachingType === 'ONLINE_COURSE' ? 'Sections & lessons' : 'Materials',
        },
        {
            title: 'Features & Publish',
            description: 'Settings',
        },
    ];

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Create New Class</Title>
                <Text type="secondary">Follow the steps to create a comprehensive class</Text>
            </div>

            <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

            <form onSubmit={handleSubmit(handleFormSubmit)}>
                {/* Step 1: Basic Info */}
                {currentStep === 0 && (
                    <Card>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                    Class Title *
                                </label>
                                <Input
                                    {...register('title', {
                                        required: 'Title is required',
                                        minLength: { value: 10, message: 'Title must be at least 10 characters' }
                                    })}
                                    placeholder="e.g., Matematika SMP: Konsep Dasar & Latihan Soal"
                                    size="large"
                                    status={errors.title ? 'error' : ''}
                                />
                                {errors.title && (
                                    <Text type="danger" style={{ fontSize: 12 }}>
                                        {errors.title.message as string}
                                    </Text>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                    Teacher *
                                </label>
                                <Controller
                                    name="teacherProfileId"
                                    control={control}
                                    rules={{ required: 'Teacher is required' }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select teacher"
                                            size="large"
                                            showSearch
                                            filterOption={(input, option: any) =>
                                                option?.label?.toLowerCase().includes(input.toLowerCase())
                                            }
                                            status={errors.teacherProfileId ? 'error' : ''}
                                            style={{ width: '100%' }}
                                            options={((teachersResult as any)?.data || []).map((teacher: any) => ({
                                                label: `${teacher.user?.name || 'Unknown'} - ${teacher.subjects?.[0]?.subject?.name || 'No subject'}`,
                                                value: teacher.id,
                                            }))}
                                        />
                                    )}
                                />
                                {errors.teacherProfileId && (
                                    <Text type="danger" style={{ fontSize: 12 }}>
                                        {errors.teacherProfileId.message as string}
                                    </Text>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                    Subtitle (Tagline)
                                </label>
                                <Input
                                    {...register('subtitle')}
                                    placeholder="Short catchy description"
                                    size="large"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                    Short Description *
                                </label>
                                <TextArea
                                    {...register('descriptionShort', {
                                        required: 'Short description is required',
                                        minLength: { value: 50, message: 'Must be at least 50 characters' }
                                    })}
                                    placeholder="Brief overview for listings (50+ characters)"
                                    rows={3}
                                    status={errors.descriptionShort ? 'error' : ''}
                                    showCount
                                    maxLength={200}
                                />
                                {errors.descriptionShort && (
                                    <Text type="danger" style={{ fontSize: 12 }}>
                                        {errors.descriptionShort.message as string}
                                    </Text>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                    Long Description *
                                </label>
                                <TextArea
                                    {...register('descriptionLong', {
                                        required: 'Long description is required',
                                        minLength: { value: 100, message: 'Must be at least 100 characters' }
                                    })}
                                    placeholder="Detailed description with benefits, what students will learn, etc. (100+ characters)"
                                    rows={6}
                                    status={errors.descriptionLong ? 'error' : ''}
                                    showCount
                                />
                                {errors.descriptionLong && (
                                    <Text type="danger" style={{ fontSize: 12 }}>
                                        {errors.descriptionLong.message as string}
                                    </Text>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                        Subject *
                                    </label>
                                    <Controller
                                        name="subject"
                                        control={control}
                                        rules={{ required: 'Subject is required' }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select subject"
                                                size="large"
                                                status={errors.subject ? 'error' : ''}
                                                style={{ width: '100%' }}
                                                options={COMMON_SUBJECTS.map(s => ({ label: s, value: s }))}
                                                showSearch
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                        Jenjang *
                                    </label>
                                    <Controller
                                        name="jenjang"
                                        control={control}
                                        rules={{ required: 'Jenjang is required' }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select jenjang"
                                                size="large"
                                                status={errors.jenjang ? 'error' : ''}
                                                style={{ width: '100%' }}
                                                options={JENJANG_OPTIONS}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                    Teaching Type *
                                </label>
                                <Controller
                                    name="teachingType"
                                    control={control}
                                    rules={{ required: 'Teaching type is required' }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select teaching type"
                                            size="large"
                                            status={errors.teachingType ? 'error' : ''}
                                            style={{ width: '100%' }}
                                        >
                                            {TEACHING_TYPE_OPTIONS.map(option => (
                                                <Select.Option key={option.value} value={option.value}>
                                                    <div>
                                                        <div style={{ fontWeight: 500 }}>{option.label}</div>
                                                        <div style={{ fontSize: 12, color: '#666' }}>{option.description}</div>
                                                    </div>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                    Level Range
                                </label>
                                <Input
                                    {...register('levelRange')}
                                    placeholder="e.g., Pemula, Menengah, Semua Tingkat"
                                    size="large"
                                />
                            </div>

                            <Divider style={{ margin: '16px 0' }} />

                            {/* Pricing Section */}
                            <div>
                                <Alert
                                    type={watchTeachingType === 'ONLINE_COURSE' ? 'info' : 'warning'}
                                    message={
                                        watchTeachingType === 'ONLINE_COURSE'
                                            ? '💰 One-time Purchase (Lifetime Access)'
                                            : '⏱️ Per-Session Pricing'
                                    }
                                    description={
                                        watchTeachingType === 'ONLINE_COURSE'
                                            ? 'Students pay once and get lifetime access to all course content. Set to 0 for free courses.'
                                            : 'Students pay per session - specify price for 60 minutes of learning.'
                                    }
                                    showIcon
                                    style={{ marginBottom: 16 }}
                                />

                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                    {watchTeachingType === 'ONLINE_COURSE'
                                        ? 'Course Price (One-time)'
                                        : 'Price per 60 Minutes'}
                                    {watchTeachingType !== 'ONLINE_COURSE' && ' *'}
                                </label>
                                <Controller
                                    name="price"
                                    control={control}
                                    rules={{
                                        required: watchTeachingType !== 'ONLINE_COURSE' ? 'Price is required for per-session pricing' : false,
                                        min: {
                                            value: watchTeachingType === 'ONLINE_COURSE' ? 0 : 1,
                                            message: watchTeachingType === 'ONLINE_COURSE'
                                                ? 'Price cannot be negative'
                                                : 'Price must be greater than 0 for per-session pricing'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <InputNumber
                                            {...field}
                                            prefix="Rp"
                                            style={{ width: '100%' }}
                                            size="large"
                                            min={watchTeachingType === 'ONLINE_COURSE' ? 0 : 1}
                                            step={10000}
                                            formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                            parser={(value: any) => value?.replace(/\$\s?|(\.*)/g, '')}
                                            placeholder={watchTeachingType === 'ONLINE_COURSE' ? '0 for free course' : 'e.g., 230000'}
                                            status={errors.price ? 'error' : ''}
                                        />
                                    )}
                                />
                                {errors.price && (
                                    <Text type="danger" style={{ fontSize: 12 }}>
                                        {errors.price.message as string}
                                    </Text>
                                )}
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                                    {watchTeachingType === 'ONLINE_COURSE'
                                        ? 'Example: Rp 499.000 for complete course, or Rp 0 for free'
                                        : 'Example: Rp 230.000 per hour of learning'}
                                </Text>
                            </div>
                        </Space>

                        <Divider />

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="primary"
                                size="large"
                                onClick={nextStep}
                                icon={<ArrowRightOutlined />}
                            >
                                Next: {watchTeachingType === 'ONLINE_COURSE' ? 'Curriculum' : 'Resources'}
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Step 2: Curriculum/Resources */}
                {currentStep === 1 && (
                    <Card>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            {watchTeachingType === 'ONLINE_COURSE' ? (
                                <div>
                                    <Title level={4}>Build Your Curriculum</Title>
                                    <Text type="secondary">
                                        Organize your course into sections and lessons. Each lesson should have a title, duration, and content type.
                                    </Text>
                                    <div style={{ marginTop: 16 }}>
                                        <Controller
                                            name="sections"
                                            control={control}
                                            render={({ field }) => (
                                                <CurriculumBuilder
                                                    initialSections={field.value || []}
                                                    onChange={(sections: any) => field.onChange(sections)}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <Title level={4}>Add Learning Resources</Title>
                                    <Text type="secondary">
                                        Provide materials that students will use during the class (videos, modules, exercises, files).
                                    </Text>
                                    <div style={{ marginTop: 16 }}>
                                        <Controller
                                            name="resources"
                                            control={control}
                                            render={({ field }) => (
                                                <ResourcesUploader
                                                    initialResources={field.value || []}
                                                    onChange={(resources: any) => field.onChange(resources)}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            )}
                        </Space>

                        <Divider />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                size="large"
                                onClick={prevStep}
                                icon={<ArrowLeftOutlined />}
                            >
                                Back
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                onClick={nextStep}
                                icon={<ArrowRightOutlined />}
                            >
                                Next: Features & Publish
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Step 3: Features & Publishing */}
                {currentStep === 2 && (
                    <Card>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Title level={4}>Class Features</Title>
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>Caption Available</div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                Subtitle/captions tersedia untuk video
                                            </Text>
                                        </div>
                                        <Controller
                                            name="captionAvailable"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch checked={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>Certificate Available</div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                Students akan mendapatkan sertifikat setelah selesai
                                            </Text>
                                        </div>
                                        <Controller
                                            name="certificateAvailable"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch checked={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>Premium Class</div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                Mark as premium/featured class
                                            </Text>
                                        </div>
                                        <Controller
                                            name="isPremium"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch checked={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                </Space>
                            </div>

                            <Divider />

                            <div>
                                <Title level={4}>Publishing</Title>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>Publish Immediately</div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Make this class visible to students right away
                                        </Text>
                                    </div>
                                    <Controller
                                        name="isPublished"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch checked={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                </div>
                                <Alert
                                    type="info"
                                    message="You can always publish or unpublish later from the class details page"
                                    style={{ marginTop: 16 }}
                                />
                            </div>
                        </Space>

                        <Divider />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                size="large"
                                onClick={prevStep}
                                icon={<ArrowLeftOutlined />}
                            >
                                Back
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                loading={isSubmitting}
                                icon={<SaveOutlined />}
                            >
                                Create Class
                            </Button>
                        </div>
                    </Card>
                )}
            </form>
        </div>
    );
}
