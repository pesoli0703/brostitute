'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Flame, MessageCircle, User, ShieldCheck } from 'lucide-react'

export function MobileNavBar() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Discover', href: '/discover', icon: Flame },
    { label: 'Matches', href: '/matches', icon: MessageCircle },
    { label: 'Safety', href: '/safety', icon: ShieldCheck },
    { label: 'Explore', href: '/', icon: Compass },
    { label: 'Profile', href: '/profile', icon: User }
  ]

  // Don't show bottom nav on admin or onboarding pages if needed
  if (pathname.startsWith('/admin') || pathname.startsWith('/onboarding')) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-stone-950/90 backdrop-blur-lg border-t border-stone-800/80 px-2 py-2 pb-safe md:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-rose-500 scale-105 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
