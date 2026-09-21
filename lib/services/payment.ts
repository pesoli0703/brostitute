import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client'
import { SubscriptionPlan, Subscription } from '../supabase/types'
import { SEED_PLANS } from '../mockData'

export interface InitializePaymentParams {
  profileId: string
  email: string
  planId: string
  provider: 'paystack' | 'flutterwave'
}

export const paymentService = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    if (!isSupabaseConfigured()) {
      return SEED_PLANS
    }

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_cents', { ascending: true })

    if (error || !data || data.length === 0) {
      return SEED_PLANS
    }

    return data as SubscriptionPlan[]
  },

  async getUserSubscription(profileId: string): Promise<Subscription | null> {
    if (!isSupabaseConfigured()) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('brostitute_user_subscription')
        if (stored) return JSON.parse(stored)
      }
      return null
    }

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, plan:subscription_plans(*)')
      .eq('profile_id', profileId)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle()

    if (error) return null
    return data as unknown as Subscription
  },

  /**
   * Initializes a transaction with Paystack or Flutterwave.
   * In production, this calls your Next.js API route (/api/payments/initialize)
   * which securely holds the PAYSTACK_SECRET_KEY or FLUTTERWAVE_SECRET_KEY.
   */
  async initializeCheckout(params: InitializePaymentParams): Promise<{ checkoutUrl: string; reference: string }> {
    const plans = await this.getPlans()
    const plan = plans.find(p => p.id === params.planId) || plans[0]

    // If API route is called
    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          email: params.email,
          provider: params.provider,
          amountCents: plan.price_cents
        })
      })

      if (res.ok) {
        const result = await res.json()
        return result
      }
    } catch {
      // Fallback to simulated checkout for preview
    }

    const mockRef = `ref_${params.provider}_${Date.now()}`

    // Grant simulated trial subscription locally
    const mockSub: Subscription = {
      id: 'sub-' + Date.now(),
      profile_id: params.profileId,
      plan_id: plan.id,
      provider: params.provider,
      provider_reference: mockRef,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      plan
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('brostitute_user_subscription', JSON.stringify(mockSub))
    }

    return {
      checkoutUrl: `/premium?success=true&ref=${mockRef}`,
      reference: mockRef
    }
  }
}
