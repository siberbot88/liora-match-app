import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { theme } from '../../theme/theme';
import { LText } from './LText';

export interface LButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
}

export const LButton: React.FC<LButtonProps> = ({
    title,
    variant = 'primary',
    fullWidth = false,
    style,
    disabled,
    ...props
}) => {
    // Animation for press effect
    const scaleValue = React.useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.96,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={disabled}
            style={[
                styles.container,
                fullWidth && styles.fullWidth,
                disabled && styles.disabled,
                style
            ]}
            {...props}
        >
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <LText
                    variant="lg"
                    style={styles.text}
                >
                    {title}
                </LText>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.button,
        borderRadius: theme.radii.md,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        // Minimal shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.6,
        backgroundColor: theme.colors.gray[300],
    },
    text: {
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.secondary, // Contrast text for button color
    }
});
