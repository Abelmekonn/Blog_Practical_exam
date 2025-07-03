import React from 'react';
import { RegisterForm } from '../../components/features/auth';
import { SEO } from '../../components/common';

export const Register: React.FC = () => {
  return (
    <>
      <SEO
        title="Register"
        description="Create your account to start writing and sharing your thoughts. Join our growing community of writers and readers."
        keywords="register, sign up, create account, blog, join community"
        url="/register"
        type="website"
      />
      <RegisterForm />
    </>
  );
}; 