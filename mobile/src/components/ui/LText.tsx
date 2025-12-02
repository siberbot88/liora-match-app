import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';
import { fontStyle } from '../../theme/typography';

export interface LTextProps extends TextProps {
    variant?: keyof typeof theme.typography.sizes;
    color?: string;
    children: React.ReactNode;
}

export const LText: React.FC<LTextProps> = ({
    variant = 'md',
    color,
    style,
    children,
    ...props
}) => {
    const baseStyle = fontStyle(variant);

    return (
        <Text
            style={[
                baseStyle,
                color ? { color } : undefined,
                style
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};
