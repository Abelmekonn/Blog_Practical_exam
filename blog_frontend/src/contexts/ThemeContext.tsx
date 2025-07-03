import React, { useEffect, useState } from 'react';
import type { Theme } from './theme.types';
import { ThemeContext } from './theme.types';

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        // Check localStorage first, then system preference
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            return savedTheme;
        }

        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove any existing theme classes
        root.classList.remove('light', 'dark');

        // Add the appropriate theme class for Tailwind dark mode
        if (theme === 'dark') {
            root.classList.add('dark');
        }
        // For light theme, we don't add any class (Tailwind default is light)

        // Save to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        if (newTheme === 'system') {
            // Handle system preference
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            setThemeState(systemTheme);
            localStorage.setItem('theme', 'system');
        } else {
            setThemeState(newTheme);
        }
    };

    const toggleTheme = () => {
        setThemeState(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Listen for system theme changes if user has selected 'system'
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
                setThemeState(e.matches ? 'dark' : 'light');
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, []);

    const value = {
        theme,
        toggleTheme,
        setTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}; 