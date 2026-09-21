# Brostitute — Intentional Modern Dating Application & PWA

> **“Meet people who are looking for the same kind of connection.”**

Brostitute is a production-ready, mobile-first dating progressive web application (PWA) designed primarily for women to discover and connect with high-intent men for dating and relationships. It features a modern, dark rose-gold luxury aesthetic, rigorous privacy protections, mutual respect matching, Supabase PostgreSQL with Row Level Security (RLS), and Realtime chat.

---

## 📱 Live Experience & Features

1. **Mobile-First PWA:** Installable on iOS and Android with custom app icons, standalone viewport, and safe-area margins.
2. **Onboarding Flow:** 4-step wizard validating minimum legal age (18+), gender selection, relationship intentions, occupation, education, and interests.
3. **Intentional Discovery Deck:** Tinder/Bumble-style card deck with multi-photo carousel, age & distance privacy protection (no exact GPS coordinates exposed), verified badge indicators, and shared interest tags.
4. **Instant Mutual Matching:** Confetti celebration modal upon mutual like with direct 1-tap route into chat.
5. **Realtime Private Chat:** Powered by Supabase Realtime with anti-spam protections (max 2,000 characters, empty message guard), quick emojis, and read/unread status.
6. **Safety & Trust Hub:**
   - Confidential user reporting (reasons: scams/fakes, harassment, inappropriate imagery, commercial solicitation, underage)
   - 1-click user blocking (instantly hides and excludes profiles bidirectionally)
   - Photo ID verification requests with badge issuance
   - GDPR-compliant JSON Data Export & instant Account Deletion
   - Comprehensive Community Guidelines, Safety Tips, Terms of Service, and Privacy Policy
7. **Role-Based Admin Dashboard:**
   - Platform metrics: Total members, gender distribution, total matches, pending reports, MRR estimate
   - User moderation: Search members, grant verification badges, suspend, or ban accounts
   - Safety reports queue with 1-click ban actions
8. **Premium Subscriptions Architecture:**
   - Stored in PostgreSQL (`subscription_plans`), not hardcoded
   - Ready for Paystack & Flutterwave checkout integration with webhook signature verification
9. **Pluggable AI Service Layer:**
   - Ethical compatibility scoring without profiling protected demographic traits
   - Contextual conversation icebreakers
   - Profile optimization tips & proactive anti-scam pattern detection

---

## 📁 Project Structure

```
brostitute/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx           # Authentication login & preview access
│   │   └── onboarding/page.tsx      # 4-step onboarding & 18+ age verification
│   ├── (main)/
│   │   ├── discover/page.tsx        # Discovery card stack & filters
│   │   ├── matches/page.tsx         # Matches queue & active conversations
│   │   ├── chat/[matchId]/page.tsx  # Supabase Realtime private chat
│   │   ├── profile/page.tsx         # Profile view/edit & verification request
│   │   ├── premium/page.tsx         # Gold & Platinum VIP tiers (Paystack/Flutterwave)
│   │   └── safety/page.tsx          # Safety center, data export & account deletion
│   ├── admin/
│   │   ├── layout.tsx               # Admin guard & navigation bar
│   │   ├── page.tsx                 # Realtime analytics, MRR & platform metrics
│   │   ├── users/page.tsx           # User search & moderation (ban/suspend/verify)
│   │   └── reports/page.tsx         # Trust & safety reports review queue
│   ├── api/
│   │   ├── setup/route.ts           # Interactive Supabase credentials manager
│   │   ├── ai/icebreakers/route.ts  # AI conversation starters endpoint
│   │   ├── ai/compatibility/route.ts# AI compatibility analysis endpoint
│   │   └── payments/webhook/route.ts# Paystack & Flutterwave webhook handler
│   ├── guidelines/page.tsx          # Community guidelines
│   ├── privacy/page.tsx             # Privacy policy (location privacy)
│   ├── safety-tips/page.tsx         # Dating safety tips
│   ├── terms/page.tsx               # Terms of service
│   ├── setup/page.tsx               # Live Supabase connection dashboard
│   ├── globals.css                  # Dark luxury theme & responsive utilities
│   ├── layout.tsx                   # Root layout, PWA metadata & providers
│   └── page.tsx                     # Landing page with hero & how it works
├── components/
│   ├── discover/
│   │   ├── SwipeCard.tsx            # Card swipe component with photo carousel
│   │   ├── FilterModal.tsx          # Age range, city, intention, verified filters
│   │   ├── ProfileDetailModal.tsx   # Detailed modal profile inspection
│   │   └── MatchModal.tsx           # "IT'S A MATCH!" celebration with confetti
│   ├── navigation/
│   │   ├── TopBar.tsx               # Brand header with Supabase live status pill
│   │   └── MobileNavBar.tsx         # Mobile bottom navigation bar
│   └── safety/
│       ├── ReportModal.tsx          # Confidential report modal
│       └── BlockModal.tsx           # User block modal
├── lib/
│   ├── context/
│   │   ├── AuthContext.tsx          # Auth state provider
│   │   └── ToastContext.tsx         # Toast notifications
│   ├── services/
│   │   ├── auth.ts                  # Supabase authentication service
│   │   ├── profiles.ts              # Profile CRUD, photos & verification
│   │   ├── discovery.ts             # Swipe matching engine
│   │   ├── matches.ts               # Matches & unmatching
│   │   ├── chat.ts                  # Realtime messaging service
│   │   ├── safety.ts                # Reports, blocks & account deletion
│   │   ├── admin.ts                 # Admin statistics & moderation
│   │   ├── ai.ts                    # Ethical AI intelligence layer
│   │   └── payment.ts               # Paystack & Flutterwave integration
│   ├── supabase/
│   │   ├── client.ts                # Browser client with fallback safety
│   │   ├── server.ts                # Server client with cookies
│   │   ├── types.ts                 # TypeScript database definitions
│   │   └── schema.sql               # Complete PostgreSQL schema & RLS policies
│   └── mockData.ts                  # Preview fallback data
├── public/
│   ├── icons/                       # PWA icons (192x192, 512x512, SVG)
│   └── manifest.json                # PWA Web App Manifest
├── .env.example                     # Environment template
└── package.json
```

