import React, { useState } from 'react';
import type { Comment } from '../../../features/comments/types';
import { formatDate } from '../../../utils/dateUtils';
import { CommentForm } from './CommentForm';
import { useComments } from '../../../features/comments/hooks/useComments';

interface CommentCardProps {
  comment: Comment & { replies?: Comment[] };
  postId: string;
  isReply?: boolean;
}

export const CommentCard: React.FC<CommentCardProps> = ({ 
  comment, 
  postId, 
  isReply = false 
}) => {
  const { addComment, removeComment } = useComments();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleReplySubmit = async (content: string) => {
    try {
      await addComment({ 
        postId, 
        content, 
        parentId: comment.id 
      });
      setShowReplyForm(false);
    } catch (error) {
      console.error('Failed to create reply:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await removeComment(comment.id);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  return (
    <div className={`comment-card ${isReply ? 'ml-8 mt-4' : ''}`}>
      <div className="comment-content bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="comment-header flex items-start justify-between mb-3">
          <div className="author-info flex items-center gap-3">
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.username}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {comment.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <div className="author-details">
              <div className="author-name font-medium text-gray-900 dark:text-white">
                {comment.author.firstName && comment.author.lastName
                  ? `${comment.author.firstName} ${comment.author.lastName}`
                  : comment.author.username}
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
        
        <div className="comment-text text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
          {comment.content}
        </div>
        
        <div className="comment-actions mt-3 flex items-center gap-4">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="reply-btn text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Reply
          </button>
        </div>
      </div>
      
      {showReplyForm && (
        <div className="reply-form mt-4 ml-4">
          <CommentForm
            onSubmit={handleReplySubmit}
            onCancel={() => setShowReplyForm(false)}
            placeholder="Write a reply..."
            isReply
          />
        </div>
      )}
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies mt-4">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              postId={postId}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}; 