import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../../../features/posts/types';
import { formatDate } from '../../../utils/dateUtils.js';

interface PostHeaderProps {
  post: Post;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  return (
    <header className="post-header mb-8">
      {post.imageUrl && (
        <div className="featured-image mb-6">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}
      
      <div className="post-meta mb-4">        
        <div className="flex justify-between items-start mb-4">
          <h1 className="post-title text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight font-serif flex-1">
            {post.title}
          </h1>
          
          {/* Edit Button - TODO: Add authentication check to only show for post author */}
          <div className="ml-4 flex-shrink-0">
            <Link
              to={`/edit-post/${post.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Post
            </Link>
          </div>
        </div>
        
        <div className="post-meta flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
          
          
          <time className="publish-date" dateTime={post.createdAt}>
            {formatDate(post.createdAt)}
          </time>
        </div>
      </div>
    </header>
  );
}; 