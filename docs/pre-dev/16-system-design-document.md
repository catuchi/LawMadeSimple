# System Design Document

> Detailed design specifications for LawMadeSimple modules and cross-cutting concerns.

---

## Design Overview

### Design Principles

1. **User-First Simplicity**
   - Every feature should reduce complexity for users, not add it
   - Legal content must be discoverable without legal knowledge
   - Error messages should guide, not frustrate

2. **Progressive Disclosure**
   - Show summary first, details on demand
   - Law sections collapse/expand
   - AI explanations load after initial content

3. **Mobile-First Responsive**
   - Design for smallest screens first
   - Touch-friendly interaction targets
   - Offline capability for saved content

4. **Defensive Design**
   - Never present AI output as legal advice
   - Always cite sources
   - Graceful degradation when services fail

5. **Performance Budget**
   - Initial load < 2 seconds on 3G
   - Interaction response < 100ms
   - AI response < 5 seconds (with streaming)

### Design Patterns Used

| Pattern | Where Applied | Rationale |
|---------|---------------|-----------|
| **Repository Pattern** | Data access layer | Abstracts database, enables testing |
| **Service Layer** | Business logic | Separates concerns, reusable logic |
| **Strategy Pattern** | AI providers | Swap OpenAI/Claude without code changes |
| **Observer Pattern** | Real-time updates | Bookmark sync across tabs |
| **Facade Pattern** | External APIs | Simplify OpenAI/Supabase interaction |
| **Cache-Aside** | AI explanations | Check cache before calling API |

---

## Module Design

### Module 1: Law Content Module

#### Purpose
Manages retrieval, display, and navigation of structured legal content.

#### Responsibilities
- Fetch laws, sections, articles from database
- Provide hierarchical navigation (Law → Section → Article)
- Support scenario-based discovery
- Enable full-text search

#### Dependencies
| Dependency | Type | Purpose |
|------------|------|---------|
| Prisma Client | Internal | Database access |
| Search Service | Internal | Full-text search |

#### Component Structure
```
src/
  services/
    LawService.ts        # Core law retrieval logic
  lib/
    laws/
      types.ts           # Law, Section, Article types
      utils.ts           # Formatting helpers
  app/
    laws/
      page.tsx           # Law listing page
      [lawId]/
        page.tsx         # Single law view
        [sectionId]/
          page.tsx       # Section detail view
```

#### Key Functions

```typescript
// LawService.ts
interface LawService {
  // Get all laws with basic info
  getLaws(): Promise<Law[]>;

  // Get single law with sections
  getLaw(lawId: string): Promise<LawWithSections>;

  // Get section with articles
  getSection(lawId: string, sectionId: string): Promise<SectionWithArticles>;

  // Get scenarios mapped to this law
  getScenarios(lawId: string): Promise<Scenario[]>;

  // Search within law content
  searchWithinLaw(lawId: string, query: string): Promise<SearchResult[]>;
}
```

#### Error Handling
| Error | Response | User Message |
|-------|----------|--------------|
| Law not found | 404 | "This law could not be found" |
| Database error | 500 | "Unable to load content. Please try again." |

---

### Module 2: AI Explanation Module

#### Purpose
Generate, cache, and serve AI-powered plain language explanations of legal content.

#### Responsibilities
- Generate explanations via OpenAI API
- Cache explanations to reduce costs
- Stream responses for better UX
- Fall back to cached content on API failure

#### Dependencies
| Dependency | Type | Purpose |
|------------|------|---------|
| OpenAI Client | External | AI generation |
| Vercel AI SDK | External | Streaming |
| Prisma Client | Internal | Cache storage |

#### Component Structure
```
src/
  services/
    AIService.ts         # AI orchestration
    CacheService.ts      # Explanation caching
  lib/
    ai/
      prompts.ts         # System prompts
      types.ts           # AI response types
  app/
    api/
      explanations/
        route.ts         # Streaming endpoint
```

#### Key Functions

```typescript
// AIService.ts
interface AIService {
  // Generate explanation (checks cache first)
  explain(params: ExplainParams): Promise<Explanation>;

  // Stream explanation for real-time display
  streamExplain(params: ExplainParams): AsyncIterable<string>;

  // Check if cached explanation exists
  getCached(contentId: string): Promise<Explanation | null>;

  // Save explanation to cache
  saveToCache(contentId: string, explanation: Explanation): Promise<void>;
}

interface ExplainParams {
  contentType: 'section' | 'article' | 'scenario';
  contentId: string;
  lawText: string;
  context?: string;
}
```

