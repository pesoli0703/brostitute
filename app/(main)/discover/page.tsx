'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { SlidersHorizontal, RefreshCw, Flame, Sparkles } from 'lucide-react'
import { Profile, Match } from '@/lib/supabase/types'
import { discoveryService, DiscoveryFilters } from '@/lib/services/discovery'
import { useAuth } from '@/lib/context/AuthContext'
import { useToast } from '@/lib/context/ToastContext'
import { SwipeCard } from '@/components/discover/SwipeCard'
import { FilterModal } from '@/components/discover/FilterModal'
import { ProfileDetailModal } from '@/components/discover/ProfileDetailModal'
import { MatchModal } from '@/components/discover/MatchModal'
import { ReportModal } from '@/components/safety/ReportModal'
import { BlockModal } from '@/components/safety/BlockModal'
import { TopBar } from '@/components/navigation/TopBar'
import { MobileNavBar } from '@/components/navigation/MobileNavBar'

export default function DiscoverPage() {
  const { user, profile: currentUser } = useAuth()
  const { success, error } = useToast()

  const [deck, setDeck] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<DiscoveryFilters>({
    minAge: 21,
    maxAge: 45,
    city: 'All',
    relationshipIntention: 'all',
    verifiedOnly: false
  })

  const [showFilterModal, setShowFilterModal] = useState(false)
  const [inspectProfile, setInspectProfile] = useState<Profile | null>(null)
  const [activeMatch, setActiveMatch] = useState<{ match: Match; partner: Profile } | null>(null)
  const [reportTarget, setReportTarget] = useState<Profile | null>(null)
  const [blockTarget, setBlockTarget] = useState<Profile | null>(null)

  const currentUserId = user?.id || 'local-user-id'

  const loadProfiles = useCallback(async () => {
    setLoading(true)
    try {
      const list = await discoveryService.getProfiles(currentUserId, filters)
      setDeck(list)
    } catch (err: any) {
      error('Failed to load profiles', err.message)
    } finally {
      setLoading(false)
    }
  }, [currentUserId, filters, error])

  useEffect(() => {
    loadProfiles()
  }, [loadProfiles])

  const handleSwipe = async (action: 'like' | 'pass' | 'superlike') => {
    if (deck.length === 0) return

    const currentTarget = deck[0]
    // Advance deck immediately for snappy UI
    setDeck(prev => prev.slice(1))

    try {
      const res = await discoveryService.recordSwipe(currentUserId, currentTarget.id, action)
      if (res.isMatch && res.partner && res.match) {
        setActiveMatch({
          match: res.match,
          partner: res.partner
        })
      }
    } catch (err: any) {
      console.error('Swipe error:', err)
    }
  }

  const handleResetSession = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('brostitute_swiped_ids')
    }
    loadProfiles()
    success('Deck Refreshed', 'Showing all compatible profiles again.')
  }

  const currentProfile = deck[0]

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col pb-20 md:pb-0">
      <TopBar />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-4 flex flex-col items-center justify-center">
        {/* Top Controls: Title & Filter Trigger */}
        <div className="w-full flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h1 className="text-lg font-bold text-white tracking-tight">Discover</h1>
          </div>

          <button
            onClick={() => setShowFilterModal(true)}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-colors relative"
            title="Filter Preferences"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {(filters.city !== 'All' || filters.verifiedOnly || filters.relationshipIntention !== 'all') && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
            )}
          </button>
        </div>

        {/* Card Deck Area */}
        {loading ? (
          <div className="w-full max-w-sm sm:max-w-md h-[580px] rounded-3xl bg-stone-900/60 border border-stone-800 animate-pulse flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-rose-500 animate-spin" />
            <p className="text-xs text-stone-400 font-medium">Finding compatible matches...</p>
          </div>
        ) : currentProfile ? (
          <div className="w-full flex justify-center">
            <SwipeCard
              profile={currentProfile}
              onLike={() => handleSwipe('like')}
              onPass={() => handleSwipe('pass')}
              onSuperlike={() => handleSwipe('superlike')}
              onOpenDetails={() => setInspectProfile(currentProfile)}
            />
          </div>
        ) : (
          /* Empty Deck State */
          <div className="w-full max-w-sm sm:max-w-md h-[540px] rounded-3xl bg-stone-900 border border-stone-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">You've seen everyone!</h3>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
              No more profiles match your current search filters. Try broadening your age range or resetting your swipes.
            </p>
            <button
              onClick={handleResetSession}
              className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-950 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Reset & See Deck Again
            </button>
          </div>
        )}
      </main>

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal
          initialFilters={filters}
          onApply={newFilters => setFilters(newFilters)}
          onClose={() => setShowFilterModal(false)}
        />
      )}

      {/* Deep Profile Detail Modal */}
      {inspectProfile && (
        <ProfileDetailModal
          profile={inspectProfile}
          onClose={() => setInspectProfile(null)}
          onLike={() => {
            setInspectProfile(null)
            handleSwipe('like')
          }}
          onPass={() => {
            setInspectProfile(null)
            handleSwipe('pass')
          }}
          onReport={() => {
            setReportTarget(inspectProfile)
            setInspectProfile(null)
          }}
          onBlock={() => {
            setBlockTarget(inspectProfile)
            setInspectProfile(null)
          }}
        />
      )}

      {/* "IT'S A MATCH!" Modal */}
      {activeMatch && (
        <MatchModal
          partner={activeMatch.partner}
          matchId={activeMatch.match.id}
          onClose={() => setActiveMatch(null)}
        />
      )}

      {/* Report Modal */}
      {reportTarget && (
        <ReportModal
          reportedUserId={reportTarget.id}
          reportedUserName={reportTarget.first_name}
          onClose={() => setReportTarget(null)}
        />
      )}

      {/* Block Modal */}
      {blockTarget && (
        <BlockModal
          blockedUserId={blockTarget.id}
          blockedUserName={blockTarget.first_name}
          onClose={() => setBlockTarget(null)}
          onBlockedSuccess={() => {
            setDeck(prev => prev.filter(p => p.id !== blockTarget.id))
          }}
        />
      )}

      <MobileNavBar />
    </div>
  )
}
