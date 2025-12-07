import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types/navigation';
import { LContainer } from '../components/ui/LContainer';
import { LText } from '../components/ui/LText';
import { LButton } from '../components/ui/LButton';
import { theme } from '../theme/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

export function OnboardingScreen() {
    const navigation = useNavigation<NavigationProp>();

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const imageScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
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
            Animated.spring(imageScale, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleStart = async () => {
        try {
            await AsyncStorage.setItem('hasSeenOnboarding', 'true');
            navigation.replace('Auth', { screen: 'Welcome' });
        } catch (error) {
            console.error('Error saving onboarding status:', error);
            navigation.replace('Auth', { screen: 'Welcome' });
        }
    };

    return (
        <LinearGradient
            colors={['#00ADB5', '#393E46']}
            locations={[0.43, 1.0]}
            style={styles.container}
        >
            {/* Illustration */}
            <Animated.View
                style={[
                    styles.imageContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: imageScale }],
                    },
                ]}
            >
                <Image
                    source={require('../../assets/splash_img.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </Animated.View>

            {/* Content Card */}
            <Animated.View
                style={[
                    styles.contentCard,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <LText variant="xl" style={styles.title}>
                    Lebih mudah mencari guru{'\n'}privat menggunakan Liora
                </LText>

                <LText variant="sm" style={styles.subtitle}>
                    Sekarang kamu bisa belajar apa saja,{'\n'}kapan saja, di mana saja
                </LText>

                <LButton
                    title="Mulai"
                    variant="secondary"
                    fullWidth
                    onPress={handleStart}
                    style={styles.button}
                />
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.xl * 2,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
    },
    image: {
        width: width * 0.8,
        height: height * 0.4,
    },
    contentCard: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: theme.radii.xl,
        padding: theme.spacing.xl,
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontFamily: theme.typography.weights.bold,
        color: theme.colors.white,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
        lineHeight: 28,
    },
    subtitle: {
        color: theme.colors.white,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        opacity: 0.9,
        lineHeight: 20,
    },
    button: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.radii.xl,
        shadowOpacity: 0,
        elevation: 0,
        paddingVertical: theme.spacing.md,
    },
});