#### Prompt Engineering

```typescript
// prompts.ts
export const EXPLANATION_SYSTEM_PROMPT = `
You are a legal educator helping Nigerian citizens understand their laws.

IMPORTANT RULES:
1. Explain in simple, clear language a high school graduate can understand
2. Use practical examples relevant to Nigerian daily life
3. NEVER provide legal advice - only explain what the law says
4. Always remind users to consult a lawyer for specific situations
5. Cite the specific section/article you're explaining
6. Use Nigerian English spellings and terminology

FORMAT:
- Start with a one-sentence summary
- Explain the key points in bullet points
- Give 1-2 practical examples
- End with "Note: This explanation is for educational purposes only..."
`;
```

#### Caching Strategy
| Content Type | Cache TTL | Invalidation |
|--------------|-----------|--------------|
| Section explanation | 7 days | Manual (law update) |
| Article explanation | 7 days | Manual (law update) |
| Scenario response | 30 days | Never (immutable) |

#### Error Handling
| Error | Response | User Message |
|-------|----------|--------------|
| OpenAI timeout | Retry once, then cache fallback | "Taking longer than expected..." |
| OpenAI error | Fall back to cached or generic | "Explanation unavailable. Try again later." |
| Rate limited | Queue request | "High demand. Please wait..." |

---

### Module 3: Search Module

#### Purpose
Enable users to find relevant legal content through text search and scenario matching.

#### Responsibilities
- Full-text search across laws
- Scenario-based discovery
- Search suggestions and autocomplete
- Track popular searches

#### Dependencies
| Dependency | Type | Purpose |
|------------|------|---------|
| Prisma Client | Internal | Database FTS |
| Analytics | Internal | Track searches |

#### Component Structure
```
src/
  services/
    SearchService.ts     # Search orchestration
  lib/
    search/
      types.ts           # Search result types
  app/
    search/
      page.tsx           # Search results page
    api/
      search/
        route.ts         # Search API
        suggestions/
          route.ts       # Autocomplete API
```

#### Key Functions

```typescript
// SearchService.ts
interface SearchService {
  // Full-text search across all content
  search(query: string, filters?: SearchFilters): Promise<SearchResults>;

  // Get scenario suggestions based on input
  suggestScenarios(input: string): Promise<Scenario[]>;

  // Get autocomplete suggestions
  autocomplete(partial: string): Promise<string[]>;

  // Track search for analytics
  trackSearch(query: string, resultCount: number): Promise<void>;
}

interface SearchFilters {
  lawIds?: string[];
  contentTypes?: ('section' | 'article' | 'scenario')[];
  limit?: number;
  offset?: number;
}
```

#### Search Ranking
1. Exact phrase match (highest)
2. All words present
3. Scenario title match
4. Partial word match (lowest)

---

### Module 4: User Module

#### Purpose
Manage user accounts, preferences, bookmarks, and feedback.

#### Responsibilities
- User profile management
- Bookmark save/retrieve
- Feedback collection
- Search/reading history

#### Dependencies
| Dependency | Type | Purpose |
|------------|------|---------|
| Supabase Auth | External | Authentication |
| Prisma Client | Internal | User data |

#### Component Structure
```
src/
  services/
    UserService.ts       # User operations
    BookmarkService.ts   # Bookmark management
    FeedbackService.ts   # Feedback collection
  app/
    profile/
      page.tsx           # User profile
      bookmarks/
        page.tsx         # Saved items
    api/
      bookmarks/
        route.ts         # CRUD bookmarks
      feedback/
        route.ts         # Submit feedback
```

#### Key Functions

```typescript
// UserService.ts
interface UserService {
  // Get user profile
  getProfile(userId: string): Promise<UserProfile>;

  // Update user preferences
  updatePreferences(userId: string, prefs: Preferences): Promise<void>;

  // Get user's reading history
  getHistory(userId: string, limit?: number): Promise<HistoryItem[]>;
}

// BookmarkService.ts
interface BookmarkService {
  // Get user's bookmarks
  getBookmarks(userId: string): Promise<Bookmark[]>;

  // Add bookmark
  addBookmark(userId: string, item: BookmarkItem): Promise<Bookmark>;

  // Remove bookmark
  removeBookmark(userId: string, bookmarkId: string): Promise<void>;

  // Check if item is bookmarked
  isBookmarked(userId: string, contentId: string): Promise<boolean>;
}
```

