# LawMadeSimple — Design Direction

> Established: January 2026
> Status: ✅ Complete — See `21-frontend-design-spec.md` for full specification

---

## Design Philosophy

**"Empowering, not intimidating"** — Like a knowledgeable friend explaining the law, not a lawyer's office.

### Core Principles
1. **Credible yet accessible** — Professional enough to trust, friendly enough to use
2. **Comprehension over access** — Design for understanding, not just information delivery
3. **Progressive disclosure** — Complex legal content revealed in digestible layers
4. **Mobile-first** — Nigerian users primarily access via smartphones

---

## Visual Direction

### Tone
| Attribute | Direction |
|-----------|-----------|
| Overall feel | Approachable professionalism |
| Not | Stuffy law firm, intimidating, corporate |
| More like | Notion Help Center, Duolingo, modern fintech |

### Color Palette (Options to Finalize)

| Option | Primary | Accent | Feel |
|--------|---------|--------|------|
| **A: Warm Trust** | Deep teal (#1A5F7A) | Warm gold (#F4B942) | Professional + Nigerian warmth |
| **B: Calm Authority** | Navy (#1E3A5F) | Soft green (#4CAF50) | Trustworthy + growth/empowerment |
| **C: Modern Civic** | Slate (#2D3748) | Vibrant yellow (#FFC107) | Tech-forward + accessible |

**Common elements:**
- Light backgrounds (white/off-white) throughout
- Color accents used strategically, not overwhelming
- High contrast for accessibility

### Typography Direction
- **Headlines**: Modern serif (Fraunces, Lora, or Playfair Display) — conveys credibility/trust
- **Body**: Clean sans-serif (Inter, DM Sans) — readable on mobile, accessible
- **Minimum body size**: 16-18px
- **Line height**: Generous (1.5-1.7) for readability

### Imagery Direction
- Human, diverse, Nigerian — real people, not stock lawyers
- Illustrations for concepts (optional) — friendly, not corporate
- Minimal decoration — content is the focus

---

## UI Patterns

### Layout
- **Card-based content** — Each law topic/scenario in digestible cards
- **Generous whitespace** — Breathing room, not overwhelming
- **Clear visual hierarchy** — Users can scan quickly

### Navigation
- **Search-first homepage** — "What legal situation are you dealing with?"
- **Scenario categories** — Pill tags for discovery ("Tenant Rights", "Police Encounters")
- **Breadcrumb trails** — Always know where you are

### Content Display
- **Accordion UI** — Progressive disclosure for:
  - Plain language explanation
  - Practical example
  - Original law text
- **Source citations** — Always visible, builds trust
- **Timestamps** — "Verified January 2026"

### Trust Signals
- Disclaimers visible but not obtrusive
- Source citations on every explanation
- "Was this helpful?" feedback
- Professional but warm tone

---

## Design Inspirations

### User's Reference Images (in `design inspirations/`)
1. **Legal Point** — Teal/navy, cloudy backgrounds, conversational tone
2. **HireLaw** — Light backgrounds, colorful human imagery, serif headlines
3. **AI Interface (yellow)** — Search-driven UI, card-based results

### Reference Designs to Study

| Reference | URL | What to Study |
|-----------|-----|---------------|
| Notion Help Center | https://www.notion.so/help | Accordion UI, search-first, progressive disclosure |
| Stripe Docs | https://stripe.com/docs | Making dense content approachable, clean navigation |
| Clio | https://www.clio.com | Legal tech that balances professionalism with usability |
| Dribbble Knowledge Base | https://dribbble.com/tags/knowledge-base | FAQ layouts, search UI, card patterns |
| Dribbble FAQ designs | https://dribbble.com/tags/faq | Accordion patterns, question cards |

### Design Patterns from Research

**From Duolingo** (making complex topics simple):
- Clean, minimal UI reduces cognitive load
- Step-by-step progression prevents overwhelm
- Friendly visual design with illustrations
- Mobile-first, accessible

**From Notion/Stripe** (complex information architecture):
- Nested accordion UI for progressive disclosure
- Generous spacing between sections
- Search-first with good suggestions
- Consistent, clean components

---

## Key Screens to Design

### Priority 1 (MVP Core)
1. **Homepage** — Search + scenario categories
2. **Scenario results** — List of relevant laws/explanations
3. **Explanation page** — Plain language + example + source
4. **Search results** — Clean, scannable list

### Priority 2 (MVP Support)
5. **Law browser** — Browse by law (Constitution, CAMA, etc.)
6. **Sign in/up** — Google OAuth + magic link
7. **Saved items** — User's bookmarks
8. **Feedback modal** — "Was this helpful?"

### Priority 3 (Polish)
9. **About/Disclaimers** — Trust building
10. **404/Error states** — Friendly, helpful

---

## Accessibility Requirements

| Requirement | Standard | Notes |
|-------------|----------|-------|
| Color contrast | WCAG 2.1 AA (4.5:1 min) | Critical for readability |
| Touch targets | 44x44px minimum | Mobile-first |
| Keyboard navigation | Full support | Accessibility |
| Screen reader | Semantic HTML, ARIA | Accessibility |
| Text scaling | Up to 200% | User preference |

---

## Next Steps

~~1. Run `/ui-spec` to formalize design specifications~~ ✅ Complete

**Completed:** See `21-frontend-design-spec.md` for:
- Final color palette: Warm Trust (Teal + Gold)
- Complete typography scale
- All component specifications
- Wireframes for 8 key screens

**Next:**
1. **User approval** of design specs (Phase 3 gate)
2. **Proceed to Phase 4** (Architecture) after approval

---

*Document created: January 2026*
*Status: ✅ Complete*
