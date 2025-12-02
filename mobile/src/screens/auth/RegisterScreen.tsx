import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { LContainer } from '../../components/ui/LContainer';
import { LText } from '../../components/ui/LText';
import { LButton } from '../../components/ui/LButton';
import { theme } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;
type RegisterRouteProp = RouteProp<AuthStackParamList, 'Register'>;

export function RegisterScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RegisterRouteProp>();
    const { role } = route.params;

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        // Implement registration logic here
        // For now, navigate to Success
        navigation.navigate('Success', {
            message: 'Selamat! Proses autentikasi akun anda telah berhasil',
            nextScreen: 'Login' // Or directly to Student/Main
        });
    };

    return (
        <LContainer style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.illustrationContainer}>
                    <View style={styles.placeholderImage}>
                        <LText variant="sm" color={theme.colors.gray[500]}>register_illustration</LText>
                    </View>
                </View>

                <LText variant="3xl" color={theme.colors.primary} style={styles.title}>
                    Daftar
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
                            placeholder="Nomor Telepon"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Kata Sandi"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Konfirmasi Kata Sandi"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <LButton
                        title="Daftar"
                        variant="primary"
                        fullWidth
                        onPress={handleRegister}
                        style={styles.submitButton}
                    />
                </View>

                <View style={styles.footer}>
                    <LText variant="sm" color={theme.colors.gray[600]}>
                        Sudah mempunyai akun?{' '}
                    </LText>
                    <TouchableOpacity onPress={() => navigation.navigate('Login', {})}>
                        <LText variant="sm" color={theme.colors.primary} style={{ fontWeight: 'bold' }}>
                            Masuk
                        </LText>
                    </TouchableOpacity>
                </View>

                <LText variant="sm" color={theme.colors.primary} style={styles.socialText}>
                    Atau masuk dengan
                </LText>

                <View style={styles.socialContainer}>
                    <View style={styles.socialIcon}><LText>G</LText></View>
                    <View style={styles.socialIcon}><LText>F</LText></View>
                    <View style={styles.socialIcon}><LText>X</LText></View>
                </View>
            </ScrollView>
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
    placeholderImage: {
        width: 180,
        height: 180,
        backgroundColor: theme.colors.gray[100],
        borderRadius: theme.radii.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: theme.typography.weights.bold,
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
        paddingVertical: theme.spacing.sm, // approx 8px
        height: 50,
        justifyContent: 'center',
    },
    input: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text,
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
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.gray[100],
        alignItems: 'center',
        justifyContent: 'center',
    }
});
