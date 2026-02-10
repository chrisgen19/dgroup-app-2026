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
├── join/
│   └── [code]/page.tsx     # Invite link landing page
└── api/
    ├── auth/
    │   ├── signup/route.ts     # POST: register new user
    │   ├── signin/route.ts     # POST: authenticate user
    │   ├── me/route.ts         # GET: current session user
    │   └── signout/route.ts    # POST: clear session
    └── groups/
        ├── route.ts            # POST: create group, GET: list groups
        ├── my-requests/route.ts # GET: pending requests for groups I lead
        ├── [id]/
        │   ├── route.ts        # GET: group detail, PATCH: update settings
        │   ├── join/route.ts   # POST: join or request to join
        │   ├── leave/route.ts  # DELETE: leave group
        │   ├── members/[memberId]/route.ts   # DELETE: remove, PATCH: role
        │   └── join-requests/
        │       ├── route.ts              # GET: pending requests
        │       └── [requestId]/route.ts  # PATCH: approve/reject
        └── invite/[code]/
            ├── route.ts        # GET: invite preview (public)
            └── join/route.ts   # POST: join via invite link
components/
├── ui/                     # Reusable UI primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── avatar.tsx
│   ├── chip.tsx
│   └── toast.tsx
├── features/               # Feature-specific components
│   ├── meeting-assistant.tsx      # 4Ws Meeting Mode
│   ├── invite-qr-modal.tsx        # QR code + copy invite link modal
│   ├── group-settings-panel.tsx   # Edit group settings (Leader only)
│   ├── member-actions-menu.tsx    # Promote/demote/remove dropdown
│   └── join-request-card.tsx      # Approve/reject request card
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
├── api-auth.ts             # Shared API auth helper (getAuthenticatedUser)
├── db.ts                   # Prisma client singleton
├── invite-code.ts          # nanoid-based invite code generator
├── mappers.ts              # API response → frontend type mappers
├── mock-data.ts            # Mock data (Phase 4: chat, posts, prayers)
├── hooks/
│   ├── use-auth.ts              # useAuth() hook
│   ├── use-groups.ts            # useGroups() — CRUD, join/leave
│   ├── use-group-management.ts  # Leader tools per group
│   └── use-join-requests.ts     # Dashboard pending requests
└── validations/
    ├── auth.ts              # Zod schemas (signin, signup)
    └── group.ts             # Zod schemas (createGroup, updateGroup, etc.)
prisma/
└── schema.prisma           # Database schema (User, Group, GroupMember, JoinRequest)
types/
└── index.ts                # TypeScript definitions & interfaces
middleware.ts               # API route protection (+ public invite routes)
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
- [x] Database schema: Group, GroupMember, JoinRequest models with enums
- [x] Create Dgroup (persist to database with invite code generation)
- [x] Join/Leave group functionality (with last-leader protection)
- [x] Invite logic with dynamic links (`/join/[code]` landing page)
- [x] Approval mode toggle: "Auto Accept" vs "Request to Join"
- [x] QR code generation for invite links (qrcode + nanoid)
- [x] Leader tools: remove members, edit group settings
- [x] Promote/demote members (Member, Apprentice, Leader)
- [x] Join request approval/rejection (Leader + Apprentice)
- [x] Dashboard pending requests across all led groups
- [x] Discover view with satellite-based sorting, search, and filters
- [x] Public/Private group visibility
- [ ] Split Group feature (deferred to later phase)

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
