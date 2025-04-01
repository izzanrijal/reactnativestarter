/**
 * @description 
 * Global theme configuration for the AhliAnak app.
 * Defines design tokens for consistent styling across the application.
 * 
 * Key features:
 * - Color palette with semantic naming
 * - Typography scale with predefined font sizes
 * - Spacing scale for consistent layout
 * - Border radius and shadow presets
 * 
 * @dependencies
 * None - Pure TypeScript configuration
 * 
 * @notes
 * - Colors follow accessibility guidelines for contrast
 * - Font sizes use a modular scale
 * - Spacing uses 4px as base unit
 */

export const colors = {
  // Primary colors
  primary: {
    main: '#2563EB',
    light: '#60A5FA',
    dark: '#1E40AF',
    contrast: '#FFFFFF',
  },
  // Secondary colors
  secondary: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    contrast: '#FFFFFF',
  },
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
  },
  // Semantic colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },
  // Text colors
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },
};

export const typography = {
  // Font families
  fontFamily: {
    primary: 'System',  // Will be replaced with actual font
    secondary: 'System-Bold',  // Will be replaced with actual font
  },
  // Font sizes (in pixels)
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  // Font weights - using valid React Native TextStyle values
  fontWeight: {
    normal: 'normal',
    bold: 'bold',
    '100': '100',
    '200': '200',
    '300': '300',
    '400': '400',
    '500': '500',
    '600': '600',
    '700': '700',
    '800': '800',
    '900': '900',
  } as const, // Make this a const to infer literal types
  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  // Base spacing unit: 4px
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export type Theme = typeof theme; 