import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { SEO } from '../../components/common';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateProfile } from '../../features/auth/store/authSlice';
import type { UpdateProfileRequest } from '../../features/auth/types';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState<UpdateProfileRequest>({
        name: '',
        email: ''
    });
    const [originalData, setOriginalData] = useState<UpdateProfileRequest>({
        name: '',
        email: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [formErrors, setFormErrors] = useState<Partial<UpdateProfileRequest>>({});

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, navigate]);

    // Initialize form data from user
    useEffect(() => {
        if (user) {
            const userData = {
                name: user.username || '',
                email: user.email || ''
            };
            setFormData(userData);
            setOriginalData(userData);
        }
    }, [user]);

    // Hide success message after 3 seconds
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    const validateForm = (): boolean => {
        const errors: Partial<UpdateProfileRequest> = {};

        if (!formData.name?.trim()) {
            errors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !user) return;

        // Check if anything changed
        const hasChanges = formData.name !== originalData.name || formData.email !== originalData.email;
        if (!hasChanges) {
            setShowSuccess(true);
            return;
        }

        try {
            await dispatch(updateProfile({
                userId: user.id,
                updates: formData
            })).unwrap();

            setOriginalData(formData);
            setShowSuccess(true);
        } catch {
            // Error is handled by the slice
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear specific field error when user starts typing
        if (formErrors[name as keyof UpdateProfileRequest]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const hasChanges = formData.name !== originalData.name || formData.email !== originalData.email;

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Layout>
            <SEO
                title="Profile Settings"
                description="Update your profile information including name and email address."
                keywords="profile, settings, account, update profile"
                url="/profile"
                type="website"
            />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Update your personal information
                        </p>
                    </div>

                    {/* Success Message */}
                    {showSuccess && (
                        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md p-4">
                            <div className="flex">
                                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="ml-3 text-sm text-green-800 dark:text-green-200">
                                    Profile updated successfully!
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md p-4">
                            <div className="flex">
                                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="ml-3 text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg border dark:border-gray-700">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name
                                </label>
                                                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors
                    ${formErrors.name 
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } 
                    text-gray-900 dark:text-white`}
                  disabled={loading}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors
                    ${formErrors.email 
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } 
                    text-gray-900 dark:text-white`}
                  disabled={loading}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !hasChanges}
                className={`w-full py-2 px-4 font-medium rounded-md transition-colors
                  ${loading || !hasChanges
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white'
                  }`}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
                        </form>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 text-sm font-medium"
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile; 