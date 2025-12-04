import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Image, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { LContainer } from '../../components/ui/LContainer';
import { LText } from '../../components/ui/LText';
import { LButton } from '../../components/ui/LButton';
import { theme } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { configureGoogleSignIn } from '../../config/google-signin';
import { api } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
    const navigation = useNavigation<NavigationProp>();
    const login = useAuthStore(state => state.login);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        configureGoogleSignIn();
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleLogin = () => {
        // Simulate successful login
        login({
            id: '1',
            email: email || 'student@example.com',
            name: 'Student User',
            role: 'STUDENT',
        }, 'dummy-token');
    };

    const onGoogleButtonPress = async () => {
        try {
            setLoading(true);
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const signInResponse = await GoogleSignin.signIn();
            const idToken = signInResponse.data?.idToken;

            if (!idToken) throw new Error('No ID token found');

            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            const userCredential = await auth().signInWithCredential(googleCredential);
            const firebaseToken = await userCredential.user.getIdToken();

            const backendResponse = await api.post('/auth/firebase-login', { firebaseToken });
            const { user, accessToken } = backendResponse.data;

            login(user, accessToken);
            Alert.alert('Success', 'Login Successful! Welcome ' + user.name);
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', 'Google Sign-In failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <LContainer style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
            </TouchableOpacity>

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            >
                <View style={styles.illustrationContainer}>
                    <Image
                        source={require('../../../assets/auth/login_img.png')}
                        style={styles.image}
                    />
                </View>

                <LText variant="3xl" color={theme.colors.primary} style={styles.title}>
                    Masuk
                </LText>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <LText variant="sm" color={theme.colors.primary} style={{ fontWeight: 'bold' }}>
                            Lupa Kata Sandi?
                        </LText>
                    </TouchableOpacity>

                    <LButton
                        title="Masuk"
                        variant="primary"
                        fullWidth
                        onPress={handleLogin}
                        style={styles.submitButton}
                    />
                </View>

                <View style={styles.footer}>
                    <LText variant="sm" color={theme.colors.gray[600]}>
                        Belum mempunyai akun?{' '}
                    </LText>
                    <TouchableOpacity onPress={() => navigation.navigate('RoleSelection')}>
                        <LText variant="sm" color={theme.colors.primary} style={{ fontWeight: 'bold' }}>
                            Daftar
                        </LText>
                    </TouchableOpacity>
                </View>

                <LText variant="sm" color={theme.colors.primary} style={styles.socialText}>
                    Atau masuk dengan
                </LText>

                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialIcon} onPress={onGoogleButtonPress} disabled={loading}>
                        <Ionicons name="logo-google" size={24} color="#DB4437" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialIcon}>
                        <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialIcon}>
                        <Ionicons name="logo-twitter" size={24} color="#000000" />
                    </TouchableOpacity>
                </View>
            </Animated.ScrollView>
        </LContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: theme.spacing.xl,
        left: theme.spacing.lg,
        zIndex: 10,
    },
    illustrationContainer: {
        marginTop: theme.spacing.xl * 2,
        marginBottom: theme.spacing.lg,
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    title: {
        fontFamily: theme.typography.weights.bold,
        marginBottom: theme.spacing.xl,
        alignSelf: 'flex-start',
    },
    form: {
        width: '100%',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: theme.radii.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        height: 50,
        justifyContent: 'center',
    },
    input: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text,
        paddingVertical: 0, // Fix for Android text clipping
        flex: 1,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
    },
    submitButton: {
        marginTop: theme.spacing.md,
    },
    footer: {
        flexDirection: 'row',
        marginBottom: theme.spacing.xl,
    },
    socialText: {
        marginBottom: theme.spacing.md,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    socialIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.gray[100],
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    }
});
