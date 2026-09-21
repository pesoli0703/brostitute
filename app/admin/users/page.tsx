'use client'

import React, { useState } from 'react'
import {
  Search,
  BadgeCheck,
  Ban,
  PauseCircle,
  CheckCircle,
  Shield,
  MoreHorizontal
} from 'lucide-react'
import { SEED_PROFILES } from '@/lib/mockData'
import { adminService } from '@/lib/services/admin'
import { useToast } from '@/lib/context/ToastContext'

export default function AdminUsersPage() {
  const { success, error } = useToast()
  const [users, setUsers] = useState(SEED_PROFILES)
  const [search, setSearch] = useState('')

  const handleAction = async (userId: string, action: 'ban' | 'suspend' | 'verify' | 'unban') => {
    try {
      await adminService.moderateUser(userId, action)
      setUsers(prev =>
        prev.map(u => {
          if (u.id === userId) {
            if (action === 'ban') return { ...u, is_banned: true }
            if (action === 'suspend') return { ...u, is_suspended: true }
            if (action === 'verify') return { ...u, is_verified: true, verification_status: 'verified' as const }
            if (action === 'unban') return { ...u, is_banned: false, is_suspended: false }
          }
          return u
        })
      )
      success('User Updated', `Action [${action.toUpperCase()}] executed successfully.`)
    } catch (err: any) {
      error('Action failed', err.message)
    }
  }

  const filtered = users.filter(u => {
    if (!search) return true
    return (
      u.first_name.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase()) ||
      (u.occupation && u.occupation.toLowerCase().includes(search.toLowerCase()))
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">User Directory & Moderation</h1>
          <p className="text-xs text-stone-400 mt-1">
            Search, moderate, grant verification badges, or suspend accounts violating guidelines.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search member by name, city, craft..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-stone-500 outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/60 text-stone-400 border-b border-stone-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Gender & Location</th>
                <th className="py-3 px-4">Intention</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-300">
              {filtered.map(member => (
                <tr key={member.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'}
                        alt={member.first_name}
                        className="w-9 h-9 rounded-xl object-cover border border-stone-700"
                      />
                      <div>
                        <div className="flex items-center gap-1 font-bold text-white">
                          {member.first_name}
                          {member.is_verified && (
                            <BadgeCheck className="w-3.5 h-3.5 text-rose-400 fill-rose-950" />
                          )}
                        </div>
                        <span className="text-[10px] text-stone-500">{member.occupation || 'Member'}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="capitalize">{member.gender}</span> • {member.city.split(',')[0]}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-lg bg-stone-950 border border-stone-800 text-[10px] capitalize">
                      {member.relationship_intention?.replace('_', ' ') || 'None'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {member.is_banned ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800 text-[10px] font-semibold">
                        Banned
                      </span>
                    ) : member.is_suspended ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-semibold">
                        Suspended
                      </span>
                    ) : member.is_verified ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-semibold">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 text-[10px]">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {!member.is_verified && (
                        <button
                          onClick={() => handleAction(member.id, 'verify')}
                          className="p-1.5 hover:bg-stone-800 rounded-lg text-emerald-400"
                          title="Verify Member"
                        >
                          <BadgeCheck className="w-4 h-4" />
                        </button>
                      )}

                      {!member.is_banned ? (
                        <button
                          onClick={() => handleAction(member.id, 'ban')}
                          className="p-1.5 hover:bg-stone-800 rounded-lg text-red-400"
                          title="Ban Member"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction(member.id, 'unban')}
                          className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-[10px]"
                        >
                          Unban
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
