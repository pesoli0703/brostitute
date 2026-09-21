'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
  Smile,
  Shield,
  MoreVertical,
  BadgeCheck,
  Sparkles,
  CheckCheck,
  AlertTriangle,
  Ban,
  HeartCrack
} from 'lucide-react'
import { Message, Match, Profile } from '@/lib/supabase/types'
import { chatService } from '@/lib/services/chat'
import { matchesService } from '@/lib/services/matches'
import { aiService } from '@/lib/services/ai'
import { useAuth } from '@/lib/context/AuthContext'
import { useToast } from '@/lib/context/ToastContext'
import { ReportModal } from '@/components/safety/ReportModal'
import { BlockModal } from '@/components/safety/BlockModal'

export default function ChatRoomPage() {
  const params = useParams()
  const router = useRouter()
  const matchId = params.matchId as string

  const { user, profile: currentUser } = useAuth()
  const { success, error } = useToast()

  const [match, setMatch] = useState<Match | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showIcebreakers, setShowIcebreakers] = useState(false)
  const [icebreakers, setIcebreakers] = useState<string[]>([])

  const [showReportModal, setShowReportModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUserId = user?.id || 'local-user-id'

  // Load match details and messages
  useEffect(() => {
    async function init() {
      try {
        const m = await matchesService.getMatchById(matchId, currentUserId)
        setMatch(m)

        const msgs = await chatService.getMessages(matchId)
        setMessages(msgs)

        // Mark as read
        await chatService.markAsRead(matchId, currentUserId)

        // Generate AI icebreakers if available
        if (currentUser && m?.partner) {
          const suggestions = await aiService.getConversationIcebreakers(currentUser, m.partner)
          setIcebreakers(suggestions)
        }
      } catch (err: any) {
        console.error('Chat init error:', err)
      }
    }
    init()

    // Subscribe to realtime messages
    const unsubscribe = chatService.subscribeToMessages(matchId, newMsg => {
      setMessages(prev => {
        if (prev.find(m => m.id === newMsg.id)) return prev
        return [...prev, newMsg]
      })
    })

    return () => {
      unsubscribe()
    }
  }, [matchId, currentUserId, currentUser])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim()
    if (!text) return

    setSending(true)
    try {
      const sent = await chatService.sendMessage({
        matchId,
        senderId: currentUserId,
        text
      })

      setMessages(prev => [...prev, sent])
      setInputText('')
      setShowIcebreakers(false)
    } catch (err: any) {
      error('Message failed', err.message)
    } finally {
      setSending(false)
    }
  }

  const handleSendQuickEmoji = (emoji: string) => {
    handleSend(emoji)
  }

  const handleUnmatch = async () => {
    if (!confirm('Are you sure you want to unmatch? This conversation will be removed.')) return
    try {
      await matchesService.unmatch(matchId)
      success('Unmatched', 'You have unmatched with this member.')
      router.push('/matches')
    } catch (err: any) {
      error('Failed to unmatch', err.message)
    }
  }

  const partner = match?.partner

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Chat Header */}
      <header className="sticky top-0 z-30 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/matches"
            className="p-1 rounded-xl text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-stone-700">
            <img
              src={partner?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'}
              alt={partner?.first_name || 'Partner'}
              className="w-full h-full object-cover"
            />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-stone-900 absolute bottom-0.5 right-0.5" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-sm text-white">
                {partner?.first_name || 'Member'}
              </h2>
              {partner?.is_verified && (
                <BadgeCheck className="w-4 h-4 text-rose-400 fill-rose-950" />
              )}
            </div>
            <p className="text-[10px] text-emerald-400 font-medium">Active now</p>
          </div>
        </div>

        {/* Action icons & Safety Menu */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowIcebreakers(!showIcebreakers)}
            className="p-2 rounded-xl text-amber-400 hover:bg-stone-800 transition-colors"
            title="AI Icebreakers"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 w-48 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl py-2 z-40 text-xs text-stone-200">
                <button
                  onClick={() => {
                    setShowMenu(false)
                    handleUnmatch()
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-stone-800 flex items-center gap-2"
                >
                  <HeartCrack className="w-4 h-4 text-stone-400" />
                  Unmatch
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowReportModal(true)
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-stone-800 text-rose-400 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Report Member
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowBlockModal(true)
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-stone-800 text-red-400 flex items-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  Block Member
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* AI Icebreaker Drawer */}
      {showIcebreakers && icebreakers.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/40 via-stone-900 to-rose-950/40 border-b border-amber-900/30 p-4 space-y-2 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Conversation Starters
            </span>
            <button
              onClick={() => setShowIcebreakers(false)}
              className="text-stone-400 hover:text-white text-xs"
            >
              Dismiss
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {icebreakers.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-left text-xs bg-stone-950/60 hover:bg-stone-800/80 p-2.5 rounded-xl border border-stone-800/80 text-stone-200 transition-colors"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 space-y-4 overflow-y-auto">
        {/* Safety Reminder Banner */}
        <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800/60 text-center space-y-1">
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400">
            <Shield className="w-3.5 h-3.5" />
            End-to-End Privacy Protection
          </div>
          <p className="text-[10px] text-stone-500 leading-relaxed">
            Never share financial accounts, passwords, or send money to anyone. Your telephone number is kept hidden.
          </p>
        </div>

        {/* Message Items */}
        {messages.map(msg => {
          const isMine = msg.sender_id === currentUserId
          const time = new Date(msg.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isMine
                    ? 'bg-rose-600 text-white rounded-br-none shadow-md shadow-rose-950/40'
                    : 'bg-stone-900 text-stone-100 rounded-bl-none border border-stone-800'
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-stone-500 px-1">
                <span>{time}</span>
                {isMine && (
                  <CheckCheck className={`w-3.5 h-3.5 ${msg.is_read ? 'text-rose-400' : 'text-stone-600'}`} />
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* Quick Emoji Bar */}
      <div className="max-w-2xl w-full mx-auto px-4 py-1 flex items-center justify-around text-lg">
        {['👋', '✨', '☕', '🥂', '😊', '🔥'].map(emoji => (
          <button
            key={emoji}
            onClick={() => handleSendQuickEmoji(emoji)}
            className="hover:scale-125 transition-transform p-1"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <footer className="sticky bottom-0 bg-stone-900/90 backdrop-blur-md border-t border-stone-800 p-3 pb-safe">
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSend()
          }}
          className="max-w-2xl w-full mx-auto flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Message ${partner?.first_name || '...'} (Max 2,000 chars)`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            maxLength={2000}
            className="flex-1 bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-stone-500 outline-none transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md shadow-rose-950 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>

      {/* Safety Modals */}
      {showReportModal && partner && (
        <ReportModal
          reportedUserId={partner.id}
          reportedUserName={partner.first_name}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {showBlockModal && partner && (
        <BlockModal
          blockedUserId={partner.id}
          blockedUserName={partner.first_name}
          onClose={() => setShowBlockModal(false)}
          onBlockedSuccess={() => router.push('/matches')}
        />
      )}
    </div>
  )
}
