import React from 'react';
import Layout from '../components/layout/Layout';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Welcome to our blog! We're passionate about sharing knowledge and insights 
              on various topics including technology, development, and creative thinking.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Our mission is to create a platform where ideas can be shared, discussed, 
              and explored by a community of like-minded individuals.
            </p>
            <p className="text-lg text-gray-600">
              Feel free to browse our posts, leave comments, and join the conversation!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About; 