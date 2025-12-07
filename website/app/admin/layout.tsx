import type { Metadata } from 'next'
import RefineProvider from './RefineProvider'


export const metadata: Metadata = {
    title: 'Liora Admin Panel',
    description: 'Master Data Management',
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <RefineProvider>
            {children}
        </RefineProvider>
    )
}
