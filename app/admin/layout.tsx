'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShieldAlert,
  Users,
  Flag,
  BarChart3,
  ArrowLeft,
  Sparkles,
  Database
} from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { profile } = useAuth()

  const navLinks = [
    { href: '/admin', label: 'Overview', icon: BarChart3 },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/reports', label: 'Reports Queue', icon: Flag }
  ]

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="border-b border-stone-800 bg-stone-900/90 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/discover" className="text-stone-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
              <div>
                <span className="font-extrabold text-sm text-white">Brostitute Admin</span>
                <span className="text-[10px] text-rose-400 font-mono ml-2">Internal Operations</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/setup"
              className="text-xs text-stone-400 hover:text-white inline-flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-rose-400" />
              Supabase Status
            </Link>
          </div>
        </div>

        {/* Tab links */}
        <div className="max-w-6xl mx-auto flex gap-4 mt-3 border-t border-stone-800 pt-2 text-xs">
          {navLinks.map(link => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </header>

      {/* Main admin view */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {children}
      </div>
    </div>
  )
}
