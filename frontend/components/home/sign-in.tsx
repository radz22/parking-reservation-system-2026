'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const SignInPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signing in:', credentials);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col antialiased">
      <main className="grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl min-h-[600px] md:h-[85vh] bg-white shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 ring-1 ring-gray-900/5">
          {/* Left: Image Section */}
          <div className="hidden md:flex relative w-full h-full bg-black/95 items-center justify-center overflow-hidden">
             {/* Decorative blur elements for modern premium feel */}
             <div className="absolute top-0 -left-1/4 w-full h-1/2 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
             <div className="absolute bottom-0 -right-1/4 w-full h-1/2 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
             
            <Image
              src="/img/login/signIn.png"
              alt="Premium Parking"
              fill
              className="object-cover opacity-50 mix-blend-overlay transition-transform duration-700 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-12 z-10">
              <div className="space-y-4 max-w-md">
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-md">
                  ✨ Seamless Experience
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                  Parking made <br className="hidden lg:block"/>brilliant.
                </h2>
                <p className="text-lg text-gray-300 font-light max-w-sm">
                  Experience the smartest way to reserve and manage your parking spaces worldwide.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form Section */}
          <div className="w-full h-full flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 xl:p-24 overflow-y-auto bg-white">
            <div className="w-full max-w-sm">
              <div className="mb-10 text-center md:text-left">
                <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Welcome back</h3>
                <p className="text-gray-500 text-sm">
                  Enter your credentials to access your account.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSignIn}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={credentials.email}
                    onChange={handleChange}
                    className="h-12 bg-white/50 focus-visible:ring-gray-900/20 border-gray-200 transition-all rounded-xl"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={handleChange}
                    className="h-12 bg-white/50 focus-visible:ring-gray-900/20 border-gray-200 transition-all rounded-xl"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 mt-6 bg-gray-900 hover:bg-black text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all active:scale-[0.98] mt-8"
                >
                  Sign in
                </Button>
              </form>
              
 <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="mt-10 md:mt-7 space-y-4">
                <p className="text-xs text-gray-500">
                 {" Don't have an account?"}
                  <Link
                    href="/sign-up"
                    className="font-semibold text-gray-900 hover:underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

             <div className=" mt-5 md:mt-7  space-y-4">
                <p className="text-xs text-gray-500 ">
                 {" Forgot Password? "}
                  <Link
                    href="/forgot-password"
                    className="font-semibold text-gray-900 hover:underline underline-offset-4"
                  >
                    Click Here!
                  </Link>
                </p>
              </div>
</div>

              <div className="mt-7 text-center">
                <Link
                  href="/terms&condition"
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  By signing in, you agree to our Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
