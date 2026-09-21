'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Profile } from '../supabase/types'
import { authService } from '../services/auth'
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client'

interface AuthContextType {
  user: any | null
  profile: Profile | null
  loading: boolean
  isConfigured: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateLocalProfile: (updates: Partial<Profile>) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isConfigured: false,
  signOut: async () => {},
  refreshProfile: async () => {},
  updateLocalProfile: () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(false)

  const loadSession = useCallback(async () => {
    try {
      const configured = isSupabaseConfigured()
      setIsConfigured(configured)

      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)

      const currentProfile = await authService.getCurrentProfile()
      setProfile(currentProfile)
    } catch (err) {
      console.error('Error loading session:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSession()

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient()
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
        setUser(session?.user || null)
        if (session?.user) {
          const prof = await authService.getCurrentProfile()
          setProfile(prof)
        } else {
          setProfile(null)
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [loadSession])

  const handleSignOut = async () => {
    await authService.signOut()
    setUser(null)
    setProfile(null)
  }

  const handleRefresh = async () => {
    const prof = await authService.getCurrentProfile()
    setProfile(prof)
  }

  const updateLocalProfile = (updates: Partial<Profile>) => {
    if (profile) {
      const updated = { ...profile, ...updates }
      setProfile(updated)
      if (typeof window !== 'undefined') {
        localStorage.setItem('brostitute_local_profile', JSON.stringify(updated))
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isConfigured,
        signOut: handleSignOut,
        refreshProfile: handleRefresh,
        updateLocalProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
