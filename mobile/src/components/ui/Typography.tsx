/**
 * Typography Components - Liora Design System
 * Heading, Text, and Label components with consistent styling
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';
export type TextVariant = 'body' | 'bodyLarge' | 'bodySmall' | 'caption';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';

interface BaseTypographyProps extends RNTextProps {
    children: React.ReactNode;
    color?: string;
    align?: TextAlign;
    weight?: TextWeight;
    style?: TextStyle;
}

// Heading Component
export interface HeadingProps extends BaseTypographyProps {
    level?: HeadingLevel;
}

export const Heading: React.FC<HeadingProps> = ({
    level = 'h1',
    children,
    color = colors.text,
    align = 'left',
    weight,
    style,
    ...rest
}) => {
    const levelStyle = textStyles[level];

    return (
        <RNText
            style={[
                levelStyle,
                { color, textAlign: align },
                weight && { fontWeight: getFontWeight(weight) },
                style,
            ]}
            {...rest}
        >
            {children}
        </RNText>
    );
};

// Text Component
export interface TextComponentProps extends BaseTypographyProps {
    variant?: TextVariant;
}

export const Text: React.FC<TextComponentProps> = ({
    variant = 'body',
    children,
    color = colors.text,
    align = 'left',
    weight,
    style,
    ...rest
}) => {
    const variantStyle = textStyles[variant];

    return (
        <RNText
            style={[
                variantStyle,
                { color, textAlign: align },
                weight && { fontWeight: getFontWeight(weight) },
                style,
            ]}
            {...rest}
        >
            {children}
        </RNText>
    );
};

// Label Component (for form labels)
export interface LabelProps extends BaseTypographyProps {
    required?: boolean;
}

export const Label: React.FC<LabelProps> = ({
    children,
    color = colors.text,
    align = 'left',
    required = false,
    style,
    ...rest
}) => {
    return (
        <RNText
            style={[
                textStyles.label,
                { color, textAlign: align },
                style,
            ]}
            {...rest}
        >
            {children}
            {required && <RNText style={styles.required}> *</RNText>}
        </RNText>
    );
};

// Helper function
const getFontWeight = (weight: TextWeight): TextStyle['fontWeight'] => {
    const weightMap: Record<TextWeight, TextStyle['fontWeight']> = {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    };
    return weightMap[weight];
};

const styles = StyleSheet.create({
    required: {
        color: colors.error,
    },
});
