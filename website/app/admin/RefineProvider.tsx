'use client';

import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import dataProvider from "@refinedev/simple-rest";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App as AntdApp, ConfigProvider } from "antd";
import { authProvider } from "./authProvider";
import { colors } from './theme/colors';

import { customDataProvider } from "./customDataProvider";

export default function RefineProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AntdRegistry>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: colors.primary,        // #00ADB5 Turquoise
                        colorSuccess: colors.success,        // #34C759
                        colorError: colors.error,            // #FF3B30
                        colorInfo: colors.primary,
                        colorBgBase: colors.white,
                        colorTextBase: colors.text,
                        colorBorder: colors.border,
                        borderRadius: 8,
                        fontSize: 14,
                    },
                    components: {
                        Layout: {
                            headerBg: colors.white,
                            siderBg: colors.secondary,        // #222831 Dark
                            triggerBg: colors.secondary,
                        },
                        Menu: {
                            darkItemBg: colors.secondary,
                            darkItemSelectedBg: colors.primary,
                            darkItemHoverBg: 'rgba(0, 173, 181, 0.1)',
                        },
                        Button: {
                            colorPrimary: colors.primary,
                            primaryColor: colors.textInverse,
                        },
                    },
                }}
            >
                <AntdApp>
                    <Refine
                        routerProvider={routerProvider}
                        authProvider={authProvider}
                        dataProvider={customDataProvider(
                            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api"
                        )}
                        resources={[
                            {
                                name: "teachers",
                                list: "/admin/teachers",
                                create: "/admin/teachers/create",
                                edit: "/admin/teachers/edit/:id",
                                meta: {
                                    label: "Teachers",
                                },
                            },
                            {
                                name: "students",
                                list: "/admin/students",
                                create: "/admin/students/create",
                                edit: "/admin/students/edit/:id",
                                meta: {
                                    label: "Students",
                                },
                            },
                            {
                                name: "classes",
                                list: "/admin/classes",
                                create: "/admin/classes/create",
                                edit: "/admin/classes/edit/:id",
                                meta: {
                                    label: "Classes",
                                },
                            },
                            {
                                name: "bookings",
                                list: "/admin/bookings",
                                meta: {
                                    label: "Profile",
                                },
                            },
                            {
                                name: "settings",
                                list: "/admin/settings",
                                meta: {
                                    label: "Settings",
                                },
                            },
                        ]}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                        }}
                    >
                        {children}
                    </Refine>
                </AntdApp>
            </ConfigProvider>
        </AntdRegistry>
    );
}
