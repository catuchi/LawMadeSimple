# User Stories

> Actionable user stories organized by epic.

---

## Epic 1: Law Discovery

*Users find relevant laws without needing legal knowledge.*

### US-1.1: Browse Scenarios

**As a** common Nigerian
**I want to** browse legal scenarios like "landlord issues" or "police encounters"
**So that** I can find relevant laws without knowing legal terminology

**Acceptance Criteria:**
- Given I'm on the homepage, when I click "I'm dealing with...", then I see a list of scenario categories
- Given I see scenario categories, when I click one, then I see sub-scenarios or relevant law sections
- Given I select a scenario, when the page loads, then I see explanations relevant to my situation

**Priority**: P0
**Story Points**: 5
**Dependencies**: Law content database

---

### US-1.2: Search Laws

**As a** user
**I want to** search for laws using keywords or questions
**So that** I can quickly find specific legal information

**Acceptance Criteria:**
- Given I'm on any page, when I type in the search bar, then I see suggestions after 2 characters
- Given I submit a search, when results load, then I see relevant laws and explanations ranked by relevance
- Given I see search results, when I click one, then I go to the full explanation page

**Priority**: P0
**Story Points**: 8
**Dependencies**: Full-text search implementation

---

### US-1.3: View Related Content

**As a** user reading an explanation
**I want to** see related scenarios and laws
**So that** I can explore connected legal topics

**Acceptance Criteria:**
- Given I'm reading an explanation, when I scroll down, then I see "Related topics" section
- Given I see related topics, when I click one, then I navigate to that explanation
- Given related topics, then they are contextually relevant to my current page

**Priority**: P1
**Story Points**: 3
**Dependencies**: Scenario mapping

---

## Epic 2: Law Comprehension

*Users understand laws in plain language with practical examples.*

### US-2.1: Read Plain Language Explanation

**As a** common Nigerian
**I want to** read an explanation of a law in simple, everyday language
**So that** I can understand my rights without legal training

**Acceptance Criteria:**
- Given I select a law section, when the page loads, then I see a plain language explanation
- Given an explanation, then it uses language accessible to a high school graduate
- Given an explanation, then technical legal terms are defined inline

**Priority**: P0
**Story Points**: 8
**Dependencies**: AI explanation engine

---

### US-2.2: See Practical Examples

**As a** user
**I want to** see practical examples of how the law applies in real situations
**So that** I can relate the law to my own circumstances

**Acceptance Criteria:**
- Given I'm reading an explanation, when I look at the content, then I see at least one practical example
- Given a practical example, then it uses Nigerian context (names, currency, situations)
- Given a practical example, then it illustrates the law's real-world application

**Priority**: P0
**Story Points**: 5
**Dependencies**: AI explanation engine

---

### US-2.3: View Original Law Text

**As a** user
**I want to** see the original law text alongside the explanation
**So that** I can verify the explanation is accurate

**Acceptance Criteria:**
- Given I'm reading an explanation, when I click "View Original", then I see the source law text
- Given original law text, then the relevant section is highlighted
- Given original law text, then the source citation is clearly displayed

**Priority**: P0
**Story Points**: 3
**Dependencies**: Law content display

---

### US-2.4: Understand Disclaimers

**As a** user
**I want to** understand that explanations are not legal advice
**So that** I know when to consult a professional

**Acceptance Criteria:**
- Given I'm reading an explanation, then a disclaimer is visible stating "This is not legal advice"
- Given the disclaimer, then it suggests consulting a lawyer for complex situations
- Given any page, then the footer contains legal disclaimers

**Priority**: P0
**Story Points**: 2
**Dependencies**: None

---

## Epic 3: User Account

*Users can save progress and personalize their experience.*

### US-3.1: Sign In with Google

**As a** user
**I want to** sign in with my Google account
**So that** I can access the platform without creating a new password

**Acceptance Criteria:**
- Given I'm on the sign-in page, when I click "Sign in with Google", then Google OAuth flow starts
- Given I complete Google auth, when I return to the app, then I'm signed in
- Given it's my first sign-in, then a user account is created automatically

**Priority**: P0
**Story Points**: 5
**Dependencies**: Supabase Auth setup

---

### US-3.2: Sign In with Magic Link

**As a** user
**I want to** sign in using an email link
**So that** I can access the platform without remembering a password

**Acceptance Criteria:**
- Given I'm on the sign-in page, when I enter my email and click "Send Magic Link", then an email is sent
- Given I receive the email, when I click the link, then I'm signed in
- Given the link, then it expires after 1 hour

**Priority**: P0
**Story Points**: 3
**Dependencies**: Supabase Auth, Email (Resend)

---

### US-3.3: Browse as Guest

