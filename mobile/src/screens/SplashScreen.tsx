import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const { width } = Dimensions.get('window');

export function SplashScreen() {
    const navigation = useNavigation<NavigationProp>();

    // Animation values
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const loadingWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Logo animation sequence
        Animated.sequence([
            // Scale and fade in logo
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            // Wait a moment
            Animated.delay(500),
        ]).start(() => {
            // Start loading bar animation
            Animated.timing(loadingWidth, {
                toValue: width * 0.6,
                duration: 2000,
                useNativeDriver: false,
            }).start(() => {
                // Navigate to onboarding after loading complete
                setTimeout(() => {
                    navigation.replace('Onboarding');
                }, 300);
            });
        });
    }, []);

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: logoOpacity,
                        transform: [{ scale: logoScale }],
                    },
                ]}
            >
                <Image
                    source={require('../../assets/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>

            {/* Loading bar */}
            <View style={styles.loadingContainer}>
                <Animated.View
                    style={[
                        styles.loadingBar,
                        {
                            width: loadingWidth,
                        },
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary, // Teal color
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100,
    },
    logo: {
        width: 200,
        height: 200,
    },
    loadingContainer: {
        position: 'absolute',
        bottom: 100,
        width: width * 0.6,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    loadingBar: {
        height: '100%',
        backgroundColor: theme.colors.white,
        borderRadius: 2,
    },
});
