'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'
import { authService } from '@/lib/services/auth'
import { useToast } from '@/lib/context/ToastContext'

export default function ForgotPasswordPage() {
  const { success, error } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await authService.resetPassword(email)
      setSubmitted(true)
      success('Reset Link Sent', 'Check your email inbox for your password reset link.')
    } catch (err: any) {
      error('Reset Error', err.message || 'Failed to send reset link.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-950">
            <Sparkles className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">Brostitute</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Reset your password</h2>
        <p className="mt-1 text-xs text-stone-400">
          Enter your email address and we will send you a secure reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-stone-900/90 border border-stone-800 p-8 rounded-3xl shadow-xl space-y-4">
          {submitted ? (
            <div className="text-center space-y-3 py-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Check Your Email</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                We sent a password reset link to <strong className="text-white">{email}</strong>. Tap the link in your email to choose a new password.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-600 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white font-semibold rounded-xl text-xs transition-all shadow-lg shadow-rose-950/40 disabled:opacity-50"
              >
                {loading ? 'Sending Link...' : 'Send Password Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
