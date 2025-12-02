/**
 * Border Radius Scale - Liora Design System
 */

export const radius = {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 999,
} as const;

// Common radius patterns
export const radiusPresets = {
    button: radius.lg,
    input: radius.md,
    card: radius.lg,
    badge: radius.full,
    avatar: radius.full,
    modal: radius.xl,
} as const;

export type RadiusKey = keyof typeof radius;
