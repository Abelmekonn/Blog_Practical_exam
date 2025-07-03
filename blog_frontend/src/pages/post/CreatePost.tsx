import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { PostForm } from '../../components/forms/PostForm';
import { useAuth } from '../../features/auth/hooks/useAuth';
import ComponentLoading from '../../components/loader/ComponentLoading';

const CreatePost: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and not authenticated, don't auto-redirect
    // Show the login prompt instead for better UX
  }, [isAuthenticated, loading]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <ComponentLoading />
        </div>
      </Layout>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <svg className="w-16 h-16 text-black dark:text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Login Required
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You need to be logged in to create a new post. Please log in or create an account to continue.
              </p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors block"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="w-full bg-white hover:bg-gray-50 text-black border border-black px-6 py-3 rounded-lg transition-colors block dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-white"
                >
                  Create Account
                </Link>
                <button
                  onClick={() => navigate('/')}
                  className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Go Back Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-8">
          <PostForm mode="create" />
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost; 