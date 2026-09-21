import React from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-rose-500" />
            Terms of Service
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Effective Date: September 2026.
          </p>
        </div>

        <div className="space-y-4 text-xs text-stone-300 leading-relaxed bg-stone-900 border border-stone-800 p-6 rounded-3xl">
          <h2 className="text-sm font-bold text-white">1. Eligibility</h2>
          <p>
            You must be at least 18 years old to create an account or use Brostitute. By registering, you affirm that you meet the legal age of majority in your jurisdiction.
          </p>

          <h2 className="text-sm font-bold text-white pt-2">2. Prohibited Conduct</h2>
          <p>
            Users agree not to: (a) engage in commercial sex work, prostitution, escorting, or solicitation; (b) harass, intimidate, or threaten other members; (c) create fake or misleading identities; (d) attempt unauthorized extraction of private member contact info.
          </p>

          <h2 className="text-sm font-bold text-white pt-2">3. Subscription Terms & Billing</h2>
          <p>
            Premium memberships (Gold, Platinum) recur on the billing period selected until cancelled. All subscription pricing is clearly shown before payment processing.
          </p>
        </div>
      </div>
    </div>
  )
}
