# User Requirements Document

> What users need from LawMadeSimple.

---

## Document Control

- **Version**: 1.0
- **Business Idea**: Democratizing Nigerian law through plain language explanations with practical examples
- **Target Users**: Common Nigerians + SMEs

---

## User Needs Analysis

### UN-01: Understand Laws in Plain Language

- **Description**: Users need to read and understand Nigerian laws without legal training. Complex legal text should be translated into everyday language.
- **Priority**: High (P0)
- **Source**: All personas (Adaeze, Chukwuemeka, Tunde, Ngozi)
- **Acceptance Criteria**:
  - [ ] Every law section can be explained in plain language
  - [ ] Reading level is accessible to high school graduates
  - [ ] No unexplained legal jargon in explanations
  - [ ] Users can understand in < 2 minutes of reading

---

### UN-02: See Practical Real-Life Examples

- **Description**: Users need to see how laws apply to real situations. Abstract legal concepts should be illustrated with concrete, relatable examples.
- **Priority**: High (P0)
- **Source**: All personas
- **Acceptance Criteria**:
  - [ ] Each explanation includes at least one practical example
  - [ ] Examples reflect Nigerian context (names, situations, currency)
  - [ ] Examples cover common scenarios users actually face
  - [ ] Users can relate example to their own situation

---

### UN-03: Discover Relevant Laws from Scenarios

- **Description**: Users don't know which law applies to their situation. They need to describe their scenario and find relevant legal information.
- **Priority**: High (P0)
- **Source**: Adaeze (tenant), Tunde (employee), Ngozi (citizen)
- **Acceptance Criteria**:
  - [ ] "I'm dealing with..." entry point exists
  - [ ] Scenarios mapped to relevant laws
  - [ ] User can navigate without legal knowledge
  - [ ] Top scenarios are easily discoverable

---

### UN-04: Search for Specific Legal Information

- **Description**: Users need to search for laws, topics, or keywords to find relevant information quickly.
- **Priority**: High (P0)
- **Source**: Chukwuemeka (SME owner), power users
- **Acceptance Criteria**:
  - [ ] Search bar is prominently displayed
  - [ ] Results are relevant and ranked properly
  - [ ] Search works for both legal terms and plain language
  - [ ] Results include both law text and explanations

---

### UN-05: Verify Information Sources

- **Description**: Users need to trust the information. They should be able to see the original law text and verify explanations are accurate.
- **Priority**: High (P0)
- **Source**: All personas (trust is critical for legal content)
- **Acceptance Criteria**:
  - [ ] Every explanation cites source law section
  - [ ] Original law text is accessible with one click
  - [ ] "Last verified" date is visible
  - [ ] Users can report inaccurate information

---

### UN-06: Access on Mobile Devices

- **Description**: Most Nigerian users access internet via smartphones. The platform must work well on mobile devices.
- **Priority**: High (P0)
- **Source**: Demographics (mobile-first country)
- **Acceptance Criteria**:
  - [ ] Responsive design works on all screen sizes
  - [ ] Touch-friendly navigation
  - [ ] Fast load times on 3G/4G networks
  - [ ] Key actions require minimal scrolling

---

### UN-07: Save and Return to Information

- **Description**: Users need to save explanations they find useful for future reference or to share with others.
- **Priority**: Medium (P0)
- **Source**: All personas
- **Acceptance Criteria**:
  - [ ] Bookmark/save functionality exists
  - [ ] Saved items are accessible after login
  - [ ] Sharing via link works
  - [ ] Offline access for saved items (PWA)

---

### UN-08: Understand Limitations and Disclaimers

- **Description**: Users must understand that the platform provides legal information, not legal advice. Disclaimers must be clear but not obtrusive.
- **Priority**: High (P0)
- **Source**: Legal compliance requirement
- **Acceptance Criteria**:
  - [ ] Disclaimer visible on all explanations
  - [ ] Clear language: "This is not legal advice"
  - [ ] Suggestion to consult lawyer for complex situations
  - [ ] User accepts terms before full access

---

### UN-09: Sign In Without Password Friction

- **Description**: Users should be able to create accounts and sign in easily without managing passwords.
- **Priority**: Medium (P0)
- **Source**: UX best practices, Nigerian user behavior
- **Acceptance Criteria**:
  - [ ] Google sign-in available
  - [ ] Magic link (email) sign-in available
  - [ ] No password required
  - [ ] Guest access for browsing without account

---

### UN-10: Get Help for Business-Specific Legal Questions

- **Description**: SME owners need guidance specific to running a business — registration, taxes, employment.
- **Priority**: Medium (P1)
- **Source**: Chukwuemeka (SME owner)
- **Acceptance Criteria**:
  - [ ] SME section or category exists
  - [ ] CAMA content covers business registration
  - [ ] FIRS content covers tax basics
  - [ ] Labour Act content covers employment law

