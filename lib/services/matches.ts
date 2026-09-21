import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client'
import { Match, Profile, Message } from '../supabase/types'
import { SEED_PROFILES } from '../mockData'
import { profilesService } from './profiles'

export const matchesService = {
  async getMatches(currentUserId: string): Promise<Match[]> {
    if (!isSupabaseConfigured()) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('brostitute_matches')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.length > 0) return parsed
        }

        // Seed with two default matches for demo exploration
        const defaultMatches: Match[] = [
          {
            id: 'match-user-demo-1',
            user1_id: currentUserId,
            user2_id: 'user-demo-1',
            is_active: true,
            last_message_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            partner: SEED_PROFILES[0],
            last_message: {
              id: 'msg-init-1',
              match_id: 'match-user-demo-1',
              sender_id: 'user-demo-1',
              text: 'Hey Sophia! I noticed you love jazz—have you been to the Bogobiri music nights on Thursdays?',
              image_url: null,
              is_read: false,
              created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
            }
          },
          {
            id: 'match-user-demo-2',
            user1_id: currentUserId,
            user2_id: 'user-demo-2',
            is_active: true,
            last_message_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            partner: SEED_PROFILES[1],
            last_message: {
              id: 'msg-init-2',
              match_id: 'match-user-demo-2',
              sender_id: 'user-demo-2',
              text: 'Would love to grab an espresso sometime this week if your schedule allows!',
              image_url: null,
              is_read: true,
              created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
            }
          }
        ]
        localStorage.setItem('brostitute_matches', JSON.stringify(defaultMatches))
        return defaultMatches
      }
      return []
    }

    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase
      .from('matches')
      .select('*, messages(*)')
      .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
      .eq('is_active', true)
      .order('last_message_at', { ascending: false })

    if (error) {
      console.error('Error fetching matches:', error)
      return []
    }

    // Populate partner details for each match
    const enrichedMatches: Match[] = await Promise.all(
      (data || []).map(async (m: any) => {
        const partnerId = m.user1_id === currentUserId ? m.user2_id : m.user1_id
        const partner = await profilesService.getProfile(partnerId)
        const messages = m.messages || []
        const lastMsg = messages.length > 0 ? messages[messages.length - 1] : undefined

        return {
          ...m,
          partner: partner || undefined,
          last_message: lastMsg
        }
      })
    )

    return enrichedMatches
  },

  async getMatchById(matchId: string, currentUserId: string): Promise<Match | null> {
    const matches = await this.getMatches(currentUserId)
    const found = matches.find(m => m.id === matchId)
    return found || null
  },

  async unmatch(matchId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('brostitute_matches')
        if (stored) {
          const list = JSON.parse(stored).filter((m: Match) => m.id !== matchId)
          localStorage.setItem('brostitute_matches', JSON.stringify(list))
        }
      }
      return
    }

    const supabase = getSupabaseBrowserClient()
    await supabase.from('matches').update({ is_active: false }).eq('id', matchId)
  }
}
