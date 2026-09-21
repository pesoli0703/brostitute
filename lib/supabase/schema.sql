-- ==============================================================================
-- BROSTITUTE DATING APPLICATION SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Production-Ready PostgreSQL Schema for Supabase
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing tables if re-running (safe order)
DROP TABLE IF EXISTS admin_actions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS verification_requests CASCADE;
DROP TABLE IF EXISTS blocks CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS profile_interests CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ==============================================================================
-- 3. PROFILES TABLE
-- ==============================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('woman', 'man', 'non-binary', 'other')),
    interested_in TEXT DEFAULT 'man' CHECK (interested_in IN ('man', 'woman', 'everyone')),
    city TEXT NOT NULL,
    bio TEXT,
    relationship_intention TEXT CHECK (relationship_intention IN ('long_term', 'marriage', 'dating', 'casual', 'friendship', 'not_sure')),
    education TEXT,
    occupation TEXT,
    lifestyle JSONB DEFAULT '{"drinking": "sometimes", "smoking": "no", "workout": "often", "pets": "dog"}'::jsonb,
    avatar_url TEXT,
    verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    is_suspended BOOLEAN DEFAULT FALSE,
    is_incognito BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    daily_likes_count INT DEFAULT 0,
    last_likes_reset_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for discovery speed
CREATE INDEX idx_profiles_gender ON profiles(gender);
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_banned ON profiles(is_banned);
CREATE INDEX idx_profiles_last_active ON profiles(last_active_at DESC);

-- ==============================================================================
-- 4. PHOTOS TABLE
-- ==============================================================================
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    is_moderated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_profile_id ON photos(profile_id);

-- ==============================================================================
-- 5. INTERESTS & PROFILE_INTERESTS TABLES
-- ==============================================================================
CREATE TABLE interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    icon TEXT
);

CREATE TABLE profile_interests (
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    interest_id UUID NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (profile_id, interest_id)
);

CREATE INDEX idx_profile_interests_pid ON profile_interests(profile_id);

-- ==============================================================================
-- 6. LIKES TABLE (Likes and Passes)
-- ==============================================================================
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('like', 'pass', 'superlike')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_sender_receiver UNIQUE (sender_id, receiver_id),
    CONSTRAINT prevent_self_like CHECK (sender_id <> receiver_id)
);

CREATE INDEX idx_likes_sender ON likes(sender_id);
CREATE INDEX idx_likes_receiver ON likes(receiver_id);
CREATE INDEX idx_likes_action ON likes(action);

-- ==============================================================================
-- 7. MATCHES TABLE
-- ==============================================================================
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_match_pair UNIQUE (user1_id, user2_id),
    CONSTRAINT prevent_self_match CHECK (user1_id <> user2_id)
);

CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);
CREATE INDEX idx_matches_last_msg ON matches(last_message_at DESC);

-- ==============================================================================
-- 8. MESSAGES TABLE
-- ==============================================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    text TEXT,
    image_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_messages_created_at ON messages(created_at ASC);

-- ==============================================================================
-- 9. REPORTS TABLE
-- ==============================================================================
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reported_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL CHECK (reason IN ('inappropriate_content', 'harassment', 'scam_or_fake', 'underage', 'solicitation', 'other')),
    details TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'action_taken')),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_reported_id ON reports(reported_id);

-- ==============================================================================
-- 10. BLOCKS TABLE
-- ==============================================================================
CREATE TABLE blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_block UNIQUE (blocker_id, blocked_id)
);

CREATE INDEX idx_blocks_blocker ON blocks(blocker_id);
CREATE INDEX idx_blocks_blocked ON blocks(blocked_id);

-- ==============================================================================
-- 11. VERIFICATION REQUESTS
-- ==============================================================================
CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    selfie_url TEXT NOT NULL,
    pose_prompt TEXT DEFAULT 'Hold up two fingers to camera',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_verification_profile ON verification_requests(profile_id);

