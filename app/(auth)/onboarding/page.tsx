'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Camera,
  Heart,
  Lock
} from 'lucide-react'
import { authService } from '@/lib/services/auth'
import { SEED_INTERESTS } from '@/lib/mockData'
import { useAuth } from '@/lib/context/AuthContext'
import { useToast } from '@/lib/context/ToastContext'
import { Gender, RelationshipIntention } from '@/lib/supabase/types'

export default function OnboardingPage() {
  const router = useRouter()
  const { refreshProfile } = useAuth()
  const { success, error } = useToast()

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  // Step 1: Identity & Credentials
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dob, setDob] = useState('2000-01-01')
  const [gender, setGender] = useState<Gender>('woman')
  const [city, setCity] = useState('Lagos')

  // Step 2: Intentions & Career
  const [intention, setIntention] = useState<RelationshipIntention>('long_term')
  const [occupation, setOccupation] = useState('')
  const [education, setEducation] = useState('')
  const [drinking, setDrinking] = useState('Socially')
  const [smoking, setSmoking] = useState('Never')
  const [workout, setWorkout] = useState('3-4x / week')

  // Step 3: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Travel & Exploration',
    'Fine Dining',
    'Art & Design'
  ])

  // Step 4: Photo & Bio
  const [bio, setBio] = useState('')
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  )

  // Age verification helper: must be 18+
  const validateAge = () => {
    const birthDate = new Date(dob)
    const today = new Date('2026-09-20')
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age >= 18
  }

  const handleNext = () => {
    if (step === 1) {
      if (!firstName.trim() || !email.trim() || !password) {
        error('Required Fields', 'Please complete all required fields.')
        return
      }
      if (!validateAge()) {
        error('Age Requirement', 'You must be at least 18 years old to join Brostitute.')
        return
      }
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      if (selectedInterests.length < 2) {
        error('Pick Interests', 'Please select at least 2 interests.')
        return
      }
      setStep(4)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await authService.signUp({
        email,
        password,
        firstName,
        dateOfBirth: dob,
        gender,
        city,
        avatarUrl: photoUrl
      })

      // Also persist additional onboarding details locally/remotely
      const fullProfile = {
        first_name: firstName,
        gender,
        city,
        relationship_intention: intention,
        occupation,
        education,
        bio,
        avatar_url: photoUrl,
        lifestyle: { drinking, smoking, workout },
        verification_status: 'unverified' as const,
        is_verified: false
      }

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('brostitute_local_profile')
        const parsed = stored ? JSON.parse(stored) : {}
        localStorage.setItem('brostitute_local_profile', JSON.stringify({ ...parsed, ...fullProfile }))
      }

      await refreshProfile()
      success('Welcome to Brostitute!', 'Your profile has been created successfully.')
      router.push('/discover')
    } catch (err: any) {
      error('Registration Error', err.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleInterest = (name: string) => {
    if (selectedInterests.includes(name)) {
      setSelectedInterests(prev => prev.filter(i => i !== name))
    } else {
      setSelectedInterests(prev => [...prev, name])
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center py-10 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-extrabold text-xl text-white">Brostitute</span>
          </Link>
          <p className="text-xs text-stone-400">Step {step} of 4: Intentional Onboarding</p>

          {/* Progress bar */}
          <div className="w-full bg-stone-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 to-rose-400 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-6 sm:p-8 rounded-3xl shadow-xl">
          {/* STEP 1: Core Credentials & Minimum Legal Age */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-xl font-bold text-white">Let’s start with the basics</h3>
                <p className="text-xs text-stone-400 mt-1">
                  We require everyone to meet the legal age of 18+ to keep our community safe.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="e.g. Sophia"
                  className="w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('woman')}
                    className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                      gender === 'woman'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    Woman
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('man')}
                    className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                      gender === 'man'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    Man
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Date of Birth (Must be 18+)
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Victoria Island, Lagos"
                  className="w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 outline-none"
                  required
                />
                <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-stone-400" />
                  Your exact address is never displayed. Only the city/district is shown.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="sophia@example.com"
                  className="w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 outline-none"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-950/40"
              >
                Continue to Intentions
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Intentions & Lifestyle */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-xl font-bold text-white">Your Intentions & Lifestyle</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Being transparent upfront helps you match with someone aligned with your life path.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  What kind of connection are you seeking?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'long_term', label: 'Long-term Partner' },
                    { id: 'marriage', label: 'Marriage / Life Partner' },
                    { id: 'dating', label: 'Dating & Seeing Vibes' },
                    { id: 'friendship', label: 'Meaningful Friendship' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIntention(item.id as RelationshipIntention)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                        intention === item.id
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Occupation / Craft
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={e => setOccupation(e.target.value)}
                  placeholder="e.g. Product Strategist / Architect"
                  className="w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Education
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={e => setEducation(e.target.value)}
                  placeholder="e.g. MSc Economics, Columbia"
                  className="w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">
                    Workout Rhythm
                  </label>
                  <select
                    value={workout}
                    onChange={e => setWorkout(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option>Daily</option>
                    <option>3-4x / week</option>
                    <option>Sometimes</option>
                    <option>Rarely</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">
                    Drinking
                  </label>
                  <select
                    value={drinking}
                    onChange={e => setDrinking(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option>Socially</option>
                    <option>Never</option>
                    <option>Rarely</option>
                    <option>Often</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 border border-stone-800 hover:bg-stone-800 rounded-xl text-xs text-stone-400 font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-2/3 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  Continue to Interests
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Interests Picker */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-xl font-bold text-white">What are you passionate about?</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Select at least 2 interests to help us find shared chemistry.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto py-2">
                {SEED_INTERESTS.map(item => {
                  const isSelected = selectedInterests.includes(item.name)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.name)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-rose-500 border-rose-400 text-white shadow-md shadow-rose-950'
                          : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      {item.name}
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  )
                })}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 border border-stone-800 hover:bg-stone-800 rounded-xl text-xs text-stone-400 font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-2/3 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  Continue to Profile & Photo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Profile Photo & Short Bio */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-xl font-bold text-white">Add your photo & bio</h3>
                <p className="text-xs text-stone-400 mt-1">
                  A warm, authentic photo and a few sentences about what excites you.
                </p>
              </div>

              {/* Photo preview */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-rose-500 shadow-xl">
                  <img src={photoUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-1 right-1 p-1 bg-stone-900/80 backdrop-blur rounded-md">
                    <Camera className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-600 outline-none"
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Short Bio
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  placeholder="Share a bit about what makes you smile, your favorite weekend rituals, and what you value in a partner..."
                  className="w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-600 outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 text-[11px] text-stone-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  By joining, you agree to our Community Guidelines and confirm that you are at least 18 years of age.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-1/3 py-3.5 border border-stone-800 hover:bg-stone-800 rounded-xl text-xs text-stone-400 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/40 disabled:opacity-50"
                >
                  {submitting ? 'Creating Profile...' : 'Complete & Start Swiping'}
                  <Heart className="w-4 h-4 fill-white" />
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-xs text-stone-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-rose-400 hover:text-rose-300 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