---

### Module 5: Authentication Module

#### Purpose
Handle user authentication via OAuth and magic links.

#### Responsibilities
- OAuth flow (Google)
- Magic link generation and verification
- Session management
- Protected route middleware

#### Dependencies
| Dependency | Type | Purpose |
|------------|------|---------|
| Supabase Auth | External | Auth provider |
| Resend | External | Magic link emails |

#### Component Structure
```
src/
  lib/
    auth/
      client.ts          # Supabase auth client
      middleware.ts      # Auth middleware
      types.ts           # Auth types
  app/
    auth/
      login/
        page.tsx         # Login page
      callback/
        route.ts         # OAuth callback
```

#### Auth Flow

```typescript
// Middleware pattern
export async function withAuth(
  handler: AuthenticatedHandler
): Promise<Response> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  return handler(user);
}
```

---

## Cross-Cutting Concerns

### Logging

**Convention:**
```typescript
import { logger } from '@/lib/logger';

// Service-level logging
logger.info('Explanation generated', {
  userId: user.id,
  contentId: section.id,
  cached: false,
  duration: endTime - startTime,
});

// Error logging
logger.error('OpenAI API failed', {
  error: error.message,
  contentId: section.id,
  attempt: retryCount,
});
```

**Log Levels by Environment:**
| Environment | Level |
|-------------|-------|
| Development | debug |
| Preview | info |
| Staging | info |
| Production | warn |

### Error Handling

**Global Error Boundary:**
```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**API Error Response Format:**
```typescript
interface ApiError {
  success: false;
  error: {
    code: string;      // Machine-readable: 'NOT_FOUND', 'VALIDATION_ERROR'
    message: string;   // Human-readable
    details?: object;  // Additional context
  };
}
```

### Configuration

**Environment Variable Pattern:**
```typescript
// lib/config.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export const config = envSchema.parse(process.env);
```

### Caching

**Cache Layers:**
1. **HTTP Cache** — Static assets (1 year), API responses (varies)
2. **Database Cache** — AI explanations table
3. **In-Memory** — React Query client cache

**Cache-Control Headers:**
```typescript
// Static pages
export const revalidate = 3600; // 1 hour

// API responses
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
  },
});
```

### Security Implementation

**Input Validation:**
```typescript
import { z } from 'zod';

const searchSchema = z.object({
  query: z.string().min(1).max(200).trim(),
  lawIds: z.array(z.string().uuid()).optional(),
  limit: z.number().min(1).max(100).default(20),
});

export async function POST(req: Request) {
  const body = await req.json();
  const validated = searchSchema.parse(body);
  // Proceed with validated data
}
```

**Output Encoding:**
```typescript
// React handles this automatically for JSX
// For dangerouslySetInnerHTML, sanitize first:
import DOMPurify from 'isomorphic-dompurify';

const safeHtml = DOMPurify.sanitize(untrustedHtml);
```

---

## File Structure Overview

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth-required routes
│   │   ├── profile/
│   │   └── bookmarks/
│   ├── (public)/                 # Public routes
│   │   ├── laws/
│   │   ├── search/
│   │   └── scenarios/
│   ├── api/                      # API routes
│   │   ├── laws/
│   │   ├── explanations/
│   │   ├── search/
│   │   ├── bookmarks/
│   │   └── feedback/
│   ├── auth/                     # Auth pages
│   ├── layout.tsx
│   ├── page.tsx
│   └── error.tsx
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── laws/                     # Law-specific components
│   ├── search/                   # Search components
│   └── layout/                   # Layout components
├── services/                     # Business logic
│   ├── LawService.ts
│   ├── AIService.ts
│   ├── SearchService.ts
│   ├── UserService.ts
│   ├── BookmarkService.ts
│   └── FeedbackService.ts
├── lib/                          # Shared utilities
│   ├── auth/
│   ├── ai/
│   ├── db/
│   ├── config.ts
│   ├── logger.ts
│   └── utils.ts
├── types/                        # TypeScript types
│   └── index.ts
└── prisma/
    ├── schema.prisma
    └── migrations/
```

---

*Document: 16 of 20 | Phase 5: Detailed Design*
*Project: LawMadeSimple | Created: January 2026*
