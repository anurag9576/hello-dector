export type ThemePalette = {
  background: string;
  card: string;
  hero: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  border: string;
  softAccent: string;
  deepAccent: string;
};

export const lightTheme: ThemePalette = {
  background: '#F9FBFD',
  card: '#FFFFFF',
  hero: '#1E88E5',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#1E88E5',
  border: '#E5E7EB',
  softAccent: '#ECFDF5',
  deepAccent: '#5099d8ff',
};

export const darkTheme: ThemePalette = {
  ...lightTheme,
  background: '#0B1728',
  card: '#111F32',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5F5',
  border: '#1E2A3F',
  softAccent: '#12263A',
  deepAccent: '#93C5FD',
};
