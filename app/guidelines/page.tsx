import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, CheckCircle, XCircle } from 'lucide-react'

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/safety" className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Back to Safety Center
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-rose-500" />
            Community Guidelines
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Last updated: September 2026. Every member must respect these values.
          </p>
        </div>

        <div className="space-y-4 text-xs text-stone-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              1. Mutual Respect & Authenticity
            </h2>
            <p>
              Brostitute was created to foster genuine, intentional dating connections. Treat fellow members with respect, kindness, and honesty. Use authentic, recent photos that accurately represent yourself.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              2. Zero Tolerance for Commercial Solicitation & Prostitution
            </h2>
            <p>
              Despite the playful branding, Brostitute strictly prohibits commercial solicitation, sex work, escorting services, and any exchange of money or gifts for romantic/sexual favors. Any accounts attempting commercial solicitation or financial transactions will be permanently banned immediately and reported to authorities when required by law.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              3. Zero Tolerance for Harassment & Hate Speech
            </h2>
            <p>
              Harassment, threats, stalking, non-consensual sexual content, discrimination based on race, ethnicity, religion, or sexual orientation are strictly forbidden and result in immediate account termination.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              4. Strict Legal Age Verification (18+)
            </h2>
            <p>
              Minors are not permitted on Brostitute under any circumstances. Suspected underage accounts are immediately frozen pending administrative review.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
