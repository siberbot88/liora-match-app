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
                    {/* Placeholder for welcome_illustration */}
                    {/* <Image source={require('../../assets/welcome_illustration.png')} style={styles.image} /> */}
                    <View style={styles.placeholderImage}>
                        <LText variant="sm" color={theme.colors.gray[500]}>welcome_illustration</LText>
                    </View>
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

                <LText variant="sm" color={theme.colors.primary} style={styles.footerText}>
                    Atau masuk dengan
                </LText>

                {/* Social Login Placeholders */}
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.lg,
    },
    title: {
        fontFamily: theme.typography.weights.bold,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        color: theme.colors.text,
    },
    illustrationContainer: {
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
    },
    placeholderImage: {
        width: 200,
        height: 200,
        backgroundColor: theme.colors.gray[100],
        borderRadius: theme.radii.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
    welcomeText: {
        fontFamily: theme.typography.weights.bold,
        marginBottom: theme.spacing.sm,
    },
    description: {
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        color: theme.colors.gray[600],
        paddingHorizontal: theme.spacing.lg,
    },
    buttonContainer: {
        width: '100%',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    button: {
        width: '100%',
    },
    footerText: {
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
