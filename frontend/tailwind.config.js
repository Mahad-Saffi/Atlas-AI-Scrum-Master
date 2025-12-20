/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Dark theme backgrounds
                dark: {
                    900: '#0a0a0f',
                    800: '#111118',
                    700: '#1a1a24',
                    600: '#22222e',
                    500: '#2a2a38',
                },
                // Accent colors - Dark Red
                accent: {
                    primary: '#dc2626',
                    secondary: '#b91c1c',
                    tertiary: '#991b1b',
                    light: '#ef4444',
                },
                // Text colors
                text: {
                    primary: '#f1f5f9',
                    secondary: '#94a3b8',
                    muted: '#64748b',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-down': 'slideDown 0.4s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(220, 38, 38, 0.3)' },
                },
            },
        },
    },
    plugins: [],
}
