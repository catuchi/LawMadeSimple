# Entity Relationship Diagram

> Database schema design for LawMadeSimple.

---

## Conceptual Model

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│     Law      │         │    User      │         │   Scenario   │
│              │         │              │         │              │
│ Constitution │         │ Nigerian     │         │ "My landlord │
│ Criminal Code│         │ Citizens     │         │  evicted me" │
│ CAMA         │         │ SMEs         │         │              │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │ has many               │ has many               │ maps to
       ▼                        ▼                        ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Section    │         │   Bookmark   │         │   Section    │
│              │◀────────│              │─────────▶              │
│ Rights       │ bookmarks│ Saved item  │ related  │ Articles    │
│ Offences     │         │              │         │              │
└──────┬───────┘         └──────────────┘         └──────────────┘
       │
       │ has many
       ▼
┌──────────────┐         ┌──────────────┐
│   Article    │         │  Explanation │
│              │◀────────│              │
│ Specific     │ explains │ AI-generated │
│ provisions   │         │ plain text   │
└──────────────┘         └──────────────┘
                                │
                                │ receives
                                ▼
                         ┌──────────────┐
                         │   Feedback   │
                         │              │
                         │ User rating  │
                         │ Comments     │
                         └──────────────┘
```

---

## Logical Model

### Entity: Law

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly identifier (e.g., "constitution") |
| title | VARCHAR(255) | NOT NULL | Full title (e.g., "Constitution of Nigeria 1999") |
| short_title | VARCHAR(100) | NOT NULL | Display title (e.g., "Constitution") |
| description | TEXT | | Brief description of the law |
| category | ENUM | NOT NULL | Category (constitution, criminal, business, labour, property, tax) |
| effective_date | DATE | | When law came into effect |
| source_url | VARCHAR(500) | | Link to official source |
| is_active | BOOLEAN | DEFAULT true | Whether law is currently in force |
| created_at | TIMESTAMP | NOT NULL | Record creation |
| updated_at | TIMESTAMP | NOT NULL | Last update |

### Entity: Section

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| law_id | UUID | FK → Law, NOT NULL | Parent law |
| slug | VARCHAR(100) | NOT NULL | URL-friendly (e.g., "section-35") |
| number | VARCHAR(20) | NOT NULL | Section number (e.g., "35", "35A") |
| title | VARCHAR(255) | NOT NULL | Section title |
| content | TEXT | NOT NULL | Full legal text |
| summary | TEXT | | Brief summary |
| order_index | INTEGER | NOT NULL | Display order |
| parent_section_id | UUID | FK → Section | For sub-sections |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

### Entity: Article

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| section_id | UUID | FK → Section, NOT NULL | Parent section |
| slug | VARCHAR(100) | NOT NULL | URL-friendly |
| number | VARCHAR(20) | NOT NULL | Article number |
| content | TEXT | NOT NULL | Full legal text |
| order_index | INTEGER | NOT NULL | Display order |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

### Entity: Scenario

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly |
| title | VARCHAR(255) | NOT NULL | User-facing title (e.g., "My landlord wants to evict me") |
| description | TEXT | | Longer description |
| keywords | TEXT[] | | Search keywords |
| category | ENUM | NOT NULL | Scenario category |
| is_featured | BOOLEAN | DEFAULT false | Show on homepage |
| view_count | INTEGER | DEFAULT 0 | Popularity tracking |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

### Entity: ScenarioSection (Join Table)

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| scenario_id | UUID | FK → Scenario, PK | |
| section_id | UUID | FK → Section, PK | |
| relevance_order | INTEGER | NOT NULL | Order of relevance |
| relevance_note | TEXT | | Why this section is relevant |

### Entity: User

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK | Matches Supabase auth.users.id |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| name | VARCHAR(100) | | Display name |
| avatar_url | VARCHAR(500) | | Profile image |
| preferences | JSONB | DEFAULT '{}' | User preferences |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

### Entity: Bookmark

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → User, NOT NULL | Owner |
| content_type | ENUM | NOT NULL | 'law', 'section', 'article', 'scenario', 'explanation' |
| content_id | UUID | NOT NULL | ID of bookmarked item |
| note | TEXT | | User's note |
| created_at | TIMESTAMP | NOT NULL | |

### Entity: Explanation

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| content_type | ENUM | NOT NULL | 'section', 'article', 'scenario' |
| content_id | UUID | NOT NULL | ID of explained item |
| explanation_text | TEXT | NOT NULL | AI-generated explanation |
| examples | JSONB | | Practical examples |
| model_used | VARCHAR(50) | NOT NULL | GPT-4o, GPT-4o-mini, etc. |
| prompt_hash | VARCHAR(64) | NOT NULL | Hash of prompt for cache invalidation |
| token_count | INTEGER | | Tokens used |
| created_at | TIMESTAMP | NOT NULL | |
| expires_at | TIMESTAMP | | Cache expiration |

### Entity: Feedback

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → User | Nullable for anonymous |
| explanation_id | UUID | FK → Explanation, NOT NULL | Related explanation |
| rating | INTEGER | CHECK (1-5) | Helpfulness rating |
| comment | TEXT | | User feedback text |
| feedback_type | ENUM | | 'helpful', 'incorrect', 'unclear', 'other' |
| created_at | TIMESTAMP | NOT NULL | |

### Entity: SearchLog

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → User | Nullable for anonymous |
| query | VARCHAR(500) | NOT NULL | Search query |
| result_count | INTEGER | NOT NULL | Number of results |
| filters | JSONB | | Applied filters |
| clicked_result_id | UUID | | Which result was clicked |
| created_at | TIMESTAMP | NOT NULL | |

---

## Relationships

| Entity A | Relationship | Entity B | Cardinality | On Delete |
|----------|--------------|----------|-------------|-----------|
| Law | has many | Section | 1:N | CASCADE |
| Section | has many | Article | 1:N | CASCADE |
| Section | has many | Section (sub) | 1:N | CASCADE |
| Scenario | maps to many | Section | M:N | CASCADE |
| User | has many | Bookmark | 1:N | CASCADE |
| User | has many | Feedback | 1:N | SET NULL |
| Explanation | has many | Feedback | 1:N | CASCADE |
| User | has many | SearchLog | 1:N | SET NULL |

---

## Physical Model (Prisma Schema)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enums
enum LawCategory {
  constitution
  criminal
  business
  labour
  property
  tax
}

enum ContentType {
  law
  section
  article
  scenario
  explanation
}

enum FeedbackType {
  helpful
  incorrect
  unclear
  other
}

// Models
model Law {
  id            String      @id @default(uuid())
  slug          String      @unique
  title         String
  shortTitle    String      @map("short_title")
  description   String?
  category      LawCategory
  effectiveDate DateTime?   @map("effective_date")
  sourceUrl     String?     @map("source_url")
  isActive      Boolean     @default(true) @map("is_active")
  createdAt     DateTime    @default(now()) @map("created_at")
  updatedAt     DateTime    @updatedAt @map("updated_at")

  sections      Section[]

  @@map("laws")
}

model Section {
  id              String    @id @default(uuid())
  lawId           String    @map("law_id")
  slug            String
  number          String
  title           String
  content         String
  summary         String?
  orderIndex      Int       @map("order_index")
  parentSectionId String?   @map("parent_section_id")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  law             Law       @relation(fields: [lawId], references: [id], onDelete: Cascade)
  parentSection   Section?  @relation("SubSections", fields: [parentSectionId], references: [id])
  subSections     Section[] @relation("SubSections")
  articles        Article[]
  scenarios       ScenarioSection[]

  @@unique([lawId, slug])
  @@index([lawId])
  @@map("sections")
}

model Article {
  id          String   @id @default(uuid())
  sectionId   String   @map("section_id")
  slug        String
  number      String
  content     String
  orderIndex  Int      @map("order_index")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  section     Section  @relation(fields: [sectionId], references: [id], onDelete: Cascade)

  @@unique([sectionId, slug])
  @@index([sectionId])
  @@map("articles")
}

model Scenario {
  id          String    @id @default(uuid())
  slug        String    @unique
  title       String
  description String?
  keywords    String[]
  category    LawCategory
  isFeatured  Boolean   @default(false) @map("is_featured")
  viewCount   Int       @default(0) @map("view_count")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  sections    ScenarioSection[]

  @@map("scenarios")
}

model ScenarioSection {
  scenarioId     String   @map("scenario_id")
  sectionId      String   @map("section_id")
  relevanceOrder Int      @map("relevance_order")
  relevanceNote  String?  @map("relevance_note")

  scenario       Scenario @relation(fields: [scenarioId], references: [id], onDelete: Cascade)
  section        Section  @relation(fields: [sectionId], references: [id], onDelete: Cascade)

  @@id([scenarioId, sectionId])
  @@map("scenario_sections")
}

model User {
  id          String     @id // Matches Supabase auth.users.id
  email       String     @unique
  name        String?
  avatarUrl   String?    @map("avatar_url")
  preferences Json       @default("{}")
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  bookmarks   Bookmark[]
  feedback    Feedback[]
  searchLogs  SearchLog[]

  @@map("users")
}

model Bookmark {
  id          String      @id @default(uuid())
  userId      String      @map("user_id")
  contentType ContentType @map("content_type")
  contentId   String      @map("content_id")
  note        String?
  createdAt   DateTime    @default(now()) @map("created_at")

  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, contentType, contentId])
  @@index([userId])
  @@map("bookmarks")
}

model Explanation {
  id              String      @id @default(uuid())
  contentType     ContentType @map("content_type")
  contentId       String      @map("content_id")
  explanationText String      @map("explanation_text")
  examples        Json?
  modelUsed       String      @map("model_used")
  promptHash      String      @map("prompt_hash")
  tokenCount      Int?        @map("token_count")
  createdAt       DateTime    @default(now()) @map("created_at")
  expiresAt       DateTime?   @map("expires_at")

  feedback        Feedback[]

  @@unique([contentType, contentId, promptHash])
  @@index([contentType, contentId])
  @@map("explanations")
}

model Feedback {
  id            String       @id @default(uuid())
  userId        String?      @map("user_id")
  explanationId String       @map("explanation_id")
  rating        Int?
  comment       String?
  feedbackType  FeedbackType? @map("feedback_type")
  createdAt     DateTime     @default(now()) @map("created_at")

  user          User?        @relation(fields: [userId], references: [id], onDelete: SetNull)
  explanation   Explanation  @relation(fields: [explanationId], references: [id], onDelete: Cascade)

  @@index([explanationId])
  @@map("feedback")
}

model SearchLog {
  id              String   @id @default(uuid())
  userId          String?  @map("user_id")
  query           String
  resultCount     Int      @map("result_count")
  filters         Json?
  clickedResultId String?  @map("clicked_result_id")
  createdAt       DateTime @default(now()) @map("created_at")

  user            User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([createdAt])
  @@map("search_logs")
}
```

