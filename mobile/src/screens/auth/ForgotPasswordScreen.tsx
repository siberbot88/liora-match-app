import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import { AuthStackParamList } from '../../types/navigation';
import { LContainer } from '../../components/ui/LContainer';
import { LText } from '../../components/ui/LText';
import { LButton } from '../../components/ui/LButton';
import { theme } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Mohon masukkan alamat email Anda');
            return;
        }

        try {
            setLoading(true);
            Keyboard.dismiss();
            await auth().sendPasswordResetEmail(email);

            navigation.navigate('Success', {
                message: 'Link reset password telah dikirim ke email Anda. Silakan cek inbox atau folder spam.',
                nextScreen: 'Login'
            });
        } catch (error: any) {
            console.error(error);
            let errorMessage = 'Gagal mengirim link reset password';

            if (error.code === 'auth/invalid-email') {
                errorMessage = 'Format email tidak valid';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'Email tidak terdaftar';
            }

            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LContainer style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
            </TouchableOpacity>

            <View style={styles.content}>
                <LText variant="2xl" color={theme.colors.primary} style={styles.title}>
                    Lupa Password?
                </LText>

                <LText variant="md" style={styles.subtitle}>
                    Jangan khawatir! Masukkan email yang terdaftar dan kami akan mengirimkan link untuk mereset password Anda.
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

                    <LButton
                        title="Kirim Link Reset"
                        variant="primary"
                        fullWidth
                        onPress={handleResetPassword}
                        loading={loading}
                        style={styles.button}
                    />
                </View>
            </View>
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
    title: {
        fontFamily: theme.typography.weights.bold,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        color: theme.colors.gray[500],
        marginBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.md,
    },
    form: {
        width: '100%',
        gap: theme.spacing.md,
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
        paddingVertical: 0,
        flex: 1,
    },
    button: {
        marginTop: theme.spacing.md,
    },
});
