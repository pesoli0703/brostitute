import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const paystackSignature = req.headers.get('x-paystack-signature')
    const flutterwaveSignature = req.headers.get('verif-hash')

    const isPaystack = !!paystackSignature
    const isFlutterwave = !!flutterwaveSignature

    const supabase = await getSupabaseServerClient()

    if (isPaystack) {
      const event = body.event
      if (event === 'charge.success') {
        const data = body.data
        const reference = data.reference
        const customerEmail = data.customer?.email
        const planId = data.metadata?.plan_id || 'plan_gold_monthly'

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customerEmail)
          .maybeSingle()

        if (profile) {
          await supabase.from('subscriptions').upsert({
            profile_id: (profile as any).id,
            plan_id: planId,
            provider: 'paystack',
            provider_reference: reference,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
        }
      }
    } else if (isFlutterwave) {
      if (body.status === 'successful') {
        const txRef = body.txRef
        const customerEmail = body.customer?.email

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customerEmail)
          .maybeSingle()

        if (profile) {
          await supabase.from('subscriptions').upsert({
            profile_id: (profile as any).id,
            plan_id: 'plan_gold_monthly',
            provider: 'flutterwave',
            provider_reference: txRef,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
