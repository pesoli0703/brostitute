'use client'

import React, { useState, useEffect } from 'react'
import { Crown, Check, Sparkles, Zap, Shield, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react'
import { SubscriptionPlan, Subscription } from '@/lib/supabase/types'
import { paymentService } from '@/lib/services/payment'
import { useAuth } from '@/lib/context/AuthContext'
import { useToast } from '@/lib/context/ToastContext'
import { TopBar } from '@/components/navigation/TopBar'
import { MobileNavBar } from '@/components/navigation/MobileNavBar'

export default function PremiumPage() {
  const { user, profile } = useAuth()
  const { success, error } = useToast()

  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [activeSub, setActiveSub] = useState<Subscription | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_gold_monthly')
  const [provider, setProvider] = useState<'paystack' | 'flutterwave'>('paystack')
  const [loading, setLoading] = useState(false)

  const currentUserId = user?.id || 'local-user-id'

  useEffect(() => {
    async function load() {
      const p = await paymentService.getPlans()
      setPlans(p)
      if (p.length > 0) {
        setSelectedPlanId(p[0].id)
      }
      const sub = await paymentService.getUserSubscription(currentUserId)
      setActiveSub(sub)
    }
    load()
  }, [currentUserId])

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const result = await paymentService.initializeCheckout({
        profileId: currentUserId,
        email: user?.email || 'sophia@example.com',
        planId: selectedPlanId,
        provider
      })

      success('Membership Activated! 🎉', `Welcome to Brostitute Premium (${provider.toUpperCase()}). All VIP features are now unlocked!`)
      // Refresh active sub
      const sub = await paymentService.getUserSubscription(currentUserId)
      setActiveSub(sub)
    } catch (err: any) {
      error('Payment Error', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col pb-24 md:pb-8">
      <TopBar />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-6 space-y-6">
        {/* Hero Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Elevate Your Journey
          </div>
          <h1 className="text-3xl font-black text-white">Upgrade to Premium</h1>
          <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
            Unlock intentional dating advantages designed to help women connect with high-intent matches faster.
          </p>
        </div>

        {/* Active Subscription status card if active */}
        {activeSub && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-200">
                You have an Active {activeSub.plan?.name || 'Premium'} Membership!
              </p>
              <p className="text-[11px] text-stone-400">
                Renews {new Date(activeSub.current_period_end).toLocaleDateString()} via {activeSub.provider.toUpperCase()}
              </p>
            </div>
          </div>
        )}

        {/* Plan Cards */}
        <div className="space-y-3">
          {plans.map(plan => {
            const isSelected = selectedPlanId === plan.id
            const isPlatinum = plan.id.includes('platinum')
            const price = (plan.price_cents / 100).toFixed(2)

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                  isSelected
                    ? isPlatinum
                      ? 'bg-gradient-to-br from-stone-900 via-amber-950/20 to-stone-900 border-amber-500 shadow-xl shadow-amber-950/30'
                      : 'bg-stone-900 border-rose-500 shadow-xl shadow-rose-950/30'
                    : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      {isPlatinum && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                          VIP Tier
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-1">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">${price}</span>
                    <span className="text-xs text-stone-400"> / mo</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800/80 space-y-2">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-stone-300">
                      <Check className={`w-3.5 h-3.5 ${isPlatinum ? 'text-amber-400' : 'text-rose-400'} shrink-0`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Payment Gateway Selector */}
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
            Payment Processor Integration
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setProvider('paystack')}
              className={`p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                provider === 'paystack'
                  ? 'bg-rose-500/20 border-rose-500 text-white shadow-md'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Paystack
            </button>
            <button
              type="button"
              onClick={() => setProvider('flutterwave')}
              className={`p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                provider === 'flutterwave'
                  ? 'bg-rose-500/20 border-rose-500 text-white shadow-md'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Flutterwave
            </button>
          </div>
          <p className="text-[10px] text-stone-500 text-center">
            Encrypted 256-bit SSL transaction. Cancel anytime in your account settings.
          </p>
        </div>

        {/* Checkout CTA */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-950/60 transition-all disabled:opacity-50"
        >
          {loading ? 'Processing Transaction...' : 'Continue to Secure Checkout'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </main>

      <MobileNavBar />
    </div>
  )
}
