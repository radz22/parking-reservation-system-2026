'use client';
import { Shield } from 'lucide-react';
import { LoginForm } from '@/components/forms/login-form';
export const Login = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-8 shadow-md">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Portal Login</h2>
          <p className="text-sm text-gray-500">
            Secure access to the membership portal
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};
