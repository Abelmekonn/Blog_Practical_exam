import React from 'react';
import Layout from '../components/layout/Layout';

const Terms: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-500 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using this website, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
            <p className="text-gray-600 mb-4">
              When you create an account with us, you must provide information that is accurate, 
              complete, and current at all times.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Content</h2>
            <p className="text-gray-600 mb-4">
              You are responsible for the content you post to the website. You must not post 
              content that is illegal, harmful, or violates the rights of others.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Prohibited Uses</h2>
            <p className="text-gray-600 mb-4">
              You may not use our service for any unlawful purpose, to spam or harass others, 
              or to violate any applicable laws or regulations.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account and bar access to the service immediately, 
              without prior notice or liability, under our sole discretion.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. We will notify users of 
              any material changes to these terms.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms; 