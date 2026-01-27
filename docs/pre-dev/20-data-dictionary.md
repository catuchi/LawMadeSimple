# Data Dictionary

> Comprehensive data definitions for LawMadeSimple.

---

## Overview

This document defines all data elements used in LawMadeSimple, including entities, attributes, data types, validation rules, and data handling policies.

---

## Entities

### Entity: Law

The primary legal documents that users can browse and search.

| Attribute | Data Type | Size | Nullable | Default | Description | Validation |
|-----------|-----------|------|----------|---------|-------------|------------|
| id | UUID | 36 | No | gen_random_uuid() | Unique identifier | Valid UUID v4 |
| slug | VARCHAR | 100 | No | - | URL-friendly identifier | ^[a-z0-9]+(-[a-z0-9]+)*$ |
| title | VARCHAR | 255 | No | - | Full official title | 1-255 chars |
| short_title | VARCHAR | 100 | No | - | Display title | 1-100 chars |
| description | TEXT | - | Yes | NULL | Brief description | Max 2000 chars |
| category | ENUM | - | No | - | Law category | Valid LawCategory |
| effective_date | DATE | - | Yes | NULL | When law took effect | Valid date |
| source_url | VARCHAR | 500 | Yes | NULL | Link to official source | Valid URL |
| is_active | BOOLEAN | - | No | true | Currently in force | true/false |
| created_at | TIMESTAMP | - | No | now() | Record creation | Auto-set |
| updated_at | TIMESTAMP | - | No | now() | Last update | Auto-updated |

**Business Rules:**
- Slug must be unique across all laws
- Category must match one of: constitution, criminal, business, labour, property, tax
- Source URL should point to official Nigerian legal sources when available

---

### Entity: Section

Subdivisions within a law (chapters, parts, sections).

| Attribute | Data Type | Size | Nullable | Default | Description | Validation |
|-----------|-----------|------|----------|---------|-------------|------------|
| id | UUID | 36 | No | gen_random_uuid() | Unique identifier | Valid UUID v4 |
| law_id | UUID | 36 | No | - | Parent law reference | Valid law ID |
| slug | VARCHAR | 100 | No | - | URL-friendly identifier | ^[a-z0-9]+(-[a-z0-9]+)*$ |
| number | VARCHAR | 20 | No | - | Section number | 1-20 chars |
| title | VARCHAR | 255 | No | - | Section title | 1-255 chars |
| content | TEXT | - | No | - | Full legal text | Min 1 char |
| summary | TEXT | - | Yes | NULL | Brief summary | Max 500 chars |
| order_index | INTEGER | - | No | - | Display order | >= 0 |
| parent_section_id | UUID | 36 | Yes | NULL | Parent section (for nesting) | Valid section ID |
| created_at | TIMESTAMP | - | No | now() | Record creation | Auto-set |
| updated_at | TIMESTAMP | - | No | now() | Last update | Auto-updated |

**Business Rules:**
- Slug must be unique within the same law
- Order index determines display sequence
- Parent section must belong to the same law

---

### Entity: Article

Specific provisions within a section.

| Attribute | Data Type | Size | Nullable | Default | Description | Validation |
|-----------|-----------|------|----------|---------|-------------|------------|
| id | UUID | 36 | No | gen_random_uuid() | Unique identifier | Valid UUID v4 |
| section_id | UUID | 36 | No | - | Parent section reference | Valid section ID |
| slug | VARCHAR | 100 | No | - | URL-friendly identifier | ^[a-z0-9]+(-[a-z0-9]+)*$ |
| number | VARCHAR | 20 | No | - | Article number (e.g., "(1)", "(a)") | 1-20 chars |
| content | TEXT | - | No | - | Full legal text | Min 1 char |
| order_index | INTEGER | - | No | - | Display order | >= 0 |
| created_at | TIMESTAMP | - | No | now() | Record creation | Auto-set |
| updated_at | TIMESTAMP | - | No | now() | Last update | Auto-updated |

**Business Rules:**
- Slug must be unique within the same section
- Content should be the exact text from the official source

---

### Entity: Scenario

User-facing situations that map to relevant legal provisions.

