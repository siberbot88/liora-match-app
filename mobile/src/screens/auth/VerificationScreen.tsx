import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Animated, Keyboard, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import { AuthStackParamList } from '../../types/navigation';
import { LContainer } from '../../components/ui/LContainer';
import { LText } from '../../components/ui/LText';
import { LButton } from '../../components/ui/LButton';
import { theme } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Verification'>;
type VerificationRouteProp = RouteProp<AuthStackParamList, 'Verification'>;

export function VerificationScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<VerificationRouteProp>();
    const { email, role, phone } = route.params;
    const [loading, setLoading] = useState(false);
    const login = useAuthStore(state => state.login);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleCheckVerification = async () => {
        try {
            setLoading(true);
            const user = auth().currentUser;

            if (!user) {
                Alert.alert('Sesi Berakhir', 'Silakan login kembali untuk melanjutkan.');
                navigation.navigate('Login', {});
                return;
            }

            await user.reload();

            if (user.emailVerified) {
                // Get Firebase Token
                const firebaseToken = await user.getIdToken();

                // Call Backend Login/Register
                const backendResponse = await api.post('/auth/firebase-login', {
                    firebaseToken,
                    role,
                    phone
                });

                const { user: backendUser, accessToken } = backendResponse.data;

                // Login to App Store
                login(backendUser, accessToken);

                navigation.navigate('Success', {
                    message: 'Email berhasil diverifikasi! Akun Anda kini aktif.',
                    nextScreen: 'Student' // Or determine based on role
                });
            } else {
                Alert.alert('Belum Diverifikasi', 'Email Anda belum terverifikasi. Silakan cek inbox atau folder spam Anda.');
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', 'Gagal memproses verifikasi: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleResendEmail = async () => {
        try {
            setLoading(true);
            const user = auth().currentUser;
            if (user) {
                await user.sendEmailVerification();
                Alert.alert('Terkirim', 'Email verifikasi baru telah dikirim.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Gagal mengirim ulang email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LContainer style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
            </TouchableOpacity>

            <Animated.View
                style={[
                    styles.content,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name="mail-open-outline" size={80} color={theme.colors.primary} />
                </View>

                <LText variant="2xl" color={theme.colors.primary} style={styles.title}>
                    Verifikasi Email
                </LText>

                <LText variant="md" style={styles.subtitle}>
                    Link verifikasi telah kami kirimkan ke{'\n'}
                    <LText variant="md" style={{ fontWeight: 'bold' }}>{email}</LText>
                </LText>

                <LText variant="sm" style={styles.instruction}>
                    Silakan buka email Anda dan klik link verifikasi yang kami kirimkan. Setelah itu, klik tombol di bawah ini.
                </LText>

                <LButton
                    title="Saya Sudah Verifikasi"
                    variant="primary"
                    fullWidth
                    onPress={handleCheckVerification}
                    loading={loading}
                    style={styles.button}
                />

                <TouchableOpacity onPress={handleResendEmail} disabled={loading} style={styles.resendButton}>
                    <LText variant="sm" color={theme.colors.primary} style={{ fontWeight: 'bold' }}>
                        Kirim Ulang Email
                    </LText>
                </TouchableOpacity>
            </Animated.View>
        </LContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    backButton: {
        position: 'absolute',
        top: theme.spacing.xl,
        left: theme.spacing.lg,
        zIndex: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontFamily: theme.typography.weights.bold,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        color: theme.colors.gray[500],
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
    },
    instruction: {
        textAlign: 'center',
        color: theme.colors.gray[400],
        marginBottom: theme.spacing.xl * 2,
        paddingHorizontal: theme.spacing.lg,
        fontSize: 14,
    },
    button: {
        marginTop: theme.spacing.sm,
    },
    resendButton: {
        marginTop: theme.spacing.lg,
        padding: theme.spacing.sm,
    },
});
