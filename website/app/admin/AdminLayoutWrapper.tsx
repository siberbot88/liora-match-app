'use client';

import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Breadcrumb, theme as antTheme } from 'antd';
import type { MenuProps } from 'antd';
import {
    DashboardOutlined,
    TeamOutlined,
    BookOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    DatabaseOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';

const { Header, Sider, Content } = Layout;

import { useGetIdentity, useLogout } from "@refinedev/core";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { data: user } = useGetIdentity();
    const { mutate: logout } = useLogout();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = antTheme.useToken();

    const menuItems = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: 'data-master',
            icon: <DatabaseOutlined />,
            label: 'Data Master',
            children: [
                {
                    key: '/admin/teachers',
                    icon: <TeamOutlined />,
                    label: 'Teachers',
                },
                {
                    key: '/admin/classes',
                    icon: <BookOutlined />,
                    label: 'Classes',
                },
                {
                    key: '/admin/students',
                    icon: <UserOutlined />,
                    label: 'Students',
                },
            ],
        },
    ];

    const userMenuItems: MenuProps['items'] = [
        {
            key: '/admin/profile',
            icon: <UserOutlined />,
            label: 'Profile',
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
        },
    ];

    const onUserMenuClick: MenuProps['onClick'] = ({ key }) => {
        if (key === 'logout') {
            logout();
        } else {
            router.push(key);
        }
    };

    const handleMenuClick = (e: any) => {
        if (e.key.startsWith('/admin/')) {
            router.push(e.key);
        }
    };

    const getBreadcrumb = () => {
        const paths = pathname.split('/').filter(Boolean);
        const items = [
            {
                title: 'Home',
            },
        ];

        if (paths.includes('dashboard')) {
            items.push({ title: 'Dashboard' });
        } else if (paths.includes('teachers')) {
            items.push({ title: 'Data Master' });
            items.push({ title: 'Teachers' });
        } else if (paths.includes('classes')) {
            items.push({ title: 'Data Master' });
            items.push({ title: 'Classes' });
        } else if (paths.includes('students')) {
            items.push({ title: 'Data Master' });
            items.push({ title: 'Students' });
        } else if (paths.includes('profile')) {
            items.push({ title: 'Profile' });
        } else if (paths.includes('settings')) {
            items.push({ title: 'Settings' });
        }

        return items;
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 16px',
                }}>
                    <div style={{
                        color: '#1890ff',
                        fontSize: collapsed ? 20 : 24,
                        fontWeight: 'bold',
                        letterSpacing: 1
                    }}>
                        {collapsed ? 'L' : 'LIORA'}
                    </div>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
                <Header style={{
                    padding: '0 24px',
                    background: colorBgContainer,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                }}>
                    <Breadcrumb items={getBreadcrumb()} />
                    <Dropdown menu={{ items: userMenuItems, onClick: onUserMenuClick }} placement="bottomRight">
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            cursor: 'pointer'
                        }}>
                            <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} src={user?.avatar} />
                            <span style={{ fontWeight: 500 }}>{user?.name || 'Admin User'}</span>
                        </div>
                    </Dropdown>
                </Header>
                <Content style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
