# Nigerian Law Sources Research

> Comprehensive research on available sources for Nigerian legal content.

**Status:** Complete
**Researched:** January 28, 2026
**Decision:** PLAC as primary source (see recommendations)

---

## Executive Summary

We evaluated 6 potential sources for Nigerian law content. **PLAC (Policy and Legal Advocacy Centre)** emerged as the best primary source for our 6 MVP laws, supplemented by specific sources for state laws (Lagos Tenancy Law) and recent legislation (CAMA 2020).

---

## Sources Evaluated

### 1. PLAC (Policy and Legal Advocacy Centre) - **RECOMMENDED PRIMARY**

| Attribute | Details |
|-----------|---------|
| **URL** | [placng.org/lawsofnigeria](https://placng.org/lawsofnigeria/) |
| **Type** | Non-profit capacity building organization |
| **Content** | Complete 2004 Laws of Nigeria + Recent Acts (2023-2025) |
| **Format** | PDF downloads, web pages |
| **Cost** | Free |
| **Currency** | Very current - has 2025 acts, 2023 Constitution amendments |
| **Licensing** | Government documents (public domain) |
| **Extraction** | Manual PDF extraction or scraping |

**Available Laws (Verified):**

| Law | Available | Link |
|-----|-----------|------|
| Constitution 1999 (with all alterations) | ✅ Yes | [PDF](https://placng.org/i/wp-content/uploads/2023/11/Constitution-of-the-Federal-Republic-of-Nigeria-1999-Updated.pdf) |
| Labour Act (Cap L1) | ✅ Yes | [PDF](https://lawsofnigeria.placng.org/laws/L1.pdf) |
| Police Act 2020 | ✅ Yes | [PDF](https://placng.org/i/wp-content/uploads/2020/09/Police-Act-2020.pdf) |
| FIRS Establishment Act | ✅ Yes | [PDF](https://www.placng.org/lawsofnigeria/laws/F36.pdf) |
| Companies Income Tax Act | ✅ Yes | [PDF](https://lawsofnigeria.placng.org/laws/C21.pdf) |
| CAMA (old version) | ⚠️ 2004 only | [PDF](https://placng.org/lawsofnigeria/laws/C20.pdf) |
| Lagos Tenancy Law | ❌ No | State law, not federal |

**Pros:**
- Most up-to-date federal laws
- Includes recent constitutional amendments
- Organized alphabetically
- Free access
- Trusted non-profit source

**Cons:**
- No API
- Requires PDF parsing or manual entry
- Missing CAMA 2020 (only has old version)
- No state laws

---

### 2. Laws.Africa API - **BEST FOR API ACCESS (BUT STALE)**

| Attribute | Details |
|-----------|---------|
| **URL** | [laws.africa/api](https://laws.africa/api/) |
| **Type** | South African non-profit |
| **Content** | Nigerian legislation (via NigeriaLII partnership) |
| **Format** | JSON, Akoma Ntoso XML, HTML, ePUB, PDF |
| **Cost** | Free for non-commercial (CC-BY-NC-SA) |
| **Currency** | **Stale - Nigerian content last updated ~2018** |
| **Licensing** | CC-BY-NC-SA (non-commercial) or contact for commercial |
| **Extraction** | REST API with structured data |

**API Features:**
- Machine-readable formats
- Rich JSON metadata
- Amendments/commencement tracking
- Akoma Ntoso XML (industry standard)

**Pros:**
- Proper API access
- Structured, machine-readable data
- Good documentation

**Cons:**
- Nigerian content outdated (2018)
- Would need to verify coverage
- Commercial use requires licensing discussion

**Potential Use:** Contact them about updating Nigerian content or licensing for commercial use. Could be a partnership opportunity.

---

### 3. NigeriaLII - **DEFUNCT**

| Attribute | Details |
|-----------|---------|
| **URL** | [nigerialii.org](https://nigerialii.org/) |
| **Type** | National Judicial Institute project |
| **Status** | **No longer functional - last updated 2018** |
| **Content** | Laws, gazettes, court judgments (historical) |
| **Format** | HTML, PDF |
| **Cost** | Free |

**Why It Failed:**
- Relied on external technical and financial support
- No clear plan for domestic sustainability
- Became vulnerable and unsustainable

**Lesson for NigerianLawsAPI:** Build sustainable revenue model from the start.

---

### 4. OpenLawsNig - **MOBILE-FOCUSED, NO API**

| Attribute | Details |
|-----------|---------|
| **URL** | [openlawsnig.org.ng](https://www.openlawsnig.org.ng/) |
| **Type** | Legal tech startup (Gbolissimo Technologies) |
| **Content** | Recent laws (2020-2025), mobile apps for specific laws |
| **Format** | SPA website, mobile apps |
| **Cost** | Free |
| **API** | None |

**Available Content:**
- CAMA 2020 (mobile app)
- Electoral Act 2022 (mobile app)
- RPC 2023 (mobile app)
- Nigeria Tax Act 2025 (website)
- Constitution 5th Alteration (website, partial)

**Limitations:**
- Single Page Application - no direct URLs to laws
- Not indexed by search engines
- Content fragmented across mobile apps
- "All rights reserved" - unclear licensing for reuse
- Missing Labour Act, Police Act, Lagos Tenancy

**Coverage for our 6 MVP laws:** 2/6 (CAMA and Tax only)

---

### 5. Nigerian-Law.org - **CERTIFICATE EXPIRED**

| Attribute | Details |
|-----------|---------|
| **URL** | [nigeria-law.org](http://www.nigeria-law.org/) |
| **Status** | SSL certificate expired - likely unmaintained |

**Not recommended** due to security issues and apparent abandonment.

---

### 6. LawPavilion - **COMMERCIAL, NO API**

| Attribute | Details |
|-----------|---------|
| **URL** | [lawpavilion.com](https://lawpavilion.com/) |
| **Type** | Commercial legal database |
| **Content** | Most comprehensive Nigerian legal database |
| **Format** | Proprietary software (Prime), online platform |
| **Cost** | Paid subscription (pricing not public) |
| **API** | No public API |

**Products:**
- LawPavilion Prime (offline e-library)
- Primsol (online platform)
- LawPavilionGPT (AI research tool)

**Pros:**
- Most comprehensive
- Regularly updated
- AI features

**Cons:**
- No API for integration
- Expensive (enterprise pricing)
- Designed for law firms, not developers

---

### 7. Official Gazette - **AUTHORITATIVE BUT SCATTERED**

| Attribute | Details |
|-----------|---------|
| **Sources** | National Library Repository, government agency sites |
| **Content** | Original published laws |
| **Format** | PDF scans |
| **Cost** | N3,000 per copy (subscription) or free on various sites |

**Access Points:**
- [National Library Repository](https://nigeriareposit.nln.gov.ng/)
- Individual agency websites (CBN, FCCPC, etc.)
- NigeriaLII (historical, 1957-2017)

**Pros:**
- Authoritative primary source

**Cons:**
- Scattered across sites
- PDF scans (not machine-readable)
- Inconsistent access

---

### 8. Lagos Ministry of Justice - **FOR LAGOS STATE LAWS**

| Attribute | Details |
|-----------|---------|
| **URL** | [lagosministryofjustice.org](http://lagosministryofjustice.org/) |
| **Content** | Lagos State laws |
| **Format** | PDF |
| **Cost** | Free |

**Lagos Tenancy Law 2011:**
- [Direct PDF Link](http://lagosministryofjustice.org/wp-content/uploads/2022/01/Tenancy-Law-2011.pdf)
- Official source from state government

---

### 9. ICNL - **FOR CAMA 2020**

| Attribute | Details |
|-----------|---------|
| **URL** | [icnl.org](https://www.icnl.org/resources/library/companies-and-allied-matters-act-2020) |
| **Type** | International Center for Not-for-Profit Law |
| **Content** | CAMA 2020 full text |
| **Format** | PDF |
| **Cost** | Free |

**Best source for CAMA 2020** (the current version).

---

## Recommendation: Content Acquisition Strategy

### Primary Sources by Law

| Law | Primary Source | Backup Source |
|-----|----------------|---------------|
| **Constitution 1999** | PLAC | Official Gazette |
| **Labour Act** | PLAC | - |
| **CAMA 2020** | ICNL | Sabi Law |
| **Police Act 2020** | PLAC | - |
| **Tax Acts** | PLAC | - |
| **Lagos Tenancy Law 2011** | Lagos MOJ | - |

### Direct Download Links (Final)

| Law | Download Link |
|-----|---------------|
| Constitution (Updated) | [PLAC PDF](https://placng.org/i/wp-content/uploads/2023/11/Constitution-of-the-Federal-Republic-of-Nigeria-1999-Updated.pdf) |
| Labour Act | [PLAC PDF](https://lawsofnigeria.placng.org/laws/L1.pdf) |
| CAMA 2020 | [ICNL](https://www.icnl.org/resources/library/companies-and-allied-matters-act-2020) |
| Police Act 2020 | [PLAC PDF](https://placng.org/i/wp-content/uploads/2020/09/Police-Act-2020.pdf) |
| FIRS Act | [PLAC PDF](https://www.placng.org/lawsofnigeria/laws/F36.pdf) |
| Companies Income Tax Act | [PLAC PDF](https://lawsofnigeria.placng.org/laws/C21.pdf) |
| Lagos Tenancy Law 2011 | [Lagos MOJ PDF](http://lagosministryofjustice.org/wp-content/uploads/2022/01/Tenancy-Law-2011.pdf) |

---

## Content Ingestion Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                 Law Ingestion Workflow                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. SOURCE                                                   │
│     └─> Download PDF from identified source                  │
│     └─> Record source URL, fetch date in LawSource model     │
│                                                              │
│  2. EXTRACT                                                  │
│     └─> Parse PDF structure (chapters, sections, articles)   │
│     └─> Extract text content                                 │
│     └─> Identify official citation, effective dates          │
│                                                              │
│  3. STRUCTURE                                                │
│     └─> Map to Prisma schema (Law → Section → Article)       │
│     └─> Generate URL-friendly slugs                          │
│     └─> Add metadata (category, jurisdiction, status)        │
│                                                              │
│  4. VALIDATE                                                 │
│     └─> Cross-reference with source document                 │
│     └─> Check section/article completeness                   │
│     └─> Mark sourceVerifiedAt date                           │
│                                                              │
│  5. SEED                                                     │
│     └─> Create/update seed script in prisma/seed.ts          │
│     └─> Run npm run db:seed                                  │
│     └─> Verify in Prisma Studio                              │
│                                                              │
│  6. DOCUMENT                                                 │
│     └─> Update this document with any issues found           │
│     └─> Note gaps or sections that need manual review        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

---

## 10. Intellectual Property Laws - **MVP ADDITION**

> Added January 28, 2026 — IP law included in MVP to serve young Nigerian creatives (content creators, musicians, designers, streamers).

### 10.1 Copyright Act 2022 - **PRIMARY IP LAW**

| Attribute | Details |
|-----------|---------|
| **URL** | [PLAC](https://placng.org/i/wp-content/uploads/2023/04/Copyright-Act-2022.pdf) |
| **Official Source** | [Nigerian Copyright Commission](https://www.copyright.gov.ng/CopyrightAct/CopyrightAct2023FinalPublication1.pdf) |
| **Type** | Recent legislation (repeals Cap C28, LFN 2004) |
| **Format** | PDF |
| **Cost** | Free |
| **Commenced** | March 17, 2023 |

**Key Provisions for Young Creatives:**
- Section 1: Objectives (protection of authors, fair access)
- Part II: Works eligible for copyright (literary, musical, artistic, audiovisual, sound recordings)
- Part III: Rights of copyright owners
- Part IV: Moral rights
- Part V: Limitations and exceptions (fair dealing)
- Part VI: Duration of copyright
- Part VII: Infringement and remedies

**Direct Download:** [PLAC PDF](https://placng.org/i/wp-content/uploads/2023/04/Copyright-Act-2022.pdf)

---

### 10.2 Trademarks Act (Cap T13, LFN 2004)

| Attribute | Details |
|-----------|---------|
| **URL** | [PLAC](https://placng.org/lawsofnigeria/laws/TRADE%20MARKS%20ACT.pdf) |
| **Type** | Federal legislation |
| **Format** | PDF |
| **Cost** | Free |

**Key Provisions for Brand Protection:**
- Section 9: Registration in Part A (inherently distinctive marks)
- Section 10: Registration in Part B (capable of becoming distinctive)
- Sections 11-13: Non-registrable marks
- Section 23: Duration and renewal (limited but renewable monopoly)
- Sections 5-6: Exclusive use and authorization rights

**Direct Download:** [PLAC PDF](https://placng.org/lawsofnigeria/laws/TRADE%20MARKS%20ACT.pdf)

---

### 10.3 Patents and Designs Act (Cap P2, LFN 2004)

| Attribute | Details |
|-----------|---------|
| **URL** | [PLAC](http://lawsofnigeria.placng.org/laws/P2.pdf) |
| **Type** | Federal legislation (Act No. 60 of 1970) |
| **Format** | PDF |
| **Cost** | Free |
| **Note** | First Schedule amended by Business Facilitation Act 2022 |

**Key Provisions:**
- Part I: Patents (registration, requirements, duration - 20 years)
- Part II: Designs (registration, industrial designs)
- Procedures at Patent Registry

**Direct Download:** [PLAC PDF](http://lawsofnigeria.placng.org/laws/P2.pdf)

---

### IP Law Sources Summary

| Law | Primary Source | Status |
|-----|----------------|--------|
| Copyright Act 2022 | PLAC | ✅ Ready to download |
| Trademarks Act (Cap T13) | PLAC | ✅ Ready to download |
| Patents & Designs Act (Cap P2) | PLAC | ✅ Ready to download |

---

## Future Expansion Sources

For post-MVP law coverage:

| Source | Best For |
|--------|----------|
| PLAC | Additional federal laws |
| State government sites | State-specific laws |
| Laws.Africa API | Bulk historical data (if updated) |
| Official Gazette | Amendment tracking |

---

## Potential Partnerships

| Organization | Opportunity |
|--------------|-------------|
| Laws.Africa | Data partnership for Nigerian content updates |
| PLAC | Content verification, official endorsement |
| OpenLawsNig | Technology partnership or acquisition |
| Nigerian Bar Association | Credibility, distribution |

---

*Document Version: 1.0*
*Last Updated: January 28, 2026*
