import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePosts } from '../features/posts/hooks/usePosts';
import { useComments } from '../features/comments/hooks/useComments';
import Layout from '../components/layout/Layout';
import { SEO } from '../components/common';
import { 
  PostHeader, 
  PostContent, 
  CommentSection 
} from '../components/features/post-detail';
import Loader from '../components/loader/Loader';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { currentPost, loading, error, loadPostById, clearPost } = usePosts();
  const { clearAllComments } = useComments();

  console.log(currentPost)

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    // Clear previous post and comments when component mounts
    clearPost();
    clearAllComments();
    
    // Fetch the post by ID
    loadPostById(id);

    // Cleanup when component unmounts
    return () => {
      clearPost();
      clearAllComments();
    };
  }, [id, navigate, loadPostById, clearPost, clearAllComments]);

  // Show loading state
  if (loading && !currentPost) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader />
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error && !currentPost) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Post Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'The post you are looking for does not exist.'}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Go Home
              </button>
              <button
                onClick={() => window.history.back()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show post not found if no current post
  if (!currentPost && !loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Post Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The post you are looking for does not exist.
            </p>
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {currentPost && (
        <SEO
          title={currentPost.title}
          description={
            currentPost.content 
              ? currentPost.content.length > 160 
                ? currentPost.content.substring(0, 160) + "..."
                : currentPost.content
              : "Read this blog post on our platform"
          }
          keywords={`blog, article, ${currentPost.title.split(' ').slice(0, 5).join(', ')}`}
          image={currentPost.imageUrl}
          url={`/blog/${currentPost.id}`}
          type="article"
          article={{
            author: "Blog Author",
            publishedTime: currentPost.createdAt,
            modifiedTime: currentPost.updatedAt,
            tags: currentPost.title.split(' ').slice(0, 3)
          }}
        />
      )}
      <div className="blog-detail-page">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb mb-6 mt-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Link 
                to="/" 
                className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                Home
              </Link>
              <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 dark:text-white">
                {currentPost?.title}
              </span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {currentPost && (
            <>
              {/* Post Header */}
              <PostHeader post={currentPost} />
              
              {/* Post Content */}
              <PostContent post={currentPost} />
              
              {/* Comments Section */}
              <CommentSection postId={currentPost.id} />
            </>
          )}
        </main>

        {/* Floating Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          title="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>

        {/* Loading overlay when updating */}
        {loading && currentPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-3">
              <Loader />
              <span className="text-gray-900 dark:text-white">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogDetail;