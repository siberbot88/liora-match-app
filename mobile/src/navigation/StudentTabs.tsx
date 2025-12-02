import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import { StudentHomeScreen } from '../screens/student/StudentHomeScreen';
import { TeacherListScreen } from '../screens/student/TeacherListScreen';
import { TeacherDetailScreen } from '../screens/student/TeacherDetailScreen';
import { BookingFormScreen } from '../screens/student/BookingFormScreen';
import { BookingListScreen } from '../screens/student/BookingListScreen';
import { ProfileScreen } from '../screens/student/ProfileScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

// Home stack with teacher navigation
function HomeStackNavigator() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen
                name="StudentHome"
                component={StudentHomeScreen}
                options={{
                    title: 'Beranda',
                    headerShown: true,
                }}
            />
            <HomeStack.Screen
                name="TeacherList"
                component={TeacherListScreen}
                options={{ title: 'Cari Guru' }}
            />
            <HomeStack.Screen
                name="TeacherDetail"
                component={TeacherDetailScreen}
                options={{ title: 'Detail Guru' }}
            />
            <HomeStack.Screen
                name="BookingForm"
                component={BookingFormScreen}
                options={{ title: 'Booking Kelas' }}
            />
        </HomeStack.Navigator>
    );
}

export function StudentTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#8E8E93',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStackNavigator}
                options={{
                    headerShown: false,
                    title: 'Beranda',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Bookings"
                component={BookingListScreen}
                options={{
                    title: 'Jadwal Saya',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
