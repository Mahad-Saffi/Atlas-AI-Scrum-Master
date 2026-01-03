/**
 * Ideal Assistant - Design System & Theme Configuration
 *
 * This file contains all the styling constants and design tokens
 * used throughout the application for consistency.
 */

export const theme = {
  // ==================== COLORS ====================
  colors: {
    // Background Colors
    background: {
      primary: "#0a0a0f", // Main dark background
      secondary: "rgba(17, 17, 24, 0.7)", // Glass morphism background
      tertiary: "rgba(10, 10, 15, 0.5)", // Darker glass background
      card: "rgba(17, 17, 24, 0.95)", // Card background
      hover: "rgba(255, 255, 255, 0.05)", // Hover state
      hoverStrong: "rgba(255, 255, 255, 0.08)", // Strong hover
    },

    // Text Colors
    text: {
      primary: "#f1f5f9", // Main text color
      secondary: "#94a3b8", // Secondary text
      tertiary: "#64748b", // Tertiary text
      muted: "#475569", // Muted text
      white: "#ffffff", // Pure white
    },

    // Brand Colors
    brand: {
      red: "#dc2626", // Primary red accent
      redDark: "#991b1b", // Dark red
      redLight: "#ef4444", // Light red
      redGradient: "linear-gradient(135deg, #dc2626, #991b1b)", // Red gradient
    },

    // Status Colors
    status: {
      success: "#22c55e", // Success/Done
      successDark: "#15803d", // Dark success
      warning: "#f59e0b", // Warning/In Progress
      warningDark: "#d97706", // Dark warning
      error: "#ef4444", // Error/High risk
      info: "#3b82f6", // Info/Medium
      neutral: "#64748b", // Neutral/Low
    },

    // Border Colors
    border: {
      default: "rgba(255, 255, 255, 0.08)",
      light: "rgba(255, 255, 255, 0.1)",
      medium: "rgba(255, 255, 255, 0.12)",
      red: "rgba(220, 38, 38, 0.3)",
      redLight: "rgba(220, 38, 38, 0.4)",
    },

    // Overlay Colors
    overlay: {
      light: "rgba(10, 10, 15, 0.8)",
      dark: "rgba(24, 28, 20, 0.7)",
    },
  },

  // ==================== SPACING ====================
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "2rem", // 32px
    "4xl": "3rem", // 48px
    "5xl": "4rem", // 64px
  },

  // ==================== TYPOGRAPHY ====================
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },

    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "0.9375rem", // 15px
      md: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.75rem", // 28px
      "4xl": "2.25rem", // 36px
    },

    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeight: {
      tight: 1,
      normal: 1.5,
      relaxed: 1.6,
    },

    letterSpacing: {
      tight: "-0.02em",
      normal: "-0.01em",
      wide: "0.01em",
      wider: "0.02em",
    },
  },

  // ==================== BORDER RADIUS ====================
  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    full: "50%",
  },

  // ==================== SHADOWS ====================
  shadows: {
    sm: "0 2px 8px rgba(0, 0, 0, 0.2)",
    md: "0 4px 16px rgba(0, 0, 0, 0.3)",
    lg: "0 8px 32px rgba(0, 0, 0, 0.4)",
    xl: "0 12px 40px rgba(0, 0, 0, 0.5)",
    red: "0 4px 16px rgba(220, 38, 38, 0.4)",
    redHover: "0 6px 20px rgba(220, 38, 38, 0.5)",
    green: "0 12px 36px rgba(34, 197, 94, 0.35)",
  },

  // ==================== EFFECTS ====================
  effects: {
    backdropBlur: {
      sm: "blur(10px)",
      md: "blur(16px)",
      lg: "blur(20px)",
    },

    transition: {
      fast: "all 0.15s ease",
      normal: "all 0.2s ease",
      slow: "all 0.3s ease",
    },

    gridPattern: `
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
    `,
    gridSize: "50px 50px",
  },

  // ==================== COMPONENT STYLES ====================
  components: {
    // Button Styles
    button: {
      primary: {
        background: "linear-gradient(135deg, #dc2626, #991b1b)",
        color: "#ffffff",
        padding: "0.75rem 1.5rem",
        borderRadius: "12px",
        fontSize: "0.9375rem",
        fontWeight: 600,
        boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
        border: "none",
      },
      secondary: {
        background: "rgba(255, 255, 255, 0.05)",
        color: "#f1f5f9",
        padding: "0.75rem 1.25rem",
        borderRadius: "12px",
        fontSize: "0.9375rem",
        fontWeight: 600,
        border: "1px solid rgba(255, 255, 255, 0.1)",
      },
      back: {
        background: "rgba(220, 38, 38, 0.15)",
        color: "#dc2626",
        padding: "0.75rem 1.25rem",
        borderRadius: "12px",
        fontSize: "0.9375rem",
        fontWeight: 600,
        border: "1px solid rgba(220, 38, 38, 0.3)",
      },
    },

    // Card Styles
    card: {
      default: {
        background: "rgba(17, 17, 24, 0.7)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "20px",
        padding: "2rem",
      },
      glass: {
        background: "rgba(17, 17, 24, 0.95)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
    },

    // Header Styles
    header: {
      background: "rgba(17, 17, 24, 0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      padding: "1.25rem 2rem",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },

    // Input Styles
    input: {
      background: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "12px",
      color: "#f1f5f9",
      padding: "0.875rem 1rem",
      fontSize: "0.9375rem",
    },

    // Select Styles
    select: {
      background: "rgba(17, 17, 24, 0.95)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "12px",
      color: "#f1f5f9",
      padding: "0.75rem 1.25rem",
      fontSize: "0.9375rem",
      fontWeight: 500,
    },
  },

  // ==================== RISK LEVELS ====================
  riskLevels: {
    high: {
      color: "#ef4444",
      background: "rgba(239, 68, 68, 0.12)",
      border: "rgba(239, 68, 68, 0.3)",
    },
    medium: {
      color: "#f59e0b",
      background: "rgba(245, 158, 11, 0.12)",
      border: "rgba(245, 158, 11, 0.3)",
    },
    low: {
      color: "#22c55e",
      background: "rgba(34, 197, 94, 0.12)",
      border: "rgba(34, 197, 94, 0.3)",
    },
  },

  // ==================== STATUS STYLES ====================
  taskStatus: {
    "To Do": {
      color: "#64748b",
      background: "rgba(100, 116, 139, 0.15)",
      border: "rgba(100, 116, 139, 0.3)",
    },
    "In Progress": {
      color: "#f59e0b",
      background: "rgba(245, 158, 11, 0.15)",
      border: "rgba(245, 158, 11, 0.3)",
    },
    Done: {
      color: "#22c55e",
      background: "rgba(34, 197, 94, 0.15)",
      border: "rgba(34, 197, 94, 0.3)",
    },
  },

  // ==================== BREAKPOINTS ====================
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1400px",
  },

  // ==================== Z-INDEX ====================
  zIndex: {
    background: 0,
    content: 1,
    dropdown: 10,
    sticky: 100,
    modal: 1000,
    tooltip: 2000,
  },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get status color based on task status
 */
export const getStatusColor = (status: string) => {
  return (
    theme.taskStatus[status as keyof typeof theme.taskStatus] ||
    theme.taskStatus["To Do"]
  );
};

/**
 * Get risk color based on risk level
 */
export const getRiskColor = (level: string) => {
  const colors = {
    high: theme.riskLevels.high.color,
    medium: theme.riskLevels.medium.color,
    low: theme.riskLevels.low.color,
  };
  return colors[level as keyof typeof colors] || theme.colors.text.secondary;
};

/**
 * Create a glass morphism style object
 */
export const glassStyle = (opacity = 0.7) => ({
  background: `rgba(17, 17, 24, ${opacity})`,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
});

/**
 * Create a grid pattern background
 */
export const gridBackground = () => ({
  position: "fixed" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: theme.effects.gridPattern,
  backgroundSize: theme.effects.gridSize,
  pointerEvents: "none" as const,
  zIndex: 0,
});

export default theme;
