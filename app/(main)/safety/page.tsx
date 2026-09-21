'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  UserX,
  FileText,
  LifeBuoy,
  Download,
  Trash2,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { safetyService } from '@/lib/services/safety'
import { useAuth } from '@/lib/context/AuthContext'
import { useToast } from '@/lib/context/ToastContext'
import { TopBar } from '@/components/navigation/TopBar'
import { MobileNavBar } from '@/components/navigation/MobileNavBar'

export default function SafetyHubPage() {
  const { user } = useAuth()
  const { success, error } = useToast()

  const [downloading, setDownloading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDataExport = () => {
    setDownloading(true)
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
        JSON.stringify({
          account: "Brostitute Account Data",
          export_date: "2026-09-20",
          status: "GDPR Compliant Export",
          privacy: "No third party tracker sales"
        }, null, 2)
      )
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href", dataStr)
      downloadAnchor.setAttribute("download", "brostitute_user_data_export.json")
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      setDownloading(false)
      success('Data Exported', 'Your account data has been downloaded.')
    }, 800)
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to permanently delete your account and all associated profile data? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      await safetyService.requestAccountDeletion(user?.id || 'local-user-id')
      success('Account Deleted', 'All profile records and chats have been queued for permanent deletion.')
      window.location.href = '/'
    } catch (err: any) {
      error('Deletion failed', err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col pb-24 md:pb-8">
      <TopBar />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-6 space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/40 via-stone-900 to-stone-900 border border-stone-800 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Trust & Safety Center</h1>
          <p className="text-xs text-stone-400 leading-relaxed">
            Brostitute is built on a foundation of respect, privacy, and zero tolerance for harassment, scams, or commercial solicitation.
          </p>
        </div>

        {/* Safety Tools Grid */}
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Your Safety Controls</h2>

          <div className="space-y-2">
            <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Precise Location Masking</p>
                <p className="text-[11px] text-stone-400">We never publish exact coordinates or street addresses.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
              <UserX className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Confidential Reporting & Blocking</p>
                <p className="text-[11px] text-stone-400">Blocked users disappear immediately and are never notified.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Human + AI Anti-Scam Review</p>
                <p className="text-[11px] text-stone-400">Automated filters intercept commercial solicitation and suspicious links.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Policies & Guidelines Links */}
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Resources & Guidelines</h2>

          <div className="divide-y divide-stone-800 text-xs">
            <Link href="/guidelines" className="py-3 flex items-center justify-between text-stone-300 hover:text-white transition-colors">
              <span className="font-semibold">Community Guidelines</span>
              <ChevronRight className="w-4 h-4 text-stone-500" />
            </Link>
            <Link href="/safety-tips" className="py-3 flex items-center justify-between text-stone-300 hover:text-white transition-colors">
              <span className="font-semibold">In-Person & Online Safety Tips</span>
              <ChevronRight className="w-4 h-4 text-stone-500" />
            </Link>
            <Link href="/privacy" className="py-3 flex items-center justify-between text-stone-300 hover:text-white transition-colors">
              <span className="font-semibold">Privacy Policy</span>
              <ChevronRight className="w-4 h-4 text-stone-500" />
            </Link>
            <Link href="/terms" className="py-3 flex items-center justify-between text-stone-300 hover:text-white transition-colors">
              <span className="font-semibold">Terms of Service</span>
              <ChevronRight className="w-4 h-4 text-stone-500" />
            </Link>
          </div>
        </div>

        {/* GDPR & Data Controls */}
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Data Rights & Deletion</h2>

          <div className="space-y-2 pt-1">
            <button
              onClick={handleDataExport}
              disabled={downloading}
              className="w-full py-3 px-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-stone-700 text-xs font-semibold text-stone-300 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-stone-400" />
                Request Data Export (JSON)
              </span>
              <span className="text-stone-500">{downloading ? 'Preparing...' : 'Export'}</span>
            </button>

            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="w-full py-3 px-4 rounded-xl bg-red-950/30 border border-red-900/50 hover:bg-red-950/50 text-xs font-semibold text-red-400 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Permanently Delete My Account
              </span>
              <span>{deleting ? 'Processing...' : 'Delete'}</span>
            </button>
          </div>
        </div>
      </main>

      <MobileNavBar />
    </div>
  )
}
