import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { AuthStack } from './AuthStack';
import { StudentTabs } from './StudentTabs';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const role = useAuthStore(state => state.role);
    const [isLoading, setIsLoading] = useState(true);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

    useEffect(() => {
        checkOnboardingStatus();
    }, []);

    const checkOnboardingStatus = async () => {
        try {
            const value = await AsyncStorage.getItem('hasSeenOnboarding');
            setHasSeenOnboarding(value === 'true');
        } catch (error) {
            console.error('Error checking onboarding status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return null; // Or a loading indicator
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!hasSeenOnboarding ? (
                <>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                </>
            ) : null}

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
