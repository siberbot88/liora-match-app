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

    const getContainerStyle = () => {
        switch (variant) {
            case 'outline':
                return styles.outlineContainer;
            case 'secondary':
                return styles.secondaryContainer;
            default:
                return styles.primaryContainer;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'outline':
                return styles.outlineText;
            case 'secondary':
                return styles.secondaryText;
            default:
                return styles.primaryText;
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={disabled}
            style={[
                styles.baseContainer,
                getContainerStyle(),
                fullWidth && styles.fullWidth,
                disabled && styles.disabled,
                style
            ]}
            {...props}
        >
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <LText
                    variant="lg"
                    style={[styles.baseText, getTextStyle()]}
                >
                    {title}
                </LText>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    baseContainer: {
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
    primaryContainer: {
        backgroundColor: theme.colors.button,
    },
    outlineContainer: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.button,
        elevation: 0, // No shadow for outline
        shadowOpacity: 0,
    },
    secondaryContainer: {
        backgroundColor: theme.colors.gray[200],
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.6,
        backgroundColor: theme.colors.gray[300],
    },
    baseText: {
        fontFamily: theme.typography.weights.semibold,
    },
    primaryText: {
        color: theme.colors.white,
    },
    outlineText: {
        color: theme.colors.button,
    },
    secondaryText: {
        color: theme.colors.text,
    },
});
