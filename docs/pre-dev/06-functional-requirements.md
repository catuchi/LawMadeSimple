# Functional Requirements Specification

> What LawMadeSimple must do.

---

## Document Control

- **Version**: 1.0
- **Source Documents**: User Requirements (05), Initial Scope (04)

---

## Requirements Overview

---

## Module 1: Law Content Management

### FR-1.1: Store Law Text

- **Description**: System shall store Nigerian federal law text in a structured format with sections, articles, and clauses.
- **Priority**: P0
- **Source**: UN-01, UN-05
- **Inputs**: Raw law text from authoritative sources
- **Outputs**: Structured law content accessible via API
- **Business Rules**:
  - Each law has metadata (title, date enacted, last amended)
  - Laws are organized hierarchically (parts > chapters > sections)
  - Each section has a unique identifier
- **Acceptance Criteria**:
  - [ ] 6 core laws are loaded and structured
  - [ ] Each section is individually addressable
  - [ ] Metadata is complete for all laws
  - [ ] Content versioning tracks "as of" dates

### FR-1.2: Display Law Text

- **Description**: System shall display original law text alongside explanations.
- **Priority**: P0
- **Source**: UN-05
- **Inputs**: Law section identifier
- **Outputs**: Formatted law text display
- **Business Rules**:
  - Original text is read-only
  - Formatting preserves legal structure
  - Citations are automatically linked
- **Acceptance Criteria**:
  - [ ] Law text renders correctly with proper formatting
  - [ ] Section numbers and references are clear
  - [ ] User can toggle between explanation and original text

---

## Module 2: AI Explanation Engine

### FR-2.1: Generate Plain Language Explanations

- **Description**: System shall generate plain language explanations of law sections using AI.
- **Priority**: P0
- **Source**: UN-01, UN-02
- **Inputs**: Law section text, user context (optional)
- **Outputs**: Plain language explanation with examples
- **Business Rules**:
  - Explanations must cite source section
  - Reading level must be accessible (high school)
  - Must include at least one practical example
  - Must include disclaimer
- **Acceptance Criteria**:
  - [ ] AI generates coherent, accurate explanations
  - [ ] Explanations include practical examples
  - [ ] Source citations are automatically included
  - [ ] Disclaimer is appended to every explanation

### FR-2.2: Cache Explanations

- **Description**: System shall cache generated explanations to reduce API costs and improve response time.
- **Priority**: P0
- **Source**: Cost constraint, UX-01
- **Inputs**: Law section identifier, explanation parameters
- **Outputs**: Cached or freshly generated explanation
- **Business Rules**:
  - Cache key based on section ID + parameters
  - Cache invalidation when law content updates
  - Cache TTL configurable (default: 30 days)
- **Acceptance Criteria**:
  - [ ] Repeated requests return cached response
  - [ ] Cache hit rate > 80% after initial population
  - [ ] Response time < 500ms for cached content

### FR-2.3: Handle AI Errors Gracefully

- **Description**: System shall handle AI API failures without breaking user experience.
- **Priority**: P0
- **Source**: Reliability requirement
- **Inputs**: Failed AI API request
- **Outputs**: Fallback response or error message
- **Business Rules**:
  - Retry failed requests up to 3 times
  - Fall back to cached content if available
  - Display user-friendly error message
  - Log errors for monitoring
- **Acceptance Criteria**:
  - [ ] API failure doesn't crash the page
  - [ ] User sees helpful error message
  - [ ] Cached fallback is used when available
  - [ ] Errors are logged to monitoring system

---

## Module 3: Scenario Discovery

### FR-3.1: Display Scenario Categories

- **Description**: System shall display browsable scenario categories for users to discover relevant laws.
- **Priority**: P0
- **Source**: UN-03
- **Inputs**: None (static content)
- **Outputs**: Categorized scenario list
- **Business Rules**:
  - Categories match common user situations
  - Each category leads to relevant law sections
  - Categories are prioritized by popularity
- **Acceptance Criteria**:
  - [ ] "I'm dealing with..." interface is prominent
  - [ ] Minimum 6 top-level categories
  - [ ] Categories cover all 6 MVP laws
  - [ ] Navigation is intuitive

### FR-3.2: Map Scenarios to Laws

