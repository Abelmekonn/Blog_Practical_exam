import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../features/auth/hooks/useAuth';

const Header: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setIsProfileMenuOpen(false);
        } catch (error) {   
            console.error('Logout failed:', error);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link 
                            to="/" 
                            className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors duration-200"
                            onClick={closeMobileMenu}
                        >
                            Blog App
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                        >
                            Home
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to="/create-post"
                                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                            >
                                Create Post
                            </Link>
                        )}
                        <Link
                            to="/about"
                            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-4">
                        
                        <ThemeToggle />

                        {/* Authentication Section */}
                        {isAuthenticated ? (
                            /* User Profile Dropdown */
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                                >
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-sm font-medium">
                                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <span className="hidden sm:block text-sm font-medium">
                                        {user?.username}
                                    </span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Profile Dropdown Menu */}
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {user?.username}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {user?.email}
                                            </p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            Profile Settings
                                        </Link>
                                        <Link
                                            to="/my-posts"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            My Posts
                                        </Link>
                                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Auth Buttons for non-authenticated users */
                            <div className="hidden sm:flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 text-sm font-medium text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button 
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link
                                to="/"
                                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                                onClick={closeMobileMenu}
                            >
                                Home
                            </Link>
                            {isAuthenticated && (
                                <Link
                                    to="/create-post"
                                    className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    Create Post
                                </Link>
                            )}
                            <Link
                                to="/about"
                                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                                onClick={closeMobileMenu}
                            >
                                About
                            </Link>
                            <Link
                                to="/contact"
                                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                                onClick={closeMobileMenu}
                            >
                                Contact
                            </Link>
                            
                            {/* Mobile Auth Section */}
                            {isAuthenticated ? (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                    <div className="px-3 py-2">
                                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                            {user?.username}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                                        onClick={closeMobileMenu}
                                    >
                                        Profile Settings
                                    </Link>
                                    <Link
                                        to="/my-posts"
                                        className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                                        onClick={closeMobileMenu}
                                    >
                                        My Posts
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
                                    <Link
                                        to="/login"
                                        className="block px-3 py-2 text-base font-medium text-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                                        onClick={closeMobileMenu}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-3 py-2 text-base font-medium text-center text-white bg-black hover:bg-gray-800 rounded-md transition-colors mx-3"
                                        onClick={closeMobileMenu}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header; 