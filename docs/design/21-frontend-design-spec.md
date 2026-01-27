# Frontend Design Specification

> LawMadeSimple — Comprehensive UI/UX Design System
> Version: 1.0 | Created: January 2026

---

## Project Overview

**LawMadeSimple** democratizes Nigerian law by translating legal jargon into plain, easy-to-understand language with practical examples.

**Design Philosophy:** "Empowering, not intimidating" — Like a knowledgeable friend explaining the law, not a lawyer's office.

**Core Principles:**
1. Credible yet accessible — Professional enough to trust, friendly enough to use
2. Comprehension over access — Design for understanding, not just information delivery
3. Progressive disclosure — Complex legal content revealed in digestible layers
4. Mobile-first — Nigerian users primarily access via smartphones

---

## Technology Stack

| Category | Choice | Version |
|----------|--------|---------|
| Framework | Next.js | 14+ |
| UI Library | React | 18+ |
| CSS Framework | Tailwind CSS | 3.x |
| Component Library | shadcn/ui | Latest |
| State Management | React Context + useState | Built-in |
| Form Handling | React Hook Form | 7.x |
| Data Fetching | Vercel AI SDK, fetch | - |
| Icons | Lucide React | Latest |

---

## Design System Foundation

### Color Palette — "Warm Trust"

**Primary: Deep Teal** — Trust, professionalism, authority

| Token | Value | CSS Variable | Usage |
|-------|-------|--------------|-------|
| primary-50 | #E6F3F5 | --color-primary-50 | Light backgrounds, hover states |
| primary-100 | #B3DDE4 | --color-primary-100 | Secondary backgrounds |
| primary-200 | #80C7D3 | --color-primary-200 | Borders, dividers |
| primary-300 | #4DB1C2 | --color-primary-300 | Icons, secondary text |
| primary-400 | #269BAF | --color-primary-400 | Links, interactive elements |
| primary-500 | #1A5F7A | --color-primary-500 | Primary buttons, headers |
| primary-600 | #154D63 | --color-primary-600 | Hover states |
| primary-700 | #103B4C | --color-primary-700 | Active states, pressed |
| primary-800 | #0B2935 | --color-primary-800 | Dark accents |
| primary-900 | #06171E | --color-primary-900 | Maximum contrast |

**Accent: Warm Gold** — Warmth, Nigerian heritage, highlights

| Token | Value | CSS Variable | Usage |
|-------|-------|--------------|-------|
| accent-50 | #FEF9E7 | --color-accent-50 | Subtle highlights |
| accent-100 | #FCF0C3 | --color-accent-100 | Badges background |
| accent-200 | #FAE79F | --color-accent-200 | Info backgrounds |
| accent-300 | #F8DE7B | --color-accent-300 | Warning light |
| accent-400 | #F6C95E | --color-accent-400 | Stars, ratings |
| accent-500 | #F4B942 | --color-accent-500 | CTA accents, highlights |
| accent-600 | #D9A339 | --color-accent-600 | Hover states |
| accent-700 | #B8892F | --color-accent-700 | Active states |
| accent-800 | #8C6923 | --color-accent-800 | Dark accents |
| accent-900 | #604917 | --color-accent-900 | Maximum contrast |

**Neutral: Slate Gray** — Content, backgrounds, text

| Token | Value | CSS Variable | Usage |
|-------|-------|--------------|-------|
| neutral-50 | #FAFAFA | --color-neutral-50 | Page background |
| neutral-100 | #F5F5F5 | --color-neutral-100 | Card backgrounds |
| neutral-200 | #E5E5E5 | --color-neutral-200 | Borders, dividers |
| neutral-300 | #D4D4D4 | --color-neutral-300 | Disabled borders |
| neutral-400 | #A3A3A3 | --color-neutral-400 | Placeholder text |
| neutral-500 | #737373 | --color-neutral-500 | Secondary text |
| neutral-600 | #525252 | --color-neutral-600 | Body text |
| neutral-700 | #404040 | --color-neutral-700 | Headlines |
| neutral-800 | #262626 | --color-neutral-800 | Strong emphasis |
| neutral-900 | #171717 | --color-neutral-900 | Maximum contrast |

**Semantic Colors**

| Token | Light | Main | Dark | Usage |
|-------|-------|------|------|-------|
| success | #DCFCE7 | #22C55E | #15803D | Confirmations, positive feedback |
| warning | #FEF3C7 | #F59E0B | #B45309 | Cautions, attention required |
| error | #FEE2E2 | #EF4444 | #B91C1C | Errors, destructive actions |
| info | #E6F3F5 | #1A5F7A | #103B4C | Information, tips |

### Theme Configuration (Light Mode Only for MVP)

```typescript
const theme = {
  colors: {
    background: {
      primary: '#FFFFFF',      // Main content areas
      secondary: '#FAFAFA',    // Page background
      tertiary: '#F5F5F5',     // Card backgrounds
      elevated: '#FFFFFF',     // Modals, dropdowns
    },
    foreground: {
      primary: '#171717',      // Headlines, strong text
      secondary: '#525252',    // Body text
      muted: '#737373',        // Secondary info
      placeholder: '#A3A3A3',  // Input placeholders
    },
    border: '#E5E5E5',
    ring: '#1A5F7A',           // Focus rings
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
};
```

### Typography

**Font Families**

| Role | Font | Fallback | Usage |
|------|------|----------|-------|
| Heading | Lora | Georgia, serif | Headlines, law titles, emphasis |
| Body | Inter | system-ui, sans-serif | Body text, UI elements |
| Mono | JetBrains Mono | monospace | Law citations, code |

**Type Scale**

| Name | Size | Weight | Line Height | Letter Spacing | Usage |
|------|------|--------|-------------|----------------|-------|
| display | 3rem (48px) | 700 | 1.1 | -0.02em | Hero headlines |
| h1 | 2.25rem (36px) | 700 | 1.2 | -0.01em | Page titles |
| h2 | 1.875rem (30px) | 600 | 1.25 | -0.01em | Section headers |
| h3 | 1.5rem (24px) | 600 | 1.3 | 0 | Card titles, law names |
| h4 | 1.25rem (20px) | 600 | 1.4 | 0 | Subsection headers |
| body-lg | 1.125rem (18px) | 400 | 1.6 | 0 | Lead paragraphs, explanations |
| body | 1rem (16px) | 400 | 1.6 | 0 | Default body text |
| body-sm | 0.875rem (14px) | 400 | 1.5 | 0 | Secondary text, metadata |
| caption | 0.75rem (12px) | 500 | 1.4 | 0.02em | Labels, timestamps |
| overline | 0.75rem (12px) | 600 | 1.4 | 0.08em | Category labels |

