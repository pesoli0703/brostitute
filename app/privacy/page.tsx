import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Lock className="w-8 h-8 text-rose-500" />
            Privacy Policy
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Effective Date: September 2026. Your privacy is paramount.
          </p>
        </div>

        <div className="space-y-4 text-xs text-stone-300 leading-relaxed bg-stone-900 border border-stone-800 p-6 rounded-3xl">
          <h2 className="text-sm font-bold text-white">1. Information We Collect</h2>
          <p>
            We collect the information you voluntarily provide upon registration: first name, date of birth (to verify legal age 18+), gender, city/general neighborhood, email address, profile photos, and relationship preferences.
          </p>

          <h2 className="text-sm font-bold text-white pt-2">2. Strict Location Privacy</h2>
          <p>
            Brostitute <strong>never publicly reveals your precise GPS coordinates, exact address, or home street</strong>. Other members only see your city or general district (e.g. "Victoria Island, Lagos").
          </p>

          <h2 className="text-sm font-bold text-white pt-2">3. Phone Number & Contact Confidentiality</h2>
          <p>
            Your private phone number, email address, and billing details are never displayed on public profile cards.
          </p>

          <h2 className="text-sm font-bold text-white pt-2">4. Your Rights (GDPR & Data Erasure)</h2>
          <p>
            You have the right to request a complete JSON export of your personal data or immediate, permanent account deletion directly through the Safety Center in your profile.
          </p>
        </div>
      </div>
    </div>
  )
}
