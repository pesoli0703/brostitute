'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, Shield, Database, Crown, User, LogIn, UserPlus, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'

export function TopBar() {
  const { isConfigured, profile, user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-30 bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80 px-4 py-3">
      <div className="max-w-md md:max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-md shadow-rose-950 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent">
            Brostitute
          </span>
        </Link>

        {/* Action pills & Auth status */}
        <div className="flex items-center gap-2">
          {/* Supabase Status Pill */}
          <Link
            href="/setup"
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 transition-all ${
              isConfigured
                ? 'bg-emerald-950/50 border-emerald-800/70 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-amber-950/50 border-amber-800/70 text-amber-300 hover:bg-amber-900/40'
            }`}
          >
            <Database className="w-3 h-3" />
            <span className="hidden sm:inline">Supabase:</span>
            {isConfigured ? 'Live' : 'Connect'}
          </Link>

          {/* Premium button */}
          <Link
            href="/premium"
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 flex items-center gap-1.5 transition-all"
          >
            <Crown className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Premium</span>
          </Link>

          {/* Safety Center */}
          <Link
            href="/safety"
            className="p-1.5 rounded-full text-stone-400 hover:text-rose-400 hover:bg-stone-900 transition-colors"
            title="Safety Center"
          >
            <Shield className="w-4 h-4" />
          </Link>

          {/* Admin link if role is admin */}
          {profile?.role === 'admin' && (
            <Link
              href="/admin"
              className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-600 text-white hover:bg-rose-500 transition-colors"
            >
              Admin
            </Link>
          )}

          {/* Auth: Log in / Register OR Profile Avatar */}
          {user ? (
            <Link
              href="/profile"
              className="w-7 h-7 rounded-full overflow-hidden border border-rose-500/80 hover:scale-105 transition-transform"
              title="My Profile"
            >
              <img
                src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </Link>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="px-2.5 py-1 rounded-xl text-xs font-semibold text-stone-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-3 py-1 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-950 transition-all"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
