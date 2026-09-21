'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, Lock, Mail } from 'lucide-react'
import { authService } from '@/lib/services/auth'
import { useAuth } from '@/lib/context/AuthContext'
import { useToast } from '@/lib/context/ToastContext'

export default function LoginPage() {
  const router = useRouter()
  const { refreshProfile } = useAuth()
  const { success, error } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await authService.signIn(email, password)
      await refreshProfile()
      success('Welcome back!', 'Signed in successfully.')
      router.push('/discover')
    } catch (err: any) {
      error('Sign in failed', err.message || 'Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  // Quick Demo Access button for frictionless preview
  const handleQuickDemo = async () => {
    setLoading(true)
    try {
      await authService.signIn('sophia@example.com', 'password123')
      await refreshProfile()
      success('Welcome to Brostitute!', 'Entered preview account as Sophia.')
      router.push('/discover')
    } catch (err: any) {
      error('Demo login error', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-950">
            <Sparkles className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">Brostitute</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Sign in to your account</h2>
        <p className="mt-2 text-xs text-stone-400">
          Discover meaningful connections with confidence.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-stone-900/90 border border-stone-800 p-8 rounded-3xl shadow-xl space-y-6">
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
                  className="w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-stone-600 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-stone-600 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-rose-950/40 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-stone-900 px-2 text-stone-500 font-medium">Or Preview Instantly</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="w-full py-3 bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 text-stone-200 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Continue as Guest Member
          </button>

          <p className="text-center text-xs text-stone-400">
            Don't have an account yet?{' '}
            <Link href="/onboarding" className="text-rose-400 hover:text-rose-300 font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
