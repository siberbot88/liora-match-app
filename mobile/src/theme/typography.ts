import { TextStyle } from 'react-native';

export const typography = {
    sizes: {
        sm: 12,
        md: 14,
        lg: 16,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
    },
    lineHeights: {
        sm: 16,
        md: 20,
        lg: 24,
        xl: 28,
        '2xl': 32,
        '3xl': 38,
        '4xl': 44,
        '5xl': 56,
    },
    weights: {
        regular: 'Poppins_400Regular',
        medium: 'Poppins_500Medium',
        semibold: 'Poppins_600SemiBold',
        bold: 'Poppins_700Bold',
    } as const,
};

export const fontStyle = (size: keyof typeof typography.sizes): TextStyle => {
    return {
        fontSize: typography.sizes[size],
        lineHeight: typography.lineHeights[size],
        color: '#1B262C', // default text color
        fontFamily: 'Poppins_400Regular', // Default font
    };
};

export const textStyles = {
    buttonSmall: {
        fontSize: typography.sizes.sm,
        fontFamily: typography.weights.semibold,
        lineHeight: typography.lineHeights.sm,
    } as TextStyle,
    button: {
        fontSize: typography.sizes.md,
        fontFamily: typography.weights.semibold,
        lineHeight: typography.lineHeights.md,
    } as TextStyle,
    buttonLarge: {
        fontSize: typography.sizes.lg,
        fontFamily: typography.weights.bold,
        lineHeight: typography.lineHeights.lg,
    } as TextStyle,
};
