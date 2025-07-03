import React from 'react';
import { LoginForm } from '../../components/features/auth';
import { SEO } from '../../components/common';

export const Login: React.FC = () => {
  return (
    <>
      <SEO
        title="Login"
        description="Login to your account to create and manage your blog posts. Join our community of writers and readers."
        keywords="login, sign in, account, blog, authentication"
        url="/login"
        type="website"
      />
      <LoginForm />
    </>
  );
}; 