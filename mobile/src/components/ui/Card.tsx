/**
 * Card Component - Liora Design System
 * Container component for content grouping
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';

export type CardVariant = 'default' | 'outlined' | 'elevated';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
    children: React.ReactNode;
    variant?: CardVariant;
    padding?: CardPadding;
    onPress?: () => void;
    style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    onPress,
    style,
}) => {
    const variantStyle = getVariantStyle(variant);
    const paddingStyle = getPaddingStyle(padding);

    const content = (
        <View style={[styles.base, variantStyle, paddingStyle, style]}>
            {children}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

const getVariantStyle = (variant: CardVariant): ViewStyle => {
    switch (variant) {
        case 'default':
            return {
                backgroundColor: colors.white,
                borderWidth: 0,
            };

        case 'outlined':
            return {
                backgroundColor: colors.white,
                borderWidth: 1,
                borderColor: colors.border,
            };

        case 'elevated':
            return {
                backgroundColor: colors.white,
                ...shadows.md,
            };

        default:
            return {
                backgroundColor: colors.white,
            };
    }
};

const getPaddingStyle = (padding: CardPadding): ViewStyle => {
    switch (padding) {
        case 'none':
            return { padding: 0 };
        case 'sm':
            return { padding: spacing.sm };
        case 'md':
            return { padding: spacing.lg };
        case 'lg':
            return { padding: spacing.xl };
        default:
            return { padding: spacing.lg };
    }
};

const styles = StyleSheet.create({
    base: {
        borderRadius: radius.lg,
        overflow: 'hidden',
    },
});