| Attribute | Data Type | Size | Nullable | Default | Description | Validation |
|-----------|-----------|------|----------|---------|-------------|------------|
| id | UUID | 36 | No | gen_random_uuid() | Unique identifier | Valid UUID v4 |
| slug | VARCHAR | 100 | No | - | URL-friendly identifier | ^[a-z0-9]+(-[a-z0-9]+)*$, unique |
| title | VARCHAR | 255 | No | - | User-facing title | 1-255 chars |
| description | TEXT | - | Yes | NULL | Longer description | Max 1000 chars |
| keywords | TEXT[] | - | Yes | '{}' | Search keywords | Array of strings |
| category | ENUM | - | No | - | Scenario category | Valid LawCategory |
| is_featured | BOOLEAN | - | No | false | Show on homepage | true/false |
| view_count | INTEGER | - | No | 0 | Popularity counter | >= 0 |
| created_at | TIMESTAMP | - | No | now() | Record creation | Auto-set |
| updated_at | TIMESTAMP | - | No | now() | Last update | Auto-updated |

**Business Rules:**
- Title should be phrased as user would ask (e.g., "What to do if police arrest me")
- Keywords aid search discovery
- Featured scenarios appear on homepage

---

### Entity: ScenarioSection

Many-to-many relationship between scenarios and sections.

| Attribute | Data Type | Size | Nullable | Default | Description | Validation |
|-----------|-----------|------|----------|---------|-------------|------------|
| scenario_id | UUID | 36 | No | - | Scenario reference | Valid scenario ID |
| section_id | UUID | 36 | No | - | Section reference | Valid section ID |
| relevance_order | INTEGER | - | No | - | Order of relevance | >= 1 |
| relevance_note | TEXT | - | Yes | NULL | Why this section is relevant | Max 500 chars |

**Business Rules:**
- Primary key is (scenario_id, section_id)
- Relevance order determines display sequence
- Most relevant section should be order 1

---

### Entity: User

Authenticated users of the platform.

| Attribute | Data Type | Size | Nullable | Default | Description | Validation |
|-----------|-----------|------|----------|---------|-------------|------------|
| id | UUID | 36 | No | - | Matches Supabase auth.users.id | Valid UUID v4 |
| email | VARCHAR | 255 | No | - | User email address | Valid email, unique |
| name | VARCHAR | 100 | Yes | NULL | Display name | 1-100 chars |
| avatar_url | VARCHAR | 500 | Yes | NULL | Profile image URL | Valid URL |
| preferences | JSONB | - | No | '{}' | User preferences | Valid JSON |
| created_at | TIMESTAMP | - | No | now() | Account creation | Auto-set |
| updated_at | TIMESTAMP | - | No | now() | Last update | Auto-updated |

**Business Rules:**
- ID syncs with Supabase Auth
- Email is the primary identifier
- Preferences schema defined below

**Preferences JSON Schema:**
```json
{
  "theme": "light",
  "fontSize": "medium",
  "emailNotifications": true,
  "savedSearches": []
}
```

---

### Entity: Bookmark

User-saved content for later reference.

| Attribute | Data Type | Size | Nullable | Default | Description | Validation |
|-----------|-----------|------|----------|---------|-------------|------------|
| id | UUID | 36 | No | gen_random_uuid() | Unique identifier | Valid UUID v4 |
| user_id | UUID | 36 | No | - | Owner reference | Valid user ID |
| content_type | ENUM | - | No | - | Type of bookmarked content | Valid ContentType |
| content_id | UUID | 36 | No | - | ID of bookmarked item | Valid UUID |
| note | TEXT | - | Yes | NULL | User's personal note | Max 500 chars |
| created_at | TIMESTAMP | - | No | now() | When bookmarked | Auto-set |

**Business Rules:**
- Unique constraint on (user_id, content_type, content_id)
- User can only bookmark same item once
- Deleted with user account (CASCADE)

---

### Entity: Explanation

Cached AI-generated explanations of legal content.