---

## ERD Diagram

```
┌──────────────────────────┐
│          laws            │
├──────────────────────────┤
│ PK id           UUID     │
│    slug         VARCHAR  │◀──────────────────────────────────┐
│    title        VARCHAR  │                                   │
│    short_title  VARCHAR  │                                   │
│    description  TEXT     │                                   │
│    category     ENUM     │                                   │
│    effective_date DATE   │                                   │
│    source_url   VARCHAR  │                                   │
│    is_active    BOOLEAN  │                                   │
│    created_at   TIMESTAMP│                                   │
│    updated_at   TIMESTAMP│                                   │
└──────────────────────────┘                                   │
            │                                                  │
            │ 1:N                                               │
            ▼                                                  │
┌──────────────────────────┐       ┌──────────────────────────┐│
│        sections          │       │       scenarios          ││
├──────────────────────────┤       ├──────────────────────────┤│
│ PK id           UUID     │◀──┐   │ PK id           UUID     ││
│ FK law_id       UUID     │───┘   │    slug         VARCHAR  ││
│    slug         VARCHAR  │       │    title        VARCHAR  ││
│    number       VARCHAR  │       │    description  TEXT     ││
│    title        VARCHAR  │       │    keywords     TEXT[]   ││
│    content      TEXT     │       │    category     ENUM     ││
│    summary      TEXT     │       │    is_featured  BOOLEAN  ││
│    order_index  INT      │       │    view_count   INT      ││
│ FK parent_section_id UUID│───┐   │    created_at   TIMESTAMP││
│    created_at   TIMESTAMP│   │   │    updated_at   TIMESTAMP││
│    updated_at   TIMESTAMP│◀──┘   └──────────────────────────┘│
└──────────────────────────┘                   │                │
            │                                  │                │
            │ 1:N                              │ M:N            │
            ▼                                  ▼                │
┌──────────────────────────┐       ┌──────────────────────────┐│
│        articles          │       │    scenario_sections     ││
├──────────────────────────┤       ├──────────────────────────┤│
│ PK id           UUID     │       │ PK scenario_id  UUID     │───┘
│ FK section_id   UUID     │───────│ PK section_id   UUID     │
│    slug         VARCHAR  │       │    relevance_order INT   │
│    number       VARCHAR  │       │    relevance_note TEXT   │
│    content      TEXT     │       └──────────────────────────┘
│    order_index  INT      │
│    created_at   TIMESTAMP│
│    updated_at   TIMESTAMP│
└──────────────────────────┘


┌──────────────────────────┐       ┌──────────────────────────┐
│          users           │       │       explanations       │
├──────────────────────────┤       ├──────────────────────────┤
│ PK id           UUID     │       │ PK id           UUID     │
│    email        VARCHAR  │       │    content_type ENUM     │
│    name         VARCHAR  │       │    content_id   UUID     │
│    avatar_url   VARCHAR  │       │    explanation_text TEXT │
│    preferences  JSONB    │       │    examples     JSONB    │
│    created_at   TIMESTAMP│       │    model_used   VARCHAR  │
│    updated_at   TIMESTAMP│       │    prompt_hash  VARCHAR  │
└──────────────────────────┘       │    token_count  INT      │
            │                      │    created_at   TIMESTAMP│
            │ 1:N                  │    expires_at   TIMESTAMP│
            ▼                      └──────────────────────────┘
┌──────────────────────────┐                   │
│        bookmarks         │                   │ 1:N
├──────────────────────────┤                   ▼
│ PK id           UUID     │       ┌──────────────────────────┐
│ FK user_id      UUID     │       │        feedback          │
│    content_type ENUM     │       ├──────────────────────────┤
│    content_id   UUID     │       │ PK id           UUID     │
│    note         TEXT     │       │ FK user_id      UUID     │
│    created_at   TIMESTAMP│       │ FK explanation_id UUID   │
└──────────────────────────┘       │    rating       INT      │
                                   │    comment      TEXT     │
                                   │    feedback_type ENUM    │
                                   │    created_at   TIMESTAMP│
                                   └──────────────────────────┘
```

