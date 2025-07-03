import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    
    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex items-center w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            role="switch"
            aria-checked={theme === 'dark'}
        >
            {/* Switch Track */}
            <span className="sr-only">Toggle theme</span>
            
            {/* Switch Thumb */}
            <span
                className={`${
                    theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                } w-6 h-6 transform bg-white dark:bg-gray-100 rounded-full shadow-lg transition-transform duration-300 ease-in-out flex items-center justify-center`}
            >
                {/* Icon inside the thumb */}
                {theme === 'light' ? (
                    <FaSun className="w-3 h-3 text-yellow-500" />
                ) : (
                    <FaMoon className="w-3 h-3 text-blue-600" />
                )}
            </span>
        </button>
    );
};

export default ThemeToggle; 