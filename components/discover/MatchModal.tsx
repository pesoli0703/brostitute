'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { Sparkles, MessageCircle, ArrowRight, X, Heart } from 'lucide-react'
import { Profile, Match } from '@/lib/supabase/types'

interface MatchModalProps {
  partner: Profile
  matchId: string
  onClose: () => void
}

export function MatchModal({ partner, matchId, onClose }: MatchModalProps) {
  useEffect(() => {
    // Fire exciting celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#fb7185', '#d4af37', '#ffffff']
      })
    } catch {
      // safe fallback
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 rounded-3xl p-6 text-center shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Match Badge */}
        <div className="space-y-2 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Mutual Connection
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-rose-200 to-amber-300 bg-clip-text text-transparent">
            IT’S A MATCH!
          </h2>
          <p className="text-xs text-stone-400">
            You and <span className="font-semibold text-white">{partner.first_name}</span> liked each other!
          </p>
        </div>

        {/* Dual Avatars with Heart Connector */}
        <div className="flex items-center justify-center gap-3 py-2">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-rose-500 shadow-xl shadow-rose-950/50">
            <img
              src={partner.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'}
              alt={partner.first_name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-rose-500 shadow-md">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>

          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-xl shadow-amber-950/50">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Link
            href={`/chat/${matchId}`}
            className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/60 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Say Hello to {partner.first_name}
          </Link>

          <button
            onClick={onClose}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 font-semibold rounded-xl text-xs transition-colors"
          >
            Keep Browsing
          </button>
        </div>
      </div>
    </div>
  )
}