---

## Indexes

| Table | Index Name | Columns | Type | Purpose |
|-------|------------|---------|------|---------|
| laws | idx_laws_slug | slug | UNIQUE | Slug lookup |
| laws | idx_laws_category | category | BTREE | Category filtering |
| sections | idx_sections_law_id | law_id | BTREE | Law sections lookup |
| sections | idx_sections_law_slug | law_id, slug | UNIQUE | Section lookup |
| sections | idx_sections_fts | content | GIN (tsvector) | Full-text search |
| articles | idx_articles_section_id | section_id | BTREE | Section articles lookup |
| scenarios | idx_scenarios_slug | slug | UNIQUE | Slug lookup |
| scenarios | idx_scenarios_featured | is_featured | BTREE | Featured filtering |
| users | idx_users_email | email | UNIQUE | Email lookup |
| bookmarks | idx_bookmarks_user_id | user_id | BTREE | User bookmarks |
| bookmarks | idx_bookmarks_unique | user_id, content_type, content_id | UNIQUE | Prevent duplicates |
| explanations | idx_explanations_content | content_type, content_id | BTREE | Content lookup |
| explanations | idx_explanations_cache | content_type, content_id, prompt_hash | UNIQUE | Cache lookup |
| feedback | idx_feedback_explanation | explanation_id | BTREE | Explanation feedback |
| search_logs | idx_search_logs_created | created_at | BTREE | Analytics queries |

---

*Document: 17 of 20 | Phase 5: Detailed Design*
*Project: LawMadeSimple | Created: January 2026*
