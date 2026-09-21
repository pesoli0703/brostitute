'use client'

import React, { useState } from 'react'
import {
  Heart,
  X,
  Info,
  BadgeCheck,
  Briefcase,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react'
import { Profile } from '@/lib/supabase/types'
import { calculateAge } from '@/lib/services/profiles'

interface SwipeCardProps {
  profile: Profile
  onLike: () => void
  onPass: () => void
  onSuperlike?: () => void
  onOpenDetails: () => void
}

export function SwipeCard({ profile, onLike, onPass, onSuperlike, onOpenDetails }: SwipeCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0)

  const photos = profile.photos && profile.photos.length > 0
    ? profile.photos.map(p => p.url)
    : [profile.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80']

  const age = calculateAge(profile.date_of_birth)

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPhotoIndex((photoIndex + 1) % photos.length)
  }

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPhotoIndex((photoIndex - 1 + photos.length) % photos.length)
  }

  const intentionLabels: Record<string, string> = {
    long_term: '💍 Long-term relationship',
    marriage: '🥂 Seeking Marriage',
    dating: '✨ Dating intentionally',
    casual: '☕ Casual coffee dates',
    friendship: '🤝 Meaningful friendship'
  }

  return (
    <div className="relative w-full max-w-sm sm:max-w-md h-[580px] sm:h-[640px] rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-2xl select-none flex flex-col group">
      {/* Photo carousel */}
      <div className="relative w-full h-full cursor-pointer" onClick={onOpenDetails}>
        <img
          src={photos[photoIndex]}
          alt={profile.first_name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {/* Photo Indicators */}
        {photos.length > 1 && (
          <div className="absolute top-3 inset-x-4 z-20 flex gap-1.5">
            {photos.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full backdrop-blur-sm transition-all ${
                  i === photoIndex ? 'bg-white shadow' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Left / Right Tap zones */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent pointer-events-none" />

        {/* Details button pill top right */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onOpenDetails()
          }}
          className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-stone-900/70 hover:bg-stone-900 backdrop-blur-md border border-white/10 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-stone-300" />
          View Profile
        </button>

        {/* Bottom Profile Info Container */}
        <div className="absolute bottom-20 inset-x-0 p-5 z-20 text-white space-y-2 pointer-events-auto">
          {/* Relationship Intention Pill */}
          {profile.relationship_intention && (
            <div className="inline-block px-3 py-1 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide shadow">
              {intentionLabels[profile.relationship_intention] || profile.relationship_intention}
            </div>
          )}

          {/* Name & Age */}
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {profile.first_name}, {age}
            </h2>
            {profile.is_verified && (
              <BadgeCheck className="w-6 h-6 text-rose-400 fill-rose-950 shrink-0" />
            )}
          </div>

          {/* Occupation & Education */}
          <div className="space-y-1 text-xs text-stone-300">
            {profile.occupation && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">{profile.occupation}</span>
              </div>
            )}
            {profile.education && (
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">{profile.education}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-stone-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{profile.city}</span>
            </div>
          </div>

          {/* Bio Snippet */}
          {profile.bio && (
            <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed pt-1">
              {profile.bio}
            </p>
          )}

          {/* Interest Tags */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.interests.slice(0, 3).map((interest, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-stone-900/80 border border-stone-700/60 text-[10px] text-stone-300 font-medium"
                >
                  {interest.name}
                </span>
              ))}
              {profile.interests.length > 3 && (
                <span className="px-2 py-0.5 rounded-lg bg-stone-900/80 border border-stone-700/60 text-[10px] text-stone-400">
                  +{profile.interests.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="absolute bottom-3 inset-x-0 z-30 flex items-center justify-center gap-4 px-6 pointer-events-auto">
        {/* Pass Button */}
        <button
          onClick={onPass}
          className="w-14 h-14 rounded-full bg-stone-900/90 hover:bg-stone-800 border-2 border-stone-700 hover:border-stone-500 text-stone-400 hover:text-white flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95"
          title="Pass"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Superlike / Spark Button */}
        {onSuperlike && (
          <button
            onClick={onSuperlike}
            className="w-11 h-11 rounded-full bg-stone-900/90 hover:bg-stone-800 border border-amber-500/50 hover:border-amber-400 text-amber-400 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
            title="Superlike"
          >
            <Sparkles className="w-5 h-5 fill-amber-400" />
          </button>
        )}

        {/* Like Button */}
        <button
          onClick={onLike}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white flex items-center justify-center shadow-xl shadow-rose-950/60 transition-all hover:scale-105 active:scale-95"
          title="Like"
        >
          <Heart className="w-7 h-7 fill-white stroke-none" />
        </button>
      </div>
    </div>
  )
}
