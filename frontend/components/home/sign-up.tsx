'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignup } from '@/hooks/auth/use-signup';
import { Loader2 } from 'lucide-react';

const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  contact: z.string().min(10, 'Contact number is too short'),
  plateNumber: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpValues = z.infer<typeof signUpSchema>;

export const SignUpPage = () => {
  const { mutate: signup, isPending } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    
  });

  const onSubmit = (data: SignUpValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = data;
    signup(registerData);
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
              alt="Premium Parking Illustration"
              fill
              className="object-cover opacity-50 mix-blend-overlay transition-transform duration-700 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
            
            <div className="absolute top-0 left-0 p-12 z-20">
               <h1 className="text-2xl font-bold text-white tracking-widest uppercase opacity-80">
                 Parking Hub
               </h1>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-12 z-10">
              <div className="space-y-4 max-w-md">
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-md">
                   Join the Hub
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                  Your journey <br className="hidden lg:block"/>starts here.
                </h2>
                <p className="text-lg text-gray-300 font-light max-w-sm">
                  Register now to experience parking management without the hassle.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form Section */}
          <div className="w-full h-full flex flex-col justify-center items-center p-6 sm:p-8 lg:p-12 xl:p-16 overflow-y-auto bg-white custom-scrollbar">
            <div className="w-full max-w-md py-8">
              <h3 className="block text-xl font-bold text-gray-900 mb-8 text-center md:hidden tracking-widest uppercase">
                Parking Hub
              </h3>
              
              <div className="mb-8 text-center md:text-left">
                <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Create an account</h3>
                <p className="text-gray-500 text-sm">
                  Join us to manage your parking slots easily.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
                  <Input
                    id="username"
                    {...register('username')}
                    placeholder="johndoe"
                    className={`h-11 bg-white/50 focus-visible:ring-gray-900/20 border-gray-200 transition-all rounded-xl ${errors.username ? 'border-red-500' : ''}`}
                  />
                  {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="name@example.com"
                      className={`h-11 bg-white/50 focus-visible:ring-gray-900/20 border-gray-200 transition-all rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact" className="text-gray-700 font-medium">Contact no.</Label>
                    <Input
                      id="contact"
                      type="tel"
                      {...register('contact')}
                      placeholder="+1 (555) 000-0000"
                      className={`h-11 bg-white/50 focus-visible:ring-gray-900/20 border-gray-200 transition-all rounded-xl ${errors.contact ? 'border-red-500' : ''}`}
                    />
                    {errors.contact && <p className="text-xs text-red-500">{errors.contact.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plateNumber" className="text-gray-700 font-medium">Plate no.</Label>
                    <Input
                      id="plateNumber"
                      {...register('plateNumber')}
                      placeholder="ABC 1234"
                      className="h-11 bg-white/50 focus-visible:ring-gray-900/20 border-gray-200 transition-all rounded-xl uppercase"
                    />
                  </div>
                 
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="••••••••"
                    className={`h-11 bg-white/50 focus-visible:ring-gray-900/20 border-gray-200 transition-all rounded-xl ${errors.password ? 'border-red-500' : ''}`}
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    placeholder="••••••••"
                    className={`h-11 bg-white/50 focus-visible:ring-gray-900/20 border-gray-200 transition-all rounded-xl ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-12 mt-4 bg-gray-900 hover:bg-black text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    'Create account'
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link
                    href="/sign-in"
                    className="font-semibold text-gray-900 hover:underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/terms&condition"
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  By registering, you agree to our Terms & Conditions
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
