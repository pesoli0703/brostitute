import React from 'react'
import Link from 'next/link'
import { ArrowLeft, LifeBuoy, MapPin, Eye, Lock, PhoneOff } from 'lucide-react'

export default function SafetyTipsPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/safety" className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Back to Safety Center
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <LifeBuoy className="w-8 h-8 text-rose-500" />
            Dating Safety Tips
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Empowering advice for staying safe online and on in-person dates.
          </p>
        </div>

        <div className="space-y-4 text-xs text-stone-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <PhoneOff className="w-4 h-4 text-rose-400" />
              1. Keep Conversations on the Platform First
            </h2>
            <p>
              Do not rush to give out your personal phone number, home address, or social media handles. Chat within Brostitute where our privacy filters and safety mechanisms are actively protecting you.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              2. Never Send Money or Financial Info
            </h2>
            <p>
              Never wire funds, share bank details, or send cryptocurrency to anyone you meet online, regardless of their story. Report anyone who asks for financial assistance immediately.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              3. Meet in Populated, Public Spaces
            </h2>
            <p>
              For initial dates, choose vibrant public cafes, restaurants, or galleries. Arrange your own transportation to and from the venue and always inform a trusted friend about where you are going.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-rose-400" />
              4. Trust Your Instincts
            </h2>
            <p>
              If a conversation or interaction makes you feel uncomfortable at any point, unmatch and block the user immediately. Your comfort and safety always come first.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
