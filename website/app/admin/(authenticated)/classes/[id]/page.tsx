'use client';

import { useOne } from "@refinedev/core";
import { Card, Descriptions, Tag, Tabs, Table, Progress, Empty, Button, Space } from "antd";
import { EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ClassDetailPage() {
    const params = useParams();
    const router = useRouter();
    const classId = params.id as string;

    const { result: classData, query } = useOne({
        resource: "classes",
        id: classId,
        meta: {
            populate: ['teacher.user', 'sections.lessons', 'resources', 'statistics'],
        },
    });



    if (query.isLoading) {
        return <div style={{ padding: 24 }}>Loading...</div>;
    }

    if (!classData) {
        return <div style={{ padding: 24 }}>Class not found</div>;
    }

    const statistics = classData.statistics || {};

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0, marginBottom: 8 }}>{classData.title}</h1>
                    {classData.subtitle && (
                        <p style={{ color: '#666', margin: 0 }}>{classData.subtitle}</p>
                    )}
                </div>
                <Space>
                    <Link href={`/admin/classes/edit/${classId}`}>
                        <Button type="primary" icon={<EditOutlined />}>Edit Class</Button>
                    </Link>
                </Space>
            </div>

            <Card style={{ marginBottom: 16 }}>
                <Descriptions title="Basic Information" column={2} bordered>
                    <Descriptions.Item label="Teacher">
                        {classData.teacher?.user?.name || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Subject">
                        {classData.subject}
                    </Descriptions.Item>
                    <Descriptions.Item label="Jenjang">
                        <Tag color={
                            classData.jenjang === 'SD' ? 'green' :
                                classData.jenjang === 'SMP' ? 'blue' :
                                    classData.jenjang === 'SMA' ? 'orange' : 'purple'
                        }>
                            {classData.jenjang}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Teaching Type">
                        <Tag color="cyan">{classData.teachingType?.replace('_', ' ')}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Level Range">
                        {classData.levelRange || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Main Language">
                        {classData.mainLanguage || 'Indonesian'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Published" span={1}>
                        {classData.isPublished ? (
                            <Tag icon={<CheckCircleOutlined />} color="success">Published</Tag>
                        ) : (
                            <Tag icon={<CloseCircleOutlined />} color="default">Draft</Tag>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Premium" span={1}>
                        {classData.isPremium ? (
                            <Tag color="gold">Premium</Tag>
                        ) : (
                            <Tag>Free</Tag>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Features" span={2}>
                        {classData.captionAvailable && <Tag>Captions Available</Tag>}
                        {classData.certificateAvailable && <Tag>Certificate</Tag>}
                        {!classData.captionAvailable && !classData.certificateAvailable && 'None'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Pricing" span={2}>
                        <div>
                            <Tag color={classData.teachingType === 'ONLINE_COURSE' ? 'green' : 'blue'} style={{ marginBottom: 8 }}>
                                {classData.teachingType === 'ONLINE_COURSE'
                                    ? '💰 Lifetime Access'
                                    : '⏱️ Per Session'}
                            </Tag>
                            <div style={{ fontSize: 18, fontWeight: 'bold', marginTop: 8 }}>
                                {classData.price === 0 ? (
                                    <span style={{ color: '#52c41a' }}>FREE</span>
                                ) : (
                                    new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                    }).format(classData.price)
                                )}
                                {classData.teachingType !== 'ONLINE_COURSE' && classData.price > 0 && (
                                    <span style={{ fontSize: 12, fontWeight: 'normal', color: '#666', marginLeft: 4 }}>
                                        / 60 minutes
                                    </span>
                                )}
                            </div>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Short Description" span={2}>
                        {classData.descriptionShort}
                    </Descriptions.Item>
                    <Descriptions.Item label="Long Description" span={2}>
                        {classData.descriptionLong}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card style={{ marginBottom: 16 }} title="Statistics">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                                {statistics.totalEnrollments || 0}
                            </div>
                            <div style={{ color: '#666' }}>Total Enrollments</div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                                {statistics.totalCompletions || 0}
                            </div>
                            <div style={{ color: '#666' }}>Completions</div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                                ⭐ {statistics.averageRating?.toFixed(1) || '0.0'}
                            </div>
                            <div style={{ color: '#666' }}>
                                {statistics.totalReviews || 0} Reviews
                            </div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                                {statistics.totalLessons || 0} / {statistics.totalDurationHours || 0}h
                            </div>
                            <div style={{ color: '#666' }}>Lessons / Duration</div>
                        </div>
                    </Card>
                </div>
            </Card>

            <Tabs
                defaultActiveKey="curriculum"
                items={[
                    {
                        key: 'curriculum',
                        label: 'Curriculum',
                        children: (
                            <div>
                                {classData.teachingType === 'ONLINE_COURSE' ? (
                                    classData.sections && classData.sections.length > 0 ? (
                                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                            {classData.sections.map((section: any, idx: number) => (
                                                <Card key={section.id} title={`Section ${idx + 1}: ${section.title}`} size="small">
                                                    {section.lessons && section.lessons.length > 0 ? (
                                                        <div>
                                                            {section.lessons.map((lesson: any, lIdx: number) => (
                                                                <div
                                                                    key={lesson.id}
                                                                    style={{
                                                                        padding: '8px 12px',
                                                                        marginBottom: 8,
                                                                        background: '#fafafa',
                                                                        borderRadius: 4,
                                                                    }}
                                                                >
                                                                    <strong>{lIdx + 1}. {lesson.title}</strong>
                                                                    <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>
                                                                        ({lesson.durationMinutes} min • {lesson.contentType})
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <Empty description="No lessons" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                                    )}
                                                </Card>
                                            ))}
                                        </Space>
                                    ) : (
                                        <Empty description="No curriculum yet" />
                                    )
                                ) : (
                                    <Empty description="Curriculum only available for Online Courses" />
                                )}
                            </div>
                        ),
                    },
                    {
                        key: 'resources',
                        label: 'Resources',
                        children: (
                            <div>
                                {classData.resources && classData.resources.length > 0 ? (
                                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                                        {classData.resources.map((resource: any, idx: number) => (
                                            <Card key={resource.id} size="small">
                                                <div>
                                                    <strong>{idx + 1}. {resource.title}</strong>
                                                    <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>
                                                        ({resource.type})
                                                    </span>
                                                </div>
                                                {resource.description && (
                                                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                                                        {resource.description}
                                                    </div>
                                                )}
                                                <div style={{ marginTop: 8 }}>
                                                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                                        {resource.url}
                                                    </a>
                                                </div>
                                            </Card>
                                        ))}
                                    </Space>
                                ) : (
                                    <Empty description="No resources yet" />
                                )}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
}