- **Description**: System shall map user scenarios to relevant law sections.
- **Priority**: P0
- **Source**: UN-03
- **Inputs**: Selected scenario
- **Outputs**: List of relevant law sections
- **Business Rules**:
  - Each scenario maps to 1-5 law sections
  - Mappings include relevance ranking
  - Scenarios can be nested (general > specific)
- **Acceptance Criteria**:
  - [ ] 50+ scenarios mapped at launch
  - [ ] Mappings are accurate and relevant
  - [ ] Users find useful content via scenarios

### FR-3.3: Suggest Related Scenarios

- **Description**: System shall suggest related scenarios to help users discover additional relevant content.
- **Priority**: P1
- **Source**: UN-03, engagement
- **Inputs**: Current scenario or law section
- **Outputs**: List of related scenarios
- **Business Rules**:
  - Related scenarios based on same law or topic
  - Maximum 5 suggestions
  - Exclude current scenario from suggestions
- **Acceptance Criteria**:
  - [ ] Related scenarios appear on explanation pages
  - [ ] Suggestions are contextually relevant
  - [ ] Users explore additional content

---

## Module 4: Search

### FR-4.1: Full-Text Search

- **Description**: System shall provide full-text search across all law content and explanations.
- **Priority**: P0
- **Source**: UN-04
- **Inputs**: Search query
- **Outputs**: Ranked search results
- **Business Rules**:
  - Search indexes both law text and explanations
  - Results ranked by relevance
  - Highlights matching text in results
  - Supports both legal terms and plain language
- **Acceptance Criteria**:
  - [ ] Search returns results in < 1 second
  - [ ] Results are relevant to query
  - [ ] Both exact and fuzzy matching work
  - [ ] Empty queries handled gracefully

### FR-4.2: Search Suggestions

- **Description**: System shall provide search suggestions as user types.
- **Priority**: P1
- **Source**: UN-04, UX improvement
- **Inputs**: Partial search query
- **Outputs**: List of suggested searches
- **Business Rules**:
  - Suggestions appear after 2+ characters
  - Based on popular searches and content
  - Maximum 5 suggestions
  - Debounced to reduce API calls
- **Acceptance Criteria**:
  - [ ] Suggestions appear as user types
  - [ ] Suggestions are relevant
  - [ ] Suggestions can be selected to search

---

## Module 5: User Authentication

### FR-5.1: OAuth Sign-In

- **Description**: System shall allow users to sign in using Google OAuth.
- **Priority**: P0
- **Source**: UN-09
- **Inputs**: Google OAuth token
- **Outputs**: Authenticated user session
- **Business Rules**:
  - Uses Supabase Auth
  - Creates user record on first sign-in
  - Session persists across browser restarts
- **Acceptance Criteria**:
  - [ ] Google sign-in button is visible
  - [ ] Sign-in completes successfully
  - [ ] User is redirected appropriately after sign-in
  - [ ] Session persists until logout

### FR-5.2: Magic Link Sign-In

- **Description**: System shall allow users to sign in via email magic link.
- **Priority**: P0
- **Source**: UN-09
- **Inputs**: User email address
- **Outputs**: Email with magic link sent
- **Business Rules**:
  - Link expires after 1 hour
  - Creates user record on first use
  - Works for both sign-up and sign-in
- **Acceptance Criteria**:
  - [ ] User can enter email and request link
  - [ ] Magic link email is delivered
  - [ ] Clicking link signs user in
  - [ ] Expired links show appropriate error

### FR-5.3: Guest Access

- **Description**: System shall allow limited access without authentication.
- **Priority**: P0
- **Source**: UN-09, reduce friction
- **Inputs**: None
- **Outputs**: Guest session
- **Business Rules**:
  - Guests can browse laws and scenarios
  - Guests can read explanations (limited count)
  - Guests cannot save/bookmark content
  - Prompt to sign in for full features
- **Acceptance Criteria**:
  - [ ] Users can browse without signing in
  - [ ] Limited features prompt sign-in
  - [ ] Guest usage is tracked

---

## Module 6: User Features

### FR-6.1: Bookmark Content

