# Approved Requirements Baseline

> The approved scope for LawMadeSimple MVP.

---

## Document Control

- **Version**: 1.0
- **Status**: **Approved**
- **Approved By**: Product Owner (Chibu)
- **Approval Date**: January 2026
- **Created**: January 2026
- **Last Updated**: January 2026

---

## Baseline Summary

| Category | Count | Priority Breakdown |
|----------|-------|-------------------|
| User Requirements | 10 | P0: 9, P1: 1 |
| Functional Requirements | 18 | P0: 14, P1: 4 |
| Non-Functional Requirements | 25 | P0: 15, P1: 7, P2: 3 |
| User Stories | 20 | P0: 16, P1: 4 |

**Total Estimated Story Points**: ~76

---

## Approved Scope

### Phase 1: MVP (Must Have)

| ID | Requirement | Type | Status |
|----|-------------|------|--------|
| UN-01 | Plain Language Explanations | User Req | Approved |
| UN-02 | Practical Examples | User Req | Approved |
| UN-03 | Scenario Discovery | User Req | Approved |
| UN-04 | Search Functionality | User Req | Approved |
| UN-05 | Source Verification | User Req | Approved |
| UN-06 | Mobile Access | User Req | Approved |
| UN-07 | Save Content | User Req | Approved |
| UN-08 | Clear Disclaimers | User Req | Approved |
| UN-09 | Easy Sign-In | User Req | Approved |
| FR-1.1 | Store Law Text | Functional | Approved |
| FR-1.2 | Display Law Text | Functional | Approved |
| FR-2.1 | Generate Explanations | Functional | Approved |
| FR-2.2 | Cache Explanations | Functional | Approved |
| FR-2.3 | Handle AI Errors | Functional | Approved |
| FR-3.1 | Display Scenarios | Functional | Approved |
| FR-3.2 | Map Scenarios to Laws | Functional | Approved |
| FR-4.1 | Full-Text Search | Functional | Approved |
| FR-5.1 | OAuth Sign-In | Functional | Approved |
| FR-5.2 | Magic Link Sign-In | Functional | Approved |
| FR-5.3 | Guest Access | Functional | Approved |
| FR-6.1 | Bookmark Content | Functional | Approved |
| FR-6.2 | Share Content | Functional | Approved |
| FR-6.3 | Provide Feedback | Functional | Approved |
| FR-7.1 | Display Disclaimers | Functional | Approved |
| FR-7.2 | ToS Acceptance | Functional | Approved |

**MVP Content Scope:**
- Constitution of Nigeria (key rights)
- Criminal Code Act (police interactions)
- CAMA (business registration)
- Labour Act (employment)
- Tenancy provisions
- FIRS Act (tax basics)

---

### Phase 2: Post-MVP (Should Have)

| ID | Requirement | Type | Status |
|----|-------------|------|--------|
| UN-10 | SME-Specific Content (expanded) | User Req | Deferred |
| FR-3.3 | Suggest Related Scenarios | Functional | Deferred |
| FR-4.2 | Search Suggestions | Functional | Deferred |
| US-4.2 | Social Media Preview | User Story | Deferred |
| US-5.2 | Report Incorrect Info | User Story | Deferred |
| — | User Reading History | Feature | Deferred |
| — | Personalized Recommendations | Feature | Deferred |
| — | Push Notifications (PWA) | Feature | Deferred |

---

### Future Phases (Nice to Have)

| ID | Requirement | Type | Status |
|----|-------------|------|--------|
| — | Nigerian Language Support | Feature | Future |
| — | Premium Features / Paywall | Feature | Future |
| — | Case Law Integration | Feature | Future |
| — | State Law Coverage | Feature | Future |
| — | Native Mobile Apps | Feature | Future |
| — | Community Q&A | Feature | Future |

---

## Non-Functional Requirements Baseline

### P0 (Must Have for Launch)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-P1 | Page Load Time | < 2 seconds |
| NFR-P3 | AI Response Time | < 5 seconds |
| NFR-P4 | Cached Response | < 500ms |
| NFR-S1 | HTTPS Encryption | Required |
| NFR-S3 | Authentication | OAuth 2.0 |
| NFR-R1 | Uptime | 99.5% |
| NFR-U1 | Learnability | < 2 min to first action |
| NFR-A3 | Color Contrast | 4.5:1 ratio |
| NDPR | Privacy Compliance | Required |

### P1 (Should Have)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-SC1 | Concurrent Users | 500 |
| NFR-M3 | Test Coverage | 70% |
| NFR-A1 | Screen Reader Support | WCAG 2.1 AA |

---

## Exclusions (Explicitly Out of Scope)

| Feature | Reason | Revisit |
|---------|--------|---------|
| Legal advice / lawyer matching | Liability risk | Never |
| Document generation | High complexity | Phase 3+ |
| Live chat / consultation | Requires lawyers | Phase 3+ |
| State-specific laws | 36 states too broad | Phase 2 |
| Nigerian languages | Translation complexity | Phase 2 |
| Native mobile apps | PWA sufficient for MVP | Phase 2 |

---

## Dependencies for Baseline

| Dependency | Status | Owner | Risk |
|------------|--------|-------|------|
| NigeriaLII content access | Not confirmed | External | High |
| OpenAI API | Available | OpenAI | Low |
| Legal ToS review | Not started | External lawyer | High |
| Supabase account | Not set up | Developer | Low |
| Domain name | Not purchased | Developer | Low |

---

## Baseline Assumptions

| Assumption | Validated |
|------------|-----------|
| AI can explain Nigerian law accurately | No (requires testing) |
| Users will trust AI with disclaimers | No (requires testing) |
| 6 federal laws cover common scenarios | No (hypothesis) |
| English is sufficient for MVP | No (assumption) |
| Freemium model viable | No (requires research) |

---

## Approval Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner / Developer | Chibu | Pending | |
| Tech Lead | Chibu (Solo) | Pending | |
| Legal Reviewer | TBD | Pending | |

---

## Baseline Change Control

Any changes to this baseline require:
1. Documented change request (see doc 11)
2. Impact analysis
3. Approval by product owner
4. Update to this document
5. Version increment

**Current Version**: 1.0 (Initial Baseline)

---

*Document: 10 of 20 | Phase 3: Validation*
*Project: LawMadeSimple | Created: January 2026*
