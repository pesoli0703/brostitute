'use client'

import React from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Shield,
  Heart,
  Lock,
  UserCheck,
  Zap,
  ArrowRight,
  Database,
  CheckCircle2,
  Crown
} from 'lucide-react'
import { TopBar } from '@/components/navigation/TopBar'
import { MobileNavBar } from '@/components/navigation/MobileNavBar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col pb-20 md:pb-0">
      <TopBar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-rose-950/30 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Designed for Intentional Connections
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
            Meet people who are looking for the{' '}
            <span className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
              same kind of connection.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-stone-300 text-base sm:text-lg mb-8 leading-relaxed">
            Brostitute is a modern, private, and premium dating platform built primarily for women
            to discover and connect with high-intent men. Safe, verified, and transparent from the first hello.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/discover"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-2xl shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              Start Discovering
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/setup"
              className="w-full sm:w-auto px-6 py-4 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              Connect Supabase
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Identity Verification
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              Precise Location Protected
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Strict Anti-Harassment Rules
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-stone-900 bg-stone-950/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">Simplicity & Elegance</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">How Brostitute Works</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800/80 hover:border-stone-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Intentional Profiles</h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                Clear relationship intentions upfront (marriage, long-term, casual, friendship). No guessing games or mixed signals.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800/80 hover:border-stone-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Mutual Respect Matching</h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                Discover verified gentlemen who align with your values, lifestyle, and life stage. When you both express interest, sparks fly!
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800/80 hover:border-stone-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Realtime Private Chat</h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                Connect safely within the app without ever needing to disclose your private telephone number or social media handles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Features Highlight */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-stone-900">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900/80 to-rose-950/20 border border-stone-800 relative overflow-hidden">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4">
                <Shield className="w-3.5 h-3.5" />
                Safety Is Our Foundation
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Empowered, Private, and Protected
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed mb-6">
                Your privacy and emotional security are paramount. We never display your exact location, your phone number remains invisible, and every member has instant one-tap tools to unmatch, block, or report inappropriate behavior.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Selfie verification against profile photos
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Proactive spam & scam detection
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Dedicated admin review & moderation
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Total account & data deletion on demand
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/safety"
                  className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-300 font-semibold text-sm transition-colors"
                >
                  Visit Safety Center & Community Guidelines
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Explanation */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-stone-900 bg-stone-950/60">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            Ethical Intelligence
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            AI Designed to Enhance, Never Discriminate
          </h3>
          <p className="max-w-2xl mx-auto text-stone-400 text-sm leading-relaxed mb-8">
            Our AI architecture assists with witty conversation icebreakers, profile storytelling improvements, and scam pattern prevention. It never profiles or scores individuals based on protected personal characteristics.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
              <div className="font-semibold text-white text-sm mb-1">Smart Icebreakers</div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Skip awkward "hey" messages with contextual starters based on mutual passions.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
              <div className="font-semibold text-white text-sm mb-1">Profile Optimization</div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Personalized tips to showcase your authentic personality and attract compatible matches.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
              <div className="font-semibold text-white text-sm mb-1">Safety Guardrails</div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Automated detection of financial solicitation and deceptive links before they reach you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (Explicitly marked as placeholder content as required) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-stone-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">What Early Members Say</h3>
            <p className="text-xs text-amber-400/90 mt-1 font-mono uppercase tracking-wider">
              [Note: Illustrative Placeholder Testimonials for Product Demonstration]
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                ★★★★★
              </div>
              <p className="text-stone-300 text-sm italic leading-relaxed">
                "The atmosphere is so much more respectful than other apps. Knowing everyone has declared their relationship intentions upfront saved me months of wasted time."
              </p>
              <div className="text-xs text-stone-400 font-semibold">
                — Adaobi K., 29 (Illustrative User Story)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                ★★★★★
              </div>
              <p className="text-stone-300 text-sm italic leading-relaxed">
                "As an ambitious professional, I love the verified badge system. It feels elevated, modern, and genuinely safe."
              </p>
              <div className="text-xs text-stone-400 font-semibold">
                — Zainab M., 32 (Illustrative User Story)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto border-t border-stone-800/80 bg-stone-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-900">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-extrabold text-xl text-white">Brostitute</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
              <Link href="/guidelines" className="hover:text-white transition-colors">Community Guidelines</Link>
              <Link href="/safety-tips" className="hover:text-white transition-colors">Safety Tips</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/setup" className="text-rose-400 hover:text-rose-300 transition-colors">Supabase Setup</Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
            <p>© 2026 Brostitute Inc. All rights reserved. Minimum age requirement: 18+.</p>
            <p>Designed for women to discover intentional romance.</p>
          </div>
        </div>
      </footer>

      <MobileNavBar />
    </div>
  )
}
