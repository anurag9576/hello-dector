// ==============================
// Theme Types
// ==============================
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
  danger: string;
  warning: string;
  success: string;
};

// ==============================
// DOCTOR THEMES
// ==============================

// Doctor Light Theme (Professional, Trust)
export const doctorLightTheme: ThemePalette = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  hero: '#0D47A1',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  accent: '#1565C0',
  border: '#E2E8F0',
  softAccent: '#E3F2FD',
  deepAccent: '#0B5ED7',
  danger: '#DC2626',
  warning: '#F59E0B',
  success: '#16A34A',
};

// Doctor Dark Theme
export const doctorDarkTheme: ThemePalette = {
  ...doctorLightTheme,
  background: '#020617',
  card: '#0F172A',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  border: '#1E293B',
  softAccent: '#0B2447',
  deepAccent: '#3B82F6',
};

// Maintain backwards compatibility with existing imports
export const lightTheme = doctorLightTheme;
export const darkTheme = doctorDarkTheme;

// ==============================
// PATIENT THEMES
// ==============================

// Patient Light Theme (Friendly, Healing)
export const patientLightTheme: ThemePalette = {
  background: '#F9FBFD',
  card: '#FFFFFF',
  hero: '#16A34A',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#22C55E',
  border: '#E5E7EB',
  softAccent: '#ECFDF5',
  deepAccent: '#15803D',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#16A34A',
};

// Patient Dark Theme
export const patientDarkTheme: ThemePalette = {
  ...patientLightTheme,
  background: '#0B1F17',
  card: '#0F2A21',
  textPrimary: '#ECFDF5',
  textSecondary: '#A7F3D0',
  border: '#134E4A',
  softAccent: '#052E24',
  deepAccent: '#4ADE80',
};

// ==============================
// THEME SELECTOR
// ==============================
export type UserRole = 'doctor' | 'patient';
export type ThemeMode = 'light' | 'dark';

export const getTheme = (
  role: UserRole,
  mode: ThemeMode
): ThemePalette => {
  if (role === 'doctor') {
    return mode === 'dark' ? doctorDarkTheme : doctorLightTheme;
  }

  return mode === 'dark' ? patientDarkTheme : patientLightTheme;
};
