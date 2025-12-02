import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    WelcomeScreen,
    RoleSelectionScreen,
    LoginScreen,
    RegisterScreen,
    SuccessScreen
} from '../screens/auth';
import { AuthStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} />
        </Stack.Navigator>
    );
}
