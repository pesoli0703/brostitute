'use client'

import React, { useState } from 'react'
import { X, AlertTriangle, ShieldAlert } from 'lucide-react'
import { ReportReason } from '@/lib/supabase/types'
import { safetyService } from '@/lib/services/safety'
import { useAuth } from '@/lib/context/AuthContext'
import { useToast } from '@/lib/context/ToastContext'

interface ReportModalProps {
  reportedUserId: string
  reportedUserName: string
  onClose: () => void
}

const REPORT_REASONS: { id: ReportReason; label: string; desc: string }[] = [
  { id: 'scam_or_fake', label: 'Scam, Fake Profile, or Impersonation', desc: 'Pretending to be someone else or asking for money' },
  { id: 'harassment', label: 'Harassment or Offensive Behavior', desc: 'Disrespectful, threatening, or unwanted messages' },
  { id: 'inappropriate_content', label: 'Inappropriate Photos or Content', desc: 'Explicit or non-consensual imagery' },
  { id: 'solicitation', label: 'Commercial Solicitation or Prostitution', desc: 'Offering or requesting commercial services' },
  { id: 'underage', label: 'Suspected Underage Member', desc: 'Appears to be under the legal age of 18' },
  { id: 'other', label: 'Other Guideline Violation', desc: 'Any other safety or trust concern' }
]

export function ReportModal({ reportedUserId, reportedUserName, onClose }: ReportModalProps) {
  const { user } = useAuth()
  const { success, error } = useToast()

  const [selectedReason, setSelectedReason] = useState<ReportReason>('scam_or_fake')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await safetyService.reportProfile({
        reporterId: user?.id || 'local-user-id',
        reportedId: reportedUserId,
        reason: selectedReason,
        details
      })

      success('Report Submitted', 'Our trust & safety team has received your report and will review it immediately.')
      onClose()
    } catch (err: any) {
      error('Failed to report', err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2 text-rose-500">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">Report {reportedUserName}</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4">
          <p className="text-xs text-stone-400">
            Reports are 100% confidential. The person you are reporting will never know who filed this report.
          </p>

          <div className="space-y-2">
            {REPORT_REASONS.map(r => (
              <label
                key={r.id}
                className={`p-3 rounded-xl border flex flex-col cursor-pointer transition-all ${
                  selectedReason === r.id
                    ? 'bg-rose-500/10 border-rose-500 text-white'
                    : 'bg-stone-950/60 border-stone-800/80 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{r.label}</span>
                  <input
                    type="radio"
                    name="reportReason"
                    checked={selectedReason === r.id}
                    onChange={() => setSelectedReason(r.id)}
                    className="accent-rose-500"
                  />
                </div>
                <span className="text-[11px] text-stone-400 mt-1">{r.desc}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Additional Details (Optional)
            </label>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              rows={3}
              placeholder="Please provide any helpful context for our moderation team..."
              className="w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl p-3 text-xs text-white placeholder-stone-600 outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs text-stone-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md shadow-rose-950 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
