import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client'
import { SubscriptionPlan, Subscription } from '../supabase/types'
import { SEED_PLANS } from '../mockData'

export const FLUTTERWAVE_PAYMENT_LINK = 'https://flutterwave.com/pay/ktogctcjjysj'

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

  async activateSubscription(profileId: string, planId: string, provider: 'flutterwave' | 'paystack', reference?: string): Promise<Subscription> {
    const plans = await this.getPlans()
    const plan = plans.find(p => p.id === planId) || plans[0]

    const newSub: Subscription = {
      id: 'sub-' + Date.now(),
      profile_id: profileId,
      plan_id: plan.id,
      provider,
      provider_reference: reference || `ref_${provider}_${Date.now()}`,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      plan
    }

    if (!isSupabaseConfigured()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('brostitute_user_subscription', JSON.stringify(newSub))
      }
      return newSub
    }

    const supabase = getSupabaseBrowserClient()
    await supabase.from('subscriptions').upsert({
      profile_id: profileId,
      plan_id: plan.id,
      provider,
      provider_reference: newSub.provider_reference,
      status: 'active',
      current_period_start: newSub.current_period_start,
      current_period_end: newSub.current_period_end
    })

    return newSub
  },

  /**
   * Initializes checkout with Flutterwave or Paystack.
   */
  async initializeCheckout(params: InitializePaymentParams): Promise<{ checkoutUrl: string; reference: string }> {
    const plans = await this.getPlans()
    const plan = plans.find(p => p.id === params.planId) || plans[0]

    if (params.provider === 'flutterwave') {
      // Use your live Flutterwave payment link
      const checkoutUrl = FLUTTERWAVE_PAYMENT_LINK
      return {
        checkoutUrl,
        reference: `flw_${Date.now()}`
      }
    }

    // Default or Paystack fallback
    const mockRef = `ref_paystack_${Date.now()}`
    await this.activateSubscription(params.profileId, plan.id, 'paystack', mockRef)

    return {
      checkoutUrl: `/premium?success=true&ref=${mockRef}`,
      reference: mockRef
    }
  }
}
