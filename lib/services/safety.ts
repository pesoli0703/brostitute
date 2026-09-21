import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client'
import { ReportReason, Report } from '../supabase/types'

export const safetyService = {
  async reportProfile(params: {
    reporterId: string
    reportedId: string
    reason: ReportReason
    details?: string
  }): Promise<Report> {
    if (!isSupabaseConfigured()) {
      const mockReport: Report = {
        id: 'rep-' + Date.now(),
        reporter_id: params.reporterId,
        reported_id: params.reportedId,
        reason: params.reason,
        details: params.details || null,
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
        admin_notes: null,
        created_at: new Date().toISOString()
      }

      if (typeof window !== 'undefined') {
        const stored = JSON.parse(localStorage.getItem('brostitute_reports') || '[]')
        stored.push(mockReport)
        localStorage.setItem('brostitute_reports', JSON.stringify(stored))
      }

      return mockReport
    }

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('reports')
      .insert({
        reporter_id: params.reporterId,
        reported_id: params.reportedId,
        reason: params.reason,
        details: params.details || null,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return data as Report
  },

  async blockUser(blockerId: string, blockedId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      if (typeof window !== 'undefined') {
        const blocked = JSON.parse(localStorage.getItem('brostitute_blocked_ids') || '[]')
        if (!blocked.includes(blockedId)) {
          blocked.push(blockedId)
          localStorage.setItem('brostitute_blocked_ids', JSON.stringify(blocked))
        }
      }
      return
    }

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.from('blocks').insert({
      blocker_id: blockerId,
      blocked_id: blockedId
    })

    if (error && !error.message.includes('unique')) {
      throw error
    }
  },

  async requestAccountDeletion(userId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      return
    }

    const supabase = getSupabaseBrowserClient()
    // Soft-ban/deactivate immediately, then queue for purge
    await supabase.from('profiles').update({ is_banned: true, is_incognito: true }).eq('id', userId)
    await supabase.auth.signOut()
  }
}
