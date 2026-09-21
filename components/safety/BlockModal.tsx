'use client'

import React, { useState } from 'react'
import { Ban, X } from 'lucide-react'
import { safetyService } from '@/lib/services/safety'
import { useAuth } from '@/lib/context/AuthContext'
import { useToast } from '@/lib/context/ToastContext'

interface BlockModalProps {
  blockedUserId: string
  blockedUserName: string
  onClose: () => void
  onBlockedSuccess?: () => void
}

export function BlockModal({ blockedUserId, blockedUserName, onClose, onBlockedSuccess }: BlockModalProps) {
  const { user } = useAuth()
  const { success, error } = useToast()
  const [blocking, setBlocking] = useState(false)

  const handleBlock = async () => {
    setBlocking(true)
    try {
      await safetyService.blockUser(user?.id || 'local-user-id', blockedUserId)
      success('User Blocked', `${blockedUserName} will no longer see your profile or send you messages.`)
      if (onBlockedSuccess) onBlockedSuccess()
      onClose()
    } catch (err: any) {
      error('Failed to block', err.message)
    } finally {
      setBlocking(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <Ban className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-white">Block {blockedUserName}?</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            They will not be notified, but they won't be able to view your profile, match with you, or message you ever again.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={onClose}
            className="py-2.5 rounded-xl border border-stone-800 hover:bg-stone-800 text-xs font-semibold text-stone-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleBlock}
            disabled={blocking}
            className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-950 transition-all disabled:opacity-50"
          >
            {blocking ? 'Blocking...' : 'Yes, Block'}
          </button>
        </div>
      </div>
    </div>
  )
}
