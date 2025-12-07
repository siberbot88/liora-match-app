'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        // Auto redirect to login page
        router.push('/admin/login');
    }, [router]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            flexDirection: 'column',
            gap: 20
        }}>
            <h1>Liora Admin Panel</h1>
            <p>Redirecting to Login...</p>
            <a href="/admin/login" style={{ color: '#1890ff' }}>
                Click here if not redirected automatically
            </a>
        </div>
    );
}
