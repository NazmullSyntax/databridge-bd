"use client";

import Link from "next/link";
import { User, Mail, Lock, Building, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#061A35] flex items-center justify-center p-4 relative overflow-hidden py-12">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Register Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="h-2 w-full bg-linear-to-r from-cyan-400 to-blue-500" />
        
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-[#102A43]">
              DataBridge<span className="text-cyan-500">BD</span>
            </Link>
            <h1 className="text-xl font-semibold text-[#102A43] mt-4">Create an Account</h1>
            <p className="text-sm text-[#64748B] mt-1">Join us to start collecting reliable data.</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#102A43] mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" className="w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Your Name" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#102A43] mb-1.5">Company / Organization</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" className="w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Optional" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#102A43] mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" className="w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#102A43] mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input type="password" className="w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Min. 8 characters" />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#102A43] hover:bg-[#1a3c5c] text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4">
              Register Now <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#64748B]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-cyan-600 hover:text-cyan-700">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
