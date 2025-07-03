import React, { useState, useEffect } from 'react';
import { useComments } from '../../../features/comments/hooks/useComments';
import { CommentCard } from './CommentCard';
import { CommentForm } from './CommentForm';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { 
    comments, 
    loading, 
    error, 
    loadCommentsByPostId, 
    addComment, 
    groupCommentsByParent 
  } = useComments();
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    loadCommentsByPostId(postId);
  }, [loadCommentsByPostId, postId]);

  const handleCommentSubmit = async (content: string) => {
    try {
      await addComment({ postId, content });
      setShowCommentForm(false);
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const groupedComments = groupCommentsByParent(comments);

  if (loading && comments.length === 0) {
    return (
      <section className="comments-section mt-12">
        <h2 className="section-title text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Comments
        </h2>
        <div className="loading-skeleton space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="comments-section mt-12">
      <div className="comments-header flex items-center justify-between mb-6">
        <h2 className="section-title text-2xl font-bold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h2>
        
        <button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="add-comment-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Comment
        </button>
      </div>

      {error && (
        <div className="error-message bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showCommentForm && (
        <div className="comment-form-container mb-8">
          <CommentForm
            onSubmit={handleCommentSubmit}
            onCancel={() => setShowCommentForm(false)}
            loading={loading}
          />
        </div>
      )}

      <div className="comments-list space-y-6">
        {groupedComments.length === 0 ? (
          <div className="no-comments text-center py-12">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No comments yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          groupedComments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              postId={postId}
            />
          ))
        )}
      </div>
    </section>
  );
}; 