import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { LContainer } from '../../components/ui/LContainer';
import { LText } from '../../components/ui/LText';
import { LButton } from '../../components/ui/LButton';
import { theme } from '../../theme/theme';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen() {
    const navigation = useNavigation<NavigationProp>();

    return (
        <LContainer style={styles.container}>
            <View style={styles.content}>
                <LText variant="5xl" color={theme.colors.primary} style={styles.title}>
                    Liora
                </LText>

                <LText variant="md" style={styles.subtitle}>
                    Cahaya Baru untuk Pembelajaran Modern
                </LText>

                <View style={styles.illustrationContainer}>
                    <Image
                        source={require('../../assets/auth/welcome_img.png')}
                        style={styles.image}
                    />
                    <View style={styles.shadow} />
                </View>

                <LText variant="2xl" color={theme.colors.primary} style={styles.welcomeText}>
                    Selamat Datang
                </LText>

                <LText variant="md" style={styles.description}>
                    Silahkan masuk atau mendaftar untuk dapat menggunakan aplikasi Liora
                </LText>

                <View style={styles.buttonContainer}>
                    <LButton
                        title="Masuk"
                        variant="outline"
                        onPress={() => navigation.navigate('Login', {})}
                        style={styles.button}
                    />
                    <LButton
                        title="Daftar"
                        variant="primary"
                        onPress={() => navigation.navigate('RoleSelection')}
                        style={styles.button}
                    />
                </View>

                {/* Pagination Dots */}
                <View style={styles.paginationContainer}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={[styles.dot, styles.activeDot]} />
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.xl,
    },
    title: {
        fontFamily: theme.typography.weights.bold,
        marginBottom: theme.spacing.xs,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        color: theme.colors.text,
        fontSize: 14,
    },
    illustrationContainer: {
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    image: {
        width: 280,
        height: 280,
        resizeMode: 'contain',
        zIndex: 1,
    },
    shadow: {
        position: 'absolute',
        bottom: 0,
        width: 200,
        height: 20,
        backgroundColor: 'rgba(0, 150, 136, 0.2)', // Teal with low opacity
        borderRadius: 100,
        transform: [{ scaleX: 1.5 }],
    },
    welcomeText: {
        fontFamily: theme.typography.weights.bold,
        marginBottom: theme.spacing.xs,
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        color: theme.colors.gray[600],
        paddingHorizontal: theme.spacing.md,
        fontSize: 14,
        lineHeight: 20,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    button: {
        width: '85%', // Not too wide as requested
    },
    paginationContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: theme.spacing.md,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.gray[300],
    },
    activeDot: {
        backgroundColor: theme.colors.primary,
    },
});