| Attribute | Data Type | Size | Nullable | Default | Description | Validation |
|-----------|-----------|------|----------|---------|-------------|------------|
| id | UUID | 36 | No | gen_random_uuid() | Unique identifier | Valid UUID v4 |
| content_type | ENUM | - | No | - | Type of explained content | Valid ContentType |
| content_id | UUID | 36 | No | - | ID of explained item | Valid UUID |
| explanation_text | TEXT | - | No | - | AI-generated explanation | Min 1 char |
| examples | JSONB | - | Yes | NULL | Practical examples | Valid JSON array |
| model_used | VARCHAR | 50 | No | - | AI model identifier | e.g., "gpt-4o" |
| prompt_hash | VARCHAR | 64 | No | - | SHA-256 of prompt | 64 hex chars |
| token_count | INTEGER | - | Yes | NULL | Tokens consumed | >= 0 |
| created_at | TIMESTAMP | - | No | now() | Generation time | Auto-set |
| expires_at | TIMESTAMP | - | Yes | NULL | Cache expiration | Future date |

**Business Rules:**
- Unique on (content_type, content_id, prompt_hash) for cache lookup
- Prompt hash enables cache invalidation when prompts change
- Explanation includes mandatory disclaimer

**Examples JSON Schema:**
```json
[
  {
    "title": "Example scenario",
    "scenario": "Description of real-world situation",
    "application": "How the law applies"
  }
]
```

---

### Entity: Feedback

User feedback on explanations.

| Attribute | Data Type | Size | Nullable | Default | Description | Validation |
|-----------|-----------|------|----------|---------|-------------|------------|
| id | UUID | 36 | No | gen_random_uuid() | Unique identifier | Valid UUID v4 |
| user_id | UUID | 36 | Yes | NULL | Feedback author | Valid user ID or NULL |
| explanation_id | UUID | 36 | No | - | Related explanation | Valid explanation ID |
| rating | INTEGER | - | Yes | NULL | Helpfulness rating | 1-5 |
| comment | TEXT | - | Yes | NULL | Written feedback | Max 1000 chars |
| feedback_type | ENUM | - | Yes | NULL | Feedback category | Valid FeedbackType |
| created_at | TIMESTAMP | - | No | now() | Submission time | Auto-set |

**Business Rules:**
- Anonymous feedback allowed (user_id NULL)
- At least rating OR comment required
- Used to improve AI explanations

---

### Entity: SearchLog

Analytics for search queries.

| Attribute | Data Type | Size | Nullable | Default | Description | Validation |
|-----------|-----------|------|----------|---------|-------------|------------|
| id | UUID | 36 | No | gen_random_uuid() | Unique identifier | Valid UUID v4 |
| user_id | UUID | 36 | Yes | NULL | Searcher (if authenticated) | Valid user ID or NULL |
| query | VARCHAR | 500 | No | - | Search query | 1-500 chars |
| result_count | INTEGER | - | No | - | Number of results | >= 0 |
| filters | JSONB | - | Yes | NULL | Applied filters | Valid JSON |
| clicked_result_id | UUID | 36 | Yes | NULL | Which result was clicked | Valid UUID |
| created_at | TIMESTAMP | - | No | now() | Search time | Auto-set |

**Business Rules:**
- Used for analytics and improving search
- Retained for 90 days, then aggregated
- PII (user_id) removed after 30 days

---

## Enumerations

### LawCategory

| Value | Description | Display Name |
|-------|-------------|--------------|
| constitution | Constitutional law | Constitution |
| criminal | Criminal law | Criminal Law |
| business | Business/Corporate law | Business Law |
| labour | Employment/Labour law | Labour Law |
| property | Property/Tenancy law | Property Law |
| tax | Tax/Revenue law | Tax Law |

### ContentType

| Value | Description | Example |
|-------|-------------|---------|
| law | A complete law | Constitution |
| section | Section within a law | Section 35 |
| article | Article within a section | Article 35(1) |
| scenario | User scenario | "Police arrest" |
| explanation | AI explanation | Explanation of Section 35 |

### FeedbackType

| Value | Description | User Prompt |
|-------|-------------|-------------|
| helpful | Explanation was useful | "This was helpful" |
| incorrect | Information seems wrong | "This seems incorrect" |
| unclear | Explanation was confusing | "I didn't understand this" |
| other | Other feedback | "Other" |

---

## Data Types Reference

