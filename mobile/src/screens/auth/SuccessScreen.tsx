import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { LContainer } from '../../components/ui/LContainer';
import { LText } from '../../components/ui/LText';
import { LButton } from '../../components/ui/LButton';
import { theme } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Success'>;
type SuccessRouteProp = RouteProp<AuthStackParamList, 'Success'>;

export function SuccessScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<SuccessRouteProp>();
    const { message, nextScreen } = route.params;

    // Animations
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleNext = () => {
        if (nextScreen === 'Student') {
            // Navigate to main app
            // navigation.reset(...)
        } else if (nextScreen) {
            navigation.navigate(nextScreen as any);
        } else {
            navigation.navigate('Login', {});
        }
    };

    return (
        <LContainer style={styles.container}>
            <View style={styles.content}>
                <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <Ionicons name="checkmark" size={50} color={theme.colors.primary} />
                </Animated.View>

                <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', width: '100%' }}>
                    <LText variant="2xl" style={styles.title}>
                        Sukses!
                    </LText>

                    <LText variant="md" style={styles.message}>
                        {message || 'Selamat! Proses autentikasi akun anda telah berhasil'}
                    </LText>

                    <LButton
                        title="Selanjutnya"
                        variant="primary"
                        fullWidth
                        onPress={handleNext}
                        style={styles.button}
                    />
                </Animated.View>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontFamily: theme.typography.weights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    message: {
        textAlign: 'center',
        color: theme.colors.gray[500],
        marginBottom: theme.spacing.xl * 2,
        paddingHorizontal: theme.spacing.xl,
        lineHeight: 24,
    },
    button: {
        marginTop: theme.spacing.lg,
    },
});
