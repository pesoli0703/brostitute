'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, Search, BadgeCheck, Sparkles, Heart } from 'lucide-react'
import { Match } from '@/lib/supabase/types'
import { matchesService } from '@/lib/services/matches'
import { useAuth } from '@/lib/context/AuthContext'
import { TopBar } from '@/components/navigation/TopBar'
import { MobileNavBar } from '@/components/navigation/MobileNavBar'

export default function MatchesPage() {
  const { user } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const currentUserId = user?.id || 'local-user-id'

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const list = await matchesService.getMatches(currentUserId)
        setMatches(list)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentUserId])

  const filteredMatches = matches.filter(m => {
    if (!search) return true
    const name = m.partner?.first_name?.toLowerCase() || ''
    return name.includes(search.toLowerCase())
  })

  // Format relative time helper
  const formatTime = (isoString?: string) => {
    if (!isoString) return ''
    const diffMin = Math.floor((Date.now() - new Date(isoString).getTime()) / (1000 * 60))
    if (diffMin < 1) return 'Just now'
    if (diffMin < 60) return `${diffMin}m`
    const diffHours = Math.floor(diffMin / 60)
    if (diffHours < 24) return `${diffHours}h`
    return `${Math.floor(diffHours / 24)}d`
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col pb-20 md:pb-0">
      <TopBar />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h1 className="text-xl font-bold text-white tracking-tight">Matches & Chat</h1>
          </div>
          <span className="text-xs text-stone-400 font-semibold px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800">
            {matches.length} Connections
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search connections..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 focus:border-rose-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 outline-none"
          />
        </div>

        {/* New Matches Row (Horizontal Bubble Scroll) */}
        {matches.length > 0 && !search && (
          <div className="space-y-2 pt-1">
            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              New Matches
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {matches.map(m => (
                <Link
                  key={m.id}
                  href={`/chat/${m.id}`}
                  className="flex flex-col items-center shrink-0 group space-y-1"
                >
                  <div className="relative w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-rose-600 via-rose-400 to-amber-300 group-hover:scale-105 transition-transform">
                    <img
                      src={m.partner?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'}
                      alt={m.partner?.first_name || 'Match'}
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-stone-950 absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <span className="text-[11px] font-medium text-stone-300 max-w-[64px] truncate text-center">
                    {m.partner?.first_name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div className="space-y-2 pt-2">
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Conversations
          </h2>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 rounded-2xl bg-stone-900/50 border border-stone-800 animate-pulse" />
              ))}
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="space-y-2">
              {filteredMatches.map(m => {
                const partner = m.partner
                const lastMsg = m.last_message
                const isUnread = lastMsg && !lastMsg.is_read && lastMsg.sender_id !== currentUserId

                return (
                  <Link
                    key={m.id}
                    href={`/chat/${m.id}`}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all hover:bg-stone-900 ${
                      isUnread
                        ? 'bg-stone-900/90 border-rose-900/50 shadow-md'
                        : 'bg-stone-900/50 border-stone-800/80'
                    }`}
                  >
                    {/* Avatar with online status indicator */}
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-stone-700">
                      <img
                        src={partner?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'}
                        alt={partner?.first_name}
                        className="w-full h-full object-cover"
                      />
                      <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-stone-900 absolute bottom-1 right-1" />
                    </div>

                    {/* Partner Name, Last message preview, and timestamp */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h3 className="font-semibold text-sm text-white truncate">
                            {partner?.first_name || 'Member'}
                          </h3>
                          {partner?.is_verified && (
                            <BadgeCheck className="w-4 h-4 text-rose-400 fill-rose-950 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-stone-500 shrink-0">
                          {formatTime(m.last_message_at)}
                        </span>
                      </div>

                      <p className={`text-xs mt-1 truncate ${
                        isUnread ? 'text-white font-medium' : 'text-stone-400'
                      }`}>
                        {lastMsg?.text || `You matched with ${partner?.first_name}! Say hello.`}
                      </p>
                    </div>

                    {isUnread && (
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    )}
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-stone-900 border border-stone-800 text-center space-y-3">
              <Heart className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-sm font-semibold text-white">No matches found</p>
              <p className="text-xs text-stone-400">
                Start liking profiles in Discover to create new matches and conversations.
              </p>
              <Link
                href="/discover"
                className="inline-block px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 transition-colors"
              >
                Go to Discover
              </Link>
            </div>
          )}
        </div>
      </main>

      <MobileNavBar />
    </div>
  )
}