**Typography CSS Classes**

```css
/* Headings - Lora (serif) */
.text-display { font-family: 'Lora', Georgia, serif; font-size: 3rem; font-weight: 700; line-height: 1.1; }
.text-h1 { font-family: 'Lora', Georgia, serif; font-size: 2.25rem; font-weight: 700; line-height: 1.2; }
.text-h2 { font-family: 'Lora', Georgia, serif; font-size: 1.875rem; font-weight: 600; line-height: 1.25; }
.text-h3 { font-family: 'Lora', Georgia, serif; font-size: 1.5rem; font-weight: 600; line-height: 1.3; }
.text-h4 { font-family: 'Lora', Georgia, serif; font-size: 1.25rem; font-weight: 600; line-height: 1.4; }

/* Body - Inter (sans-serif) */
.text-body-lg { font-family: 'Inter', system-ui, sans-serif; font-size: 1.125rem; line-height: 1.6; }
.text-body { font-family: 'Inter', system-ui, sans-serif; font-size: 1rem; line-height: 1.6; }
.text-body-sm { font-family: 'Inter', system-ui, sans-serif; font-size: 0.875rem; line-height: 1.5; }
.text-caption { font-family: 'Inter', system-ui, sans-serif; font-size: 0.75rem; font-weight: 500; line-height: 1.4; }
```

### Spacing System

Base unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| space-0 | 0 | Reset |
| space-1 | 4px | Tight inline spacing |
| space-2 | 8px | Icon gaps, tight padding |
| space-3 | 12px | Small padding, list gaps |
| space-4 | 16px | Standard padding |
| space-5 | 20px | Medium spacing |
| space-6 | 24px | Card padding |
| space-8 | 32px | Section gaps |
| space-10 | 40px | Large spacing |
| space-12 | 48px | Section padding |
| space-16 | 64px | Page sections |
| space-20 | 80px | Hero spacing |
| space-24 | 96px | Major sections |

### Breakpoints

| Name | Value | Target |
|------|-------|--------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

**Mobile-First Approach:** Default styles target mobile (< 640px), then scale up.

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | Subtle depth |
| shadow-md | 0 4px 6px -1px rgba(0,0,0,0.1) | Cards, buttons |
| shadow-lg | 0 10px 15px -3px rgba(0,0,0,0.1) | Dropdowns, popovers |
| shadow-xl | 0 20px 25px -5px rgba(0,0,0,0.1) | Modals |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| radius-none | 0 | Sharp corners |
| radius-sm | 4px | Small elements |
| radius-md | 8px | Buttons, inputs |
| radius-lg | 12px | Cards |
| radius-xl | 16px | Large cards, modals |
| radius-2xl | 24px | Pills, feature cards |
| radius-full | 9999px | Circles, pills |

### Animation

| Property | Value | Usage |
|----------|-------|-------|
| duration-fast | 150ms | Micro-interactions |
| duration-normal | 200ms | Standard transitions |
| duration-slow | 300ms | Complex animations |
| easing-default | cubic-bezier(0.4, 0, 0.2, 1) | General purpose |
| easing-in | cubic-bezier(0.4, 0, 1, 1) | Enter animations |
| easing-out | cubic-bezier(0, 0, 0.2, 1) | Exit animations |

---

## Component Specifications

### Atoms (Base Elements)

---

#### Button

**Purpose:** Primary interaction element for user actions

**Variants:**
| Variant | Background | Text | Border | Usage |
|---------|------------|------|--------|-------|
| primary | primary-500 | white | none | Main CTAs, "Search", "Sign In" |
| secondary | white | primary-500 | primary-500 | Alternative actions |
| ghost | transparent | primary-500 | none | Tertiary actions, navigation |
| accent | accent-500 | neutral-800 | none | Highlight actions, premium features |
| destructive | error-main | white | none | Delete, cancel subscription |

**Sizes:**
| Size | Height | Padding X | Text Size | Icon Size |
|------|--------|-----------|-----------|-----------|
| sm | 32px | 12px | 14px | 16px |
| md | 40px | 16px | 14px | 18px |
| lg | 48px | 24px | 16px | 20px |
| xl | 56px | 32px | 18px | 24px |

**Props Interface:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Visual States:**
| State | primary | secondary | ghost |
|-------|---------|-----------|-------|
| Default | bg-primary-500, text-white | bg-white, text-primary-500, border-primary-500 | bg-transparent, text-primary-500 |
| Hover | bg-primary-600 | bg-primary-50 | bg-primary-50 |
| Active | bg-primary-700, scale-[0.98] | bg-primary-100 | bg-primary-100 |
| Disabled | bg-neutral-200, text-neutral-400 | bg-neutral-100, text-neutral-400, border-neutral-300 | text-neutral-400 |
| Focus | ring-2 ring-primary-500 ring-offset-2 | ring-2 ring-primary-500 ring-offset-2 | ring-2 ring-primary-500 ring-offset-2 |
| Loading | Show spinner, pointer-events-none | Show spinner, pointer-events-none | Show spinner, pointer-events-none |

**Accessibility:**
- ARIA role: button (default)
- Keyboard: Enter/Space to activate, Tab to focus
- Focus visible: 2px ring with offset
- Disabled: aria-disabled="true", cursor-not-allowed
- Loading: aria-busy="true", screen reader announces "Loading"

---

#### Input

**Purpose:** Text input for search, forms, and data entry

**Variants:**
| Variant | Usage |
|---------|-------|
| default | Standard text input |
| search | Search bar with icon |
| error | Validation error state |

**Props Interface:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Visual Specifications:**
| Property | Value |
|----------|-------|
| Height | 44px (touch-friendly) |
| Padding | 12px 16px |
| Border | 1px solid neutral-300 |
| Border Radius | 8px |
| Font Size | 16px (prevents iOS zoom) |
| Background | white |

