export const colors = {
  primary: '#7b2cbf',
  primaryLight: '#9d4edd',
  primaryDark: '#5a189a',
  secondary: '#ff9900',
  accent: '#06d6a0',

  background: '#f8f7fd',
  cardBackground: 'rgba(255, 255, 255, 0.95)',
  cardShadow: 'rgba(123, 44, 191, 0.1)',

  textDark: '#353535',
  textMedium: '#666666',
  textLight: '#8a8a8a',

  error: '#e63946',
  success: '#06d6a0',
  warning: '#ffb703',

  warm: '#ff9900',
  cold: '#00b4d8',
  neutral: '#adb5bd',
};

// Typography scale with properly typed fontWeight values
// React Native fontWeight must be one of:
// 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
export const typography = {
  header: {
    fontSize: 28,
    fontWeight: 'bold' as const,
  },
  subheader: {
    fontSize: 22,
    fontWeight: 'bold' as const,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  round: 999,
};

export const shadows = {
  small: {
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};
