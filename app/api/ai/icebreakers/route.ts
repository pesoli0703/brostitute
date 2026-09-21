import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/services/ai'

export async function POST(req: NextRequest) {
  try {
    const { userProfile, partnerProfile } = await req.json()

    if (!userProfile || !partnerProfile) {
      return NextResponse.json({ error: 'Missing profile data' }, { status: 400 })
    }

    const icebreakers = await aiService.getConversationIcebreakers(userProfile, partnerProfile)
    return NextResponse.json({ icebreakers })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