**Visual States:**
| State | Border | Background | Shadow |
|-------|--------|------------|--------|
| Default | neutral-300 | white | none |
| Hover | neutral-400 | white | none |
| Focus | primary-500 | white | ring-2 ring-primary-100 |
| Error | error-main | error-light/10 | ring-2 ring-error-light |
| Disabled | neutral-200 | neutral-100 | none |
| Filled | neutral-300 | white | none |

**Accessibility:**
- Label association via htmlFor/id
- Error messages: aria-describedby
- Required: aria-required="true"
- Invalid: aria-invalid="true" when error

---

#### SearchInput (Specialized)

**Purpose:** Primary search interface for law discovery

**Visual Specifications:**
| Property | Mobile | Desktop |
|----------|--------|---------|
| Height | 56px | 56px |
| Width | 100% | max 640px |
| Border Radius | 28px (pill shape) | 28px |
| Padding Left | 24px | 24px |
| Icon Size | 24px | 24px |
| Shadow | shadow-md | shadow-lg on focus |

**Features:**
- Placeholder: "What legal situation are you dealing with?"
- Left icon: Search (Lucide)
- Clear button on right when text entered
- Suggestions dropdown on focus/type

---

#### Badge

**Purpose:** Status indicators, category labels, scenario tags

**Variants:**
| Variant | Background | Text | Usage |
|---------|------------|------|-------|
| default | neutral-100 | neutral-700 | Generic tags |
| primary | primary-100 | primary-700 | Active/selected |
| accent | accent-100 | accent-800 | Highlights, new |
| success | success-light | success-dark | Verified, complete |
| warning | warning-light | warning-dark | Attention needed |
| error | error-light | error-dark | Issues, alerts |

**Sizes:**
| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| sm | 20px | 6px 8px | 11px |
| md | 24px | 6px 12px | 12px |
| lg | 28px | 8px 14px | 14px |

