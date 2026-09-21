import { Profile, Interest, SubscriptionPlan } from './supabase/types'

export const SEED_INTERESTS: Interest[] = [
  { id: 'int-1', name: 'Travel & Exploration', category: 'Lifestyle', icon: 'Compass' },
  { id: 'int-2', name: 'Fitness & Gym', category: 'Health', icon: 'Dumbbell' },
  { id: 'int-3', name: 'Coffee Enthusiast', category: 'Food & Drink', icon: 'Coffee' },
  { id: 'int-4', name: 'Art & Design', category: 'Creative', icon: 'Palette' },
  { id: 'int-5', name: 'Tech & Startups', category: 'Career', icon: 'Cpu' },
  { id: 'int-6', name: 'Reading & Books', category: 'Intellectual', icon: 'BookOpen' },
  { id: 'int-7', name: 'Fine Dining', category: 'Food & Drink', icon: 'Utensils' },
  { id: 'int-8', name: 'Live Music', category: 'Entertainment', icon: 'Music' },
  { id: 'int-9', name: 'Hiking & Outdoors', category: 'Outdoors', icon: 'Mountain' },
  { id: 'int-10', name: 'Wine & Cocktails', category: 'Food & Drink', icon: 'Wine' },
  { id: 'int-11', name: 'Photography', category: 'Creative', icon: 'Camera' },
  { id: 'int-12', name: 'Dog Lover', category: 'Pets', icon: 'Dog' },
  { id: 'int-13', name: 'Cooking & Culinary', category: 'Lifestyle', icon: 'ChefHat' },
  { id: 'int-14', name: 'Cinema & Films', category: 'Entertainment', icon: 'Film' },
  { id: 'int-15', name: 'Yoga & Wellness', category: 'Health', icon: 'HeartHandshake' },
  { id: 'int-16', name: 'Architecture', category: 'Creative', icon: 'Building' }
]

