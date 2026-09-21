'use client'

import React, { useState } from 'react'
import { X, SlidersHorizontal, Check, RefreshCw } from 'lucide-react'
import { DiscoveryFilters } from '@/lib/services/discovery'
import { SEED_INTERESTS } from '@/lib/mockData'

interface FilterModalProps {
  initialFilters: DiscoveryFilters
  onApply: (filters: DiscoveryFilters) => void
  onClose: () => void
}

export const CITIES = [
  'All',
  'Victoria Island, Lagos',
  'Ikoyi, Lagos',
  'Lekki Phase 1, Lagos',
  'Ikeja, Lagos',
  'Abuja',
  'Port Harcourt'
]

export function FilterModal({ initialFilters, onApply, onClose }: FilterModalProps) {
  const [minAge, setMinAge] = useState(initialFilters.minAge || 21)
  const [maxAge, setMaxAge] = useState(initialFilters.maxAge || 45)
  const [city, setCity] = useState(initialFilters.city || 'All')
  const [intention, setIntention] = useState(initialFilters.relationshipIntention || 'all')
  const [verifiedOnly, setVerifiedOnly] = useState(initialFilters.verifiedOnly || false)

  const handleReset = () => {
    setMinAge(21)
    setMaxAge(45)
    setCity('All')
    setIntention('all')
    setVerifiedOnly(false)
  }

  const handleSave = () => {
    onApply({
      minAge,
      maxAge,
      city,
      relationshipIntention: intention,
      verifiedOnly
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-base text-white">Discovery Filters</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Age Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Age Range
              </label>
              <span className="text-xs font-bold text-rose-400">
                {minAge} — {maxAge} years old
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="18"
                max="65"
                value={minAge}
                onChange={e => setMinAge(Math.min(Number(e.target.value), maxAge - 1))}
                className="w-full accent-rose-500 bg-stone-950 rounded-lg h-2 cursor-pointer"
              />
              <input
                type="range"
                min="18"
                max="65"
                value={maxAge}
                onChange={e => setMaxAge(Math.max(Number(e.target.value), minAge + 1))}
                className="w-full accent-rose-500 bg-stone-950 rounded-lg h-2 cursor-pointer"
              />
            </div>
          </div>

          {/* Location / City */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              City / Region
            </label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            >
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Relationship Intention */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Relationship Intention
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'all', label: 'All Intentions' },
                { id: 'long_term', label: 'Long-term' },
                { id: 'marriage', label: 'Marriage' },
                { id: 'dating', label: 'Dating' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setIntention(opt.id)}
                  className={`py-2.5 px-3 rounded-xl border text-left font-medium transition-all ${
                    intention === opt.id
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Verified Members Only Toggle */}
          <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Verified Profiles Only</p>
              <p className="text-[11px] text-stone-400">Only see members who completed photo ID verification</p>
            </div>
            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                verifiedOnly ? 'bg-rose-600' : 'bg-stone-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  verifiedOnly ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl text-xs text-stone-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white font-semibold text-xs transition-all shadow-md shadow-rose-950"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}
