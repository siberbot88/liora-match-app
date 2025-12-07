'use client';

import { useForm } from "@refinedev/react-hook-form";
import { useRouter } from "next/navigation";
import { useOne } from "@refinedev/core";
import { Input, Button, Spin } from "antd";

const { TextArea } = Input;

export default function EditTeacherPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const teacherId = params.id;

    const { query } = useOne({
        resource: "teachers",
        id: teacherId,
    });

    const {
        refineCore: { onFinish },
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        refineCoreProps: {
            resource: "teachers",
            action: "edit",
            id: teacherId,
            redirect: "list",
        },
    });

    if (query.isLoading) {
        return <div style={{ padding: 24, textAlign: 'center' }}><Spin size="large" /></div>;
    }

    const teacher = query.data?.data;

    return (
        <div style={{ padding: 24, maxWidth: 800 }}>
            <h1>Edit Teacher</h1>

            <form onSubmit={handleSubmit(onFinish)}>
                <div style={{ marginBottom: 16 }}>
                    <label>Full Name *</label>
                    <Input
                        {...register("name", { required: "Name is required" })}
                        defaultValue={teacher?.user?.name}
                        placeholder="Enter teacher's full name"
                        status={errors.name ? "error" : ""}
                    />
                    {errors.name?.message && <span style={{ color: 'red' }}>{String(errors.name.message)}</span>}
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Email *</label>
                    <Input
                        {...register("email", { required: "Email is required" })}
                        defaultValue={teacher?.user?.email}
                        type="email"
                        placeholder="teacher@example.com"
                        status={errors.email ? "error" : ""}
                    />
                    {errors.email?.message && <span style={{ color: 'red' }}>{String(errors.email.message)}</span>}
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Phone</label>
                    <Input
                        {...register("phone")}
                        defaultValue={teacher?.user?.phone}
                        placeholder="08123456789"
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Bio</label>
                    <TextArea
                        {...register("bio")}
                        defaultValue={teacher?.bio}
                        rows={4}
                        placeholder="Tell us about the teacher..."
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Education</label>
                    <Input
                        {...register("education")}
                        defaultValue={teacher?.education}
                        placeholder="e.g., S1 Pendidikan Matematika"
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Experience (years)</label>
                    <Input
                        {...register("experience")}
                        defaultValue={teacher?.experience}
                        type="number"
                        placeholder="0"
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Hourly Rate (Rp)</label>
                    <Input
                        {...register("hourlyRate")}
                        defaultValue={teacher?.hourlyRate}
                        type="number"
                        placeholder="100000"
                    />
                </div>

                <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                    <Button onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={isSubmitting}>
                        Update Teacher
                    </Button>
                </div>
            </form>
        </div>
    );
}
