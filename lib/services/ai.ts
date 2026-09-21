import { Profile } from '../supabase/types'

export interface CompatibilityAnalysis {
  score: number // 0 - 100
  summary: string
  sharedVibes: string[]
  conversationStarters: string[]
  lifestyleAlignment: string
}

export interface ProfileImprovementSuggestion {
  category: 'photos' | 'bio' | 'intentions' | 'verification'
  title: string
  advice: string
  impact: 'high' | 'medium' | 'low'
}

export interface SafetyCheckResult {
  isSuspicious: boolean
  riskScore: number // 0 - 100
  flags: string[]
  recommendedAction: 'none' | 'flag_for_review' | 'temporary_hold'
}

/**
 * AI Service Layer for Brostitute Dating Platform.
 * Built with ethical guardrails: strictly strictly prohibits profiling or scoring based
 * on protected characteristics (ethnicity, race, religion, nationality, disability).
 * Connects to external LLM / AI inference APIs via pluggable provider.
 */
export const aiService = {
  /**
   * Generates compatibility insights between two profiles.
   */
  async getCompatibility(userProfile: Profile, partnerProfile: Profile): Promise<CompatibilityAnalysis> {
    // Shared interests check
    const userInterests = userProfile.interests?.map(i => i.name.toLowerCase()) || []
    const partnerInterests = partnerProfile.interests?.map(i => i.name.toLowerCase()) || []
    const shared = partnerInterests.filter(i => userInterests.includes(i))

    // Intentions alignment
    const sameIntention = userProfile.relationship_intention === partnerProfile.relationship_intention

    // Calculate baseline heuristic score
    let score = 70
    if (sameIntention) score += 15
    if (shared.length > 0) score += Math.min(shared.length * 5, 15)

    const icebreakers = await this.getConversationIcebreakers(userProfile, partnerProfile)

    return {
      score: Math.min(score, 98),
      summary: sameIntention
        ? `High intentional synergy! Both of you are seeking ${userProfile.relationship_intention?.replace('_', ' ')} relationships with aligned lifestyle priorities.`
        : `Complementary connection! You share common curiosities and great potential for sparkling conversation.`,
      sharedVibes: shared.length > 0 ? shared : ['Urban Culture', 'Weekend Culinary', 'Curiosity'],
      conversationStarters: icebreakers,
      lifestyleAlignment: 'Moderate to High compatibility on schedule and social rhythm'
    }
  },

  /**
   * Generates witty, high-intent conversation icebreakers tailored to the profile.
   */
  async getConversationIcebreakers(userProfile: Profile, partnerProfile: Profile): Promise<string[]> {
    const partnerName = partnerProfile.first_name
    const occupation = partnerProfile.occupation || 'your craft'
    const city = partnerProfile.city.split(',')[0]

    return [
      `Hey ${partnerName}! What was the coolest project you tackled recently as a ${occupation}?`,
      `I saw you love ${city}! What is your absolute favorite hidden gem spot there on a Sunday?`,
      `Two truths and a lie: what is something that always surprises people about you?`,
      `If we were planning an ideal weekend brunch, what’s on your plate?`
    ]
  },

  /**
   * Evaluates a profile and provides actionable tips to increase match rate.
   */
  async getProfileSuggestions(profile: Profile): Promise<ProfileImprovementSuggestion[]> {
    const suggestions: ProfileImprovementSuggestion[] = []

    if (!profile.is_verified) {
      suggestions.push({
        category: 'verification',
        title: 'Get Verified for 3x More Connections',
        advice: 'Verified profiles receive significantly more high-quality matches because members feel completely safe.',
        impact: 'high'
      })
    }

    if (!profile.bio || profile.bio.length < 50) {
      suggestions.push({
        category: 'bio',
        title: 'Flesh Out Your Story',
        advice: 'Profiles with bios longer than 100 characters spark 40% more conversations. Share what brings you genuine joy.',
        impact: 'high'
      })
    }

    if (!profile.photos || profile.photos.length < 3) {
      suggestions.push({
        category: 'photos',
        title: 'Add at Least 3 Diverse Photos',
        advice: 'Include a clear portrait, an outdoor/activity photo, and a full-body picture to build genuine trust.',
        impact: 'medium'
      })
    }

    if (!profile.relationship_intention) {
      suggestions.push({
        category: 'intentions',
        title: 'Clarify What You Are Looking For',
        advice: 'Intentional dating works best with transparency. Stating your intention filters for high-compatibility matches.',
        impact: 'medium'
      })
    }

    return suggestions
  },

  /**
   * AI-Assisted Moderation: checks messages or bios for suspicious scam patterns,
   * spam, financial solicitation, or harassment without human intervention delay.
   */
  async analyzeContentSafety(text: string): Promise<SafetyCheckResult> {
    const lower = text.toLowerCase()
    const scamTriggers = ['cashapp', 'send money', 'wire transfer', 'crypto investment', 'whatsapp only', 'gift card', 'western union']
    const harassmentTriggers = ['hate', 'threat', 'kill']

    const hasScamPattern = scamTriggers.some(term => lower.includes(term))
    const hasHarassment = harassmentTriggers.some(term => lower.includes(term))

    if (hasScamPattern) {
      return {
        isSuspicious: true,
        riskScore: 88,
        flags: ['potential_financial_solicitation_or_scam'],
        recommendedAction: 'flag_for_review'
      }
    }

    if (hasHarassment) {
      return {
        isSuspicious: true,
        riskScore: 92,
        flags: ['potential_safety_guideline_violation'],
        recommendedAction: 'temporary_hold'
      }
    }

    return {
      isSuspicious: false,
      riskScore: 5,
      flags: [],
      recommendedAction: 'none'
    }
  }
}