-- ==============================================================================
-- 12. SUBSCRIPTION PLANS & SUBSCRIPTIONS
-- ==============================================================================
CREATE TABLE subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_cents INT NOT NULL,
    currency TEXT DEFAULT 'USD',
    interval TEXT DEFAULT 'monthly' CHECK (interval IN ('weekly', 'monthly', 'quarterly', 'yearly')),
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
    provider TEXT NOT NULL CHECK (provider IN ('paystack', 'flutterwave', 'stripe', 'manual', 'test')),
    provider_reference TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'expired')),
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_profile ON subscriptions(profile_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ==============================================================================
-- 13. NOTIFICATIONS TABLE
-- ==============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('match', 'message', 'like', 'verification', 'system')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_profile ON notifications(profile_id, is_read);

-- ==============================================================================
-- 14. ADMIN ACTIONS AUDIT LOG
-- ==============================================================================
CREATE TABLE admin_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES profiles(id),
    target_profile_id UUID REFERENCES profiles(id),
    action_type TEXT NOT NULL,
    reason TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 15. AUTOMATIC TRIGGERS & FUNCTIONS
-- ==============================================================================

-- A. Auto-create Profile on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    date_of_birth,
    gender,
    interested_in,
    city,
    bio,
    avatar_url,
    role
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'New Member'),
    COALESCE((NEW.raw_user_meta_data->>'date_of_birth')::date, '2000-01-01'::date),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'woman'),
    COALESCE(NEW.raw_user_meta_data->>'interested_in', 'man'),
    COALESCE(NEW.raw_user_meta_data->>'city', 'Lagos'),
    COALESCE(NEW.raw_user_meta_data->>'bio', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- B. Auto Match on Mutual Like
CREATE OR REPLACE FUNCTION public.check_mutual_like()
RETURNS TRIGGER AS $$
DECLARE
    reciprocal_like RECORD;
    u1 UUID;
    u2 UUID;
    new_match_id UUID;
    sender_name TEXT;
    receiver_name TEXT;
BEGIN
    IF NEW.action IN ('like', 'superlike') THEN
        -- Check if receiver has also liked the sender
        SELECT * INTO reciprocal_like
        FROM public.likes
        WHERE sender_id = NEW.receiver_id 
          AND receiver_id = NEW.sender_id
          AND action IN ('like', 'superlike');

        IF FOUND THEN
            -- Deterministic ordering to prevent duplicate reversed rows
            IF NEW.sender_id < NEW.receiver_id THEN
                u1 := NEW.sender_id;
                u2 := NEW.receiver_id;
            ELSE
                u1 := NEW.receiver_id;
                u2 := NEW.sender_id;
            END IF;

            -- Insert match
            INSERT INTO public.matches (user1_id, user2_id, is_active, last_message_at)
            VALUES (u1, u2, true, NOW())
            ON CONFLICT (user1_id, user2_id) DO UPDATE SET is_active = TRUE
            RETURNING id INTO new_match_id;

            -- Get names for notifications
            SELECT first_name INTO sender_name FROM public.profiles WHERE id = NEW.sender_id;
            SELECT first_name INTO receiver_name FROM public.profiles WHERE id = NEW.receiver_id;

            -- Notify sender
            INSERT INTO public.notifications (profile_id, type, title, body, data)
            VALUES (
                NEW.sender_id,
                'match',
                'It''s a Match! 🎉',
                'You and ' || COALESCE(receiver_name, 'someone') || ' liked each other!',
                jsonb_build_object('match_id', new_match_id, 'partner_id', NEW.receiver_id)
            );

            -- Notify receiver
            INSERT INTO public.notifications (profile_id, type, title, body, data)
            VALUES (
                NEW.receiver_id,
                'match',
                'It''s a Match! 🎉',
                'You and ' || COALESCE(sender_name, 'someone') || ' liked each other!',
                jsonb_build_object('match_id', new_match_id, 'partner_id', NEW.sender_id)
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_mutual_like ON public.likes;
CREATE TRIGGER trigger_mutual_like
  AFTER INSERT OR UPDATE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.check_mutual_like();

-- C. Update match last_message_at on new message
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.matches
    SET last_message_at = NEW.created_at
    WHERE id = NEW.match_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_new_message ON public.messages;
CREATE TRIGGER trigger_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_message();

-- ==============================================================================
-- 16. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- PROFILES Policies
CREATE POLICY "Public profiles can be viewed by authenticated users"
ON profiles FOR SELECT
TO authenticated
USING (
  is_banned = FALSE 
  AND (is_incognito = FALSE OR id = auth.uid() OR is_admin())
  AND NOT EXISTS (
    SELECT 1 FROM blocks 
    WHERE (blocker_id = auth.uid() AND blocked_id = profiles.id)
       OR (blocker_id = profiles.id AND blocked_id = auth.uid())
  )
);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid() OR is_admin())
WITH CHECK (id = auth.uid() OR is_admin());

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid() OR is_admin());

-- PHOTOS Policies
CREATE POLICY "Photos viewable by authenticated users"
ON photos FOR SELECT
TO authenticated
USING (is_moderated = TRUE OR profile_id = auth.uid() OR is_admin());

CREATE POLICY "Users can manage their own photos"
ON photos FOR ALL
TO authenticated
USING (profile_id = auth.uid() OR is_admin())
WITH CHECK (profile_id = auth.uid() OR is_admin());

-- INTERESTS Policies
CREATE POLICY "Interests viewable by all authenticated users"
ON interests FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Profile interests viewable by authenticated users"
ON profile_interests FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can manage their own profile interests"
ON profile_interests FOR ALL
TO authenticated
USING (profile_id = auth.uid() OR is_admin())
WITH CHECK (profile_id = auth.uid() OR is_admin());

-- LIKES Policies
CREATE POLICY "Users can insert their own likes"
ON likes FOR INSERT
TO authenticated
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can view likes they sent"
ON likes FOR SELECT
TO authenticated
USING (sender_id = auth.uid() OR is_admin());