| Type | Description | PostgreSQL | Example |
|------|-------------|------------|---------|
| UUID | Universally unique identifier | uuid | 550e8400-e29b-41d4-a716-446655440000 |
| VARCHAR(n) | Variable-length string | varchar(n) | "Constitution" |
| TEXT | Unlimited text | text | Long legal text... |
| INTEGER | 32-bit integer | integer | 42 |
| BOOLEAN | True/False | boolean | true |
| DATE | Calendar date | date | 1999-05-29 |
| TIMESTAMP | Date and time (UTC) | timestamp with time zone | 2026-01-27T10:30:00Z |
| JSONB | Binary JSON | jsonb | {"key": "value"} |
| TEXT[] | Array of text | text[] | ['keyword1', 'keyword2'] |
| ENUM | Enumerated type | custom type | 'constitution' |

---

## Validation Rules

| Rule Name | Regex/Logic | Example Valid | Example Invalid |
|-----------|-------------|---------------|-----------------|
| slug | ^[a-z0-9]+(-[a-z0-9]+)*$ | "section-35" | "Section 35" |
| email | ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ | "user@example.com" | "user@" |
| url | ^https?://[^\s]+$ | "https://example.com" | "not a url" |
| uuid | ^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$ | Valid UUID v4 | "123" |
| rating | 1 <= value <= 5 | 4 | 0, 6 |
| prompt_hash | ^[a-f0-9]{64}$ | SHA-256 hex | "abc" |

---

## Data Relationships Summary

| Parent | Child | Relationship | Cascade Delete |
|--------|-------|--------------|----------------|
| Law | Section | One to Many | Yes |
| Section | Article | One to Many | Yes |
| Section | Section (subsection) | One to Many | Yes |
| Scenario | ScenarioSection | One to Many | Yes |
| Section | ScenarioSection | One to Many | Yes |
| User | Bookmark | One to Many | Yes |
| User | Feedback | One to Many | Set NULL |
| User | SearchLog | One to Many | Set NULL |
| Explanation | Feedback | One to Many | Yes |

---

## Data Retention Policy

| Data Type | Retention Period | Archival | Deletion Method |
|-----------|------------------|----------|-----------------|
| Law content | Indefinite | N/A | Manual only |
| User accounts | Until deletion requested | N/A | Hard delete + anonymize related |
| Bookmarks | With user account | N/A | Cascade delete |
| Explanations | 30 days after expires_at | N/A | Batch delete |
| Feedback | 2 years | Aggregate stats | Anonymize |
| Search logs | 90 days | Aggregate stats | Hard delete |
| Auth sessions | 7 days inactive | N/A | Auto-expire |

---

## NDPR Compliance

### Personal Data Inventory

| Data Element | Personal Data? | Sensitive? | Legal Basis |
|--------------|----------------|------------|-------------|
| User email | Yes | No | Consent (signup) |
| User name | Yes | No | Consent |
| Search queries | Potentially | No | Legitimate interest |
| Bookmarks | Linked to user | No | Consent |
| Feedback | Linked to user | No | Consent |
| IP addresses | Yes | No | Legitimate interest (security) |

### Data Subject Rights

| Right | Implementation |
|-------|----------------|
| Access | Export via profile settings |
| Rectification | Edit profile |
| Erasure | Delete account (all data) |
| Portability | JSON export |
| Objection | Opt-out of analytics |

---

## Seed Data Requirements

### MVP Laws

| Law | Sections (est.) | Priority |
|-----|-----------------|----------|
| Constitution of Nigeria 1999 | ~320 | P0 |
| Criminal Code Act | ~500 | P0 |
| CAMA 2020 | ~870 | P0 |
| Labour Act | ~90 | P0 |
| Lagos Tenancy Law | ~30 | P0 |
| FIRS Act | ~60 | P0 |

### MVP Scenarios

| Category | Scenarios (est.) | Examples |
|----------|------------------|----------|
| Criminal | 15 | Police arrest, bail, charges |
| Business | 10 | Registration, compliance |
| Labour | 10 | Dismissal, leave, wages |
| Property | 10 | Eviction, rent, deposits |
| Constitution | 5 | Fundamental rights |

---

*Document: 20 of 20 | Phase 5: Detailed Design*
*Project: LawMadeSimple | Created: January 2026*
