# API Specifications

> REST API design for LawMadeSimple.

---

## API Overview

**Base URL:** `/api/v1`
**Authentication:** Bearer token (JWT from Supabase Auth)
**Content-Type:** `application/json`

---

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "data": { },
  "meta": {
    "timestamp": "2026-01-27T10:30:00Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ ],
  "meta": {
    "timestamp": "2026-01-27T10:30:00Z",
    "requestId": "uuid"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasMore": true
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested law could not be found",
    "details": {
      "lawId": "invalid-id"
    }
  },
  "meta": {
    "timestamp": "2026-01-27T10:30:00Z",
    "requestId": "uuid"
  }
}
```

---

## Authentication

Most endpoints support both authenticated and guest access, with enhanced features for authenticated users.

**Header Format:**
```
Authorization: Bearer <supabase_access_token>
```

**Auth States:**
| State | Access Level |
|-------|--------------|
| No token | Guest - read-only public content |
| Valid token | User - bookmarks, feedback, personalization |
| Invalid/expired | 401 Unauthorized |

---

## Endpoints

### Laws

#### List Laws

Get all available laws with basic information.

- **Method:** `GET`
- **Path:** `/api/v1/laws`
- **Auth:** Optional
- **Query Parameters:**
  | Param | Type | Default | Description |
  |-------|------|---------|-------------|
  | category | string | all | Filter by category |
  | active | boolean | true | Only active laws |
- **Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "constitution",
      "title": "Constitution of the Federal Republic of Nigeria 1999",
      "shortTitle": "Constitution",
      "description": "The supreme law of Nigeria...",
      "category": "constitution",
      "sectionCount": 320,
      "isActive": true
    }
  ]
}
```

#### Get Law

Get a single law with its sections.

- **Method:** `GET`
- **Path:** `/api/v1/laws/:slug`
- **Auth:** Optional
- **Path Parameters:**
  | Param | Type | Description |
  |-------|------|-------------|
  | slug | string | Law slug (e.g., "constitution") |
- **Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "constitution",
    "title": "Constitution of the Federal Republic of Nigeria 1999",
    "shortTitle": "Constitution",
    "description": "The supreme law of Nigeria...",
    "category": "constitution",
    "effectiveDate": "1999-05-29",
    "sourceUrl": "https://nigerialli.org/...",
    "isActive": true,
    "sections": [
      {
        "id": "uuid",
        "slug": "chapter-4",
        "number": "Chapter IV",
        "title": "Fundamental Rights",
        "summary": "Rights guaranteed to all Nigerians...",
        "hasSubsections": true
      }
    ]
  }
}
```

#### Get Section

Get a section with its articles and sub-sections.

- **Method:** `GET`
- **Path:** `/api/v1/laws/:lawSlug/sections/:sectionSlug`
- **Auth:** Optional
- **Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "section-35",
    "number": "35",
    "title": "Right to Personal Liberty",
    "content": "Every person shall be entitled to his personal liberty...",
    "summary": "Protects Nigerians from arbitrary arrest...",
    "law": {
      "slug": "constitution",
      "shortTitle": "Constitution"
    },
    "articles": [
      {
        "id": "uuid",
        "slug": "35-1",
        "number": "(1)",
        "content": "Every person shall be entitled..."
      }
    ],
    "subSections": [],
    "relatedScenarios": [
      {
        "id": "uuid",
        "slug": "police-arrest",
        "title": "What to do if police arrest you"
      }
    ]
  }
}
```

---

### Explanations

#### Get Explanation

Get AI explanation for content (cached if available).

- **Method:** `GET`
- **Path:** `/api/v1/explanations/:contentType/:contentId`
- **Auth:** Optional
- **Path Parameters:**
  | Param | Type | Description |
  |-------|------|-------------|
  | contentType | string | 'section', 'article', or 'scenario' |
  | contentId | string | UUID of content |
- **Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "contentType": "section",
    "contentId": "uuid",
    "explanation": "In simple terms, Section 35 of the Constitution protects your right to freedom...",
    "examples": [
      {
        "title": "Police checkpoint",
        "scenario": "If police stop you at a checkpoint...",
        "application": "According to this law, they cannot..."
      }
    ],
    "source": {
      "law": "Constitution",
      "section": "Section 35",
      "title": "Right to Personal Liberty"
    },
    "disclaimer": "This explanation is for educational purposes only and does not constitute legal advice.",
    "cached": true,
    "generatedAt": "2026-01-20T10:30:00Z"
  }
}
```

#### Generate Explanation (Streaming)

Generate new AI explanation with streaming response.

- **Method:** `POST`
- **Path:** `/api/v1/explanations/stream`
- **Auth:** Optional (rate limited for guests)
- **Request Body:**

```json
{
  "contentType": "section",
  "contentId": "uuid",
  "forceRegenerate": false
}
```

- **Response:** `200 OK` (text/event-stream)

```
data: {"type": "start", "id": "uuid"}

data: {"type": "chunk", "content": "In simple terms, "}

data: {"type": "chunk", "content": "Section 35 protects "}

data: {"type": "chunk", "content": "your right to freedom..."}