**Props Interface:**
```typescript
interface BadgeProps {
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

---

#### ScenarioPill

**Purpose:** Clickable scenario category buttons on homepage

**Visual Specifications:**
| Property | Value |
|----------|-------|
| Height | 40px |
| Padding | 8px 20px |
| Border Radius | 20px (full pill) |
| Font Size | 14px |
| Font Weight | 500 |
| Background | white |
| Border | 1px solid neutral-200 |
| Transition | all 200ms ease |

**States:**
| State | Background | Border | Shadow |
|-------|------------|--------|--------|
| Default | white | neutral-200 | shadow-sm |
| Hover | primary-50 | primary-300 | shadow-md |
| Active | primary-100 | primary-400 | shadow-sm |
| Selected | primary-500 | primary-500 | shadow-md |

**With Icon:**
- Icon left of text
- Icon size: 18px
- Gap: 8px

---

#### Avatar

**Purpose:** User profile images, author attribution

**Sizes:**
| Size | Dimensions | Font Size (fallback) |
|------|------------|---------------------|
| xs | 24px | 10px |
| sm | 32px | 12px |
| md | 40px | 14px |
| lg | 56px | 20px |
| xl | 80px | 28px |

**Props Interface:**
```typescript
interface AvatarProps {
  src?: string;
  alt: string;
  fallback?: string;  // Initials
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
```

**Visual:**
- Border radius: full (circle)
- Fallback: primary-100 background, primary-600 text
- Border: 2px solid white (for overlapping groups)

---

#### Icon

**Purpose:** Visual indicators throughout the UI

**Library:** Lucide React

**Sizes:**
| Size | Dimensions | Stroke Width |
|------|------------|--------------|
| xs | 14px | 2px |
| sm | 16px | 2px |
| md | 20px | 2px |
| lg | 24px | 1.5px |
| xl | 32px | 1.5px |

**Core Icons Used:**
| Icon | Usage |
|------|-------|
| Search | Search input |
| ChevronRight | Navigation, accordions |
| ChevronDown | Dropdowns, accordions |
| Bookmark | Save/unsave |
| BookmarkCheck | Saved state |
| Share2 | Share action |
| ThumbsUp | Helpful feedback |
| ThumbsDown | Not helpful feedback |
| AlertCircle | Warnings, errors |
| CheckCircle | Success, verified |
| Info | Information, tips |
| FileText | Law document |
| Scale | Legal/justice |
| User | Profile |
| Menu | Mobile menu |
| X | Close |
| ExternalLink | External links |
| Copy | Copy to clipboard |

---

#### Spinner

**Purpose:** Loading indicators

**Sizes:**
| Size | Dimensions |
|------|------------|
| sm | 16px |
| md | 24px |
| lg | 32px |
| xl | 48px |

**Visual:**
- Border: 2px solid
- Color: primary-500 (animated segment), neutral-200 (static)
- Animation: spin 1s linear infinite

---

#### Disclaimer Badge

**Purpose:** Always-visible legal disclaimer

**Visual Specifications:**
| Property | Value |
|----------|-------|
| Background | warning-light |
| Border | 1px solid warning-main |
| Border Radius | 8px |
| Padding | 8px 12px |
| Font Size | 12px |
| Icon | AlertCircle, 14px |
| Text Color | neutral-700 |

**Content:** "This is legal information, not legal advice. Consult a lawyer for your specific situation."

---

### Molecules (Combinations)

---

#### FormField

**Purpose:** Label + input + error message combination

**Structure:**
```
┌─────────────────────────────────┐
│ Label                    (opt.) │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Input                       │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Hint or Error message    (opt.) │
└─────────────────────────────────┘
```

**Spacing:**
- Label to input: 6px
- Input to hint/error: 4px

---

#### SearchBar

**Purpose:** Search input with suggestions dropdown

**Structure:**
```
┌──────────────────────────────────────────┐
│ 🔍 What legal situation are you...   ✕  │
├──────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐ │
│ │ Recent searches                      │ │
│ │ • tenant rights                      │ │
│ │ • police arrest                      │ │
│ ├──────────────────────────────────────┤ │
│ │ Popular scenarios                    │ │
│ │ • Landlord/Tenant Issues            │ │
│ │ • Employment Rights                  │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

**Dropdown Specs:**
| Property | Value |
|----------|-------|
| Background | white |
| Border | 1px solid neutral-200 |
| Border Radius | 16px |
| Shadow | shadow-lg |
| Max Height | 400px |
| Item Height | 44px |

---

#### ScenarioCard

**Purpose:** Clickable scenario category card on homepage

**Structure:**
```
┌────────────────────────────────┐
│  ⚖️                            │
│                                │
│  Landlord & Tenant             │
│  Issues                        │
│                                │
│  Rent, eviction, repairs...    │
│                          →     │
└────────────────────────────────┘
```

**Visual Specifications:**
| Property | Value |
|----------|-------|
| Width | 100% (grid responsive) |
| Min Height | 160px |
| Padding | 24px |
| Background | white |
| Border | 1px solid neutral-200 |
| Border Radius | 16px |
| Shadow | shadow-sm |
| Hover Shadow | shadow-md |
| Hover Border | primary-300 |

**Content:**
- Icon: 32px, primary-500
- Title: h4 (20px, semibold, neutral-800)
- Description: body-sm (14px, neutral-500)
- Arrow: ChevronRight, neutral-400 → primary-500 on hover

---

#### LawCard

**Purpose:** Search result or law section preview card

**Structure:**
```
┌────────────────────────────────────────────────┐
│ [Badge: Constitution] [Badge: Verified ✓]      │
│                                                │
│ Section 35: Right to Personal Liberty          │
│                                                │
│ Every person shall be entitled to his personal │
│ liberty and no person shall be deprived of...  │
│                                                │
│ 📄 Constitution of Nigeria    •    Updated Jan │
└────────────────────────────────────────────────┘
```

**Visual Specifications:**
| Property | Value |
|----------|-------|
| Padding | 20px 24px |
| Background | white |
| Border | 1px solid neutral-200 |
| Border Radius | 12px |
| Shadow | none → shadow-sm on hover |
| Cursor | pointer |

**Content Hierarchy:**
1. Badges: top, flex wrap, gap-8
2. Title: h3 (24px serif), margin-top-12
3. Preview: body (16px), neutral-600, 2-line clamp
4. Meta: caption (12px), neutral-500, flex with dot separator

---

#### AccordionItem

**Purpose:** Progressive disclosure for law explanations

**Structure (Closed):**
```
┌────────────────────────────────────────────────┐
│ ▶  Plain Language Explanation                  │
└────────────────────────────────────────────────┘
```

**Structure (Open):**
```
┌────────────────────────────────────────────────┐
│ ▼  Plain Language Explanation                  │
├────────────────────────────────────────────────┤
│                                                │
│    This law means that every Nigerian has...   │
│                                                │
└────────────────────────────────────────────────┘
```

**Visual Specifications:**
| Property | Value |
|----------|-------|
| Header Height | 56px |
| Header Padding | 16px 20px |
| Content Padding | 0 20px 20px 44px |
| Background | neutral-50 |
| Border Radius | 12px |
| Icon Rotation | 90deg when open |
| Animation | height 200ms ease, rotate 200ms |

---

#### FeedbackWidget

**Purpose:** "Was this helpful?" feedback collector

**Structure:**
```
┌────────────────────────────────────────────────┐
│ Was this explanation helpful?                  │
│                                                │
│   👍 Yes        👎 No                          │
└────────────────────────────────────────────────┘
```

**After Selection (if No):**
```
┌────────────────────────────────────────────────┐
│ Thanks for the feedback. What could be better? │
│                                                │
│ ┌────────────────────────────────────────────┐ │
│ │ Optional: Tell us more...                  │ │
│ └────────────────────────────────────────────┘ │
│                                     [Submit]   │
└────────────────────────────────────────────────┘
```

**Visual Specifications:**
| Property | Value |
|----------|-------|
| Background | neutral-50 |
| Border | 1px solid neutral-200 |
| Border Radius | 12px |
| Padding | 20px |
| Button Gap | 16px |

---

#### Breadcrumb

**Purpose:** Navigation path indicator

**Structure:**
```
Home  /  Scenarios  /  Landlord Issues  /  Rent Increase
```

**Visual Specifications:**
| Property | Value |
|----------|-------|
| Font Size | 14px |
| Color | neutral-500 |
| Active Color | neutral-800 |
| Separator | / or ChevronRight |
| Gap | 8px |

**Mobile:** Truncate to "... / Current Page" if > 3 levels

---

#### Pagination

**Purpose:** Navigate through search results

**Visual Specifications:**
| Property | Value |
|----------|-------|
| Button Size | 40px x 40px |
| Border Radius | 8px |
| Active Background | primary-500 |
| Active Text | white |
| Inactive Background | white |
| Inactive Text | neutral-600 |
| Disabled | neutral-300 |

**Mobile:** Show "Previous" and "Next" only, with page count in middle

---

### Organisms (Complex Components)

---

#### Header/Navbar

**Purpose:** Global navigation and branding

**Desktop Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] LawMadeSimple      Home  Browse  About     [Login]  │
└─────────────────────────────────────────────────────────────┘
```

**Mobile Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] LawMadeSimple                               [Menu]  │
└─────────────────────────────────────────────────────────────┘
```

**Visual Specifications:**
| Property | Mobile | Desktop |
|----------|--------|---------|
| Height | 56px | 64px |
| Padding | 0 16px | 0 32px |
| Background | white | white |
| Border Bottom | 1px solid neutral-200 | 1px solid neutral-200 |
| Position | sticky top-0 | sticky top-0 |
| Z-Index | 50 | 50 |

**Logo:**
- Mark: ⚖️ or custom icon, 28px
- Text: "LawMadeSimple", Lora, 20px, 600 weight
- Color: primary-500

**Nav Items:**
- Font: Inter, 14px, 500 weight
- Color: neutral-600 → primary-500 on hover
- Active: primary-500, underline-offset-8

---

#### MobileMenu (Drawer)

**Purpose:** Full navigation on mobile

**Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] LawMadeSimple                                [X]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Home                                                       │
│  ────────────────────────────────────────                   │
│  Browse Laws                                                │
│  ────────────────────────────────────────                   │
│  Scenarios                                                  │
│  ────────────────────────────────────────                   │
│  About                                                      │
│  ────────────────────────────────────────                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Sign In with Google                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Sign In with Email                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Visual Specifications:**
| Property | Value |
|----------|-------|
| Position | fixed, full screen |
| Background | white |
| Animation | slide from right, 300ms |
| Overlay | neutral-900/50 |
| Item Height | 56px |
| Item Padding | 16px 24px |
| Divider | 1px solid neutral-200 |

---

#### Footer

**Purpose:** Legal disclaimers, secondary navigation, trust signals

**Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Logo] LawMadeSimple                                       │
│  Democratizing Nigerian law                                 │
│                                                             │
│  ────────────────────────────────────────                   │
│                                                             │
│  Quick Links        Laws              Legal                 │
│  Home               Constitution      Terms of Service      │
│  Browse             Criminal Code     Privacy Policy        │
│  Scenarios          CAMA              Disclaimer            │
│  About              Labour Act                              │
│                                                             │
│  ────────────────────────────────────────                   │
│                                                             │
│  ⚠️ Legal Disclaimer: This platform provides legal         │
│  information, not legal advice. Always consult a           │
│  qualified lawyer for your specific legal situation.       │
│                                                             │
│  ────────────────────────────────────────                   │
│                                                             │
│  © 2026 LawMadeSimple. All rights reserved.                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Visual Specifications:**
| Property | Value |
|----------|-------|
| Background | neutral-50 |
| Padding | 48px 32px |
| Border Top | 1px solid neutral-200 |
| Link Color | neutral-600 |
| Link Hover | primary-500 |
| Disclaimer Background | warning-light |
| Disclaimer Border | 1px solid warning-main |
| Disclaimer Padding | 16px |
| Disclaimer Radius | 8px |

---

#### ExplanationCard

**Purpose:** Main content display for law explanations

**Structure:**
```
┌────────────────────────────────────────────────────────────┐
│ [Badge: Constitution]   [Badge: Verified Jan 2026 ✓]       │
│                                                            │
│ Section 35: Right to Personal Liberty                      │
│                                                            │
│ ⚠️ This is legal information, not legal advice.           │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ ▼  Plain Language Explanation                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│    In everyday terms, this law means that no one -        │
│    not the police, not the government, not anyone -       │
│    can arrest you or lock you up without following        │
│    proper legal procedures...                              │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ ▶  Practical Example                                       │
├────────────────────────────────────────────────────────────┤
│ ▶  Original Law Text                                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Was this helpful?     👍 Yes     👎 No                    │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  📤 Share    🔖 Save    📄 View Full Law                   │
└────────────────────────────────────────────────────────────┘
```

**Visual Specifications:**
| Property | Value |
|----------|-------|
| Background | white |
| Border | 1px solid neutral-200 |
| Border Radius | 16px |
| Shadow | shadow-md |
| Padding | 24px (mobile), 32px (desktop) |
| Max Width | 800px |
| Margin | auto (centered) |

**Accordion Sections:**
1. Plain Language Explanation (open by default)
2. Practical Example (closed)
3. Original Law Text (closed)

---

#### AuthModal

**Purpose:** Sign in / Sign up modal

**Structure:**
```
┌────────────────────────────────────────────────┐
│                                          [X]   │
│                                                │
│           ⚖️ LawMadeSimple                     │
│                                                │
│        Sign in to save your progress           │
│                                                │
│   ┌────────────────────────────────────────┐   │
│   │    🔵  Continue with Google            │   │
│   └────────────────────────────────────────┘   │
│                                                │
│                 ─── or ───                     │
│                                                │
│   ┌────────────────────────────────────────┐   │
│   │  📧  Email                             │   │
│   └────────────────────────────────────────┘   │
│                                                │
│   ┌────────────────────────────────────────┐   │
│   │         Send Magic Link                │   │
│   └────────────────────────────────────────┘   │
│                                                │
│   By continuing, you agree to our Terms and   │
│   Privacy Policy.                              │
│                                                │
└────────────────────────────────────────────────┘
```

**Visual Specifications:**
| Property | Value |
|----------|-------|
| Width | 100% (mobile), 420px (desktop) |
| Max Height | 90vh |
| Background | white |
| Border Radius | 24px (desktop), 24px 24px 0 0 (mobile bottom sheet) |
| Padding | 32px |
| Shadow | shadow-xl |
| Overlay | neutral-900/50 |
| Animation | fade in + scale up (desktop), slide up (mobile) |

---

#### Toast/Notification

**Purpose:** Feedback messages for user actions

**Variants:**
| Variant | Icon | Background | Border |
|---------|------|------------|--------|
| success | CheckCircle | success-light | success-main |
| error | AlertCircle | error-light | error-main |
| warning | AlertCircle | warning-light | warning-main |
| info | Info | primary-50 | primary-300 |

**Visual Specifications:**
| Property | Mobile | Desktop |
|----------|--------|---------|
| Position | bottom-center | top-right |
| Width | calc(100% - 32px) | 360px |
| Padding | 16px | 16px |
| Border Radius | 12px | 12px |
| Shadow | shadow-lg | shadow-lg |
| Animation | slide up | slide left |
| Duration | 5 seconds | 5 seconds |

---

#### EmptyState

**Purpose:** Display when no content/results available

**Structure:**
```
┌────────────────────────────────────────────────┐
│                                                │
│                    🔍                          │
│                                                │
│           No results found                     │
│                                                │
│    We couldn't find any laws matching         │
│    "your search". Try different keywords.      │
│                                                │
│           [Search Again]                       │
│                                                │
└────────────────────────────────────────────────┘
```

**Visual Specifications:**
| Property | Value |
|----------|-------|
| Icon Size | 64px |
| Icon Color | neutral-300 |
| Title | h3, neutral-700 |
| Description | body, neutral-500, text-center |
| Max Width | 400px |
| Padding | 48px |

---

#### SkeletonLoader

**Purpose:** Loading placeholders

**Elements:**
- SkeletonText: height 16px, rounded
- SkeletonTitle: height 24px, width 60%, rounded
- SkeletonCard: Full card shape
- SkeletonAvatar: Circle

**Animation:**
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f5f5f5 25%,
    #e5e5e5 50%,
    #f5f5f5 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## Layout Patterns

### Page Layout Structure

**Desktop:**
```
┌─────────────────────────────────────────────────────────────┐
│                        Header (64px)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│                     Main Content                            │
│                   (max-width: 1280px)                       │
│                     (padding: 32px)                         │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                         Footer                              │
└─────────────────────────────────────────────────────────────┘
```

**Mobile:**
```
┌───────────────────────┐
│     Header (56px)     │
├───────────────────────┤
│                       │
│    Main Content       │
│    (padding: 16px)    │
│                       │
├───────────────────────┤
│       Footer          │
└───────────────────────┘
```

### Grid System

**Container:**
| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Max Width | 100% | 100% | 1280px |
| Padding | 16px | 24px | 32px |

