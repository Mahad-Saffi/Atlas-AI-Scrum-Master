import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, colors, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        padding: '12px',
        border: `2px solid ${colors.border}`,
        backgroundColor: colors.surface,
        color: colors.text,
        fontSize: '20px',
        cursor: 'pointer',
        boxShadow: `3px 3px 0 ${colors.shadow}`,
        fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translate(1px, 1px)';
        e.currentTarget.style.boxShadow = `2px 2px 0 ${colors.shadow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate(0, 0)';
        e.currentTarget.style.boxShadow = `3px 3px 0 ${colors.shadow}`;
      }}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
