import React, { useState } from 'react';
import type { Comment } from '../../../features/comments/types';
import { formatDate } from '../../../utils/dateUtils';
import { useComments } from '../../../features/comments/hooks/useComments';

interface CommentCardProps {
  comment: Comment;
}

export const CommentCard: React.FC<CommentCardProps> = ({ 
  comment
}) => {
  const { removeComment } = useComments();
  const [showActions, setShowActions] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await removeComment(comment.id);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const authorName = comment.author?.username || 'Anonymous';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <div className="comment-card">
      <div className="comment-content bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="comment-header flex items-start justify-between mb-3">
          <div className="author-info flex items-center gap-3">
            {comment.author?.avatar ? (
              <img
                src={comment.author.avatar}
                alt={authorName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {authorInitial}
                </span>
              </div>
            )}
            
            <div className="author-details">
              <div className="author-name font-medium text-gray-900 dark:text-white">
                {authorName}
              </div>
              <div className="comment-meta flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <time dateTime={comment.createdAt}>
                  {formatDate(comment.createdAt)}
                </time>
                {comment.isEdited && (
                  <>
                    <span>•</span>
                    <span className="edited-indicator">edited</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="comment-actions relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="actions-trigger p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            {showActions && (
              <div className="actions-menu absolute right-0 top-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10">
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="comment-text text-gray-700 dark:text-gray-300 leading-relaxed">
          {comment.content}
        </div>
      </div>
    </div>
  );
}; 