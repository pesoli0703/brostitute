import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client'
import { Report, VerificationRequest, Profile } from '../supabase/types'
import { SEED_PROFILES } from '../mockData'

export interface AdminStats {
  totalUsers: number
  totalWomen: number
  totalMen: number
  totalMatches: number
  pendingReports: number
  pendingVerifications: number
  activeSubscriptions: number
  totalRevenueUSD: number
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    if (!isSupabaseConfigured()) {
      return {
        totalUsers: 1420,
        totalWomen: 780,
        totalMen: 640,
        totalMatches: 3840,
        pendingReports: 3,
        pendingVerifications: 5,
        activeSubscriptions: 215,
        totalRevenueUSD: 6890
      }
    }

    const supabase = getSupabaseBrowserClient()

    const [
      { count: totalUsers },
      { count: totalWomen },
      { count: totalMen },
      { count: totalMatches },
      { count: pendingReports },
      { count: pendingVerifications },
      { count: activeSubscriptions }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('gender', 'woman'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('gender', 'man'),
      supabase.from('matches').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('verification_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
    ])

    return {
      totalUsers: totalUsers || 0,
      totalWomen: totalWomen || 0,
      totalMen: totalMen || 0,
      totalMatches: totalMatches || 0,
      pendingReports: pendingReports || 0,
      pendingVerifications: pendingVerifications || 0,
      activeSubscriptions: activeSubscriptions || 0,
      totalRevenueUSD: (activeSubscriptions || 0) * 29
    }
  },

  async getReports(): Promise<Report[]> {
    if (!isSupabaseConfigured()) {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('brostitute_reports')
        if (local) return JSON.parse(local)
      }
      return [
        {
          id: 'rep-seed-1',
          reporter_id: 'user-demo-1',
          reported_id: 'user-demo-4',
          reason: 'inappropriate_content',
          details: 'Used offensive slang in messages',
          status: 'pending',
          reviewed_by: null,
          reviewed_at: null,
          admin_notes: null,
          created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          reported: SEED_PROFILES[3]
        }
      ]
    }

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('reports')
      .select('*, reporter:profiles!reporter_id(*), reported:profiles!reported_id(*)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []) as unknown as Report[]
  },

  async moderateUser(userId: string, action: 'ban' | 'suspend' | 'verify' | 'unban'): Promise<void> {
    if (!isSupabaseConfigured()) {
      return
    }

    const supabase = getSupabaseBrowserClient()
    const updates: Partial<Profile> = {}

    if (action === 'ban') {
      updates.is_banned = true
    } else if (action === 'suspend') {
      updates.is_suspended = true
    } else if (action === 'unban') {
      updates.is_banned = false
      updates.is_suspended = false
    } else if (action === 'verify') {
      updates.is_verified = true
      updates.verification_status = 'verified'
    }

    await supabase.from('profiles').update(updates).eq('id', userId)
  },

  async updateReportStatus(reportId: string, status: Report['status'], adminNotes?: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      if (typeof window !== 'undefined') {
        const reports = JSON.parse(localStorage.getItem('brostitute_reports') || '[]')
        const updated = reports.map((r: Report) => r.id === reportId ? { ...r, status, admin_notes: adminNotes || null } : r)
        localStorage.setItem('brostitute_reports', JSON.stringify(updated))
      }
      return
    }

    const supabase = getSupabaseBrowserClient()
    await supabase.from('reports').update({
      status,
      admin_notes: adminNotes,
      reviewed_at: new Date().toISOString()
    }).eq('id', reportId)
  }
}
