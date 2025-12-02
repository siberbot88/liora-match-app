/**
 * Input Component - Liora Design System
 * Text input with label, error states, and icons
 */

import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    ViewStyle,
    TextInputProps,
    TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from './Typography';

export interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    containerStyle,
    inputStyle,
    disabled = false,
    ...textInputProps
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const hasError = !!error;
    const borderColor = hasError
        ? colors.error
        : isFocused
            ? colors.primary
            : colors.border;

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text variant="bodySmall" weight="medium" style={styles.label}>
                    {label}
                </Text>
            )}

            <View
                style={[
                    styles.inputContainer,
                    { borderColor },
                    disabled && styles.disabled,
                ]}
            >
                {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

                <TextInput
                    style={[styles.input, inputStyle]}
                    placeholderTextColor={colors.textTertiary}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    editable={!disabled}
                    {...textInputProps}
                />

                {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </View>

            {error && (
                <Text variant="caption" color={colors.error} style={styles.error}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        marginBottom: spacing.xs,
        color: colors.text,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        minHeight: 48,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        paddingVertical: spacing.md,
    },
    iconLeft: {
        marginRight: spacing.sm,
    },
    iconRight: {
        marginLeft: spacing.sm,
    },
    disabled: {
        backgroundColor: colors.surfaceSecondary,
        opacity: 0.6,
    },
    error: {
        marginTop: spacing.xs,
    },
});