---

## User Journey Maps

### Journey 1: Tenant Seeking Rights Information (Adaeze)

| Stage | User Action | System Response | Emotion | Opportunities |
|-------|-------------|-----------------|---------|---------------|
| **Trigger** | Landlord demands rent increase mid-lease | — | Frustrated, confused | — |
| **Discovery** | Searches "tenant rights Nigeria" on Google | SEO-optimized landing page appears | Curious, hopeful | Clear value prop |
| **Entry** | Clicks result, lands on LawMadeSimple | Homepage with "I'm dealing with..." option | Interested | Guide to relevant content |
| **Navigation** | Selects "Landlord/Tenant issues" scenario | Guided to tenancy laws section | Engaged | Scenario-based navigation |
| **Consumption** | Reads plain language explanation | Clear explanation with example | Relieved, informed | Practical, relatable example |
| **Verification** | Clicks to see original law text | Source law section displayed | Trusting | Citation builds confidence |
| **Action** | Saves explanation, shares with friend | Bookmark saved, share link generated | Empowered | Easy sharing |
| **Return** | Comes back when new issue arises | Login restores saved content | Loyal | Personalized experience |

---

### Journey 2: SME Owner Registering Business (Chukwuemeka)

| Stage | User Action | System Response | Emotion | Opportunities |
|-------|-------------|-----------------|---------|---------------|
| **Trigger** | Wants to register logistics company properly | — | Anxious, overwhelmed | — |
| **Discovery** | Searches "how to register company Nigeria CAMA" | LawMadeSimple article ranks | Hopeful | SEO for business queries |
| **Entry** | Lands on CAMA business registration guide | Clear, step-by-step guidance | Relieved | Structured content |
| **Deep Dive** | Reads about company types, requirements | Explanations with examples | Informed | Practical business examples |
| **Cross-Reference** | Wants to understand tax obligations | Link to FIRS section | Efficient | Related content linking |
| **Sign Up** | Creates account to save progress | Quick Google sign-in | Smooth | Frictionless auth |
| **Return** | Returns weekly as business grows | Personalized recommendations | Valued | SME-focused features |

---

### Journey 3: Employee Checking Rights (Tunde)

| Stage | User Action | System Response | Emotion | Opportunities |
|-------|-------------|-----------------|---------|---------------|
| **Trigger** | No overtime pay, employer threatening termination | — | Angry, powerless | — |
| **Discovery** | Sees LawMadeSimple mentioned on Twitter/X | Social proof, user testimonial | Curious | Community presence |
| **Entry** | Visits site, sees "Employment issues" scenario | Guided path to Labour Act | Hopeful | Clear scenario matching |
| **Question** | Wonders "Is it legal to not pay overtime?" | AI explains Labour Act provisions | Enlightened | Direct answer to question |
| **Deep Dive** | Reads about termination rights | Comprehensive explanation | Prepared | Covers related concerns |
| **Action** | Shares on social media | Shareable card/link | Advocate | Word-of-mouth growth |

---

### Journey 4: Citizen Learning Rights (Ngozi)

| Stage | User Action | System Response | Emotion | Opportunities |
|-------|-------------|-----------------|---------|---------------|
| **Trigger** | Nephew harassed by police | — | Worried, angry | — |
| **Discovery** | Searches "police rights Nigeria" | LawMadeSimple guide appears | Concerned | Content for common fears |
| **Entry** | Reads "Know Your Rights: Police Encounters" | Clear dos and don'ts | Reassured | Practical, actionable |
| **Verification** | Sees Constitution citation | Source clearly marked | Trusting | Authority building |
| **Offline Need** | Wants to access later without internet | PWA offline mode | Practical | Offline capability |
| **Teaching** | Shares with family members | Easy sharing, printable format | Protective | Family/community sharing |

---

## User Experience Requirements

| ID | Requirement | Rationale | Priority |
|----|-------------|-----------|----------|
| UX-01 | Page loads in < 2 seconds on 3G | Nigerian network conditions | P0 |
| UX-02 | Mobile-first responsive design | Majority mobile users | P0 |
| UX-03 | Maximum 3 clicks to any explanation | Reduce friction | P0 |
| UX-04 | Reading level at high school graduate | Accessibility for target users | P0 |
| UX-05 | Consistent navigation across all pages | Usability | P0 |
| UX-06 | Touch targets minimum 44x44 pixels | Mobile usability | P0 |
| UX-07 | Clear visual hierarchy for content | Scannability | P0 |
| UX-08 | Offline access for saved content | Connectivity issues | P1 |
| UX-09 | Dark mode option | User preference, battery saving | P2 |
| UX-10 | Text size adjustment | Accessibility | P1 |

---

*Document: 05 of 20 | Phase 2: Requirements*
*Project: LawMadeSimple | Created: January 2026*
