export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Gender = 'woman' | 'man' | 'non-binary' | 'other'
export type InterestedIn = 'man' | 'woman' | 'everyone'
export type RelationshipIntention =
  | 'long_term'
  | 'marriage'
  | 'dating'
  | 'casual'
  | 'friendship'
  | 'not_sure'
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'
export type UserRole = 'user' | 'admin' | 'moderator'
export type LikeAction = 'like' | 'pass' | 'superlike'
export type ReportReason =
  | 'inappropriate_content'
  | 'harassment'
  | 'scam_or_fake'
  | 'underage'
  | 'solicitation'
  | 'other'
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed' | 'action_taken'

export interface Profile {
  id: string
  first_name: string
  date_of_birth: string
  gender: Gender
  interested_in: InterestedIn
  city: string
  bio: string | null
  relationship_intention: RelationshipIntention | null
  education: string | null
  occupation: string | null
  lifestyle: {
    drinking?: string
    smoking?: string
    workout?: string
    pets?: string
    diet?: string
    height?: string
  } | null
  avatar_url: string | null
  verification_status: VerificationStatus
  is_verified: boolean
  is_banned: boolean
  is_suspended: boolean
  is_incognito: boolean
  role: UserRole
  daily_likes_count: number
  last_likes_reset_at: string
  last_active_at: string
  created_at: string
  updated_at: string
  photos?: Photo[]
  interests?: Interest[]
}

export interface Photo {
  id: string
  profile_id: string
  url: string
  display_order: number
  is_primary: boolean
  is_moderated: boolean
  created_at: string
}

export interface Interest {
  id: string
  name: string
  category: string
  icon?: string | null
}

export interface Like {
  id: string
  sender_id: string
  receiver_id: string
  action: LikeAction
  created_at: string
}

export interface Match {
  id: string
  user1_id: string
  user2_id: string
  is_active: boolean
  last_message_at: string
  created_at: string
  partner?: Profile
  last_message?: Message
}

export interface Message {
  id: string
  match_id: string
  sender_id: string
  text: string | null
  image_url: string | null
  is_read: boolean
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  reported_id: string
  reason: ReportReason
  details: string | null
  status: ReportStatus
  reviewed_by: string | null
  reviewed_at: string | null
  admin_notes: string | null
  created_at: string
  reporter?: Profile
  reported?: Profile
}

export interface Block {
  id: string
  blocker_id: string
  blocked_id: string
  created_at: string
}

export interface VerificationRequest {
  id: string
  profile_id: string
  selfie_url: string
  pose_prompt: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  profile?: Profile
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string | null
  price_cents: number
  currency: string
  interval: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  features: string[]
  is_active: boolean
  created_at: string
}

export interface Subscription {
  id: string
  profile_id: string
  plan_id: string
  provider: 'paystack' | 'flutterwave' | 'stripe' | 'manual' | 'test'
  provider_reference: string | null
  status: 'active' | 'past_due' | 'cancelled' | 'expired'
  current_period_start: string
  current_period_end: string
  created_at: string
  updated_at: string
  plan?: SubscriptionPlan
}

export interface Notification {
  id: string
  profile_id: string
  type: 'match' | 'message' | 'like' | 'verification' | 'system'
  title: string
  body: string
  data: Record<string, any>
  is_read: boolean
  created_at: string
}

export interface AdminAction {
  id: string
  admin_id: string
  target_profile_id: string | null
  action_type: string
  reason: string | null
  details: Record<string, any>
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string; first_name: string; date_of_birth: string; gender: Gender; city: string }
        Update: Partial<Profile>
      }
      photos: {
        Row: Photo
        Insert: Omit<Photo, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Photo>
      }
      interests: {
        Row: Interest
        Insert: Omit<Interest, 'id'> & { id?: string }
        Update: Partial<Interest>
      }
      profile_interests: {
        Row: { profile_id: string; interest_id: string; created_at: string }
        Insert: { profile_id: string; interest_id: string; created_at?: string }
        Update: Partial<{ profile_id: string; interest_id: string }>
      }
      likes: {
        Row: Like
        Insert: Omit<Like, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Like>
      }
      matches: {
        Row: Match
        Insert: Omit<Match, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Match>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Message>
      }
      reports: {
        Row: Report
        Insert: Omit<Report, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Report>
      }
      blocks: {
        Row: Block
        Insert: Omit<Block, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Block>
      }
      verification_requests: {
        Row: VerificationRequest
        Insert: Omit<VerificationRequest, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<VerificationRequest>
      }
      subscription_plans: {
        Row: SubscriptionPlan
        Insert: SubscriptionPlan
        Update: Partial<SubscriptionPlan>
      }
      subscriptions: {
        Row: Subscription
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Subscription>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Notification>
      }
      admin_actions: {
        Row: AdminAction
        Insert: Omit<AdminAction, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<AdminAction>
      }
    }
  }
}
