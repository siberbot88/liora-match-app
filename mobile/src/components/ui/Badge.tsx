/**
 * Badge Component - Liora Design System
 * Small badge/tag for status, categories, or labels
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from './Typography';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
    children: string;
    variant?: BadgeVariant;
    size?: BadgeSize;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'neutral',
    size = 'md',
    style,
    textStyle,
}) => {
    const variantStyle = getVariantStyle(variant);
    const sizeStyle = getSizeStyle(size);

    return (
        <View style={[styles.container, variantStyle.container, sizeStyle.container, style]}>
            <Text
                variant={size === 'sm' ? 'caption' : 'bodySmall'}
                weight="medium"
                style={{ ...variantStyle.text, ...textStyle }}
            >
                {children}
            </Text>
        </View>
    );
};

const getVariantStyle = (variant: BadgeVariant): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
        case 'primary':
            return {
                container: { backgroundColor: colors.primaryLight + '30' },
                text: { color: colors.primaryDark },
            };
        case 'secondary':
            return {
                container: { backgroundColor: colors.secondaryLight + '30' },
                text: { color: colors.secondary },
            };
        case 'success':
            return {
                container: { backgroundColor: colors.successLight + '30' },
                text: { color: colors.successDark },
            };
        case 'warning':
            return {
                container: { backgroundColor: colors.warningLight + '30' },
                text: { color: colors.warningDark },
            };
        case 'error':
            return {
                container: { backgroundColor: colors.errorLight + '30' },
                text: { color: colors.errorDark },
            };
        case 'info':
            return {
                container: { backgroundColor: colors.infoLight + '30' },
                text: { color: colors.infoDark },
            };
        case 'neutral':
        default:
            return {
                container: { backgroundColor: colors.surfaceSecondary },
                text: { color: colors.text },
            };
    }
};

const getSizeStyle = (size: BadgeSize): { container: ViewStyle } => {
    switch (size) {
        case 'sm':
            return {
                container: {
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                },
            };
        case 'md':
        default:
            return {
                container: {
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                },
            };
    }
};

const styles = StyleSheet.create({
    container: {
        borderRadius: radius.full,
        alignSelf: 'flex-start',
    },
});
