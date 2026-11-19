"use client";

import Link from "next/link";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#061A35] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Top Bar Accent */}
        <div className="h-2 w-full bg-linear-to-r from-cyan-400 to-blue-500" />
        
        <div className="p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-[#102A43]">
              DataBridge<span className="text-cyan-500">BD</span>
            </Link>
            <div className="mb-6 mt-4 text-left">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] transition-colors hover:text-[#102A43]"
              >
                <ArrowLeft size={16} /> Back to Home
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-[#102A43] mt-4">Welcome Back</h1>
            <p className="text-sm text-[#64748B] mt-1">Enter your credentials to access your portal.</p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#102A43] mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  className="w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" 
                  placeholder="you@example.com" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-[#102A43]">Password</label>
                <Link href="#" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700">Forgot password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="password" 
                  className="w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#102A43] hover:bg-[#1a3c5c] text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#64748B]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-cyan-600 hover:text-cyan-700">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