---

## 🗄️ Database Schema & RLS Policies

The entire SQL migration is located in `lib/supabase/schema.sql`.

### Tables Created:
1. `profiles`: User information, age, gender, city, intentions, bio, verified status, ban status, role (`user`, `admin`).
2. `photos`: Multi-photo support with order, primary flag, and moderation status.
3. `interests`: Pre-seeded with 20 lifestyle and creative categories.
4. `profile_interests`: Many-to-many join table between profiles and interests.
5. `likes`: Stores `like` or `pass` with uniqueness constraints and automatic triggers.
6. `matches`: Auto-created on mutual like with `last_message_at` timestamps.
7. `messages`: Realtime-enabled private chat with read receipts.
8. `reports`: Safety reports with reasons, details, and admin resolution states.
9. `blocks`: Bidirectional query exclusion so blocked users cannot see or interact with each other.
10. `verification_requests`: Photo verification submission for admin review.
11. `subscription_plans`: Pricing, intervals, and features (Gold, Platinum).
12. `subscriptions`: Active member billing records.
13. `notifications`: Realtime notifications for matches and messages.
14. `admin_actions`: Audit trail for all moderation actions.

### Automated SQL Triggers:
- `handle_new_user()`: Automatically creates a profile record when a user registers via Supabase Auth.
- `check_mutual_like()`: Triggers upon like insertion; if mutual like exists, automatically creates a match and sends notifications.
- `handle_new_message()`: Automatically updates `last_message_at` on the match table.

---

## 🔑 Environment Variables Required

Create a `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Payment Processors (Optional for production billing)
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-...
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-...

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## 🚀 Supabase Setup Instructions

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com) and create a new project.
2. **Execute Database Migration:**
   - In your Supabase Dashboard, open the **SQL Editor**.
   - Copy the entire contents of `lib/supabase/schema.sql` and click **Run**.
   - This creates all 14 tables, enables Row Level Security (RLS) on each table, configures foreign keys, and adds realtime replication for `messages` and `notifications`.
3. **Configure Storage Bucket:**
   - In Supabase Dashboard → **Storage**, create a public bucket named `profile_photos`.
4. **Copy API Keys:**
   - In Supabase Dashboard → **Project Settings** → **API**, copy the **Project URL** and **anon public key**.
5. **Paste into Brostitute:**
   - Open `/setup` in the web app, paste your URL and key, and click **Save & Connect**. Alternatively, paste them into `.env.local` and restart the server.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The app will be accessible at `http://localhost:3000`.

---

## ☁️ Vercel Deployment Instructions

1. Push your repository to GitHub.
2. Log into [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (if using server-side administrative tasks)
5. Click **Deploy**. Vercel will build and deploy the Next.js application automatically.
6. In Supabase Dashboard → **Authentication** → **URL Configuration**, set the Site URL to your Vercel deployment URL (e.g. `https://brostitute.vercel.app`).
