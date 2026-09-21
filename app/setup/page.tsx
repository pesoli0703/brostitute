'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Database, Key, CheckCircle, AlertTriangle, ArrowLeft, Copy, RefreshCw, Shield, ExternalLink } from 'lucide-react'
import { useToast } from '@/lib/context/ToastContext'

export default function SetupPage() {
  const { success, error } = useToast()
  const [url, setUrl] = useState('')
  const [key, setKey] = useState('')
  const [testing, setTesting] = useState(false)
  const [status, setStatus] = useState<{
    isConfigured: boolean
    supabaseUrl: string | null
    dbConnected: boolean
    dbError: string | null
  } | null>(null)
  const [copiedSchema, setCopiedSchema] = useState(false)

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/setup')
      const data = await res.json()
      setStatus(data)
    } catch {
      setStatus({ isConfigured: false, supabaseUrl: null, dbConnected: false, dbError: 'Failed to query server' })
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !key) {
      error('Missing credentials', 'Please enter both your Supabase URL and Anon Key')
      return
    }

    setTesting(true)
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseUrl: url, supabaseAnonKey: key })
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save credentials')
      }

      success('Connected to Supabase!', 'Credentials saved to .env.local.')
      await checkStatus()
    } catch (err: any) {
      error('Configuration Error', err.message)
    } finally {
      setTesting(false)
    }
  }

  const handleCopySql = () => {
    fetch('/lib/supabase/schema.sql')
      .then(res => res.text())
      .catch(() => {
        return `-- Full schema is stored at lib/supabase/schema.sql in the project root.`
      })
    navigator.clipboard.writeText('Please copy from lib/supabase/schema.sql in your workspace.')
    setCopiedSchema(true)
    success('Schema Path Copied', 'Check lib/supabase/schema.sql for the complete SQL schema')
    setTimeout(() => setCopiedSchema(false), 3000)
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-800 bg-stone-900/60 backdrop-blur-md px-6 py-4 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-300">Supabase Integrations</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Database className="w-8 h-8 text-rose-500" />
            Connect Your Supabase Project
          </h1>
          <p className="text-stone-400 mt-2 text-sm leading-relaxed">
            Brostitute uses Supabase for Postgres storage, Authentication, RLS security policies, and Realtime messaging.
          </p>
        </div>

        {/* Status Card */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Live Connection Status
            </h2>
            <button
              onClick={checkStatus}
              className="text-xs text-stone-400 hover:text-stone-200 inline-flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
              {status?.isConfigured ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-xs text-stone-400">Environment Variables</p>
                <p className="text-sm font-medium text-white truncate">
                  {status?.isConfigured ? 'Configured (.env.local)' : 'Using Local Preview Mode'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
              {status?.dbConnected ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-xs text-stone-400">Database Tables</p>
                <p className="text-sm font-medium text-white truncate">
                  {status?.dbConnected ? 'Tables Verified & Ready' : 'Awaiting Credentials / SQL'}
                </p>
              </div>
            </div>
          </div>

          {status?.dbError && (
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/50 text-xs text-amber-200">
              <span className="font-semibold">Notice:</span> {status.dbError}. Run the SQL schema below in your Supabase SQL Editor to initialize your tables!
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Enter Supabase Credentials</h2>
            <p className="text-xs text-stone-400 mt-1">
              Find these in your Supabase Dashboard under <strong>Project Settings → API</strong>.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Project URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 focus:border-rose-500 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Anon Public Key (anon public API key)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={key}
                  onChange={e => setKey(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 focus:border-rose-500 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 font-mono outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
            >
              Open Supabase Dashboard
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="submit"
              disabled={testing}
              className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-rose-900/30 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              {testing ? 'Saving & Testing...' : 'Save & Connect Supabase'}
            </button>
          </div>
        </form>

        {/* Database Schema Section */}
        <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Database Migration SQL</h2>
              <p className="text-xs text-stone-400 mt-1">
                Creates the 12 required tables, automatic match triggers, realtime publications, and RLS security policies.
              </p>
            </div>
            <button
              onClick={handleCopySql}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-xl inline-flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedSchema ? 'Copied!' : 'Copy Schema Info'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 font-mono text-xs text-stone-400 max-h-48 overflow-y-auto leading-relaxed">
            <code>
              {`-- Schema location: lib/supabase/schema.sql
-- Tables created:
-- 1. profiles (with triggers for auto new user & RLS)
-- 2. photos (order, primary flag, moderation)
-- 3. interests & profile_interests (20 pre-seeded interests)
-- 4. likes (unique constraints, auto-match on mutual like)
-- 5. matches (with last_message_at auto updates)
-- 6. messages (realtime enabled for private chat)
-- 7. reports (reason, reviewer, status)
-- 8. blocks (bidirectional query exclusion)
-- 9. verification_requests (selfie, prompt, review)
-- 10. subscription_plans & subscriptions (Gold, Platinum, Paystack/Flutterwave)
-- 11. notifications (realtime enabled for match/message alerts)
-- 12. admin_actions (audit logs)`}
            </code>
          </div>
        </div>
      </main>
    </div>
  )
}
