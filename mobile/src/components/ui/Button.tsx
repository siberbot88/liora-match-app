/**
 * Button Component - Liora Design System
 * Reusable button with variants, sizes, and states
 */

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { textStyles } from '../../theme/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
    // Content
    children: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;

    // Behavior
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;

    // Style
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;

    // Custom styles
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    leftIcon,
    rightIcon,
    onPress,
    disabled = false,
    loading = false,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    style,
    textStyle,
}) => {
    const isDisabled = disabled || loading;

    // Variant styles
    const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
        switch (variant) {
            case 'primary':
                return {
                    container: {
                        backgroundColor: colors.primary,
                        ...shadows.sm,
                    },
                    text: { color: colors.textInverse },
                };

            case 'secondary':
                return {
                    container: {
                        backgroundColor: colors.secondary,
                        ...shadows.sm,
                    },
                    text: { color: colors.textInverse },
                };

            case 'accent':
                return {
                    container: {
                        backgroundColor: colors.accent,
                        ...shadows.sm,
                    },
                    text: { color: colors.secondary },
                };

            case 'outline':
                return {
                    container: {
                        backgroundColor: colors.transparent,
                        borderWidth: 2,
                        borderColor: colors.primary,
                    },
                    text: { color: colors.primary },
                };

            case 'ghost':
                return {
                    container: {
                        backgroundColor: colors.transparent,
                    },
                    text: { color: colors.primary },
                };

            default:
                return {
                    container: { backgroundColor: colors.primary },
                    text: { color: colors.textInverse },
                };
        }
    };

    // Size styles
    const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
        switch (size) {
            case 'sm':
                return {
                    container: {
                        paddingVertical: spacing.sm,
                        paddingHorizontal: spacing.lg,
                        minHeight: 36,
                    },
                    text: textStyles.buttonSmall,
                };

            case 'md':
                return {
                    container: {
                        paddingVertical: spacing.md,
                        paddingHorizontal: spacing.xl,
                        minHeight: 44,
                    },
                    text: textStyles.button,
                };

            case 'lg':
                return {
                    container: {
                        paddingVertical: spacing.lg,
                        paddingHorizontal: spacing['2xl'],
                        minHeight: 52,
                    },
                    text: textStyles.buttonLarge,
                };

            default:
                return {
                    container: {
                        paddingVertical: spacing.md,
                        paddingHorizontal: spacing.xl,
                        minHeight: 44,
                    },
                    text: textStyles.button,
                };
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[
                styles.container,
                variantStyles.container,
                sizeStyles.container,
                fullWidth && styles.fullWidth,
                isDisabled && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    color={variantStyles.text.color}
                    size={size === 'sm' ? 'small' : 'small'}
                />
            ) : (
                <View style={styles.content}>
                    {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
                    <Text style={[sizeStyles.text, variantStyles.text, textStyle]}>
                        {children}
                    </Text>
                    {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
    iconLeft: {
        marginRight: spacing.xs,
    },
    iconRight: {
        marginLeft: spacing.xs,
    },
});
