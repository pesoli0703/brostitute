import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client'
import { Profile, Gender } from '../supabase/types'

export interface SignUpParams {
  email: string
  password: string
  firstName: string
  dateOfBirth: string
  gender: Gender
  city: string
  avatarUrl?: string
}

export const authService = {
  async signUp(params: SignUpParams) {
    if (!isSupabaseConfigured()) {
      const demoUser = {
        id: 'local-user-id',
        email: params.email,
        user_metadata: {
          first_name: params.firstName,
          date_of_birth: params.dateOfBirth,
          gender: params.gender,
          city: params.city
        }
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('brostitute_local_user', JSON.stringify(demoUser))
      }
      return { data: { user: demoUser, session: null }, error: null }
    }

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          first_name: params.firstName,
          date_of_birth: params.dateOfBirth,
          gender: params.gender,
          city: params.city,
          avatar_url: params.avatarUrl || ''
        }
      }
    })

    if (error) throw error

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        first_name: params.firstName,
        date_of_birth: params.dateOfBirth,
        gender: params.gender,
        city: params.city,
        avatar_url: params.avatarUrl || null,
        interested_in: params.gender === 'woman' ? 'man' : 'woman',
        verification_status: 'unverified',
        is_verified: false,
        is_banned: false,
        is_suspended: false,
        is_incognito: false,
        role: 'user'
      })
    }

    return { data, error: null }
  },

  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      const demoUser = {
        id: 'local-user-id',
        email,
        user_metadata: {
          first_name: 'Sophia',
          gender: 'woman',
          city: 'Lagos'
        }
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('brostitute_local_user', JSON.stringify(demoUser))
      }
      return { data: { user: demoUser, session: null }, error: null }
    }

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return { data, error: null }
  },

  async signInWithOAuth(provider: 'google' | 'github') {
    if (!isSupabaseConfigured()) {
      return this.signIn('user@example.com', 'password123')
    }

    const supabase = getSupabaseBrowserClient()
    const redirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : undefined

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo
      }
    })

    if (error) throw error
    return { data, error: null }
  },

  async resetPassword(email: string) {
    if (!isSupabaseConfigured()) {
      return { error: null }
    }

    const supabase = getSupabaseBrowserClient()
    const redirectTo = typeof window !== 'undefined'
      ? `${window.location.origin}/reset-password`
      : undefined

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo
    })

    if (error) throw error
    return { data, error: null }
  },

  async signOut() {
    if (!isSupabaseConfigured()) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('brostitute_local_user')
        localStorage.removeItem('brostitute_local_profile')
      }
      return { error: null }
    }

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  },

  async getCurrentUser() {
    if (!isSupabaseConfigured()) {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('brostitute_local_user')
        return local ? JSON.parse(local) : null
      }
      return null
    }

    const supabase = getSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  async getCurrentProfile(): Promise<Profile | null> {
    if (!isSupabaseConfigured()) {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('brostitute_local_profile')
        if (cached) return JSON.parse(cached)
        const defaultProfile: Profile = {
          id: 'local-user-id',
          first_name: 'Sophia',
          date_of_birth: '1998-06-15',
          gender: 'woman',
          interested_in: 'man',
          city: 'Victoria Island, Lagos',
          bio: 'Curious soul, tech product strategist, lover of jazz & weekend brunches. Seeking an ambitious, kind man who knows what he wants.',
          relationship_intention: 'long_term',
          education: 'MSc Economics & Tech Policy',
          occupation: 'Product Strategist',
          lifestyle: {
            drinking: 'Socially',
            smoking: 'Never',
            workout: '3-4x / week',
            pets: 'Love cats & dogs'
          },
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
          verification_status: 'verified',
          is_verified: true,
          is_banned: false,
          is_suspended: false,
          is_incognito: false,
          role: 'user',
          daily_likes_count: 4,
          last_likes_reset_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        localStorage.setItem('brostitute_local_profile', JSON.stringify(defaultProfile))
        return defaultProfile
      }
      return null
    }

    const supabase = getSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*, photos(*), profile_interests(interests(*))')
      .eq('id', user.id)
      .single()

    if (error || !data) return null
    return data as unknown as Profile
  }
}
