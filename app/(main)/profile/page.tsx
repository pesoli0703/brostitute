'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  BadgeCheck,
  Camera,
  Edit3,
  Save,
  Shield,
  EyeOff,
  LogOut,
  Trash2,
  Check,
  Sparkles,
  Heart,
  Crown,
  LogIn,
  UserPlus
} from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { useToast } from '@/lib/context/ToastContext'
import { profilesService, calculateAge } from '@/lib/services/profiles'
import { SEED_INTERESTS } from '@/lib/mockData'
import { TopBar } from '@/components/navigation/TopBar'
import { MobileNavBar } from '@/components/navigation/MobileNavBar'
import { RelationshipIntention } from '@/lib/supabase/types'
import { isUUID } from '@/lib/utils'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, updateLocalProfile, signOut } = useAuth()
  const { success, error } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Edit fields
  const [firstName, setFirstName] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [occupation, setOccupation] = useState('')
  const [education, setEducation] = useState('')
  const [intention, setIntention] = useState<RelationshipIntention>('long_term')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isIncognito, setIsIncognito] = useState(false)

  // Verification request state
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '')
      setBio(profile.bio || '')
      setCity(profile.city || '')
      setOccupation(profile.occupation || '')
      setEducation(profile.education || '')
      setIntention(profile.relationship_intention || 'long_term')
      setAvatarUrl(profile.avatar_url || '')
      setIsIncognito(profile.is_incognito || false)
    }
  }, [profile])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const updates = {
        first_name: firstName,
        bio,
        city,
        occupation,
        education,
        relationship_intention: intention,
        avatar_url: avatarUrl,
        is_incognito: isIncognito
      }

      const targetId = user?.id || profile?.id || 'local-user-id'
      await profilesService.updateProfile(targetId, updates)
      updateLocalProfile(updates)
      setIsEditing(false)
      success('Profile Updated', 'Your changes have been saved.')
    } catch (err: any) {
      error('Failed to save', err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRequestVerification = async () => {
    setVerifying(true)
    try {
      const targetId = user?.id || profile?.id
      if (!user || !isUUID(targetId)) {
        // Guest mode verification
        updateLocalProfile({ verification_status: 'verified', is_verified: true })
        success('Verification Badge Active! 🌟', 'Guest preview verified. Sign in to submit photo ID to Supabase.')
        return
      }

      await profilesService.submitVerification(targetId, avatarUrl)
      updateLocalProfile({ verification_status: 'pending' })
      success('Verification Submitted', 'Your verification request has been submitted for admin review.')
    } catch (err: any) {
      error('Verification error', err.message)
    } finally {
      setVerifying(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    success('Signed Out', 'You have been logged out safely.')
    router.push('/login')
  }

  const age = calculateAge(profile?.date_of_birth || '2000-01-01')

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col pb-24 md:pb-8">
      <TopBar />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-4 space-y-5">
        {/* Guest Mode Callout if not signed into Supabase Auth */}
        {!user && (
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-between text-xs animate-in fade-in">
            <div>
              <p className="font-semibold text-amber-200">Browsing as Guest (Sophia)</p>
              <p className="text-[11px] text-stone-400">Sign in to save and sync your real profile to Supabase.</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href="/login"
                className="px-2.5 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-semibold"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="relative p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl flex flex-col items-center text-center">
          <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-rose-500 shadow-xl shadow-rose-950/40 mb-3">
            <img
              src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
              alt={firstName}
              className="w-full h-full object-cover"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">
              {firstName || 'Sophia'}, {age}
            </h1>
            {profile?.is_verified && (
              <BadgeCheck className="w-6 h-6 text-rose-400 fill-rose-950" />
            )}
          </div>

          <p className="text-xs text-stone-400 mt-0.5">{city || 'Victoria Island, Lagos'}</p>

          {/* Verification Callout */}
          {!profile?.is_verified && (
            <div className="mt-4 w-full p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-left">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Get Verified Badge
                </p>
                <p className="text-[11px] text-stone-400">Build instant trust with prospective matches</p>
              </div>
              <button
                onClick={handleRequestVerification}
                disabled={verifying}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all shrink-0"
              >
                {verifying ? 'Verifying...' : 'Verify Now'}
              </button>
            </div>
          )}

          {/* Quick Edit Toggle Button */}
          <div className="mt-4 flex gap-2 w-full">
            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-950 transition-all"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-stone-700/60"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile Information
              </button>
            )}
          </div>
        </div>

        {/* Profile Details & Form */}
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">About & Intentions</h2>

          {isEditing ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 font-medium mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-medium mb-1">Photo URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-medium mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white outline-none focus:border-rose-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-medium mb-1">Relationship Intention</label>
                <select
                  value={intention}
                  onChange={e => setIntention(e.target.value as RelationshipIntention)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white outline-none focus:border-rose-500"
                >
                  <option value="long_term">Long-term Relationship</option>
                  <option value="marriage">Marriage</option>
                  <option value="dating">Dating Intentionally</option>
                  <option value="casual">Casual</option>
                  <option value="friendship">Friendship</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 font-medium mb-1">Occupation</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={e => setOccupation(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-medium mb-1">Education</label>
                <input
                  type="text"
                  value={education}
                  onChange={e => setEducation(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white outline-none focus:border-rose-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs leading-relaxed">
              <div>
                <span className="text-stone-500 font-semibold uppercase block text-[10px] mb-1">Bio</span>
                <p className="text-stone-300 bg-stone-950/60 p-3.5 rounded-2xl border border-stone-800/80">
                  {bio || 'No bio written yet. Click Edit Profile to tell members about yourself!'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                  <span className="text-[10px] text-stone-500 uppercase block">Occupation</span>
                  <span className="text-stone-200 font-medium truncate block">{occupation || 'Not specified'}</span>
                </div>
                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                  <span className="text-[10px] text-stone-500 uppercase block">Education</span>
                  <span className="text-stone-200 font-medium truncate block">{education || 'Not specified'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Privacy & Account Settings */}
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Privacy & Security</h2>

          <div className="flex items-center justify-between py-2 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-stone-400" />
              <div>
                <p className="text-xs font-semibold text-white">Incognito Mode</p>
                <p className="text-[10px] text-stone-500">Only people you like can view your profile</p>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !isIncognito
                setIsIncognito(next)
                updateLocalProfile({ is_incognito: next })
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                isIncognito ? 'bg-rose-600' : 'bg-stone-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  isIncognito ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <Link
            href="/premium"
            className="flex items-center justify-between py-2 border-b border-stone-800 hover:text-amber-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold">Manage Premium Subscription</span>
            </div>
            <span className="text-xs text-amber-400">View Plans →</span>
          </Link>

          <Link
            href="/safety"
            className="flex items-center justify-between py-2 border-b border-stone-800 hover:text-rose-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-semibold">Safety Center & Guidelines</span>
            </div>
            <span className="text-xs text-stone-500">→</span>
          </Link>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleSignOut}
              className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </main>

      <MobileNavBar />
    </div>
  )
}