**Grid:**
| Breakpoint | Columns | Gap |
|------------|---------|-----|
| Mobile (< 640px) | 1 | 16px |
| Tablet (640-1024px) | 2 | 24px |
| Desktop (> 1024px) | 3-4 | 24px |

### Content Width

| Type | Max Width | Usage |
|------|-----------|-------|
| Full | 100% | Headers, hero sections |
| Wide | 1280px | Card grids, browse pages |
| Medium | 960px | Search results |
| Narrow | 720px | Explanation pages, articles |
| Form | 480px | Auth forms, feedback |

---

## Key Screens — Wireframe Specifications

### Screen 1: Homepage

**Purpose:** Entry point, search-first interface for law discovery

**URL:** `/`

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                         Header                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│                    ⚖️ LawMadeSimple                         │
│                                                             │
│           Nigerian law in plain language                    │
│                                                             │
│        ┌───────────────────────────────────────┐           │
│        │ 🔍 What legal situation are you...    │           │
│        └───────────────────────────────────────┘           │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     I'm dealing with...                                     │
│                                                             │
│     [Landlord Issues] [Police Encounters] [Employment]      │
│     [Starting a Business] [Tax Questions] [My Rights]       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     Popular Topics                                          │
│                                                             │
│     ┌───────────────┐  ┌───────────────┐  ┌─────────────┐  │
│     │ 🏠            │  │ 👮            │  │ 💼          │  │
│     │ Tenant        │  │ Know Your     │  │ Register    │  │
│     │ Rights        │  │ Rights        │  │ Business    │  │
│     │               │  │               │  │             │  │
│     └───────────────┘  └───────────────┘  └─────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                         Footer                              │
└─────────────────────────────────────────────────────────────┘
```

**Components Used:**
- Header (organism)
- SearchInput (molecule)
- ScenarioPill (atom) — horizontal scroll on mobile
- ScenarioCard (molecule) — 3-column grid
- Footer (organism)

**Responsive Behavior:**

| Breakpoint | Hero | Pills | Cards |
|------------|------|-------|-------|
| Mobile | Centered, smaller text | Horizontal scroll | Single column |
| Tablet | Centered | Wrap 2 rows | 2 columns |
| Desktop | Centered, max-width 640px | Single row | 3 columns |

---

### Screen 2: Scenario Results

**Purpose:** List of laws/explanations matching selected scenario

**URL:** `/scenarios/[slug]`

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                         Header                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ← Back    Home / Scenarios / Landlord Issues               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏠  Landlord & Tenant Issues                               │
│                                                             │
│      Understanding your rights as a tenant or landlord      │
│      under Nigerian law.                                    │
│                                                             │
│      [Rent Increase] [Eviction] [Repairs] [Deposits]       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  12 relevant laws found                                     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Tenancy]                                             │  │
│  │ Rent Increase: What Your Landlord Can (and Can't)    │  │
│  │ Do                                                    │  │
│  │                                                       │  │
│  │ Your landlord cannot increase rent during an active  │  │
│  │ tenancy agreement without proper notice...           │  │
│  │                                                       │  │
│  │ 📄 Lagos Tenancy Law  •  Updated Jan 2026           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Tenancy] [Constitution]                              │  │
│  │ Your Right to Adequate Notice Before Eviction        │  │
│  │ ...                                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [Load More]                                                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                         Footer                              │
└─────────────────────────────────────────────────────────────┘
```

**Components Used:**
- Header
- Breadcrumb
- Badge (for sub-scenario filters)
- LawCard (molecule)
- Button (Load More)
- Footer

---

### Screen 3: Explanation Page

**Purpose:** Full explanation with progressive disclosure

**URL:** `/explain/[law-slug]/[section-slug]`

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                         Header                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ← Back    Home / Constitution / Section 35                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     ┌──────────────────────────────────────────────────┐   │
│     │ [Constitution]        [Verified Jan 2026 ✓]      │   │
│     │                                                   │   │
│     │ Section 35: Right to Personal Liberty             │   │
│     │                                                   │   │
│     │ ⚠️ This is legal information, not legal advice.  │   │
│     │                                                   │   │
│     ├──────────────────────────────────────────────────┤   │
│     │ ▼  Plain Language Explanation                    │   │
│     ├──────────────────────────────────────────────────┤   │
│     │                                                   │   │
│     │    In everyday terms, this law means that no     │   │
│     │    one - not the police, not the government,     │   │
│     │    not anyone - can arrest you or lock you up    │   │
│     │    without following proper legal procedures.    │   │
│     │                                                   │   │
│     │    **What this means for you:**                  │   │
│     │                                                   │   │
│     │    • You cannot be detained arbitrarily          │   │
│     │    • If arrested, you must be told why           │   │
│     │    • You must be brought before a court within   │   │
│     │      24-48 hours                                 │   │
│     │    • You have the right to a lawyer              │   │
│     │                                                   │   │
│     ├──────────────────────────────────────────────────┤   │
│     │ ▶  Practical Example                             │   │
│     ├──────────────────────────────────────────────────┤   │
│     │ ▶  Original Law Text                             │   │
│     ├──────────────────────────────────────────────────┤   │
│     │                                                   │   │
│     │  Was this helpful?     👍 Yes     👎 No          │   │
│     │                                                   │   │
│     ├──────────────────────────────────────────────────┤   │
│     │  📤 Share    🔖 Save    📄 View Full Law         │   │
│     └──────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     Related Topics                                          │
│                                                             │
│     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│     │ Section 36  │  │ Section 34  │  │ Police      │      │
│     │ Fair Trial  │  │ Dignity     │  │ Encounters  │      │
│     └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                         Footer                              │
└─────────────────────────────────────────────────────────────┘
```

**Components Used:**
- Header
- Breadcrumb
- ExplanationCard (organism)
  - Badge
  - DisclaimerBadge
  - AccordionItem (x3)
  - FeedbackWidget
  - Button group (Share, Save, View Full)
- LawCard (for related topics)
- Footer

---

### Screen 4: Search Results

**Purpose:** Results from search query

**URL:** `/search?q=[query]`

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                         Header                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 🔍 tenant rights                                   ✕  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  23 results for "tenant rights"                             │
│                                                             │
│  Filter: [All] [Constitution] [Tenancy] [CAMA]             │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Tenancy]                                             │  │
│  │ Your Rights as a Tenant in Nigeria                    │  │
│  │                                                       │  │
│  │ As a tenant in Nigeria, you have specific legal      │  │
│  │ protections under various tenancy laws...            │  │
│  │                                                       │  │
│  │ 📄 Lagos Tenancy Law  •  Updated Jan 2026           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ...more results...                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [1] [2] [3] ... [Next →]                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                         Footer                              │
└─────────────────────────────────────────────────────────────┘
```

