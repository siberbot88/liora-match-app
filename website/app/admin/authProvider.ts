'use client';

import { AuthProvider } from "@refinedev/core";
import axios from "axios";

// Force use of port 3333 for backend API to avoid conflict with frontend (port 3000)
const API_URL = "http://localhost:3333/api";

export const authProvider: AuthProvider = {
    login: async ({ email, password }: { email?: string; password?: string } = {}) => {
        try {
            if (!email || !password) {
                return {
                    success: false,
                    error: {
                        name: "LoginError",
                        message: "Email and password are required",
                    },
                };
            }

            const response = await axios.post(`${API_URL}/auth/admin-login`, {
                email,
                password,
            });

            const { accessToken, user } = response.data;

            if (accessToken) {
                localStorage.setItem("liora_auth_token", accessToken);
                localStorage.setItem("liora_user", JSON.stringify(user));

                return {
                    success: true,
                    redirectTo: "/admin/dashboard",
                };
            }

            return {
                success: false,
                error: {
                    name: "LoginError",
                    message: "Invalid response from server",
                },
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    name: "LoginError",
                    message: error.response?.data?.message || "Invalid email or password",
                },
            };
        }
    },
    logout: async () => {
        localStorage.removeItem("liora_auth_token");
        localStorage.removeItem("liora_user");
        return {
            success: true,
            redirectTo: "/admin/login",
        };
    },
    check: async () => {
        const token = localStorage.getItem("liora_auth_token");
        if (token) {
            return {
                authenticated: true,
            };
        }

        return {
            authenticated: false,
            redirectTo: "/admin/login",
        };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
        const user = localStorage.getItem("liora_user");
        if (user) {
            return JSON.parse(user);
        }
        return null;
    },
    onError: async (error: any) => {
        console.error("Auth Error:", error);
        return { error };
    },
};
