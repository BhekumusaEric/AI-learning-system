import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

// Font configuration
const fontConfig = {
  fontFamily: 'System',
  fontWeight: 'normal',
};

// Color palette
export const COLORS = {
  // Primary colors
  primary: '#1e40af', // Blue-800
  primaryLight: '#3b82f6', // Blue-500
  primaryDark: '#1e3a8a', // Blue-900

  // Secondary colors
  secondary: '#7c3aed', // Violet-600
  secondaryLight: '#a855f7', // Violet-500
  secondaryDark: '#581c87', // Violet-800

  // Accent colors
  accent: '#f59e0b', // Amber-500
  success: '#10b981', // Emerald-500
  error: '#ef4444', // Red-500
  warning: '#f59e0b', // Amber-500
  info: '#3b82f6', // Blue-500

  // Neutral colors
  background: '#ffffff',
  surface: '#f8fafc',
  surfaceVariant: '#f1f5f9',
  onSurface: '#1e293b',
  onSurfaceVariant: '#64748b',

  // Text colors
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textDisabled: '#94a3b8',

  // Border colors
  border: '#e2e8f0',
  borderLight: '#f1f5f9',

  // Learning ground colors
  groundFundamentals: '#3b82f6', // Blue
  groundVision: '#10b981', // Green
  groundNLP: '#f59e0b', // Amber
  groundProjects: '#ef4444', // Red

  // Status colors
  statusNotStarted: '#94a3b8',
  statusInProgress: '#f59e0b',
  statusCompleted: '#10b981',
} as const;

// Light theme
export const lightTheme = {
  ...MD3LightTheme,
  ...DefaultTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    primaryContainer: COLORS.primaryLight,
    secondary: COLORS.secondary,
    secondaryContainer: COLORS.secondaryLight,
    tertiary: COLORS.accent,
    error: COLORS.error,
    background: COLORS.background,
    surface: COLORS.surface,
    surfaceVariant: COLORS.surfaceVariant,
    onSurface: COLORS.onSurface,
    onSurfaceVariant: COLORS.onSurfaceVariant,
    outline: COLORS.border,
  },
  fonts: configureFonts({ config: fontConfig }),
};

// Dark theme
export const darkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    primary: COLORS.primaryLight,
    primaryContainer: COLORS.primary,
    secondary: COLORS.secondaryLight,
    secondaryContainer: COLORS.secondary,
    tertiary: COLORS.accent,
    error: COLORS.error,
    background: '#0f172a', // Slate-900
    surface: '#1e293b', // Slate-800
    surfaceVariant: '#334155', // Slate-700
    onSurface: '#f1f5f9', // Slate-100
    onSurfaceVariant: '#cbd5e1', // Slate-300
    outline: '#475569', // Slate-600
  },
  fonts: configureFonts({ config: fontConfig }),
};

// Get theme based on mode
export const getTheme = (mode: 'light' | 'dark' | 'system' = 'light') => {
  switch (mode) {
    case 'dark':
      return darkTheme;
    case 'system':
      // In a real app, you'd detect system preference
      return lightTheme;
    default:
      return lightTheme;
  }
};

// Default theme export
export const theme = lightTheme;

// Spacing system
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Border radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
} as const;

// Shadows
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

// Typography
export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
} as const;