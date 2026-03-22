'use client'
import Image from "next/image";
import { KeyRound, LockKeyhole, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react"; // Nag-import tayo ng Eye icons
import Link from "next/link";
import { useState } from "react";

export const SetPassword = () => {
  // Separate states para sa dalawang password fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Bagong state para i-track kung "nakatago" o "nakikita" ang password
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simpleng validation check
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    
    // Simulation ng API call para sa backend niyo
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  // 1. Success State UI (Pagka-submit)
  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-body p-4">
        <div className="w-full max-w-md text-center bg-primary p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-green-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-text jakarta-font">Password Updated!</h2>
          <p className="text-text/70 mt-2 text-sm">
            You can now log in to your account using your new credentials.
          </p>
          <Link href="/sign-in" className="inline-block mt-6 w-full bg-text text-white font-semibold py-3 rounded-xl hover:bg-secondary transition-colors shadow-lg active:scale-95">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // 2. Main Form UI (Reset Password Flow)
  return (
    <div className="bg-body min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl md:max-w-2xl w-full mx-auto">
        <div className="bg-primary rounded-2xl pt-10 pb-10 px-5 shadow-xl border border-gray-100">
          
          {/* Mailbox Image Section */}
          <div className="flex items-center justify-center mb-6">
            <Image 
              src="/img/mailbox-icon.png" 
              alt="set-password image"
              width={150}    
              height={300}   
              priority
            />
          </div>

          {/* Text/Subtitle Section */}
          <div className="text-center gap-2 flex flex-col">
            <h1 className="text-2xl font-bold text-text jakarta-font">Reset Password</h1>
            <p className="text-sm text-text/70 max-w-sm mx-auto">Create a new strong password to secure your personal account.</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5 max-w-md mx-auto">
            
            {/* New Password Field (with View/Hide Logic) */}
            <div>
              <label className="block text-sm font-medium text-text/80 mb-1">New Password:</label>
              <div className="relative mt-1">
                {/* Icon key in left side */}
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                
                <input
                  // Ang magic ay nandito sa type: nag-se-switch siya depende sa showPassword state
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 shadow-inner"
                />

                {/* Ang "Mata" Button ay nasa kanang side ng input */}
                <button
                  type="button" // Siguraduhing 'button' type ito, hindi 'submit'
                  onClick={() => setShowPassword(!showPassword)} // Toggles the state
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {/* Dynamic icon selection */}
                  {showPassword ? (
                    <Eye className="w-5 h-5" /> // Ouch, open eye means text is visible!
                  ) : (
                    <EyeOff className="w-5 h-5" /> // Pikit na mata, safe na tago yung text
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (no view logic) */}
            <div>
              <label className="block text-sm font-medium text-text/80 mb-1">Confirm Password:</label>
              <div className="relative mt-1">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password" // Laging password format ito
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 shadow-inner"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full bg-text hover:bg-secondary text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-70 disabled:active:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Update Password"
              )}
            </button>

            {/* Back to Email link */}
            <div className="flex justify-center">
              <Link 
                href="/forgot-password" 
                className="inline-flex items-center gap-2 mt-4 text-text/60 hover:text-text hover:underline text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> 
                <span>Back to Email</span>
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}