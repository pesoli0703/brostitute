import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client'
import { Profile, LikeAction, Match } from '../supabase/types'
import { SEED_PROFILES } from '../mockData'
import { profilesService, calculateAge } from './profiles'
import { isUUID } from '../utils'

export interface DiscoveryFilters {
  minAge?: number
  maxAge?: number
  city?: string
  relationshipIntention?: string
  verifiedOnly?: boolean
  interests?: string[]
}

export const discoveryService = {
  async getProfiles(currentUserId: string, filters?: DiscoveryFilters): Promise<Profile[]> {
    if (!isSupabaseConfigured() || !isUUID(currentUserId)) {
      let profiles = [...SEED_PROFILES]
      profiles = profiles.filter(p => p.id !== currentUserId)

      if (typeof window !== 'undefined') {
        const swiped = JSON.parse(sessionStorage.getItem('brostitute_swiped_ids') || '[]')
        profiles = profiles.filter(p => !swiped.includes(p.id))
      }

      if (filters?.minAge || filters?.maxAge) {
        profiles = profiles.filter(p => {
          const age = calculateAge(p.date_of_birth)
          if (filters.minAge && age < filters.minAge) return false
          if (filters.maxAge && age > filters.maxAge) return false
          return true
        })
      }

      if (filters?.city && filters.city !== 'All') {
        profiles = profiles.filter(p => p.city.toLowerCase().includes(filters.city!.toLowerCase()))
      }

      if (filters?.relationshipIntention && filters.relationshipIntention !== 'all') {
        profiles = profiles.filter(p => p.relationship_intention === filters.relationshipIntention)
      }

      if (filters?.verifiedOnly) {
        profiles = profiles.filter(p => p.is_verified)
      }

      return profiles
    }

    const supabase = getSupabaseBrowserClient()

    const { data: alreadySwiped } = await supabase
      .from('likes')
      .select('receiver_id')
      .eq('sender_id', currentUserId)

    const swipedIds = ((alreadySwiped || []) as any[]).map(item => item.receiver_id).filter(id => isUUID(id))
    swipedIds.push(currentUserId)

    let query = supabase
      .from('profiles')
      .select('*, photos(*), profile_interests(interests(*))')
      .eq('is_banned', false)
      .eq('is_suspended', false)

    if (swipedIds.length > 0) {
      query = query.not('id', 'in', `(${swipedIds.join(',')})`)
    }

    if (filters?.city && filters.city !== 'All') {
      query = query.ilike('city', `%${filters.city}%`)
    }

    if (filters?.relationshipIntention && filters.relationshipIntention !== 'all') {
      query = query.eq('relationship_intention', filters.relationshipIntention)
    }

    if (filters?.verifiedOnly) {
      query = query.eq('is_verified', true)
    }

    const { data, error } = await query.limit(20)
    if (error || !data || data.length === 0) {
      return SEED_PROFILES.filter(p => p.id !== currentUserId)
    }

    return (data || []) as unknown as Profile[]
  },

  async recordSwipe(
    senderId: string,
    receiverId: string,
    action: LikeAction
  ): Promise<{ isMatch: boolean; match?: Match; partner?: Profile }> {
    if (!isSupabaseConfigured() || !isUUID(senderId) || !isUUID(receiverId)) {
      if (typeof window !== 'undefined') {
        const swiped = JSON.parse(sessionStorage.getItem('brostitute_swiped_ids') || '[]')
        swiped.push(receiverId)
        sessionStorage.setItem('brostitute_swiped_ids', JSON.stringify(swiped))
      }

      if (action === 'like' || action === 'superlike') {
        const partner = SEED_PROFILES.find(p => p.id === receiverId) || SEED_PROFILES[0]
        const mockMatch: Match = {
          id: 'match-' + receiverId,
          user1_id: senderId,
          user2_id: receiverId,
          is_active: true,
          last_message_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          partner
        }

        if (typeof window !== 'undefined') {
          const currentMatches = JSON.parse(localStorage.getItem('brostitute_matches') || '[]')
          if (!currentMatches.find((m: Match) => m.id === mockMatch.id)) {
            currentMatches.unshift(mockMatch)
            localStorage.setItem('brostitute_matches', JSON.stringify(currentMatches))
          }
        }

        return { isMatch: true, match: mockMatch, partner }
      }

      return { isMatch: false }
    }

    const supabase = getSupabaseBrowserClient()

    const { error: likeError } = await supabase.from('likes').insert({
      sender_id: senderId,
      receiver_id: receiverId,
      action
    })

    if (likeError && !likeError.message.includes('unique')) {
      throw likeError
    }

    if (action === 'pass') {
      return { isMatch: false }
    }

    const { data: mutualLike } = await supabase
      .from('likes')
      .select('*')
      .eq('sender_id', receiverId)
      .eq('receiver_id', senderId)
      .in('action', ['like', 'superlike'])
      .maybeSingle()

    if (mutualLike) {
      const { data: matchData } = await supabase
        .from('matches')
        .select('*')
        .or(`and(user1_id.eq.${senderId},user2_id.eq.${receiverId}),and(user1_id.eq.${receiverId},user2_id.eq.${senderId})`)
        .maybeSingle()

      const partner = await profilesService.getProfile(receiverId)

      return {
        isMatch: true,
        match: matchData ? (matchData as Match) : undefined,
        partner: partner || undefined
      }
    }

    return { isMatch: false }
  }
}
