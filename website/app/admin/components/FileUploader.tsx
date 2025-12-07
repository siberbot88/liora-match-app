'use client';

import { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

interface FileUploaderProps {
    onUploadComplete?: (url: string) => void;
    accept?: string;
    maxSize?: number; // in MB
}

export default function FileUploader({
    onUploadComplete,
    accept = "image/*",
    maxSize = 5
}: FileUploaderProps) {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);

    const uploadProps: UploadProps = {
        accept,
        maxCount: 1,
        fileList,
        beforeUpload: (file) => {
            const isValidSize = file.size / 1024 / 1024 < maxSize;
            if (!isValidSize) {
                message.error(`File must be smaller than ${maxSize}MB!`);
                return false;
            }
            setFileList([file]);
            return false; // Prevent auto upload
        },
        onRemove: () => {
            setFileList([]);
        },
    };

    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('file', file as any);
        });

        setUploading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            message.success('Upload successful!');

            if (onUploadComplete) {
                onUploadComplete(data.url || data.path);
            }

            setFileList([]);
        } catch (error) {
            message.error('Upload failed. Please try again.');
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
            >
                {uploading ? 'Uploading' : 'Upload'}
            </Button>
            <p style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                Max file size: {maxSize}MB
            </p>
        </div>
    );
}
