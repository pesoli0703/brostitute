'use client'

import React, { useState, useEffect } from 'react'
import { Flag, CheckCircle, Ban, X, ShieldAlert } from 'lucide-react'
import { Report } from '@/lib/supabase/types'
import { adminService } from '@/lib/services/admin'
import { useToast } from '@/lib/context/ToastContext'

export default function AdminReportsPage() {
  const { success, error } = useToast()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const list = await adminService.getReports()
        setReports(list)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleResolve = async (reportId: string, action: 'dismissed' | 'action_taken', banUser?: boolean, targetUserId?: string) => {
    try {
      if (banUser && targetUserId) {
        await adminService.moderateUser(targetUserId, 'ban')
      }
      await adminService.updateReportStatus(reportId, action, banUser ? 'User banned after investigation' : 'Report reviewed & dismissed')

      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: action } : r))
      success('Report Handled', banUser ? 'Report resolved and offending user banned.' : 'Report dismissed.')
    } catch (err: any) {
      error('Failed to handle report', err.message)
    }
  }

  const reasonLabels: Record<string, string> = {
    scam_or_fake: '⚠️ Potential Scam / Fake Profile',
    harassment: '🚫 Harassment / Abuse',
    inappropriate_content: '🔞 Inappropriate Imagery',
    solicitation: '💵 Commercial Solicitation / Prostitution',
    underage: '👶 Underage Member Suspected',
    other: '❓ Other Safety Concern'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Flag className="w-6 h-6 text-red-500" />
          Trust & Safety Reports Queue
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Confidential reports submitted by members. Zero tolerance for solicitation, harassment, or fake identities.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-stone-500 text-xs">Loading safety reports...</div>
      ) : reports.length === 0 ? (
        <div className="p-8 rounded-3xl bg-stone-900 border border-stone-800 text-center space-y-2">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
          <p className="text-sm font-semibold text-white">Queue is clear!</p>
          <p className="text-xs text-stone-500">No pending safety reports require moderation.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(rep => {
            const isPending = rep.status === 'pending'
            return (
              <div
                key={rep.id}
                className={`p-5 rounded-3xl border space-y-3 transition-all ${
                  isPending ? 'bg-stone-900 border-red-900/50 shadow-lg' : 'bg-stone-900/40 border-stone-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-red-400">
                      {reasonLabels[rep.reason] || rep.reason}
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Report ID: {rep.id} • Filed on {new Date(rep.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    isPending ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {rep.status}
                  </span>
                </div>

                {rep.details && (
                  <p className="text-xs text-stone-300 bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                    "{rep.details}"
                  </p>
                )}

                {isPending && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                    <button
                      onClick={() => handleResolve(rep.id, 'dismissed')}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => handleResolve(rep.id, 'action_taken', true, rep.reported_id)}
                      className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-red-950 transition-all"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Ban Offending Account
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
