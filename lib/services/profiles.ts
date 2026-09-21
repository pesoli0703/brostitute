import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client'
import { Profile, Photo, Interest, VerificationRequest } from '../supabase/types'
import { SEED_INTERESTS, SEED_PROFILES } from '../mockData'
import { isUUID } from '../utils'

export function calculateAge(dobString: string): number {
  if (!dobString) return 25
  const birthDate = new Date(dobString)
  const today = new Date('2026-09-20')
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return isNaN(age) ? 25 : age
}

export const profilesService = {
  async getProfile(id: string): Promise<Profile | null> {
    if (!isSupabaseConfigured() || !isUUID(id)) {
      if (id === 'local-user-id' || !isUUID(id)) {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('brostitute_local_profile') : null
        if (stored) return JSON.parse(stored)
      }
      const found = SEED_PROFILES.find(p => p.id === id)
      return found || null
    }

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*, photos(*), profile_interests(interests(*))')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) return null
    return data as unknown as Profile
  },

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
    if (!isSupabaseConfigured() || !isUUID(id)) {
      if (typeof window !== 'undefined') {
        const current = localStorage.getItem('brostitute_local_profile')
        const parsed = current ? JSON.parse(current) : {}
        const merged = { ...parsed, ...updates, updated_at: new Date().toISOString() }
        localStorage.setItem('brostitute_local_profile', JSON.stringify(merged))
        return merged
      }
      return updates as Profile
    }

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as unknown as Profile
  },

  async getAllInterests(): Promise<Interest[]> {
    if (!isSupabaseConfigured()) {
      return SEED_INTERESTS
    }

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('interests')
      .select('*')
      .order('category', { ascending: true })

    if (error || !data || data.length === 0) {
      return SEED_INTERESTS
    }
    return data as Interest[]
  },

  async submitVerification(profileId: string, selfieUrl: string): Promise<VerificationRequest> {
    if (!isSupabaseConfigured() || !isUUID(profileId)) {
      const mockReq: VerificationRequest = {
        id: 'vr-' + Date.now(),
        profile_id: profileId,
        selfie_url: selfieUrl,
        pose_prompt: 'Two fingers up beside smiling face',
        status: 'pending',
        admin_notes: null,
        reviewed_by: null,
        reviewed_at: null,
        created_at: new Date().toISOString()
      }
      return mockReq
    }

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('verification_requests')
      .insert({
        profile_id: profileId,
        selfie_url: selfieUrl,
        pose_prompt: 'Two fingers up beside smiling face',
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    // Update status on profile to pending
    await supabase.from('profiles').update({ verification_status: 'pending' }).eq('id', profileId)

    return data as VerificationRequest
  },

  async uploadPhoto(file: File, profileId: string): Promise<string> {
    if (!isSupabaseConfigured() || !isUUID(profileId)) {
      return URL.createObjectURL(file)
    }

    const supabase = getSupabaseBrowserClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${profileId}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('profile_photos')
      .upload(fileName, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('profile_photos').getPublicUrl(fileName)
    return data.publicUrl
  }
}
