'use client';

import { useState, useEffect } from 'react';
import { useForm } from "@refinedev/react-hook-form";
import { useList, useOne } from "@refinedev/core";
import { Controller } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { 
    Input, Button, Card, Typography, Steps, Select, 
    Switch, Space, Alert, Divider 
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

export default function EditClassPage() {
    const params = useParams();
    const router = useRouter();
    const classId = params.id as string;
    const [currentStep, setCurrentStep] = useState(0);
    const [teachingType, setTeachingType] = useState('ONLINE_COURSE');

    // Fetch existing class data
    const { data: classData, isLoading: classLoading } = useOne({
        resource: "classes",
        id: classId,
        meta: {
            populate: ['sections.lessons', 'resources'],
        },
    });

    // Fetch teachers for selection
    const { data: teachersData } = useList({
        resource: "teachers",
        pagination: { pageSize: 100 },
    });

    const {
        refineCore: { onFinish },
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        refineCoreProps: {
            resource: "classes",
            action: "edit",
            id: classId,
            redirect: "list",
        },
        mode: 'onBlur',
    });

    // Populate form with existing data
    useEffect(() => {
        if (classData?.data) {
            reset(classData.data);
            setTeachingType(classData.data.teachingType || 'ONLINE_COURSE');
        }
    }, [classData, reset]);

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

    if (classLoading) {
        return <div style={{ padding: 24 }}>Loading class data...</div>;
    }

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Edit Class</Title>
                <Text type="secondary">Update class information and curriculum</Text>
            </div>

            <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

            <form onSubmit={handleSubmit(handleFormSubmit)}>
                {/* Step 1: Basic Info - Same as create form */}
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
                                    placeholder="e.g., Biologi SMP: Konsep Dasar & Latihan Soal"
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
                                            options={teachersData?.data?.map((teacher: any) => ({
                                                label: `${teacher.user?.name || 'Unknown'} - ${teacher.subjects?.[0]?.subject?.name || 'No subject'}`,
                                                value: teacher.id,
                                            })) || []}
                                        />
                                    )}
                                />
                            </div>

                            {/* Remaining fields same as create form... */}
                            {/* For brevity, showing key fields only */}

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
                                                style={{ width: '100%' }}
                                                options={JENJANG_OPTIONS}
                                            />
                                        )}
                                    />
                                </div>
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

                {/* Step 2: Curriculum/Resources - Using same components as create */}
                {currentStep === 1 && (
                    <Card>
                        {watchTeachingType === 'ONLINE_COURSE' ? (
                            <CurriculumBuilder 
                                classId={classId}
                                initialSections={classData?.data?.sections || []}
                                onChange={(sections) => console.log('Sections updated:', sections)} 
                            />
                        ) : (
                            <ResourcesUploader 
                                classId={classId}
                                initialResources={classData?.data?.resources || []}
                                onChange={(resources) => console.log('Resources updated:', resources)} 
                            />
                        )}

                        <Divider />

                        <Space>
                            <Button size="large" onClick={prevStep} icon={<ArrowLeftOutlined />}>
                                Back
                            </Button>
                            <Button type="primary" size="large" onClick={nextStep} icon={<ArrowRightOutlined />}>
                                Next: Features & Publish
                            </Button>
                        </Space>
                    </Card>
                )}

                {/* Step 3: Features & Publishing - Same as create form */}
                {currentStep === 2 && (
                    <Card>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <Text strong>Published</Text>
                                        <br />
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Make class visible to students
                                        </Text>
                                    </div>
                                    <Controller
                                        name="isPublished"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch {...field} checked={field.value} />
                                        )}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <Text strong>Premium Class</Text>
                                        <br />
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Requires payment to enroll
                                        </Text>
                                    </div>
                                    <Controller
                                        name="isPremium"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch {...field} checked={field.value} />
                                        )}
                                    />
                                </div>
                            </div>
                        </Space>

                        <Divider />

                        <Space>
                            <Button size="large" onClick={prevStep} icon={<ArrowLeftOutlined />}>
                                Back
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                loading={isSubmitting}
                                icon={<SaveOutlined />}
                            >
                                Update Class
                            </Button>
                        </Space>
                    </Card>
                )}
            </form>
        </div>
    );
}
