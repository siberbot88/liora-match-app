import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { LContainer } from '../../components/ui/LContainer';
import { LText } from '../../components/ui/LText';
import { LButton } from '../../components/ui/LButton';
import { theme } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Implement login logic here
        // For now, navigate to Success or directly to Student
        // @ts-ignore
        navigation.replace('Student');
    };

    return (
        <LContainer style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.illustrationContainer}>
                    <View style={styles.placeholderImage}>
                        <LText variant="sm" color={theme.colors.gray[500]}>login_illustration</LText>
                    </View>
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
                    <View style={styles.socialIcon}><LText>G</LText></View>
                    <View style={styles.socialIcon}><LText>F</LText></View>
                    <View style={styles.socialIcon}><LText>X</LText></View>
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
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
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
        paddingVertical: theme.spacing.sm,
        height: 50,
        justifyContent: 'center',
    },
    input: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text,
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
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.gray[100],
        alignItems: 'center',
        justifyContent: 'center',
    }
});