**As a** new visitor
**I want to** browse laws and scenarios without signing in
**So that** I can evaluate the platform before committing

**Acceptance Criteria:**
- Given I'm not signed in, when I browse scenarios, then I can view content
- Given I'm a guest, when I try to save content, then I'm prompted to sign in
- Given I'm a guest, then I have limited explanation views (e.g., 5/day)

**Priority**: P0
**Story Points**: 3
**Dependencies**: Auth middleware

---

### US-3.4: Bookmark Explanations

**As a** signed-in user
**I want to** save explanations to my account
**So that** I can access them easily later

**Acceptance Criteria:**
- Given I'm signed in and reading an explanation, when I click "Save", then it's bookmarked
- Given I have bookmarks, when I visit my saved items, then I see all bookmarked content
- Given a bookmark, when I click "Remove", then it's removed from my saved items

**Priority**: P0
**Story Points**: 5
**Dependencies**: User account system

---

## Epic 4: Content Sharing

*Users share legal information with others.*

### US-4.1: Share via Link

**As a** user
**I want to** share an explanation via a link
**So that** others can access the same information

**Acceptance Criteria:**
- Given I'm on an explanation page, when I click "Share", then a shareable link is copied
- Given someone clicks the shared link, when the page loads, then they see the explanation
- Given a shared link, then no authentication is required to view

**Priority**: P0
**Story Points**: 2
**Dependencies**: None

---

### US-4.2: Social Media Preview

**As a** user sharing on social media
**I want to** links to show a preview card
**So that** the content looks professional when shared

**Acceptance Criteria:**
- Given I share a link on WhatsApp/Twitter/Facebook, then a preview card appears
- Given the preview, then it shows the law title and brief description
- Given the preview, then it includes LawMadeSimple branding

**Priority**: P1
**Story Points**: 2
**Dependencies**: Meta tags

---

## Epic 5: Feedback & Quality

*Users help improve content quality through feedback.*

### US-5.1: Rate Explanation Helpfulness

**As a** user
**I want to** indicate if an explanation was helpful
**So that** the platform can improve content quality

**Acceptance Criteria:**
- Given I'm reading an explanation, when I finish, then I see "Was this helpful?" prompt
- Given the prompt, when I click Yes/No, then my feedback is recorded
- Given I click No, then I can optionally explain why

**Priority**: P0
**Story Points**: 3
**Dependencies**: Feedback storage

---

### US-5.2: Report Incorrect Information

**As a** user
**I want to** report potentially incorrect legal information
**So that** errors can be corrected

**Acceptance Criteria:**
- Given I'm reading an explanation, when I click "Report Issue", then a form appears
- Given the form, when I describe the issue and submit, then it's recorded
- Given a report, then it's flagged for review

**Priority**: P1
**Story Points**: 3
**Dependencies**: Feedback system

---

## Epic 6: SME-Specific Content

*Small business owners get business-specific legal guidance.*

### US-6.1: View Business Registration Guide

**As an** SME owner
**I want to** understand how to register my business under CAMA
**So that** I can operate legally

**Acceptance Criteria:**
- Given I select "Starting a Business" scenario, then I see CAMA registration content
- Given the content, then it explains different company types
- Given the content, then it includes step-by-step guidance

**Priority**: P0
**Story Points**: 5
**Dependencies**: CAMA content

---

### US-6.2: Understand Tax Obligations

**As an** SME owner
**I want to** understand my tax obligations under FIRS
**So that** I can comply with tax laws

**Acceptance Criteria:**
- Given I select "Business Taxes" scenario, then I see FIRS content
- Given the content, then it explains what taxes apply
- Given the content, then it includes practical examples for small businesses

**Priority**: P0
**Story Points**: 5
**Dependencies**: FIRS content

---

## Story Map

| User Activity | Discover Laws | Understand Laws | Save & Share | Provide Feedback |
|---------------|---------------|-----------------|--------------|------------------|
| **Must Have (P0)** | US-1.1, US-1.2 | US-2.1, US-2.2, US-2.3, US-2.4 | US-3.1, US-3.2, US-3.3, US-3.4, US-4.1 | US-5.1 |
| **Should Have (P1)** | US-1.3 | — | US-4.2 | US-5.2 |
| **Nice to Have (P2)** | — | — | — | — |

---

## Story Summary

| Priority | Count | Total Story Points |
|----------|-------|-------------------|
| P0 | 16 stories | ~65 points |
| P1 | 4 stories | ~11 points |
| P2 | 0 stories | 0 points |
| **Total** | 20 stories | ~76 points |

---

*Document: 08 of 20 | Phase 2: Requirements*
*Project: LawMadeSimple | Created: January 2026*
