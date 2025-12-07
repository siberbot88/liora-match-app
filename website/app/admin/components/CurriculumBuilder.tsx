'use client';

import { useState } from 'react';
import { Card, Button, Input, Space, Modal, Select, InputNumber, message, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface Lesson {
    id: string;
    title: string;
    durationMinutes: number;
    contentType: string;
    videoUrl?: string;
    contentUrl?: string;
    description?: string;
    order: number;
}

interface Section {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

interface CurriculumBuilderProps {
    classId?: string;
    initialSections?: Section[];
    onChange?: (sections: Section[]) => void;
}

export default function CurriculumBuilder({ classId, initialSections = [], onChange }: CurriculumBuilderProps) {
    const [sections, setSections] = useState<Section[]>(initialSections);
    const [sectionModalOpen, setSectionModalOpen] = useState(false);
    const [lessonModalOpen, setLessonModalOpen] = useState(false);
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [editingLessonParentId, setEditingLessonParentId] = useState<string | null>(null);
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

    const [sectionForm, setSectionForm] = useState({ title: '' });
    const [lessonForm, setLessonForm] = useState<Partial<Lesson>>({
        title: '',
        durationMinutes: 0,
        contentType: 'VIDEO',
        description: '',
    });

    const generateId = () => `temp_${Date.now()}_${Math.random()}`;

    const handleAddSection = () => {
        setSectionForm({ title: '' });
        setEditingSectionId(null);
        setSectionModalOpen(true);
    };

    const handleEditSection = (section: Section) => {
        setSectionForm({ title: section.title });
        setEditingSectionId(section.id);
        setSectionModalOpen(true);
    };

    const handleSaveSection = () => {
        if (!sectionForm.title.trim()) {
            message.error('Section title is required');
            return;
        }

        let updatedSections: Section[];

        if (editingSectionId) {
            updatedSections = sections.map(s =>
                s.id === editingSectionId ? { ...s, title: sectionForm.title } : s
            );
        } else {
            const newSection: Section = {
                id: generateId(),
                title: sectionForm.title,
                order: sections.length + 1,
                lessons: [],
            };
            updatedSections = [...sections, newSection];
        }

        setSections(updatedSections);
        onChange?.(updatedSections);
        setSectionModalOpen(false);
        message.success(editingSectionId ? 'Section updated' : 'Section added');
    };

    const handleDeleteSection = (sectionId: string) => {
        Modal.confirm({
            title: 'Delete Section?',
            content: 'This will also delete all lessons in this section.',
            okText: 'Delete',
            okType: 'danger',
            onOk: () => {
                const updatedSections = sections.filter(s => s.id !== sectionId);
                setSections(updatedSections);
                onChange?.(updatedSections);
                message.success('Section deleted');
            },
        });
    };

    const handleAddLesson = (sectionId: string) => {
        setLessonForm({
            title: '',
            durationMinutes: 0,
            contentType: 'VIDEO',
            description: '',
        });
        setEditingLessonParentId(sectionId);
        setEditingLessonId(null);
        setLessonModalOpen(true);
    };

    const handleEditLesson = (sectionId: string, lesson: Lesson) => {
        setLessonForm(lesson);
        setEditingLessonParentId(sectionId);
        setEditingLessonId(lesson.id);
        setLessonModalOpen(true);
    };

    const handleSaveLesson = () => {
        if (!lessonForm.title?.trim()) {
            message.error('Lesson title is required');
            return;
        }

        if (!editingLessonParentId) return;

        const updatedSections = sections.map(section => {
            if (section.id !== editingLessonParentId) return section;

            let updatedLessons: Lesson[];

            if (editingLessonId) {
                updatedLessons = section.lessons.map(l =>
                    l.id === editingLessonId ? { ...l, ...lessonForm } as Lesson : l
                );
            } else {
                const newLesson: Lesson = {
                    id: generateId(),
                    title: lessonForm.title || '',
                    durationMinutes: lessonForm.durationMinutes || 0,
                    contentType: lessonForm.contentType || 'VIDEO',
                    videoUrl: lessonForm.videoUrl,
                    contentUrl: lessonForm.contentUrl,
                    description: lessonForm.description,
                    order: section.lessons.length + 1,
                };
                updatedLessons = [...section.lessons, newLesson];
            }

            return { ...section, lessons: updatedLessons };
        });

        setSections(updatedSections);
        onChange?.(updatedSections);
        setLessonModalOpen(false);
        message.success(editingLessonId ? 'Lesson updated' : 'Lesson added');
    };

    const handleDeleteLesson = (sectionId: string, lessonId: string) => {
        Modal.confirm({
            title: 'Delete Lesson?',
            okText: 'Delete',
            okType: 'danger',
            onOk: () => {
                const updatedSections = sections.map(section => {
                    if (section.id !== sectionId) return section;
                    return {
                        ...section,
                        lessons: section.lessons.filter(l => l.id !== lessonId),
                    };
                });
                setSections(updatedSections);
                onChange?.(updatedSections);
                message.success('Lesson deleted');
            },
        });
    };

    const getTotalDuration = () => {
        const total = sections.reduce((acc, section) => {
            return acc + section.lessons.reduce((sum, lesson) => sum + (lesson.durationMinutes || 0), 0);
        }, 0);
        return total;
    };

    const totalMinutes = getTotalDuration();
    const totalHours = (totalMinutes / 60).toFixed(1);

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <strong>Curriculum Builder</strong>
                    {sections.length > 0 && (
                        <span style={{ marginLeft: 12, color: '#666', fontSize: 14 }}>
                            {sections.length} sections • {sections.reduce((acc, s) => acc + s.lessons.length, 0)} lessons • {totalHours}h total
                        </span>
                    )}
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSection}>
                    Add Section
                </Button>
            </div>

            {sections.length === 0 ? (
                <Empty description="No sections yet. Click 'Add Section' to start building your curriculum." />
            ) : (
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    {sections.map((section, sIdx) => (
                        <Card
                            key={section.id}
                            size="small"
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <MenuOutlined style={{ color: '#999' }} />
                                    <span>Section {sIdx + 1}: {section.title}</span>
                                    <span style={{ marginLeft: 'auto', fontWeight: 'normal', fontSize: 12, color: '#666' }}>
                                        {section.lessons.length} lessons
                                    </span>
                                </div>
                            }
                            extra={
                                <Space>
                                    <Button
                                        type="link"
                                        size="small"
                                        icon={<PlusOutlined />}
                                        onClick={() => handleAddLesson(section.id)}
                                    >
                                        Add Lesson
                                    </Button>
                                    <Button
                                        type="link"
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEditSection(section)}
                                    />
                                    <Button
                                        type="link"
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDeleteSection(section.id)}
                                    />
                                </Space>
                            }
                        >
                            {section.lessons.length === 0 ? (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="No lessons yet"
                                />
                            ) : (
                                <div style={{ paddingLeft: 24 }}>
                                    {section.lessons.map((lesson, lIdx) => (
                                        <div
                                            key={lesson.id}
                                            style={{
                                                padding: '8px 12px',
                                                marginBottom: 8,
                                                background: '#fafafa',
                                                borderRadius: 4,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div>
                                                <div>
                                                    <MenuOutlined style={{ color: '#ccc', marginRight: 8, fontSize: 12 }} />
                                                    <strong>{lIdx + 1}. {lesson.title}</strong>
                                                    <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>
                                                        ({lesson.durationMinutes} min • {lesson.contentType})
                                                    </span>
                                                </div>
                                                {lesson.description && (
                                                    <div style={{ fontSize: 12, color: '#999', marginLeft: 20, marginTop: 4 }}>
                                                        {lesson.description}
                                                    </div>
                                                )}
                                            </div>
                                            <Space>
                                                <Button
                                                    type="link"
                                                    size="small"
                                                    icon={<EditOutlined />}
                                                    onClick={() => handleEditLesson(section.id, lesson)}
                                                />
                                                <Button
                                                    type="link"
                                                    size="small"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleDeleteLesson(section.id, lesson.id)}
                                                />
                                            </Space>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    ))}
                </Space>
            )}

            {/* Section Modal */}
            <Modal
                title={editingSectionId ? 'Edit Section' : 'Add Section'}
                open={sectionModalOpen}
                onOk={handleSaveSection}
                onCancel={() => setSectionModalOpen(false)}
                okText="Save"
            >
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8 }}>Section Title *</label>
                    <Input
                        value={sectionForm.title}
                        onChange={e => setSectionForm({ title: e.target.value })}
                        placeholder="e.g., Introduction to Biology"
                        size="large"
                    />
                </div>
            </Modal>

            {/* Lesson Modal */}
            <Modal
                title={editingLessonId ? 'Edit Lesson' : 'Add Lesson'}
                open={lessonModalOpen}
                onOk={handleSaveLesson}
                onCancel={() => setLessonModalOpen(false)}
                okText="Save"
                width={600}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                        <label style={{ display: 'block', marginBottom: 8 }}>Lesson Title *</label>
                        <Input
                            value={lessonForm.title}
                            onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                            placeholder="e.g., What is Biology?"
                            size="large"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 8 }}>Content Type</label>
                            <Select
                                value={lessonForm.contentType}
                                onChange={value => setLessonForm({ ...lessonForm, contentType: value })}
                                style={{ width: '100%' }}
                                size="large"
                                options={[
                                    { label: 'Video', value: 'VIDEO' },
                                    { label: 'Reading (Modul)', value: 'MODUL' },
                                    { label: 'Quiz', value: 'QUIZ' },
                                    { label: 'File/Document', value: 'FILE' },
                                ]}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 8 }}>Duration (minutes)</label>
                            <InputNumber
                                value={lessonForm.durationMinutes}
                                onChange={value => setLessonForm({ ...lessonForm, durationMinutes: value || 0 })}
                                style={{ width: '100%' }}
                                size="large"
                                min={0}
                            />
                        </div>
                    </div>

                    {lessonForm.contentType === 'VIDEO' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: 8 }}>Video URL</label>
                            <Input
                                value={lessonForm.videoUrl}
                                onChange={e => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                                placeholder="https://youtube.com/watch?v=..."
                                size="large"
                            />
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', marginBottom: 8 }}>Content URL (optional)</label>
                        <Input
                            value={lessonForm.contentUrl}
                            onChange={e => setLessonForm({ ...lessonForm, contentUrl: e.target.value })}
                            placeholder="Link to PDF, quiz, etc."
                            size="large"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: 8 }}>Description (optional)</label>
                        <TextArea
                            value={lessonForm.description}
                            onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })}
                            placeholder="Brief description of this lesson"
                            rows={3}
                        />
                    </div>
                </Space>
            </Modal>
        </div>
    );
}
