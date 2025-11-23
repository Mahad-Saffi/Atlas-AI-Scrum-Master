import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
  accent: string;
}

const themes: Record<Theme, ThemeColors> = {
  light: {
    background: '#fefefe',
    surface: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#4a4a4a',
    border: '#1a1a1a',
    shadow: '#1a1a1a',
    accent: '#2563eb',
  },
  dark: {
    background: '#0d1117',
    surface: '#161b22',
    text: '#f0f6fc',
    textSecondary: '#8b949e',
    border: '#30363d',
    shadow: '#000000',
    accent: '#58a6ff',
  },
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('atlas-theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('atlas-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    colors: themes[theme],
    toggleTheme,
    isDark: theme === 'dark',
  };
};