-- MATCHES Policies
CREATE POLICY "Users can view their own matches"
ON matches FOR SELECT
TO authenticated
USING (
  (user1_id = auth.uid() OR user2_id = auth.uid() OR is_admin())
  AND is_active = TRUE
);

CREATE POLICY "Users can update their own matches (e.g. unmatch)"
ON matches FOR UPDATE
TO authenticated
USING (user1_id = auth.uid() OR user2_id = auth.uid() OR is_admin());

-- MESSAGES Policies
CREATE POLICY "Match participants can view messages"
ON messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM matches m
    WHERE m.id = messages.match_id
      AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
  ) OR is_admin()
);

CREATE POLICY "Match participants can insert messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM matches m
    WHERE m.id = match_id
      AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
      AND m.is_active = TRUE
  )
);

CREATE POLICY "Users can mark messages as read"
ON messages FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM matches m
    WHERE m.id = messages.match_id
      AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
  )
);

-- REPORTS Policies
CREATE POLICY "Users can submit reports"
ON reports FOR INSERT
TO authenticated
WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Only admins can view and update reports"
ON reports FOR ALL
TO authenticated
USING (is_admin());

-- BLOCKS Policies
CREATE POLICY "Users can view and manage their block list"
ON blocks FOR ALL
TO authenticated
USING (blocker_id = auth.uid() OR is_admin())
WITH CHECK (blocker_id = auth.uid());

-- VERIFICATION REQUESTS Policies
CREATE POLICY "Users can view and submit their own verification requests"
ON verification_requests FOR SELECT
TO authenticated
USING (profile_id = auth.uid() OR is_admin());

CREATE POLICY "Users can insert verification request"
ON verification_requests FOR INSERT
TO authenticated
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Admins can update verification requests"
ON verification_requests FOR UPDATE
TO authenticated
USING (is_admin());

-- SUBSCRIPTION PLANS Policies
CREATE POLICY "Plans viewable by everyone"
ON subscription_plans FOR SELECT
TO authenticated, anon
USING (is_active = TRUE OR is_admin());

-- SUBSCRIPTIONS Policies
CREATE POLICY "Users can view their own subscriptions"
ON subscriptions FOR SELECT
TO authenticated
USING (profile_id = auth.uid() OR is_admin());

-- NOTIFICATIONS Policies
CREATE POLICY "Users can view and manage their own notifications"
ON notifications FOR ALL
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

-- ADMIN ACTIONS Policies
CREATE POLICY "Only admins can view and write admin actions"
ON admin_actions FOR ALL
TO authenticated
USING (is_admin());

-- ==============================================================================
-- 17. SEED DATA (Interests & Subscription Plans)
-- ==============================================================================
INSERT INTO interests (name, category, icon) VALUES
('Travel & Exploration', 'Lifestyle', 'Compass'),
('Fitness & Gym', 'Health', 'Dumbbell'),
('Coffee Enthusiast', 'Food & Drink', 'Coffee'),
('Art & Design', 'Creative', 'Palette'),
('Tech & Startups', 'Career', 'Cpu'),
('Reading & Books', 'Intellectual', 'BookOpen'),
('Fine Dining & Foodie', 'Food & Drink', 'Utensils'),
('Live Music & Concerts', 'Entertainment', 'Music'),
('Hiking & Nature', 'Outdoors', 'Mountain'),
('Wine & Cocktails', 'Food & Drink', 'Wine'),
('Photography', 'Creative', 'Camera'),
('Dog Lover', 'Pets', 'Dog'),
('Cat Lover', 'Pets', 'Cat'),
('Cooking & Baking', 'Lifestyle', 'ChefHat'),
('Fashion & Style', 'Creative', 'Sparkles'),
('Cinema & Film', 'Entertainment', 'Film'),
('Gaming', 'Entertainment', 'Gamepad2'),
('Yoga & Mindfulness', 'Health', 'HeartHandshake'),
('Podcasts & Philosophy', 'Intellectual', 'Headphones'),
('Entrepreneurship', 'Career', 'TrendingUp')
ON CONFLICT (name) DO NOTHING;

INSERT INTO subscription_plans (id, name, description, price_cents, currency, interval, features) VALUES
(
  'plan_gold_monthly',
  'Brostitute Gold',
  'Designed for serious singles seeking intentional romance',
  2499,
  'USD',
  'monthly',
  '["Unlimited daily likes", "See who liked you first", "5 priority profile boosts / month", "Advanced filters (lifestyle, intentions)", "Read receipts in chat", "Incognito browsing mode"]'::jsonb
),
(
  'plan_platinum_monthly',
  'Brostitute Platinum',
  'The elite dating experience with personalized AI compatibility',
  4999,
  'USD',
  'monthly',
  '["Everything in Gold", "AI-powered compatibility reports", "AI conversation starters & icebreakers", "Instant priority matching queue", "Direct message before matching (2/day)", "Dedicated concierge verification"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Enable Realtime for Messages & Notifications
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
