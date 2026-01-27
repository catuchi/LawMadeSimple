# Requirements Traceability Matrix

> Tracing requirements from business objectives to implementation.

---

## Forward Traceability

| Business Objective | User Requirement | Functional Req | User Story | Test Case |
|-------------------|------------------|----------------|------------|-----------|
| User Acquisition | UN-01: Plain Language | FR-2.1: Generate Explanations | US-2.1: Read Plain Language | TC-2.1 |
| User Acquisition | UN-03: Scenario Discovery | FR-3.1: Display Scenarios | US-1.1: Browse Scenarios | TC-1.1 |
| User Acquisition | UN-04: Search | FR-4.1: Full-Text Search | US-1.2: Search Laws | TC-1.2 |
| Comprehension Impact | UN-01: Plain Language | FR-2.1: Generate Explanations | US-2.1: Read Plain Language | TC-2.1 |
| Comprehension Impact | UN-02: Practical Examples | FR-2.1: Generate Explanations | US-2.2: See Examples | TC-2.2 |
| Content Coverage | UN-01: Plain Language | FR-1.1: Store Law Text | US-6.1, US-6.2: SME Content | TC-6.x |
| Platform Trust | UN-05: Verify Sources | FR-2.1: Source Citations | US-2.3: View Original | TC-2.3 |
| Platform Trust | UN-08: Disclaimers | FR-7.1: Display Disclaimers | US-2.4: Understand Disclaimers | TC-7.1 |
| Sustainability | UN-09: Easy Sign-In | FR-5.1, FR-5.2: OAuth/Magic Link | US-3.1, US-3.2: Sign In | TC-3.x |

---

## Backward Traceability

| User Story | Functional Req | User Requirement | Business Objective |
|------------|----------------|------------------|-------------------|
| US-1.1: Browse Scenarios | FR-3.1, FR-3.2 | UN-03 | User Acquisition |
| US-1.2: Search Laws | FR-4.1, FR-4.2 | UN-04 | User Acquisition |
| US-1.3: Related Content | FR-3.3 | UN-03 | Comprehension Impact |
| US-2.1: Plain Language | FR-2.1 | UN-01 | Comprehension Impact |
| US-2.2: Practical Examples | FR-2.1 | UN-02 | Comprehension Impact |
| US-2.3: Original Text | FR-1.2, FR-2.1 | UN-05 | Platform Trust |
| US-2.4: Disclaimers | FR-7.1 | UN-08 | Platform Trust |
| US-3.1: Google Sign-In | FR-5.1 | UN-09 | Sustainability |
| US-3.2: Magic Link | FR-5.2 | UN-09 | Sustainability |
| US-3.3: Guest Access | FR-5.3 | UN-09 | User Acquisition |
| US-3.4: Bookmarks | FR-6.1 | UN-07 | User Acquisition |
| US-4.1: Share Link | FR-6.2 | UN-07 | User Acquisition |
| US-5.1: Rate Helpful | FR-6.3 | UN-05 | Comprehension Impact |
| US-6.1: Business Registration | FR-1.1, FR-2.1 | UN-10 | Content Coverage |
| US-6.2: Tax Obligations | FR-1.1, FR-2.1 | UN-10 | Content Coverage |

---

## Coverage Analysis

### Business Objectives Coverage

| Objective | Requirements | Stories | Coverage |
|-----------|--------------|---------|----------|
| User Acquisition | UN-01, UN-03, UN-04, UN-07, UN-09 | 8 stories | 100% |
| Comprehension Impact | UN-01, UN-02, UN-05 | 5 stories | 100% |
| Content Coverage | UN-01, UN-10 | 4 stories | 100% |
| Platform Trust | UN-05, UN-08 | 3 stories | 100% |
| Sustainability | UN-09 | 2 stories | 100% |

### User Requirements Coverage

| User Requirement | Functional Reqs | User Stories | Status |
|------------------|-----------------|--------------|--------|
| UN-01: Plain Language | FR-2.1 | US-2.1 | Covered |
| UN-02: Practical Examples | FR-2.1 | US-2.2 | Covered |
| UN-03: Scenario Discovery | FR-3.1, FR-3.2, FR-3.3 | US-1.1, US-1.3 | Covered |
| UN-04: Search | FR-4.1, FR-4.2 | US-1.2 | Covered |
| UN-05: Verify Sources | FR-2.1 (citations) | US-2.3 | Covered |
| UN-06: Mobile Access | NFR-P1, NFR-U4 | All stories | Covered |
| UN-07: Save Content | FR-6.1, FR-6.2 | US-3.4, US-4.1 | Covered |
| UN-08: Disclaimers | FR-7.1, FR-7.2 | US-2.4 | Covered |
| UN-09: Easy Sign-In | FR-5.1, FR-5.2, FR-5.3 | US-3.1, US-3.2, US-3.3 | Covered |
| UN-10: SME Content | FR-1.1, FR-2.1 | US-6.1, US-6.2 | Covered |

**Coverage Summary:**
- User Requirements Covered: 10/10 (100%)
- Business Objectives Covered: 5/5 (100%)

---

## Gap Analysis

| Gap | Description | Impact | Recommendation |
|-----|-------------|--------|----------------|
| No offline mode story | PWA offline not explicitly storied | Users with poor connectivity affected | Add US for offline reading (P1) |
| No analytics story | Admin analytics dashboard not storied | Product insights delayed | Add admin stories post-MVP |
| No A/B testing story | Experimentation not included | Optimization delayed | Add post-MVP |

---

## Orphan Requirements Check

**Orphan Functional Requirements (no user story):**
- FR-2.2: Cache Explanations — *Implementation detail, covered by performance NFRs*
- FR-2.3: Handle AI Errors — *Implementation detail, covered by reliability NFRs*
- FR-7.2: ToS Acceptance — *Add US-3.5: Accept Terms (P0)*

**Orphan User Stories (no requirement):**
- None identified

**Action Required:**
- [ ] Add US-3.5: Accept Terms of Service (P0)
- [ ] Add US-7.1: Read Content Offline (P1)

---

## Test Traceability

| User Story | Test Case ID | Test Type | Priority |
|------------|--------------|-----------|----------|
| US-1.1 | TC-1.1 | E2E | P0 |
| US-1.2 | TC-1.2 | E2E | P0 |
| US-2.1 | TC-2.1 | Integration | P0 |
| US-2.2 | TC-2.2 | Integration | P0 |
| US-2.3 | TC-2.3 | E2E | P0 |
| US-2.4 | TC-2.4 | E2E | P0 |
| US-3.1 | TC-3.1 | E2E | P0 |
| US-3.2 | TC-3.2 | E2E | P0 |
| US-3.3 | TC-3.3 | E2E | P0 |
| US-3.4 | TC-3.4 | E2E | P0 |
| US-4.1 | TC-4.1 | E2E | P0 |
| US-5.1 | TC-5.1 | E2E | P0 |
| US-6.1 | TC-6.1 | E2E | P0 |
| US-6.2 | TC-6.2 | E2E | P0 |

---

*Document: 09 of 20 | Phase 3: Validation*
*Project: LawMadeSimple | Created: January 2026*
