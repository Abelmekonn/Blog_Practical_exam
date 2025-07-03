import React, { useState } from 'react';
import { ImageUpload } from '../common';

// Example component showing how to use ImageUpload in a form
const PostFormExample: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePublicId, setImagePublicId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUploaded = (url: string, publicId: string) => {
    setImageUrl(url);
    setImagePublicId(publicId);
    console.log('Image uploaded:', { url, publicId });
  };

  const handleImageRemoved = () => {
    setImageUrl('');
    setImagePublicId('');
    console.log('Image removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Example API call to create post
      const postData = {
        title,
        content,
        imageUrl,
        imagePublicId,
      };

      console.log('Creating post with data:', postData);
      
      // Here you would call your posts API
      // await createPost(postData);
      
      // Reset form on success
      setTitle('');
      setContent('');
      setImageUrl('');
      setImagePublicId('');
      
      alert('Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter post title..."
            required
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Write your post content..."
            required
          />
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
            ✅ Image uploaded successfully!
            <br />
            <span className="font-mono text-xs break-all">{imageUrl}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setTitle('');
              setContent('');
              setImageUrl('');
              setImagePublicId('');
            }}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">Form State (Debug):</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify({ title, content, imageUrl, imagePublicId }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default PostFormExample; 