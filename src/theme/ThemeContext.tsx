import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemePalette, lightTheme, darkTheme, ThemeMode } from './palette';

type ThemeContextType = {
  theme: ThemePalette;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  setTheme: (theme: ThemePalette) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

type ThemeProviderProps = {
  children: ReactNode;
  initialTheme?: ThemePalette;
  initialMode?: ThemeMode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = lightTheme,
  initialMode = 'light'
}) => {
  const [theme, setTheme] = useState<ThemePalette>(initialTheme);
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const updateTheme = (newMode: ThemeMode | string) => {
    setMode(newMode as ThemeMode);
    const newTheme = (newMode as ThemeMode) === 'dark' ? darkTheme : lightTheme;
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    mode,
    setMode: updateTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;