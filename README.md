# LeadPulse — AI Lead Intelligence Platform

LeadPulse is a full-stack web application that helps sales teams research prospects faster. Enter a company name and LeadPulse generates an AI-powered sales brief — covering what the company does, its estimated size, potential pain points, and suggested conversation starters — so reps can walk into calls prepared without spending 20 minutes on manual research.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Auth | NextAuth.js (Google OAuth) |
| ORM | Prisma 7 |
| Database | PostgreSQL (Neon) |
| AI | OpenAI API (gpt-4o-mini) |
| Styling | Tailwind CSS 4 |
| Deployment | Vercel |

## Features

- **Google OAuth sign-in** with JWT session management
- **AI-generated sales briefs** using OpenAI gpt-4o-mini
- **Full CRUD operations** for lead management
- **Favorite leads** for quick access
- **Middleware-protected routes** — all pages and API endpoints require authentication
- **Optimistic UI updates** — favorites and deletes feel instant
- **Responsive design** — mobile-first layout with adaptive header
- **Skeleton loading states** — smooth perceived performance during data fetches
- **Subtle animations** — staggered card entrance, glassmorphism header, scale-bounce favorites

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) free tier recommended)
- Google Cloud OAuth 2.0 credentials
- OpenAI API key

### Installation

```bash
git clone https://github.com/VardanMalik/leadpulse.git
cd leadpulse
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Fill in each variable:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | [Neon dashboard](https://console.neon.tech) — create a project and copy the connection string |
| `NEXTAUTH_URL` | `http://localhost:3000` for local dev |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` in your terminal |
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com) — APIs & Services → Credentials → Create OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | Same location as above |
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) → API Keys |

> For Google OAuth, add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.

### Database Setup

```bash
npx prisma db push
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Method | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/api/leads` | List all leads for the authenticated user | Yes |
| `POST` | `/api/leads` | Create a new lead | Yes |
| `PATCH` | `/api/leads/:id` | Toggle favorite status on a lead | Yes |
| `DELETE` | `/api/leads/:id` | Delete a lead | Yes |
| `POST` | `/api/leads/analyze` | Generate an AI sales brief for a lead | Yes |
| `GET` | `/api/user/profile` | Get the authenticated user's profile | Yes |
| `*` | `/api/auth/*` | NextAuth.js authentication routes | No |

## Project Structure

```
leadpulse/
├── prisma/
│   └── schema.prisma          # Database schema (User, Lead, Account, Session)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   │   │   ├── leads/route.ts                # GET/POST leads
│   │   │   ├── leads/[id]/route.ts           # PATCH/DELETE lead
│   │   │   ├── leads/analyze/route.ts        # AI brief generation
│   │   │   └── user/profile/route.ts         # User profile
│   │   ├── login/page.tsx     # Login page with Google OAuth
│   │   ├── page.tsx           # Dashboard (main app)
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── globals.css        # Global styles and animations
│   ├── components/
│   │   ├── AddLeadForm.tsx    # Lead creation form
│   │   ├── LeadCard.tsx       # Lead display card
│   │   ├── LoadingSpinner.tsx # Reusable spinner
│   │   ├── SkeletonCard.tsx   # Loading placeholder
│   │   ├── EmptyState.tsx     # Empty dashboard state
│   │   └── providers.tsx      # NextAuth SessionProvider
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config (Google, JWT, Prisma adapter)
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── openai.ts          # OpenAI client and prompt engineering
│   │   └── types.ts           # Shared TypeScript types
│   ├── types/
│   │   └── next-auth.d.ts     # NextAuth type augmentation
│   └── middleware.ts          # Route protection middleware
├── package.json
└── tsconfig.json
```

## Architecture

### Auth Flow

Google OAuth → NextAuth.js → Prisma Adapter persists accounts/users → JWT session strategy → middleware protects all routes except `/login` and `/api/auth/*` → `getAuthSession()` validates API requests server-side.

### API Design

RESTful routes in the Next.js App Router. Every endpoint calls `getAuthSession()` to verify the JWT, then scopes database queries to the authenticated user via Prisma ORM. Ownership checks prevent users from accessing or modifying other users' leads.

### AI Integration

The `/api/leads/analyze` endpoint sends the company name (and optional URL) to OpenAI's gpt-4o-mini with a system prompt tuned for B2B sales intelligence. Responses are capped at 150 words and stored on the lead record for future reference.

### Frontend

React client components with optimistic state updates — favorites toggle and deletes update the UI immediately, rolling back on failure. The dashboard uses a responsive CSS grid (1 → 2 → 3 columns) with staggered fade-in animations, skeleton loading states, and a glassmorphism sticky header.

## Deployment

1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set all environment variables in the Vercel dashboard (Settings → Environment Variables)
4. Update `NEXTAUTH_URL` to your Vercel deployment URL
5. Add `https://your-app.vercel.app/api/auth/callback/google` to your Google OAuth authorized redirect URIs
6. Deploy

## Author

**Vardan Malik**
MS Computer Science, Indiana University Bloomington
[GitHub](https://github.com/VardanMalik)
