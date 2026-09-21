import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client'
import { Message } from '../supabase/types'

// In-memory message store for local/preview mode
const localMessagesStore: Record<string, Message[]> = {
  'match-user-demo-1': [
    {
      id: 'm1',
      match_id: 'match-user-demo-1',
      sender_id: 'user-demo-1',
      text: 'Hey Sophia! I noticed you love jazz—have you been to the Bogobiri music nights on Thursdays?',
      image_url: null,
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      id: 'm2',
      match_id: 'match-user-demo-1',
      sender_id: 'local-user-id',
      text: 'Hi Marcus! Yes, Bogobiri is one of my favorite spots in Ikoyi! The live acoustics there are magical.',
      image_url: null,
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString()
    },
    {
      id: 'm3',
      match_id: 'match-user-demo-1',
      sender_id: 'user-demo-1',
      text: 'That is awesome. I am planning on stopping by this Thursday. Would love to buy you an espresso or glass of wine there if you are free!',
      image_url: null,
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
    }
  ]
}

export const chatService = {
  async getMessages(matchId: string): Promise<Message[]> {
    if (!isSupabaseConfigured()) {
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem(`brostitute_chat_${matchId}`)
        if (stored) return JSON.parse(stored)
      }
      return localMessagesStore[matchId] || []
    }

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching chat messages:', error)
      return []
    }

    return (data || []) as Message[]
  },

  async sendMessage(params: {
    matchId: string
    senderId: string
    text?: string
    imageUrl?: string
  }): Promise<Message> {
    const trimmed = params.text?.trim()
    if (!trimmed && !params.imageUrl) {
      throw new Error('Message cannot be empty')
    }

    // Anti-spam check: prevent messages longer than 2,000 characters
    if (trimmed && trimmed.length > 2000) {
      throw new Error('Message exceeds maximum length')
    }

    if (!isSupabaseConfigured()) {
      const newMsg: Message = {
        id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        match_id: params.matchId,
        sender_id: params.senderId,
        text: trimmed || null,
        image_url: params.imageUrl || null,
        is_read: false,
        created_at: new Date().toISOString()
      }

      if (!localMessagesStore[params.matchId]) {
        localMessagesStore[params.matchId] = []
      }
      localMessagesStore[params.matchId].push(newMsg)

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          `brostitute_chat_${params.matchId}`,
          JSON.stringify(localMessagesStore[params.matchId])
        )
      }

      return newMsg
    }

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('messages')
      .insert({
        match_id: params.matchId,
        sender_id: params.senderId,
        text: trimmed || null,
        image_url: params.imageUrl || null,
        is_read: false
      })
      .select()
      .single()

    if (error) throw error

    // Update match timestamp
    await supabase.from('matches').update({ last_message_at: new Date().toISOString() }).eq('id', params.matchId)

    return data as Message
  },

  subscribeToMessages(matchId: string, onMessage: (msg: Message) => void) {
    if (!isSupabaseConfigured()) {
      // Return dummy unsubscribe
      return () => {}
    }

    const supabase = getSupabaseBrowserClient()
    const channel = supabase
      .channel(`chat_${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`
        },
        (payload: any) => {
          onMessage(payload.new as Message)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },

  async markAsRead(matchId: string, currentUserId: string): Promise<void> {
    if (!isSupabaseConfigured()) return

    const supabase = getSupabaseBrowserClient()
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('match_id', matchId)
      .neq('sender_id', currentUserId)
  }
}
