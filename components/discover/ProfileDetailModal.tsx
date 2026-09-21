'use client'

import React, { useState } from 'react'
import {
  X,
  BadgeCheck,
  Briefcase,
  GraduationCap,
  MapPin,
  Sparkles,
  Shield,
  Heart,
  AlertTriangle,
  Ban,
  Activity,
  Wine,
  Cigarette,
  Dumbbell,
  Dog
} from 'lucide-react'
import { Profile } from '@/lib/supabase/types'
import { calculateAge } from '@/lib/services/profiles'
import { aiService, CompatibilityAnalysis } from '@/lib/services/ai'
import { useAuth } from '@/lib/context/AuthContext'

interface ProfileDetailModalProps {
  profile: Profile
  onClose: () => void
  onLike?: () => void
  onPass?: () => void
  onReport?: () => void
  onBlock?: () => void
}

export function ProfileDetailModal({
  profile,
  onClose,
  onLike,
  onPass,
  onReport,
  onBlock
}: ProfileDetailModalProps) {
  const { profile: currentUserProfile } = useAuth()
  const [aiReport, setAiReport] = useState<CompatibilityAnalysis | null>(null)
  const [loadingAi, setLoadingAi] = useState(false)

  const age = calculateAge(profile.date_of_birth)
  const photos = profile.photos && profile.photos.length > 0
    ? profile.photos.map(p => p.url)
    : [profile.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80']

  const handleFetchAiCompatibility = async () => {
    if (!currentUserProfile) return
    setLoadingAi(true)
    try {
      const result = await aiService.getCompatibility(currentUserProfile, profile)
      setAiReport(result)
    } finally {
      setLoadingAi(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[92vh] bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-900 text-stone-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pb-24">
          {/* Photos Grid / Hero */}
          <div className="relative h-96 w-full">
            <img
              src={photos[0]}
              alt={profile.first_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-extrabold text-white">
                  {profile.first_name}, {age}
                </h2>
                {profile.is_verified && (
                  <BadgeCheck className="w-7 h-7 text-rose-400 fill-rose-950" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-stone-300 text-xs mt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{profile.city}</span>
              </div>
            </div>
          </div>

          <div className="px-6 space-y-6">
            {/* Relationship Intention Card */}
            {profile.relationship_intention && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <Heart className="w-5 h-5 fill-rose-500/30" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider">
                    Looking for
                  </div>
                  <div className="text-sm font-semibold text-white capitalize">
                    {profile.relationship_intention.replace('_', ' ')}
                  </div>
                </div>
              </div>
            )}

            {/* Bio */}
            <div>
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">About Me</h3>
              <p className="text-sm text-stone-200 leading-relaxed whitespace-pre-line bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80">
                {profile.bio || "No bio added yet."}
              </p>
            </div>

            {/* Profession & Education */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.occupation && (
                <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-rose-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-stone-400 uppercase">Work</p>
                    <p className="text-xs font-semibold text-white truncate">{profile.occupation}</p>
                  </div>
                </div>
              )}
              {profile.education && (
                <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-rose-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-stone-400 uppercase">Education</p>
                    <p className="text-xs font-semibold text-white truncate">{profile.education}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lifestyle stats */}
            {profile.lifestyle && (
              <div>
                <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Lifestyle</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {profile.lifestyle.workout && (
                    <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center gap-2 text-stone-300">
                      <Dumbbell className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{profile.lifestyle.workout}</span>
                    </div>
                  )}
                  {profile.lifestyle.drinking && (
                    <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center gap-2 text-stone-300">
                      <Wine className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Drinks: {profile.lifestyle.drinking}</span>
                    </div>
                  )}
                  {profile.lifestyle.smoking && (
                    <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center gap-2 text-stone-300">
                      <Cigarette className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Smokes: {profile.lifestyle.smoking}</span>
                    </div>
                  )}
                  {profile.lifestyle.pets && (
                    <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center gap-2 text-stone-300">
                      <Dog className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{profile.lifestyle.pets}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Photos */}
            {photos.length > 1 && (
              <div>
                <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">More Photos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {photos.slice(1).map((url, i) => (
                    <div key={i} className="h-48 rounded-2xl overflow-hidden border border-stone-800">
                      <img src={url} alt={`Photo ${i + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-medium text-stone-200"
                    >
                      {interest.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Compatibility Insight Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-stone-900 to-rose-500/10 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  AI Compatibility Report
                </div>
                {!aiReport && (
                  <button
                    onClick={handleFetchAiCompatibility}
                    disabled={loadingAi}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-all"
                  >
                    {loadingAi ? 'Analyzing...' : 'Generate Insight'}
                  </button>
                )}
              </div>

              {aiReport ? (
                <div className="space-y-3 pt-1 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-black text-amber-400">{aiReport.score}%</div>
                    <p className="text-stone-300 leading-relaxed">{aiReport.summary}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-400">Shared Passions: </span>
                    <span className="text-stone-200">{aiReport.sharedVibes.join(', ')}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-stone-400">Suggested Opener:</span>
                    <p className="italic text-rose-300 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80">
                      "{aiReport.conversationStarters[0]}"
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-400 leading-relaxed">
                  Discover your calculated synergy, aligned values, and custom icebreakers generated by our ethical dating AI model.
                </p>
              )}
            </div>

            {/* Safety Actions: Report / Block */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-500">
              <button
                onClick={onReport}
                className="hover:text-red-400 inline-flex items-center gap-1.5 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Report Profile
              </button>
              <button
                onClick={onBlock}
                className="hover:text-red-400 inline-flex items-center gap-1.5 transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                Block Member
              </button>
            </div>
          </div>
        </div>

        {/* Floating Action Bar at Bottom of Modal */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-stone-950/90 backdrop-blur-lg border-t border-stone-800 flex items-center justify-around z-30">
          <button
            onClick={() => {
              onClose()
              if (onPass) onPass()
            }}
            className="px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors"
          >
            Pass
          </button>
          <button
            onClick={() => {
              onClose()
              if (onLike) onLike()
            }}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-950 transition-all"
          >
            <Heart className="w-4 h-4 fill-white" />
            Like Profile
          </button>
        </div>
      </div>
    </div>
  )
}
