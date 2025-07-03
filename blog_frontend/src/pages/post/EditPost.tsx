import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { PostForm } from '../../components/forms/PostForm';
import ComponentLoading from '../../components/loader/ComponentLoading';
import { postsApi } from '../../features/posts/api/posts.api';
import { useAuth } from '../../features/auth/hooks/useAuth';
import type { Post } from '../../features/posts/types';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('Post ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedPost = await postsApi.getPostById(id);
        setPost(fetchedPost);
        
        // Check if user is authenticated and is the author
        if (!authLoading) {
          if (!isAuthenticated) {
            setAuthError('You must be logged in to edit posts.');
          } else if (!user) {
            setAuthError('Unable to verify user identity.');
          } else if (!fetchedPost.author) {
            setAuthError('Post author information is not available.');
          } else if (user.id !== fetchedPost.author.id) {
            setAuthError('You can only edit your own posts.');
          }
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
        setError('Failed to load post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchPost();
    }
  }, [id, user, isAuthenticated, authLoading]);

  const handleSuccess = (updatedPost: Post) => {
    navigate(`/blog/${updatedPost.id}`);
  };

  const handleCancel = () => {
    navigate(`/blog/${id}`);
  };

  // Show loading while checking authentication or fetching post
  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <ComponentLoading />
        </div>
      </Layout>
    );
  }

  // Show authentication error
  if (authError) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Access Denied
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {authError}
              </p>
              <div className="space-y-3">
                {!isAuthenticated ? (
                  <>
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
                  </>
                ) : (
                  <button
                    onClick={() => navigate(`/blog/${id}`)}
                    className="w-full bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    View Post
                  </button>
                )}
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

  // Show post loading error
  if (error || !post) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || 'Post not found'}
            </h1>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-8">
          <PostForm
            mode="edit"
            initialPost={post}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </Layout>
  );
};

export default EditPost; 