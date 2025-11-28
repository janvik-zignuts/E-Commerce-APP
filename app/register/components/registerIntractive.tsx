'use client';

import { useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import RegistrationForm from './registerForm';
import SocialLoginOptions from './SocialLoginOptions';

interface RegistrationInteractiveProps {
    initialData: {
      title: string;
      subtitle: string;
    };
  }

export default function RegistrationInteractive({ initialData }:RegistrationInteractiveProps) {


  return (
    <div className="min-h-screen bg-background ">
      <div className="max-w-md mx-auto">
        <div className="text-center ">
          <div className="flex items-center justify-center w-16 h-16 bg-accent rounded-full mx-auto mb-4">
     
          </div>
          <h1 className="text-3xl font-bold text-text-primary font-heading mb-2">
            {initialData?.title}
          </h1>
          <p className="text-text-secondary">{initialData?.subtitle}</p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-elevation-md p-4 sm:p-6 mt-3">
          <RegistrationForm />

          <SocialLoginOptions isLoading={false} />

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-accent font-medium hover:underline transition-smooth"
              >
                Sign in here
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

