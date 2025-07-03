import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageUpload } from '../common';
import { postsApi } from '../../features/posts/api/posts.api';
import type { Post, CreatePostRequest, UpdatePostRequest } from '../../features/posts/types';

interface PostFormProps {
  mode: 'create' | 'edit';
  initialPost?: Post;
  onSuccess?: (post: Post) => void;
  onCancel?: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({
  mode,
  initialPost,
  onSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [imageUrl, setImageUrl] = useState(initialPost?.imageUrl || '');
  const [imagePublicId, setImagePublicId] = useState(initialPost?.imagePublicId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title);
      setContent(initialPost.content);
      setImageUrl(initialPost.imageUrl || '');
      setImagePublicId(initialPost.imagePublicId || '');
    }
  }, [initialPost]);

  const handleImageUploaded = (url: string, publicId: string) => {
    setImageUrl(url);
    setImagePublicId(publicId);
  };

  const handleImageRemoved = () => {
    setImageUrl('');
    setImagePublicId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let result: Post;

      if (mode === 'create') {
        const createData: CreatePostRequest = {
          title,
          content,
          imageUrl: imageUrl || undefined,
          imagePublicId: imagePublicId || undefined,
        };
        result = await postsApi.createPost(createData);
      } else {
        if (!initialPost?.id) {
          throw new Error('Post ID is required for update');
        }
        const updateData: UpdatePostRequest = {
          id: initialPost.id,
          title,
          content,
          imageUrl: imageUrl || undefined,
          imagePublicId: imagePublicId || undefined,
        };
        result = await postsApi.updatePost(initialPost.id, updateData);
      }

      // Call success callback or navigate
      if (onSuccess) {
        onSuccess(result);
      } else {
        navigate(`/blog/${result.id}`);
      }
    } catch (error) {
      console.error(`Failed to ${mode} post:`, error);
      setError(`Failed to ${mode} post. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  const handleReset = () => {
    if (mode === 'create') {
      setTitle('');
      setContent('');
      setImageUrl('');
      setImagePublicId('');
    } else {
      setTitle(initialPost?.title || '');
      setContent(initialPost?.content || '');
      setImageUrl(initialPost?.imageUrl || '');
      setImagePublicId(initialPost?.imagePublicId || '');
    }
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {mode === 'create' ? 'Create New Post' : 'Edit Post'}
        </h1>
        <button
          onClick={handleCancel}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-lg"
            placeholder="Enter an engaging title..."
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-y"
            placeholder="Write your post content here..."
            required
            disabled={isSubmitting}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Characters: {content.length}
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Featured Image (Optional)
          </label>
          <ImageUpload
            onImageUploaded={handleImageUploaded}
            onImageRemoved={handleImageRemoved}
            currentImageUrl={imageUrl}
            disabled={isSubmitting}
          />
        </div>

        {/* Current Image Info */}
        {imageUrl && (
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400">✅</span>
              <span>Image uploaded successfully!</span>
            </div>
            <p className="font-mono text-xs break-all mt-1 text-gray-500 dark:text-gray-400">
              {imageUrl}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </span>
            ) : (
              mode === 'create' ? 'Create Post' : 'Update Post'
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm; 