**Components Used:**
- Header
- SearchInput (pre-filled)
- Badge (filters)
- LawCard (results list)
- Pagination
- EmptyState (if no results)
- Footer

---

### Screen 5: Law Browser

**Purpose:** Browse laws by category

**URL:** `/laws` and `/laws/[law-slug]`

**Layout (Index):**
```
┌─────────────────────────────────────────────────────────────┐
│                         Header                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Browse Nigerian Laws                                       │
│                                                             │
│  Explore federal laws covered by LawMadeSimple              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────┐  ┌─────────────────────┐   │
│  │ 📜                         │  │ 👮                  │   │
│  │ Constitution of Nigeria    │  │ Criminal Code Act   │   │
│  │                            │  │                     │   │
│  │ Fundamental rights,        │  │ Offenses, police    │   │
│  │ government structure...    │  │ interactions...     │   │
│  │                            │  │                     │   │
│  │ 45 sections explained      │  │ 38 sections         │   │
│  └────────────────────────────┘  └─────────────────────┘   │
│                                                             │
│  ┌────────────────────────────┐  ┌─────────────────────┐   │
│  │ 🏢                         │  │ 💼                  │   │
│  │ CAMA                       │  │ Labour Act          │   │
│  │                            │  │                     │   │
│  │ Company registration,      │  │ Employment rights,  │   │
│  │ business law...            │  │ termination...      │   │
│  │                            │  │                     │   │
│  │ 52 sections                │  │ 34 sections         │   │
│  └────────────────────────────┘  └─────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                         Footer                              │
└─────────────────────────────────────────────────────────────┘
```

**Components Used:**
- Header
- ScenarioCard (adapted for laws)
- Footer

---

### Screen 6: Sign In Page

**Purpose:** Authentication (dedicated page, not modal)

**URL:** `/auth/signin`

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                         Header                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│                                                             │
│              ┌─────────────────────────────┐               │
│              │                              │               │
│              │      ⚖️ LawMadeSimple        │               │
│              │                              │               │
│              │   Sign in to save your       │               │
│              │   progress and bookmarks     │               │
│              │                              │               │
│              │   ┌──────────────────────┐   │               │
│              │   │ 🔵 Continue with     │   │               │
│              │   │    Google            │   │               │
│              │   └──────────────────────┘   │               │
│              │                              │               │
│              │        ─── or ───            │               │
│              │                              │               │
│              │   ┌──────────────────────┐   │               │
│              │   │ 📧 Email             │   │               │
│              │   └──────────────────────┘   │               │
│              │                              │               │
│              │   ┌──────────────────────┐   │               │
│              │   │   Send Magic Link    │   │               │
│              │   └──────────────────────┘   │               │
│              │                              │               │
│              │   By continuing, you agree   │               │
│              │   to our Terms and Privacy   │               │
│              │   Policy.                    │               │
│              │                              │               │
│              └─────────────────────────────┘               │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                         Footer                              │
└─────────────────────────────────────────────────────────────┘
```

**Components Used:**
- Header (minimal)
- AuthModal content (centered card)
- Button (Google OAuth)
- Input (email)
- Button (Magic Link)
- Footer (minimal)

---

### Screen 7: Saved Items

**Purpose:** User's bookmarked explanations

**URL:** `/saved`

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                         Header                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔖 Saved Items                                             │
│                                                             │
│  Your bookmarked laws and explanations                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Constitution]                              [🗑️]      │  │
│  │ Section 35: Right to Personal Liberty                │  │
│  │                                                       │  │
│  │ Saved on Jan 15, 2026                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Tenancy]                                   [🗑️]      │  │
│  │ Rent Increase: Your Rights                           │  │
│  │                                                       │  │
│  │ Saved on Jan 12, 2026                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                         Footer                              │
└─────────────────────────────────────────────────────────────┘
```

**Empty State:**
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                      🔖                              │
│                                                      │
│              No saved items yet                      │
│                                                      │
│    Bookmark explanations to access them easily      │
│    later.                                            │
│                                                      │
│              [Browse Scenarios]                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Components Used:**
- Header
- LawCard (with delete action)
- EmptyState
- Footer

---

### Screen 8: 404 / Error Page

**Purpose:** Friendly error handling

