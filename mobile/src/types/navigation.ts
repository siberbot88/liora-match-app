/**
 * Navigation Types
 * Type definitions for React Navigation
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { Teacher } from './api';

export type HomeStackParamList = {
    StudentHome: undefined;
    TeacherList: undefined;
    TeacherDetail: { id: string };
    BookingForm: { teacher: Teacher };
};

export type StudentTabParamList = {
    Home: NavigatorScreenParams<HomeStackParamList>;
    Bookings: undefined;
    Profile: undefined;
};

export type AuthStackParamList = {
    Welcome: undefined;
    RoleSelection: undefined;
    Login: { role?: 'STUDENT' | 'TEACHER' | 'PARENT' };
    Register: { role: 'STUDENT' | 'TEACHER' | 'PARENT' };
    ForgotPassword: undefined;
    Verification: { email: string; role?: 'STUDENT' | 'TEACHER' | 'PARENT'; phone?: string };
    Success: { message?: string; nextScreen?: keyof AuthStackParamList | 'Student' };
};

export type RootStackParamList = {
    Splash: undefined;
    Onboarding: undefined;
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Student: NavigatorScreenParams<StudentTabParamList>;
};

// Helper types for useNavigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

export type StudentScreenNavigationProp<T extends keyof HomeStackParamList> =
    CompositeNavigationProp<
        NativeStackNavigationProp<HomeStackParamList, T>,
        BottomTabNavigationProp<StudentTabParamList>
    >;