- **Description**: System shall allow authenticated users to bookmark explanations for later access.
- **Priority**: P0
- **Source**: UN-07
- **Inputs**: Explanation/section identifier
- **Outputs**: Bookmark saved to user account
- **Business Rules**:
  - Requires authentication
  - Users can view all bookmarks
  - Bookmarks sync across devices
  - Users can remove bookmarks
- **Acceptance Criteria**:
  - [ ] Bookmark button visible on explanations
  - [ ] Bookmarks appear in user's saved items
  - [ ] Bookmarks persist across sessions
  - [ ] Users can unbookmark items

### FR-6.2: Share Content

- **Description**: System shall allow users to share explanations via link.
- **Priority**: P0
- **Source**: UN-07
- **Inputs**: Explanation identifier
- **Outputs**: Shareable URL
- **Business Rules**:
  - Shared links work for anyone (no auth required to view)
  - Links are short and readable
  - Shared page includes metadata for social previews
- **Acceptance Criteria**:
  - [ ] Share button visible on explanations
  - [ ] Link copies to clipboard
  - [ ] Shared link displays content correctly
  - [ ] Social media previews work

### FR-6.3: Provide Feedback

- **Description**: System shall allow users to provide feedback on explanations.
- **Priority**: P0
- **Source**: UN-05, quality improvement
- **Inputs**: Feedback type (helpful/not helpful), optional text
- **Outputs**: Feedback recorded
- **Business Rules**:
  - Simple binary feedback (helpful/not helpful)
  - Optional text feedback for "not helpful"
  - Anonymous feedback allowed
  - Feedback influences content improvement
- **Acceptance Criteria**:
  - [ ] "Was this helpful?" prompt appears
  - [ ] User can submit yes/no response
  - [ ] Optional text input for negative feedback
  - [ ] Feedback is stored and accessible

---

## Module 7: Legal Compliance

### FR-7.1: Display Disclaimers

- **Description**: System shall display appropriate disclaimers on all legal content.
- **Priority**: P0
- **Source**: UN-08, legal requirement
- **Inputs**: None
- **Outputs**: Disclaimer text displayed
- **Business Rules**:
  - Disclaimer on every explanation
  - Disclaimer on footer of every page
  - Clear, prominent language
  - Cannot be dismissed permanently
- **Acceptance Criteria**:
  - [ ] Disclaimer visible on all explanation pages
  - [ ] Language is clear: "This is not legal advice"
  - [ ] Footer disclaimer present on all pages

### FR-7.2: Terms of Service Acceptance

- **Description**: System shall require users to accept terms of service before full access.
- **Priority**: P0
- **Source**: Legal requirement
- **Inputs**: User acceptance action
- **Outputs**: ToS acceptance recorded
- **Business Rules**:
  - ToS acceptance required before sign-in completes
  - ToS version tracked
  - Re-acceptance required if ToS changes
- **Acceptance Criteria**:
  - [ ] ToS displayed during sign-up/sign-in
  - [ ] User must accept to proceed
  - [ ] Acceptance is recorded with timestamp

---

## Business Rules Summary

| ID | Rule | Description | Source |
|----|------|-------------|--------|
| BR-01 | Disclaimer Required | All explanations must include "not legal advice" disclaimer | Legal compliance |
| BR-02 | Source Citation | All explanations must cite original law section | Trust building |
| BR-03 | Practical Examples | All explanations should include at least one example | Core differentiator |
| BR-04 | Auth for Save | Saving/bookmarking requires authentication | User feature |
| BR-05 | Guest Limits | Guest users have limited explanation access | Monetization path |
| BR-06 | Content Versioning | Law content must be versioned with "as of" dates | Accuracy |

---

## Data Requirements

| Data Element | Type | Validation | Source |
|--------------|------|------------|--------|
| Law Title | String | Required, max 200 chars | Content ingestion |
| Law Section | String | Required, formatted | Content ingestion |
| Explanation Text | String | Required, max 5000 chars | AI generation |
| User Email | Email | Valid email format | Authentication |
| Feedback Rating | Boolean | Required (helpful/not helpful) | User input |
| Scenario Name | String | Required, max 100 chars | Content management |

---

*Document: 06 of 20 | Phase 2: Requirements*
*Project: LawMadeSimple | Created: January 2026*