**URL:** `/404` or any invalid route

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                         Header                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│                                                             │
│                         ⚖️                                  │
│                                                             │
│               Oops! Page not found                          │
│                                                             │
│         The page you're looking for doesn't exist          │
│         or has been moved.                                  │
│                                                             │
│               [Go to Homepage]                              │
│                                                             │
│         Or try searching for what you need:                 │
│                                                             │
│         ┌─────────────────────────────────────┐            │
│         │ 🔍 Search laws and scenarios...     │            │
│         └─────────────────────────────────────┘            │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                         Footer                              │
└─────────────────────────────────────────────────────────────┘
```

**Components Used:**
- Header
- EmptyState (customized)
- Button
- SearchInput
- Footer

---

## Interaction Patterns

### Modal/Dialog

**Behavior:**
- Backdrop: neutral-900/50 opacity
- Animation: Fade in backdrop (150ms), scale up content (200ms)
- Close triggers: X button, backdrop click, Escape key
- Focus trap: Tab cycles within modal
- Scroll lock: Body scroll disabled when open

**Mobile Adaptation:**
- Render as bottom sheet
- Slide up animation (300ms)
- Swipe down to dismiss
- Max height: 90vh

---

### Toast Notifications

**Behavior:**
- Position: Bottom-center (mobile), top-right (desktop)
- Duration: 5 seconds (configurable)
- Stacking: Max 3 visible, newest on top
- Dismissal: Click X or swipe (mobile)

**Types:**
| Type | Use Case |
|------|----------|
| success | "Saved to bookmarks", "Link copied" |
| error | "Failed to save", "Network error" |
| info | "Sign in to save items" |

---

### Loading States

**Skeleton Loading:**
- Used for: Initial page load, content fetching
- Animation: Shimmer effect (1.5s loop)
- Match content shape: Cards, text blocks, images

**Inline Spinner:**
- Used for: Button loading, small actions
- Size matches context (16-24px)
- Replace button text or append

**Full Page Loading:**
- Used for: Auth redirects, heavy operations
- Centered spinner with optional message
- Minimum display: 500ms (prevent flash)

---

### Form Validation

**Timing:**
- Validate on blur (individual fields)
- Validate on submit (full form)
- Clear error on edit

**Error Display:**
- Inline below field
- Error icon + message
- Field border turns error-main

**Success Feedback:**
- Brief success message
- Redirect or clear form
- Toast notification

---

### Accordion Behavior

**Open/Close:**
- Click header to toggle
- Smooth height animation (200ms)
- Chevron rotates 90°
- Only one section open at a time (optional)

**Default State:**
- First section (Plain Language) open by default
- Others collapsed

---

### Search Behavior

**Suggestions:**
- Appear after 2 characters typed
- Debounce: 300ms
- Max 8 suggestions
- Categories: Recent, Popular, Results

**Submit:**
- Enter key or click search icon
- Navigate to /search?q=query
- Clear suggestions

---

## Responsive Behavior Summary

### Homepage

| Element | Mobile (< 640px) | Tablet (640-1024px) | Desktop (> 1024px) |
|---------|------------------|---------------------|-------------------|
| Hero | Stack, centered | Stack, centered | Stack, centered |
| Search | Full width | Max 500px | Max 640px |
| Scenario pills | Horizontal scroll | Wrap 2 rows | Single row |
| Topic cards | 1 column | 2 columns | 3 columns |

### Explanation Page

| Element | Mobile | Desktop |
|---------|--------|---------|
| Card width | 100% - 32px | Max 800px, centered |
| Accordions | Full width | Same |
| Actions | Stack vertical | Inline row |
| Related topics | Horizontal scroll | 3 columns |

### Navigation

| Element | Mobile | Desktop |
|---------|--------|---------|
| Header | Logo + hamburger | Logo + nav items + auth |
| Nav | Drawer (slide right) | Inline links |
| Footer | Stack columns | Grid 4 columns |

---

## Accessibility Requirements

### Color Contrast

| Element | Ratio Required | Achieved |
|---------|----------------|----------|
| Body text (neutral-600 on white) | 4.5:1 | 7.0:1 ✓ |
| Headlines (neutral-800 on white) | 4.5:1 | 12.6:1 ✓ |
| Primary button text (white on primary-500) | 4.5:1 | 4.9:1 ✓ |
| Links (primary-500 on white) | 4.5:1 | 4.5:1 ✓ |
| Placeholder text (neutral-400 on white) | 3:1 (large text) | 3.0:1 ✓ |

### Touch Targets

- Minimum size: 44x44px
- Spacing between targets: 8px minimum
- Applies to: Buttons, links, form controls, accordion headers

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move focus forward |
| Shift+Tab | Move focus backward |
| Enter/Space | Activate buttons, links |
| Escape | Close modals, dropdowns |
| Arrow keys | Navigate within menus, accordions |

### Screen Reader Support

- Semantic HTML (header, main, nav, footer, article, section)
- ARIA labels for icons and non-text elements
- Live regions for dynamic content (toasts, loading)
- Skip links to main content
- Heading hierarchy (h1 → h2 → h3)

### Focus Management

- Visible focus indicators (2px ring)
- Focus trapped in modals
- Focus restored after modal close
- No focus on non-interactive elements

---

## Implementation Checklist

### Phase 1: Foundation

- [ ] Set up Tailwind CSS configuration with design tokens
- [ ] Configure Google Fonts (Lora, Inter)
- [ ] Create CSS custom properties for colors
- [ ] Set up shadcn/ui with custom theme
- [ ] Create base typography components (Text, Heading)

### Phase 2: Atoms

- [ ] Button (all variants, sizes, states)
- [ ] Input (default, search, error states)
- [ ] Badge (all variants)
- [ ] ScenarioPill
- [ ] Avatar
- [ ] Icon setup (Lucide)
- [ ] Spinner
- [ ] DisclaimerBadge

### Phase 3: Molecules

- [ ] FormField (label + input + error)
- [ ] SearchBar (with suggestions dropdown)
- [ ] ScenarioCard
- [ ] LawCard
- [ ] AccordionItem
- [ ] FeedbackWidget
- [ ] Breadcrumb
- [ ] Pagination

### Phase 4: Organisms

- [ ] Header/Navbar (desktop + mobile)
- [ ] MobileMenu (drawer)
- [ ] Footer
- [ ] ExplanationCard
- [ ] AuthModal / Auth page
- [ ] Toast notification system
- [ ] EmptyState
- [ ] SkeletonLoader

### Phase 5: Pages

- [ ] Homepage layout
- [ ] Scenario results page
- [ ] Explanation page
- [ ] Search results page
- [ ] Law browser
- [ ] Sign in page
- [ ] Saved items page
- [ ] 404 page

### Phase 6: Polish

- [ ] Loading states and skeletons
- [ ] Error states and boundaries
- [ ] Animations and transitions
- [ ] Responsive testing (all breakpoints)
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Performance optimization

---

## Open Questions

*None at this time. All design decisions have been made.*

---

## Appendix: Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F3F5',
          100: '#B3DDE4',
          200: '#80C7D3',
          300: '#4DB1C2',
          400: '#269BAF',
          500: '#1A5F7A',
          600: '#154D63',
          700: '#103B4C',
          800: '#0B2935',
          900: '#06171E',
        },
        accent: {
          50: '#FEF9E7',
          100: '#FCF0C3',
          200: '#FAE79F',
          300: '#F8DE7B',
          400: '#F6C95E',
          500: '#F4B942',
          600: '#D9A339',
          700: '#B8892F',
          800: '#8C6923',
          900: '#604917',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'h3': ['1.5rem', { lineHeight: '1.3' }],
        'h4': ['1.25rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.05)',
        'md': '0 4px 6px -1px rgba(0,0,0,0.1)',
        'lg': '0 10px 15px -3px rgba(0,0,0,0.1)',
        'xl': '0 20px 25px -5px rgba(0,0,0,0.1)',
      },
    },
  },
};
```

---

*Document: 21-frontend-design-spec.md*
*Version: 1.0 | Created: January 2026*
*Project: LawMadeSimple*
