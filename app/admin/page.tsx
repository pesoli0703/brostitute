'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Heart,
  Flag,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'
import { adminService, AdminStats } from '@/lib/services/admin'

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const s = await adminService.getStats()
      setStats(s)
      setLoading(false)
    }
    load()
  }, [])

  if (loading || !stats) {
    return (
      <div className="py-12 text-center text-stone-400 text-xs">
        Loading platform metrics...
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Registered Members',
      value: stats.totalUsers.toLocaleString(),
      sub: `${stats.totalWomen} Women • ${stats.totalMen} Men`,
      icon: Users,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20'
    },
    {
      title: 'Mutual Matches Created',
      value: stats.totalMatches.toLocaleString(),
      sub: 'Connections sparked',
      icon: Heart,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Active Paid Subscriptions',
      value: stats.activeSubscriptions.toLocaleString(),
      sub: 'Gold & Platinum Tiers',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Pending Safety Reports',
      value: stats.pendingReports.toString(),
      sub: 'Requires Trust & Safety review',
      icon: Flag,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white">Platform Analytics & Operations</h1>
        <p className="text-xs text-stone-400 mt-1">
          Realtime platform health, revenue metrics, and trust & safety queues.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div
              key={i}
              className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-400">{card.title}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-white">{card.value}</p>
                <p className="text-[11px] text-stone-500 mt-1">{card.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Revenue & Growth Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Monthly Revenue Performance
            </h2>
            <span className="text-xs font-bold text-emerald-400">
              Est. ${(stats.totalRevenueUSD).toLocaleString()} USD / mo
            </span>
          </div>

          <p className="text-xs text-stone-400 leading-relaxed">
            Revenue originates from recurring Gold ($24.99) and Platinum ($49.99) subscription tiers, structured for seamless settlement through Paystack and Flutterwave.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-3 bg-stone-950/60 rounded-2xl border border-stone-800">
              <span className="text-stone-500 block text-[10px] uppercase">Women Ratio</span>
              <span className="text-base font-bold text-rose-400">55%</span>
            </div>
            <div className="p-3 bg-stone-950/60 rounded-2xl border border-stone-800">
              <span className="text-stone-500 block text-[10px] uppercase">Men Ratio</span>
              <span className="text-base font-bold text-blue-400">45%</span>
            </div>
            <div className="p-3 bg-stone-950/60 rounded-2xl border border-stone-800">
              <span className="text-stone-500 block text-[10px] uppercase">Conversion Rate</span>
              <span className="text-base font-bold text-amber-400">15.1%</span>
            </div>
          </div>
        </div>

        {/* Quick Operations Callout */}
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Urgent Action Items
          </h2>

          <div className="space-y-3 text-xs">
            <Link
              href="/admin/reports"
              className="p-3 rounded-2xl bg-stone-950/60 border border-stone-800 hover:border-rose-500/50 flex items-center justify-between transition-colors group"
            >
              <div>
                <p className="font-semibold text-white group-hover:text-rose-400 transition-colors">
                  Review Reported Accounts
                </p>
                <p className="text-[11px] text-stone-500">{stats.pendingReports} accounts pending review</p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-rose-400 transition-colors" />
            </Link>

            <Link
              href="/admin/users"
              className="p-3 rounded-2xl bg-stone-950/60 border border-stone-800 hover:border-emerald-500/50 flex items-center justify-between transition-colors group"
            >
              <div>
                <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  User Moderation & Verifications
                </p>
                <p className="text-[11px] text-stone-500">{stats.pendingVerifications} verification requests</p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-emerald-400 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
