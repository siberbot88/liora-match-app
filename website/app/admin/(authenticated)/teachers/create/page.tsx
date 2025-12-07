'use client';

import { useState } from 'react';
import { useForm } from "@refinedev/react-hook-form";
import { useFieldArray, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input, Button, Card, Typography, Space, Divider, Select, Alert } from "antd";
import { SaveOutlined, CloseOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { countries, commonLanguages } from '../../../constants/countries';
import FileUploader from '../../../components/FileUploader';
import { generateMapPreview, isValidGoogleMapsUrl } from '../../../utils/mapPreview';

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function CreateTeacherPage() {
    const router = useRouter();
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [mapPreviewUrl, setMapPreviewUrl] = useState<string | null>(null);

    const {
        refineCore: { onFinish },
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        refineCoreProps: {
            resource: "teachers",
            action: "create",
            redirect: "list",
        },
        mode: 'onBlur',
    });

    const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
        control,
        name: "education",
    });

    const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({
        control,
        name: "workHistory",
    });

    const { fields: orgFields, append: appendOrg, remove: removeOrg } = useFieldArray({
        control,
        name: "organizations",
    });

    const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
        control,
        name: "certifications",
    });

    const { fields: langFields, append: appendLang, remove: removeLang } = useFieldArray({
        control,
        name: "languages",
    });

    const handleFormSubmit = (data: any) => {
        const formData = {
            ...data,
            avatar: avatarUrl,
        };
        onFinish(formData);
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>
                    Add New Teacher
                </Title>
                <Text type="secondary" style={{ fontSize: 14 }}>
                    Complete teacher profile with credentials and location
                </Text>
            </div>

            <Card bordered={false} style={{
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
            }}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>

                        {/* Personal Information */}
                        <div>
                            <Title level={5} style={{ marginBottom: 16, fontWeight: 600 }}>Personal Information</Title>

                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
                                    Profile Photo
                                </label>
                                <FileUploader onUploadComplete={setAvatarUrl} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
                                        Full Name <span style={{ color: '#FF3B30' }}>*</span>
                                    </label>
                                    <Controller
                                        control={control}
                                        name="name"
                                        rules={{ required: "Name is required" }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Enter teacher's full name"
                                                status={errors.name ? "error" : ""}
                                                size="large"
                                                style={{ borderRadius: 8 }}
                                            />
                                        )}
                                    />
                                    {errors.name?.message && <Text type="danger" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>{String(errors.name.message)}</Text>}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Professional Title</label>
                                    <Input {...register("title")} placeholder="e.g., M.Pd, S.Psi" size="large" style={{ borderRadius: 8 }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Email <span style={{ color: '#FF3B30' }}>*</span></label>
                                    <Controller
                                        control={control}
                                        name="email"
                                        rules={{
                                            required: "Email is required",
                                            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" }
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="teacher@example.com"
                                                status={errors.email ? "error" : ""}
                                                size="large"
                                                style={{ borderRadius: 8 }}
                                            />
                                        )}
                                    />
                                    {errors.email?.message && <Text type="danger" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>{String(errors.email.message)}</Text>}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Phone</label>
                                    <Input {...register("phone")} placeholder="08123456789" size="large" style={{ borderRadius: 8 }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>About / Bio</label>
                                <TextArea {...register("bio")} rows={4} placeholder="Tell us about the teacher's background and expertise..." style={{ borderRadius: 8, fontSize: 14 }} />
                            </div>
                        </div>

                        <Divider />

                        {/* Location */}
                        <div>
                            <Title level={5} style={{ marginBottom: 16, fontWeight: 600 }}>Location</Title>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Country</label>
                                    <Controller
                                        control={control}
                                        name="country"
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                showSearch
                                                placeholder="Select country"
                                                size="large"
                                                style={{ width: '100%' }}
                                                options={countries.map(c => ({ label: c, value: c }))}
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>City</label>
                                    <Input {...register("city")} placeholder="e.g., Jakarta" size="large" style={{ borderRadius: 8 }} />
                                </div>
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Full Address</label>
                                <TextArea {...register("fullAddress")} rows={2} placeholder="Complete address" style={{ borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Teaching Space Description</label>
                                <TextArea {...register("locationDesc")} rows={2} placeholder="Describe teaching environment" style={{ borderRadius: 8 }} />
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Google Maps Link</label>
                                <Controller
                                    control={control}
                                    name="mapUrl"
                                    render={({ field: { onChange, value, ...field } }) => (
                                        <Input
                                            {...field}
                                            value={value}
                                            placeholder="Paste Google Maps link"
                                            size="large"
                                            style={{ borderRadius: 8 }}
                                            onChange={(e) => {
                                                onChange(e);
                                                const url = e.target.value;
                                                if (url && isValidGoogleMapsUrl(url)) {
                                                    const preview = generateMapPreview(url);
                                                    setMapPreviewUrl(preview);
                                                } else {
                                                    setMapPreviewUrl(null);
                                                }
                                            }}
                                        />
                                    )}
                                />
                                <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                                    Share location from Google Maps app
                                </Text>

                                {mapPreviewUrl ? (
                                    <div style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                                        <img
                                            src={mapPreviewUrl}
                                            alt="Location preview"
                                            style={{ width: '100%', display: 'block' }}
                                            onError={() => setMapPreviewUrl(null)}
                                        />
                                    </div>
                                ) : (
                                    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? null : (
                                        <Alert
                                            message="Mapbox access token not configured"
                                            description="Map preview requires NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in .env.local"
                                            type="info"
                                            showIcon
                                            style={{ marginTop: 12 }}
                                            closable
                                        />
                                    )
                                )}
                            </div>
                        </div>

                        <Divider />

                        {/* Professional Info */}
                        <div>
                            <Title level={5} style={{ marginBottom: 16, fontWeight: 600 }}>Professional Information</Title>

                            {/* Education */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <label style={{ fontWeight: 500, fontSize: 14, margin: 0 }}>Education</label>
                                    <Button type="dashed" onClick={() => appendEducation({ degree: '', institution: '', field: '', year: '' })} icon={<PlusOutlined />} size="small">Add Degree</Button>
                                </div>
                                {educationFields.map((field: any, index: number) => (
                                    <div key={field.id} style={{ marginBottom: 12, padding: 16, border: '1px solid #f0f0f0', borderRadius: 8 }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                            <Input {...register(`education.${index}.degree` as const)} placeholder="Degree (S1/S2/S3)" size="large" />
                                            <Input {...register(`education.${index}.year` as const)} placeholder="Year (2015-2019)" size="large" />
                                        </div>
                                        <Input {...register(`education.${index}.field` as const)} placeholder="Field of study" size="large" style={{ marginBottom: 12 }} />
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Input {...register(`education.${index}.institution` as const)} placeholder="Institution" size="large" style={{ flex: 1 }} />
                                            {educationFields.length > 0 && <Button danger icon={<DeleteOutlined />} onClick={() => removeEducation(index)} size="large" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Work History */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <label style={{ fontWeight: 500, fontSize: 14, margin: 0 }}>Work History</label>
                                    <Button type="dashed" onClick={() => appendWork({ position: '', company: '', period: '', description: '' })} icon={<PlusOutlined />} size="small">Add Experience</Button>
                                </div>
                                {workFields.map((field: any, index: number) => (
                                    <div key={field.id} style={{ marginBottom: 12, padding: 16, border: '1px solid #f0f0f0', borderRadius: 8 }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                            <Input {...register(`workHistory.${index}.position` as const)} placeholder="Position" size="large" />
                                            <Input {...register(`workHistory.${index}.period` as const)} placeholder="2019-2022" size="large" />
                                        </div>
                                        <Input {...register(`workHistory.${index}.company` as const)} placeholder="Company" size="large" style={{ marginBottom: 12 }} />
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <TextArea {...register(`workHistory.${index}.description` as const)} placeholder="Description" rows={2} style={{ flex: 1 }} />
                                            {workFields.length > 0 && <Button danger icon={<DeleteOutlined />} onClick={() => removeWork(index)} size="large" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Certifications */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <label style={{ fontWeight: 500, fontSize: 14, margin: 0 }}>Certifications</label>
                                    <Button type="dashed" onClick={() => appendCert({ name: '', issuer: '', year: '', url: '' })} icon={<PlusOutlined />} size="small">Add Certification</Button>
                                </div>
                                {certFields.map((field: any, index: number) => (
                                    <div key={field.id} style={{ marginBottom: 12, padding: 16, border: '1px solid #f0f0f0', borderRadius: 8 }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
                                            <Input {...register(`certifications.${index}.name` as const)} placeholder="Certification name" size="large" />
                                            <Input {...register(`certifications.${index}.year` as const)} placeholder="Year" size="large" />
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Input {...register(`certifications.${index}.issuer` as const)} placeholder="Issuing organization" size="large" style={{ flex: 1 }} />
                                            {certFields.length > 0 && <Button danger icon={<DeleteOutlined />} onClick={() => removeCert(index)} size="large" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Organizations */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <label style={{ fontWeight: 500, fontSize: 14, margin: 0 }}>Organizations</label>
                                    <Button type="dashed" onClick={() => appendOrg({ name: '', role: '', year: '' })} icon={<PlusOutlined />} size="small">Add Organization</Button>
                                </div>
                                {orgFields.map((field: any, index: number) => (
                                    <div key={field.id} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                        <Input {...register(`organizations.${index}.name` as const)} placeholder="Organization name" size="large" style={{ flex: 1 }} />
                                        <Input {...register(`organizations.${index}.role` as const)} placeholder="Role/Position" size="large" style={{ flex: 1 }} />
                                        <Input {...register(`organizations.${index}.year` as const)} placeholder="Year" size="large" style={{ width: 120 }} />
                                        {orgFields.length > 0 && <Button danger icon={<DeleteOutlined />} onClick={() => removeOrg(index)} size="large" />}
                                    </div>
                                ))}
                            </div>

                            {/* Languages */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <label style={{ fontWeight: 500, fontSize: 14, margin: 0 }}>Languages</label>
                                    <Button type="dashed" onClick={() => appendLang({ language: '', level: 'Native' })} icon={<PlusOutlined />} size="small">Add Language</Button>
                                </div>
                                {langFields.map((field: any, index: number) => (
                                    <div key={field.id} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                                        <div style={{ flex: 2 }}>
                                            <Controller
                                                control={control}
                                                name={`languages.${index}.language` as const}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        showSearch
                                                        placeholder="Select Language"
                                                        size="large"
                                                        style={{ width: '100%' }}
                                                        options={commonLanguages.map(l => ({ label: l, value: l }))}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <Controller
                                                control={control}
                                                name={`languages.${index}.level` as const}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        placeholder="Level"
                                                        size="large"
                                                        style={{ width: '100%' }}
                                                        options={[
                                                            { label: 'Native/Bilingual', value: 'Native' },
                                                            { label: 'Professional (C2)', value: 'C2' },
                                                            { label: 'Advanced (C1)', value: 'C1' },
                                                            { label: 'Upper Intermediate (B2)', value: 'B2' },
                                                            { label: 'Intermediate (B1)', value: 'B1' },
                                                            { label: 'Elementary (A2)', value: 'A2' },
                                                            { label: 'Beginner (A1)', value: 'A1' },
                                                        ]}
                                                    />
                                                )}
                                            />
                                        </div>
                                        {langFields.length > 0 && <Button danger icon={<DeleteOutlined />} onClick={() => removeLang(index)} size="large" />}
                                    </div>
                                ))}
                            </div>

                            {/* Experience & Rate */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Years of Experience</label>
                                    <Input {...register("experience")} type="number" placeholder="0" size="large" style={{ borderRadius: 8 }} min={0} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Hourly Rate (Rp)</label>
                                    <Input {...register("hourlyRate")} type="number" placeholder="100000" size="large" style={{ borderRadius: 8 }} min={0} />
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
                            <Button size="large" onClick={() => router.back()} icon={<CloseOutlined />} style={{ minWidth: 120, borderRadius: 8 }}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={isSubmitting} size="large" icon={<SaveOutlined />} style={{ minWidth: 120, borderRadius: 8 }}>Create Teacher</Button>
                        </div>
                    </Space>
                </form>
            </Card>
        </div>
    );
}
