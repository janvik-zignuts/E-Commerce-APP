'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginForm from './loginForm';
import SocialLogin from './socialLogin';


const LoginInteractive=() =>{
  const [isLoading, setIsLoading] = useState(false);
  console.log("🚀 ~ LoginInteractive ~ isLoading:", isLoading)

  const handleLoginSuccess = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-lg mx-auto mb-4">
       
          </div>
          <h1 className="text-3xl font-bold text-text-primary font-heading mb-2">
            Welcome Back
          </h1>
          <p className="text-text-secondary">
            Sign in to access your account and continue shopping
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-elevation-md p-4 sm:p-6 mt-3">
          <LoginForm onSuccess={handleLoginSuccess} />

          <div className="mt-6">
            <SocialLogin />
          </div>


          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Don&apos;t have an account?{' '}
              <Link
                href="/routes/auth/register"
                className="text-accent font-medium hover:opacity-80 transition-smooth"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
        
        </div>
      </div>
    </div>
  );
}

export default LoginInteractive;