export const SEED_PROFILES: Profile[] = [
  {
    id: 'user-demo-1',
    first_name: 'Marcus',
    date_of_birth: '1995-04-12', // 31
    gender: 'man',
    interested_in: 'woman',
    city: 'Victoria Island, Lagos',
    bio: 'Architect by day, amateur chef on weekends. Looking for someone witty who appreciates quiet vinyl evenings, art galleries, and spontaneous weekend road trips.',
    relationship_intention: 'long_term',
    education: 'M.Arch, Columbia University',
    occupation: 'Lead Architect & Designer',
    lifestyle: {
      drinking: 'Socially',
      smoking: 'Never',
      workout: '4-5x / week',
      pets: 'Golden Retriever named Leo',
      height: '6 ft 1 in (185 cm)'
    },
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    verification_status: 'verified',
    is_verified: true,
    is_banned: false,
    is_suspended: false,
    is_incognito: false,
    role: 'user',
    daily_likes_count: 3,
    last_likes_reset_at: new Date().toISOString(),
    last_active_at: new Date().toISOString(),
    created_at: '2026-01-10T12:00:00Z',
    updated_at: '2026-09-18T15:30:00Z',
    photos: [
      {
        id: 'p-1',
        profile_id: 'user-demo-1',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        display_order: 0,
        is_primary: true,
        is_moderated: true,
        created_at: '2026-01-10T12:00:00Z'
      },
      {
        id: 'p-2',
        profile_id: 'user-demo-1',
        url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        display_order: 1,
        is_primary: false,
        is_moderated: true,
        created_at: '2026-01-10T12:00:00Z'
      },
      {
        id: 'p-3',
        profile_id: 'user-demo-1',
        url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
        display_order: 2,
        is_primary: false,
        is_moderated: true,
        created_at: '2026-01-10T12:00:00Z'
      }
    ],
    interests: [
      SEED_INTERESTS[0],
      SEED_INTERESTS[3],
      SEED_INTERESTS[6],
      SEED_INTERESTS[9],
      SEED_INTERESTS[11]
    ]
  },
  {
    id: 'user-demo-2',
    first_name: 'Damilola',
    date_of_birth: '1994-08-23', // 32
    gender: 'man',
    interested_in: 'woman',
    city: 'Ikoyi, Lagos',
    bio: 'Fintech founder passionate about clean tech and deep conversations over espresso. Here for meaningful chemistry and a real partnership built on mutual respect.',
    relationship_intention: 'marriage',
    education: 'MBA, INSEAD',
    occupation: 'Fintech Founder & Angel Investor',
    lifestyle: {
      drinking: 'Rarely',
      smoking: 'Never',
      workout: 'Every morning',
      pets: 'Love dogs',
      height: '6 ft 3 in (190 cm)'
    },
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    verification_status: 'verified',
    is_verified: true,
    is_banned: false,
    is_suspended: false,
    is_incognito: false,
    role: 'user',
    daily_likes_count: 1,
    last_likes_reset_at: new Date().toISOString(),
    last_active_at: new Date().toISOString(),
    created_at: '2026-02-14T10:00:00Z',
    updated_at: '2026-09-19T11:20:00Z',
    photos: [
      {
        id: 'p-4',
        profile_id: 'user-demo-2',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        display_order: 0,
        is_primary: true,
        is_moderated: true,
        created_at: '2026-02-14T10:00:00Z'
      },
      {
        id: 'p-5',
        profile_id: 'user-demo-2',
        url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
        display_order: 1,
        is_primary: false,
        is_moderated: true,
        created_at: '2026-02-14T10:00:00Z'
      }
    ],
    interests: [
      SEED_INTERESTS[1],
      SEED_INTERESTS[2],
      SEED_INTERESTS[4],
      SEED_INTERESTS[5]
    ]
  },
  {
    id: 'user-demo-3',
    first_name: 'Julian',
    date_of_birth: '1997-11-05', // 28
    gender: 'man',
    interested_in: 'woman',
    city: 'Lekki Phase 1, Lagos',
    bio: 'Documentary filmmaker & photographer. Believer in vulnerability, warm honesty, and finding extraordinary beauty in ordinary moments. Tell me your favorite film.',
    relationship_intention: 'dating',
    education: 'Film & Media Studies, NYU',
    occupation: 'Cinematographer & Director',
    lifestyle: {
      drinking: 'Socially',
      smoking: 'Socially',
      workout: 'Cycling & Tennis',
      pets: 'Cat person',
      height: '5 ft 11 in (180 cm)'
    },
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    verification_status: 'verified',
    is_verified: true,
    is_banned: false,
    is_suspended: false,
    is_incognito: false,
    role: 'user',
    daily_likes_count: 5,
    last_likes_reset_at: new Date().toISOString(),
    last_active_at: new Date().toISOString(),
    created_at: '2026-03-01T08:00:00Z',
    updated_at: '2026-09-19T20:00:00Z',
    photos: [
      {
        id: 'p-6',
        profile_id: 'user-demo-3',
        url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
        display_order: 0,
        is_primary: true,
        is_moderated: true,
        created_at: '2026-03-01T08:00:00Z'
      },
      {
        id: 'p-7',
        profile_id: 'user-demo-3',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        display_order: 1,
        is_primary: false,
        is_moderated: true,
        created_at: '2026-03-01T08:00:00Z'
      }
    ],
    interests: [
      SEED_INTERESTS[3],
      SEED_INTERESTS[7],
      SEED_INTERESTS[10],
      SEED_INTERESTS[13]
    ]
  },
  {
    id: 'user-demo-4',
    first_name: 'Tariq',
    date_of_birth: '1993-02-18', // 33
    gender: 'man',
    interested_in: 'woman',
    city: 'Oniru, Lagos',
    bio: 'Pediatric Surgeon. Calm under pressure, goofy around friends. Looking for a smart, emotionally grounded partner to build a joyful, intentional life with.',
    relationship_intention: 'long_term',
    education: 'MBBS, FWACS',
    occupation: 'Consultant Pediatric Surgeon',
    lifestyle: {
      drinking: 'Rarely',
      smoking: 'Never',
      workout: 'Swimming & Running',
      pets: 'None currently',
      height: '6 ft 2 in (188 cm)'
    },
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    verification_status: 'verified',
    is_verified: true,
    is_banned: false,
    is_suspended: false,
    is_incognito: false,
    role: 'user',
    daily_likes_count: 2,
    last_likes_reset_at: new Date().toISOString(),
    last_active_at: new Date().toISOString(),
    created_at: '2026-04-11T14:00:00Z',
    updated_at: '2026-09-20T08:30:00Z',
    photos: [
      {
        id: 'p-8',
        profile_id: 'user-demo-4',
        url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
        display_order: 0,
        is_primary: true,
        is_moderated: true,
        created_at: '2026-04-11T14:00:00Z'
      }
    ],
    interests: [
      SEED_INTERESTS[1],
      SEED_INTERESTS[5],
      SEED_INTERESTS[8],
      SEED_INTERESTS[14]
    ]
  }
]

export const SEED_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_gold_monthly',
    name: 'Brostitute Gold',
    description: 'Designed for serious singles seeking intentional romance',
    price_cents: 2499,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Unlimited daily likes & rewinds',
      'See who liked you first',
      '5 priority profile boosts every month',
      'Advanced filters (intentions, education, lifestyle)',
      'Read receipts in chat',
      'Incognito browsing mode'
    ],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'plan_platinum_monthly',
    name: 'Brostitute Platinum',
    description: 'The elite dating experience with personalized AI compatibility',
    price_cents: 4999,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Everything in Gold membership',
      'AI-powered compatibility deep dives',
      'Smart conversation starters & icebreakers',
      'Instant VIP priority matching queue',
      'Direct message before matching (2 per day)',
      'Dedicated concierge identity verification'
    ],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  }
]
