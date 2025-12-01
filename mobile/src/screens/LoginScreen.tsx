import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');

    const { login, register, isLoading, error } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        try {
            await login(email, password, role);
            Alert.alert('Success', 'Logged in successfully!');
        } catch (err: any) {
            Alert.alert('Login Failed', err.message);
        }
    };

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        try {
            await register(email, password, role);
            Alert.alert('Success', 'Account created successfully!');
        } catch (err: any) {
            Alert.alert('Registration Failed', err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Liora Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <View style={styles.roleContainer}>
                <TouchableOpacity
                    style={[styles.roleButton, role === 'STUDENT' && styles.roleButtonActive]}
                    onPress={() => setRole('STUDENT')}
                >
                    <Text style={role === 'STUDENT' ? styles.roleTextActive : styles.roleText}>
                        Student
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.roleButton, role === 'TEACHER' && styles.roleButtonActive]}
                    onPress={() => setRole('TEACHER')}
                >
                    <Text style={role === 'TEACHER' ? styles.roleTextActive : styles.roleText}>
                        Teacher
                    </Text>
                </TouchableOpacity>
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={handleRegister}
                disabled={isLoading}
            >
                <Text style={styles.buttonTextSecondary}>Register</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    roleContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    roleButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    roleButtonActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    roleText: {
        fontSize: 16,
        color: '#666',
    },
    roleTextActive: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonSecondary: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonTextSecondary: {
        color: '#007AFF',
        fontSize: 18,
        fontWeight: '600',
    },
    error: {
        color: 'red',
        marginBottom: 15,
        textAlign: 'center',
    },
});
