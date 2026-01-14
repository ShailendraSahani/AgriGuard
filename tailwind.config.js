/** @type {import('tailwindcss').Config} */
export const content = [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
    extend: {
        colors: {
            agriGreen: {
                light: '#D9F99D', // Soft light green
                DEFAULT: '#22C55E', // Main green
                dark: '#166534', // Deep green
            },
            agriYellow: {
                light: '#FEF9C3',
                DEFAULT: '#FACC15',
                dark: '#D97706',
            },
            agriBrown: {
                light: '#F5F5DC',
                DEFAULT: '#A0522D',
                dark: '#5C4033',
            },
            agriBlue: {
                light: '#E0F2FE',
                DEFAULT: '#3B82F6',
                dark: '#1E40AF',
            },
        },
        backgroundImage: {
            'hero-gradient': 'linear-gradient(to bottom right, #D9F99D, #FACC15)',
            'card-gradient': 'linear-gradient(to top right, #22C55E, #FACC15)',
        },
        keyframes: {
            pulseSlow: {
                '0%, 100%': { transform: 'scale(1)', opacity: 0.3 },
                '50%': { transform: 'scale(1.05)', opacity: 0.6 },
            },
            float: {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-10px)' },
            },
            fadeInUp: {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
            },
        },
        animation: {
            pulseSlow: 'pulseSlow 4s ease-in-out infinite',
            float: 'float 6s ease-in-out infinite',
            fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        },
        fontFamily: {
            sans: ['Poppins', 'sans-serif'],
            display: ['Montserrat', 'sans-serif'],
        },
        boxShadow: {
            agriCard: '0 10px 20px rgba(34, 197, 94, 0.2), 0 6px 6px rgba(250, 204, 21, 0.15)',
        },
        borderRadius: {
            xl2: '1.5rem',
        },
    },
};
export const plugins = [require('@tailwindcss/line-clamp')];
