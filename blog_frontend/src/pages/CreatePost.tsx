import React from 'react';
import Layout from '../components/layout/Layout';
import { PostForm } from '../components/forms/PostForm';

const CreatePost: React.FC = () => {
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