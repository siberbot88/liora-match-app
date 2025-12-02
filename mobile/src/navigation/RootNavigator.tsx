import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { AuthStack } from './AuthStack';
import { StudentTabs } from './StudentTabs';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const role = useAuthStore(state => state.role);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
                <Stack.Screen name="Auth" component={AuthStack} />
            ) : role === 'STUDENT' ? (
                <Stack.Screen name="Student" component={StudentTabs} />
            ) : (
                // Fallback for TEACHER or other roles (can add later)
                <Stack.Screen name="Auth" component={AuthStack} />
            )}
        </Stack.Navigator>
    );
}
