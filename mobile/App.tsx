import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { queryClient } from './src/config/queryClient';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <NavigationContainer>
                <StatusBar style="auto" />
                <RootNavigator />
            </NavigationContainer>
        </QueryClientProvider>
    );
}
