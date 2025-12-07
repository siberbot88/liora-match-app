'use client';

import { useState } from 'react';
import { Card, Button, Input, Space, Modal, Select, message, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface Resource {
    id: string;
    type: string;
    title: string;
    description?: string;
    url: string;
    order: number;
}

interface ResourcesUploaderProps {
    classId?: string;
    initialResources?: Resource[];
    onChange?: (resources: Resource[]) => void;
}

export default function ResourcesUploader({ classId, initialResources = [], onChange }: ResourcesUploaderProps) {
    const [resources, setResources] = useState<Resource[]>(initialResources);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<Partial<Resource>>({
        type: 'MODUL',
        title: '',
        description: '',
        url: '',
    });

    const generateId = () => `temp_${Date.now()}_${Math.random()}`;

    const handleAdd = () => {
        setForm({
            type: 'MODUL',
            title: '',
            description: '',
            url: '',
        });
        setEditingId(null);
        setModalOpen(true);
    };

    const handleEdit = (resource: Resource) => {
        setForm(resource);
        setEditingId(resource.id);
        setModalOpen(true);
    };

    const handleSave = () => {
        if (!form.title?.trim()) {
            message.error('Resource title is required');
            return;
        }
        if (!form.url?.trim()) {
            message.error('Resource URL is required');
            return;
        }

        let updatedResources: Resource[];

        if (editingId) {
            updatedResources = resources.map(r =>
                r.id === editingId ? { ...r, ...form } as Resource : r
            );
        } else {
            const newResource: Resource = {
                id: generateId(),
                type: form.type || 'MODUL',
                title: form.title || '',
                description: form.description,
                url: form.url || '',
                order: resources.length + 1,
            };
            updatedResources = [...resources, newResource];
        }

        setResources(updatedResources);
        onChange?.(updatedResources);
        setModalOpen(false);
        message.success(editingId ? 'Resource updated' : 'Resource added');
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Delete Resource?',
            okText: 'Delete',
            okType: 'danger',
            onOk: () => {
                const updatedResources = resources.filter(r => r.id !== id);
                setResources(updatedResources);
                onChange?.(updatedResources);
                message.success('Resource deleted');
            },
        });
    };

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return '🎥';
            case 'MODUL': return '📖';
            case 'LATIHAN': return '📝';
            case 'FILE': return '📄';
            default: return '📦';
        }
    };

    const getResourceLabel = (type: string) => {
        switch (type) {
            case 'VIDEO': return 'Video';
            case 'MODUL': return 'Reading Module';
            case 'LATIHAN': return 'Exercise/Practice';
            case 'FILE': return 'File/Document';
            default: return type;
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Resources ({resources.length})</strong>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Resource
                </Button>
            </div>

            {resources.length === 0 ? (
                <Empty description="No resources yet. Click 'Add Resource' to add study materials." />
            ) : (
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                    {resources.map((resource, idx) => (
                        <Card
                            key={resource.id}
                            size="small"
                            style={{ background: '#fafafa' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ marginBottom: 4 }}>
                                        <span style={{ fontSize: 18, marginRight: 8 }}>
                                            {getResourceIcon(resource.type)}
                                        </span>
                                        <strong>{idx + 1}. {resource.title}</strong>
                                        <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>
                                            ({getResourceLabel(resource.type)})
                                        </span>
                                    </div>
                                    {resource.description && (
                                        <div style={{ fontSize: 12, color: '#666', marginLeft: 28 }}>
                                            {resource.description}
                                        </div>
                                    )}
                                    <div style={{ fontSize: 12, color: '#1890ff', marginLeft: 28, marginTop: 4 }}>
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                            {resource.url}
                                        </a>
                                    </div>
                                </div>
                                <Space>
                                    <Button
                                        type="link"
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEdit(resource)}
                                    />
                                    <Button
                                        type="link"
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDelete(resource.id)}
                                    />
                                </Space>
                            </div>
                        </Card>
                    ))}
                </Space>
            )}

            <Modal
                title={editingId ? 'Edit Resource' : 'Add Resource'}
                open={modalOpen}
                onOk={handleSave}
                onCancel={() => setModalOpen(false)}
                okText="Save"
                width={600}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                        <label style={{ display: 'block', marginBottom: 8 }}>Resource Type *</label>
                        <Select
                            value={form.type}
                            onChange={value => setForm({ ...form, type: value })}
                            style={{ width: '100%' }}
                            size="large"
                            options={[
                                { label: '📖 Reading Module (PDF, Doc)', value: 'MODUL' },
                                { label: '🎥 Video Tutorial', value: 'VIDEO' },
                                { label: '📝 Exercises/Practice', value: 'LATIHAN' },
                                { label: '📄 File/Document', value: 'FILE' },
                            ]}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: 8 }}>Resource Title *</label>
                        <Input
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            placeholder="e.g., Algebra Practice Problems"
                            size="large"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: 8 }}>URL/Link *</label>
                        <Input
                            value={form.url}
                            onChange={e => setForm({ ...form, url: e.target.value })}
                            placeholder="https://... (Google Drive, Dropbox, YouTube, etc.)"
                            size="large"
                        />
                        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                            Upload files to Google Drive or similar, then paste the shareable link here
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: 8 }}>Description (optional)</label>
                        <TextArea
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="Brief description of this resource"
                            rows={3}
                        />
                    </div>
                </Space>
            </Modal>
        </div>
    );
}
