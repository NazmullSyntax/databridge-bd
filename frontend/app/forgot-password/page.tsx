"use client"

import Link from "next/link"
import { Mail, ArrowRight, ArrowLeft } from "lucide-react"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // ব্যাকএন্ড কানেক্ট হলে এখানে API কল হবে
    setTimeout(() => {
      setSuccess("✅ Password reset link sent to your email!")
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#061A35] p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="h-2 w-full bg-linear-to-r from-cyan-400 to-blue-500" />
        <div className="p-8 md:p-10">
          <div className="mb-8 text-center">
            <Link href="/" className="text-2xl font-bold text-[#102A43]">
              DataBridge<span className="text-cyan-500">BD</span>
            </Link>
            <h1 className="mt-4 text-xl font-semibold text-[#102A43]">
              Reset Your Password
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Enter your email and we&apos;ll send you a link.
            </p>
          </div>

          {success && (
            <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-600">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#102A43]">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full rounded-lg border border-[#E2E8F0] py-2.5 pr-3 pl-10 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#102A43] py-3 font-semibold text-white transition-all hover:bg-[#1a3c5c] disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}{" "}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="flex items-center justify-center gap-1 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
            >
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
