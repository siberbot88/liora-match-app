/**
 * Spacing Scale - Liora Design System
 * Based on 4px grid system
 */

export const spacing = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
    '7xl': 80,
    '8xl': 96,
} as const;

// Common spacing patterns
export const spacing2 = {
    ...spacing,
    // Component-specific spacing
    buttonPaddingVertical: spacing.md,
    buttonPaddingHorizontal: spacing.xl,
    inputPaddingVertical: spacing.md,
    inputPaddingHorizontal: spacing.lg,
    cardPadding: spacing.lg,
    screenPadding: spacing.lg,
    sectionGap: spacing['2xl'],
    itemGap: spacing.md,
} as const;

export type SpacingKey = keyof typeof spacing;
