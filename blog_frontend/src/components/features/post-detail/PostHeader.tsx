import React from 'react';
import type { Post } from '../../../features/posts/types';
import { formatDate } from '../../../utils/dateUtils.js';

interface PostHeaderProps {
  post: Post;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  return (
    <header className="post-header mb-8">
      {post.featuredImage && (
        <div className="featured-image mb-6">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}
      
      <div className="post-meta mb-4">        
        <h1 className="post-title text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight font-serif">
          {post.title}
        </h1>
        
        <div className="post-meta flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <div className="author-info flex items-center gap-2">
            {post.author.avatar && (
              <img 
                src={post.author.avatar} 
                alt={`${post.author.firstName || post.author.username}'s avatar`}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="author-name font-medium">
              {post.author.firstName && post.author.lastName 
                ? `${post.author.firstName} ${post.author.lastName}`
                : post.author.username
              }
            </span>
          </div>
          
          <time className="publish-date" dateTime={post.createdAt}>
            {formatDate(post.createdAt)}
          </time>
        </div>
      </div>
    </header>
  );
}; 