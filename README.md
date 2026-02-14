# LawMadeSimple

Democratizing Nigerian law by translating legal jargon into plain, easy-to-understand language.

## Features

- **Browse Nigerian Laws** - Access the Constitution, Criminal Code, Labour Act, and more
- **AI-Powered Explanations** - Get plain-language explanations of legal provisions using GPT-4
- **Scenario-Based Discovery** - Find relevant laws by describing your situation
- **Smart Search** - Search using everyday language with semantic + keyword hybrid search
- **Bookmarks** - Save sections for later reference
- **Mobile-Responsive** - Works seamlessly on all devices

## Tech Stack

- **Frontend:** Next.js 14+, React 18, Tailwind CSS 4, shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL) with pgvector for semantic search
- **ORM:** Prisma
- **Auth:** Supabase Auth (Google, Apple, Facebook OAuth + Email/Password)
- **AI:** OpenAI GPT-4o-mini + text-embedding-3-small
- **Cache/Rate Limiting:** Upstash Redis
- **Monitoring:** Sentry
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase account
- OpenAI API key
- Upstash Redis account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/lawmadesimple.git
cd lawmadesimple
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Fill in all required variables in `.env.local`

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Enable pgvector extension in Supabase SQL Editor:
```sql
create extension if not exists vector;
```

3. Push the schema and seed data:
```bash
npm run db:push
npm run db:seed
```

4. Generate embeddings for semantic search:
```bash
DOTENV_CONFIG_PATH=.env.local npx tsx -r dotenv/config scripts/backfill-embeddings.ts
```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Commands

```bash
# Development
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Lint code
npm run lint:fix     # Auto-fix lint issues
npm run typecheck    # TypeScript check
npm run format       # Format with Prettier
npm run format:check # Check formatting

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests (Playwright)

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio (GUI)
```

## Project Structure

```
src/
├── app/                  # App Router pages & API routes
│   ├── api/v1/          # API endpoints
│   ├── (auth)/          # Auth pages (sign-in, sign-up)
│   ├── (protected)/     # Protected pages (settings, saved)
│   └── ...              # Public pages
├── components/
│   ├── ui/              # Base components (shadcn)
│   ├── auth/            # Auth components
│   ├── features/        # Feature components
│   └── layout/          # Layout components
├── services/            # Business logic
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, clients
├── types/               # TypeScript types
└── constants/           # Configuration
```

## API Endpoints

| Endpoint | Methods | Auth | Description |
|----------|---------|------|-------------|
| `/api/v1/laws` | GET | Optional | List all laws |
| `/api/v1/laws/[lawSlug]` | GET | Optional | Get law details |
| `/api/v1/scenarios` | GET | Optional | List scenarios |
| `/api/v1/scenarios/[slug]` | GET | Optional | Get scenario details |
| `/api/v1/search` | GET | Optional | Search laws and scenarios |
| `/api/v1/bookmarks` | GET, POST | Required | Manage bookmarks |
| `/api/v1/explanations/stream` | POST | Optional | Stream AI explanation |
| `/api/v1/user/export` | GET | Required | Export user data (NDPR) |

## Environment Variables

See `.env.example` for required variables:

- **Supabase:** Database and auth
- **OpenAI:** AI explanations and embeddings
- **Upstash Redis:** Rate limiting and caching
- **Sentry:** Error monitoring
- **OAuth:** Google, Apple, Facebook credentials

## Content

The MVP includes:
- **11 Laws** - Constitution, Criminal Code, Labour Act, and more
- **60 Scenarios** - Real-world legal situations
- **422 Sections** - Individual law provisions with embeddings

## NDPR Compliance

LawMadeSimple complies with the Nigeria Data Protection Regulation:
- Privacy Policy at `/privacy`
- Data export via `/api/v1/user/export`
- Account deletion in Settings
- Cookie consent banner
- Transparent data handling

## Security

- Content Security Policy (CSP) headers
- Secure authentication with Supabase Auth
- Rate limiting with Upstash Redis
- Input validation with Zod
- HTTPS enforced in production

## Testing

- **Unit Tests:** 245+ tests with Vitest
- **E2E Tests:** 124+ tests with Playwright
- **Accessibility:** WCAG 2.1 AA compliance tested

```bash
# Run all tests
npm run test && npm run test:e2e
```

## License

MIT

## Contact

- Website: [lawmadesimple.ng](https://lawmadesimple.ng)
- Email: hello@lawmadesimple.ng
