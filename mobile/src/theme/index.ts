/**
 * Liora Design System - Theme Tokens
 * Central export for all theme values
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './radius';
export * from './theme';

import { theme } from './theme';

// Backward compatibility (optional, or just use theme)
export const colors = theme.colors;
export const typography = theme.typography;
export const spacing = theme.spacing;
export const radii = theme.radii;

export type Theme = typeof theme;
