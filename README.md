# Dgroup App

A discipleship group management app built for CCF (Christ's Commission Fellowship). More than just a chat group — it's about spiritual growth, accountability, and meeting consistency.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Runtime:** Bun
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Database:** PostgreSQL + Prisma ORM 7
- **Auth:** Custom credentials (bcryptjs + jose JWT + HttpOnly cookies)
- **Validation:** Zod + React Hook Form

## Getting Started

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Lint
bun run lint
```

## Project Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # App shell (auth + state management + routing)
├── globals.css             # Global styles + Tailwind config
├── signup/
│   └── page.tsx            # Signup form
└── api/auth/
    ├── signup/route.ts     # POST: register new user
    ├── signin/route.ts     # POST: authenticate user
    ├── me/route.ts         # GET: current session user
    └── signout/route.ts    # POST: clear session
components/
├── ui/                     # Reusable UI primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── avatar.tsx
│   ├── chip.tsx
│   └── toast.tsx
├── features/               # Feature-specific components
│   └── meeting-assistant.tsx   # 4Ws Meeting Mode
├── layout/                 # Layout components
│   └── nav-bar.tsx
└── views/                  # Page-level views
    ├── auth-view.tsx
    ├── home-view.tsx
    ├── discover-view.tsx
    ├── create-group-view.tsx
    └── group-detail-view.tsx
lib/
├── auth.ts                 # JWT sign/verify + cookie helpers
├── db.ts                   # Prisma client singleton
├── mock-data.ts            # Mock data (to be replaced with real API)
├── hooks/
│   └── use-auth.ts         # useAuth() hook
└── validations/
    └── auth.ts             # Zod schemas (signin, signup)
prisma/
└── schema.prisma           # Database schema
types/
└── index.ts                # TypeScript definitions & interfaces
middleware.ts               # API route protection
```

## User Roles

| Role | Permissions |
|------|------------|
| **Member** | Chat, post prayer requests, view resources |
| **Apprentice** | Co-leader, assists the leader |
| **Leader** | Remove members, edit group settings, mark attendance, promote apprentices |
| **Admin** | CCF Pastors/Staff who oversee multiple Dgroups |

---

## Development Roadmap

### Phase 1: Foundation
- [x] Project setup (Next.js + Bun + TypeScript + Tailwind)
- [x] TypeScript type definitions and interfaces
- [x] UI component library (Button, Card, Avatar, Chip, Toast)
- [x] Auth view (Login/Register screen)
- [x] Home dashboard with daily verse card
- [x] Group listing (My Dgroups)
- [x] Discover view (Find a Dgroup)
- [x] Create Dgroup form
- [x] Group detail view with tabs (Feed, Chat, Prayer Wall, Members)
- [x] 4Ws Meeting Assistant (Welcome, Worship, Word, Works)
- [x] Responsive navigation (bottom bar mobile / sidebar desktop)
- [x] Mock data for development

### Phase 2: Authentication & Database
- [x] Set up PostgreSQL database with Prisma ORM (v7)
- [x] Database schema: User model with enums (Gender, LifeStage)
- [x] Custom credential authentication (email/password) with JWT (jose) + HttpOnly cookies
- [x] User registration & profile setup (signup form with Zod validation)
- [x] Satellite selection (CCF Main, Alabang, Eastwood, etc.)
- [x] Life stage selection (Single, Single Professional, Married, Parent)
- [x] Protected API routes & session management (middleware)

### Phase 3: Group Management
- [ ] Create Dgroup (persist to database)
- [ ] Join/Leave group functionality
- [ ] Invite logic with dynamic links (e.g., `dgroup.app/join/xc9-22a`)
- [ ] Approval mode toggle: "Auto-accept via link" vs "Request to Join"
- [ ] QR code generation for invite links
- [ ] Leader tools: remove members, edit group settings
- [ ] Promote member to Apprentice (co-leader)
- [ ] Split Group feature (multiply/clone group for new leader)

### Phase 4: Communication & Content
- [ ] Real-time group chat (Socket.io or Pusher)
- [ ] Post announcements and devotionals
- [ ] Prayer Request Wall with "Prayed" button & notifications
- [ ] Mark prayer requests as "Answered" (Testimony Log)
- [ ] Resource sharing (PDF uploads, links)
- [ ] Video call integration (Zoom/Google Meet link)

### Phase 5: Meeting & Attendance
- [ ] Start Meeting mode with 4Ws flow (persist meeting data)
- [ ] Icebreaker question generator (Welcome step)
- [ ] YouTube/Spotify embed for worship songs (Worship step)
- [ ] CCF Sunday Chronicle auto-fetch via PDF parser (Word step)
- [ ] Prayer points & outreach checklist (Works step)
- [ ] Automated attendance tracking
- [ ] Retention flags: notify leader if member absent 3+ weeks

### Phase 6: Discovery & Search
- [ ] Smart search with filters
- [ ] Filter by location (GPS radius or satellite)
- [ ] Filter by schedule (Weekday Evenings, Saturday Mornings)
- [ ] Filter by demographic (Singles, Couples, Parents, Men/Women)
- [ ] Map view for nearby Dgroups
- [ ] Public vs Private group visibility

### Phase 7: Polish & Launch
- [ ] Daily devotion integration (Bible verse API or Bible tracker)
- [ ] Push notifications
- [ ] Admin dashboard for pastors/staff (oversee multiple Dgroups)
- [ ] Performance optimization & SEO
- [ ] PWA support (installable on mobile)
- [ ] Deployment (Vercel)
