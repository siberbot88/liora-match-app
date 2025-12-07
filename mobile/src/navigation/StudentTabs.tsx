import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import { StudentHomeScreen } from '../screens/student/StudentHomeScreen';
import { TeacherListScreen } from '../screens/student/TeacherListScreen';
import { TeacherDetailScreen } from '../screens/student/TeacherDetailScreen';
import { BookingFormScreen } from '../screens/student/BookingFormScreen';
import { SearchScreen } from '../screens/student/SearchScreen';
import { ClassesScreen } from '../screens/student/ClassesScreen';
import { ChatScreen } from '../screens/student/ChatScreen';
import { BookingListScreen } from '../screens/student/BookingListScreen';
import { ProfileScreen } from '../screens/student/ProfileScreen';
import { BottomNav } from '../components/navigation/BottomNav';

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
                    headerShown: false,
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
            tabBar={(props) => <BottomNav {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStackNavigator}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
            />
            <Tab.Screen
                name="Classes"
                component={ClassesScreen}
            />
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
            />
        </Tab.Navigator>
    );
}
