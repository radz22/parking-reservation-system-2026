'use client'
import Image from "next/image";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-green-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Check your email</h2>
          <p className="text-gray-600 mt-2">
            Nag-send kami ng password reset link sa <strong>{email}</strong>.
          </p>
          <Link href="/login" className="inline-block mt-6 text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
        <div className="bg-body  min-h-screen flex items-center justify-center antialiased  container-1">

            <div className="max-w-3xl md:max-w-lg mx-auto">
              <div className=" bg-primary rounded-2xl pt-10 pb-10 px-5">           
                 <div className="flex items-center justify-center">
               <Image src={"/img/direction.png"} alt="email-proceed"
  width={170}    
  height={300}   
  className=""></Image>
                 </div>

                 <div className="text-center gap-2 flex flex-col">
                  <h1 className="text-2xl  text-text">Forgot your password?</h1>
                  <p className="text-sm text-text/70">Recover account by sending a reset link to email.</p>
                 </div>

<form onSubmit={handleSubmit} className="mt-8 md:px-15 space-y-4 ">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-5 w-full bg-text hover:bg-secondary  text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </button>

<div className="flex justify-center items-center flex-col">
<Link 
  href="/sign-in" 
  className="inline-flex  items-center gap-2 mt-3 hover:underline text-text/70 hover:text-text transition" 
>
  <ArrowLeft className="w-4 h-4 " /> 
  <span className="">Back to Sign-In</span>
</Link>

{/*tanggalin din tong button pag na accept mo yung UI, kasi sa email nila lalabas to :D */}
<Link 
  href="/set-password" 
  className="inline-flex  items-center gap-2 mt-3 text-text hover:underline"
>
  <ArrowLeft className="w-4 h-4 " /> 
  <span>Set Password <span className="text-text/70 text-sm">(Termporary, will removed later on)</span> </span>
</Link>
</div>
        </form>

                </div>
            </div>
        </div>
  );
};