data: {"type": "done", "explanation": {...}}
```

---

### Search

#### Search Content

Full-text search across laws, sections, and scenarios.

- **Method:** `GET`
- **Path:** `/api/v1/search`
- **Auth:** Optional
- **Query Parameters:**
  | Param | Type | Default | Description |
  |-------|------|---------|-------------|
  | q | string | required | Search query |
  | type | string | all | 'law', 'section', 'scenario', or 'all' |
  | lawIds | string[] | all | Filter by law IDs |
  | page | number | 1 | Page number |
  | limit | number | 20 | Results per page (max 100) |
- **Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "section",
        "id": "uuid",
        "title": "Right to Personal Liberty",
        "excerpt": "...person shall be entitled to his personal **liberty**...",
        "law": {
          "slug": "constitution",
          "shortTitle": "Constitution"
        },
        "relevanceScore": 0.95
      },
      {
        "type": "scenario",
        "id": "uuid",
        "title": "What to do if police arrest you",
        "excerpt": "Know your rights when dealing with **police**...",
        "relevanceScore": 0.87
      }
    ],
    "query": "police arrest rights",
    "totalResults": 45
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasMore": true
  }
}
```

#### Get Search Suggestions

Autocomplete suggestions for search.

- **Method:** `GET`
- **Path:** `/api/v1/search/suggestions`
- **Auth:** Optional
- **Query Parameters:**
  | Param | Type | Description |
  |-------|------|-------------|
  | q | string | Partial query (min 2 chars) |
  | limit | number | Max suggestions (default 5) |
- **Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "suggestions": [
      "police arrest",
      "police checkpoint",
      "police brutality rights"
    ],
    "scenarios": [
      {
        "id": "uuid",
        "title": "What to do if police arrest you"
      }
    ]
  }
}
```

---

### Scenarios

#### List Scenarios

Get scenarios, optionally filtered.

- **Method:** `GET`
- **Path:** `/api/v1/scenarios`
- **Auth:** Optional
- **Query Parameters:**
  | Param | Type | Default | Description |
  |-------|------|---------|-------------|
  | category | string | all | Filter by category |
  | featured | boolean | false | Only featured scenarios |
  | page | number | 1 | Page number |
  | limit | number | 20 | Per page |
- **Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "landlord-eviction",
      "title": "My landlord wants to evict me",
      "description": "Understanding your rights as a tenant...",
      "category": "property",
      "isFeatured": true,
      "relatedLaws": ["tenancy-law"]
    }
  ],
  "pagination": { }
}
```

#### Get Scenario

Get scenario details with related sections.

- **Method:** `GET`
- **Path:** `/api/v1/scenarios/:slug`
- **Auth:** Optional
- **Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "landlord-eviction",
    "title": "My landlord wants to evict me",
    "description": "Understanding your rights as a tenant when facing eviction...",
    "category": "property",
    "relatedSections": [
      {
        "id": "uuid",
        "lawSlug": "tenancy-law",
        "sectionSlug": "section-10",
        "title": "Notice Requirements",
        "relevanceNote": "Specifies how much notice landlords must give"
      }
    ]
  }
}
```

---

### Bookmarks (Authenticated)

#### List Bookmarks

Get user's saved bookmarks.

- **Method:** `GET`
- **Path:** `/api/v1/bookmarks`
- **Auth:** Required
- **Query Parameters:**
  | Param | Type | Default | Description |
  |-------|------|---------|-------------|
  | type | string | all | Filter by content type |
  | page | number | 1 | Page number |
  | limit | number | 20 | Per page |
- **Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "contentType": "section",
      "contentId": "uuid",
      "note": "Important for my case",
      "createdAt": "2026-01-25T10:30:00Z",
      "content": {
        "title": "Right to Personal Liberty",
        "law": {
          "slug": "constitution",
          "shortTitle": "Constitution"
        }
      }
    }
  ],
  "pagination": { }
}
```

#### Create Bookmark

Save content to bookmarks.

- **Method:** `POST`
- **Path:** `/api/v1/bookmarks`
- **Auth:** Required
- **Request Body:**

```json
{
  "contentType": "section",
  "contentId": "uuid",
  "note": "Important for my case"
}
```

- **Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "contentType": "section",
    "contentId": "uuid",
    "note": "Important for my case",
    "createdAt": "2026-01-27T10:30:00Z"
  }
}
```

#### Delete Bookmark

Remove a bookmark.

- **Method:** `DELETE`
- **Path:** `/api/v1/bookmarks/:id`
- **Auth:** Required
- **Response:** `204 No Content`

---

### Feedback

#### Submit Feedback

Submit feedback on an explanation.

- **Method:** `POST`
- **Path:** `/api/v1/feedback`
- **Auth:** Optional (anonymous allowed)
- **Request Body:**

```json
{
  "explanationId": "uuid",
  "rating": 4,
  "feedbackType": "helpful",
  "comment": "Very clear explanation, thank you!"
}
```

- **Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Thank you for your feedback!"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists (e.g., duplicate bookmark) |
| `RATE_LIMITED` | 429 | Too many requests |
| `AI_UNAVAILABLE` | 503 | AI service temporarily unavailable |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Rate Limiting

### Limits by Auth Status

| Endpoint | Guest | Authenticated |
|----------|-------|---------------|
| GET /laws/* | 100/min | 200/min |
| GET /search | 30/min | 100/min |
| GET /explanations | 20/min | 50/min |
| POST /explanations/stream | 5/min | 20/min |
| POST /bookmarks | N/A | 50/min |
| POST /feedback | 10/min | 30/min |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706348400
```

---

## Versioning

API is versioned via URL path (`/api/v1/`).

**Deprecation Policy:**
- Old versions supported for 6 months after new version release
- Deprecation warnings via `X-API-Deprecation` header
- Breaking changes only in major versions

---

*Document: 18 of 20 | Phase 5: Detailed Design*
*Project: LawMadeSimple | Created: January 2026*
