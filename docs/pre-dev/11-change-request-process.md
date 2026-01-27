# Change Request Process

> How to request, evaluate, and implement changes to approved requirements.

---

## Overview

This document defines the process for requesting, evaluating, and implementing changes to the approved requirements baseline. For a solo developer project, this process is streamlined but maintains discipline.

---

## Change Request Form Template

### CR-[NUMBER]: [Title]

**Metadata:**
- **Requestor**: [Name/Source]
- **Date**: [YYYY-MM-DD]
- **Priority**: [Critical/High/Medium/Low]
- **Type**: [Addition/Modification/Deletion]

**Description of Change:**
[Detailed description of what is being requested]

**Justification:**
[Why is this change needed? What user problem does it solve?]

**Impact Analysis:**
| Dimension | Impact Level | Details |
|-----------|--------------|---------|
| Scope | None/Low/Medium/High | [Explanation] |
| Timeline | None/Low/Medium/High | [Explanation] |
| Cost | None/Low/Medium/High | [Explanation] |
| Technical | None/Low/Medium/High | [Explanation] |

**Affected Requirements:**
| Requirement ID | Current State | Proposed State |
|---------------|---------------|----------------|
| [ID] | [Current] | [Proposed] |

**Trade-off (if adding):**
[What gets cut or deferred if this is added?]

**Decision:**
- [ ] Approved
- [ ] Rejected
- [ ] Deferred to Phase: ___

**Decision Rationale:**
[Why was this decision made?]

**Approved By:** [Name] | **Date:** [YYYY-MM-DD]

---

## Approval Workflow

### For Solo Developer (Simplified)

```
┌─────────────┐
│   Identify  │
│    Need     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Document   │
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Analyze   │
│   Impact    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Decide    │◄─── Wait 24 hours for non-critical
│             │     (prevents impulsive changes)
└──────┬──────┘
       │
  ┌────┴────┐
  │         │
  ▼         ▼
┌─────┐  ┌──────┐
│ Yes │  │  No  │
└──┬──┘  └──┬───┘
   │        │
   ▼        ▼
┌──────┐  ┌───────┐
│Update│  │Document│
│Baseline│ │Why Not │
└──────┘  └───────┘
```

### Decision Criteria

| Priority | Timeline to Decide | Auto-Approve If |
|----------|-------------------|-----------------|
| Critical | Immediate | User-blocking bug |
| High | 24 hours | Clear user benefit, low impact |
| Medium | 48 hours | — |
| Low | Defer to sprint planning | — |

---

## Change Types

### Addition
Adding a new requirement, feature, or scope item.

**Evaluation Questions:**
1. Does this align with MVP goals?
2. What is the effort required?
3. What gets cut if we add this?
4. Can this wait for post-MVP?

**Default Answer: Defer to post-MVP**

### Modification
Changing an existing approved requirement.

**Evaluation Questions:**
1. Why is the original requirement insufficient?
2. Does this change impact dependencies?
3. Is the modification backward compatible?

### Deletion
Removing an approved requirement from scope.

**Evaluation Questions:**
1. Why is this no longer needed?
2. Are there dependent requirements affected?
3. Does this significantly reduce user value?

---

## Change Categories

### Scope Changes
Changes to what features/requirements are included.

- **High Impact**: New features, major scope additions
- **Medium Impact**: Feature modifications
- **Low Impact**: Minor refinements

### Technical Changes
Changes to how requirements are implemented.

- **High Impact**: Architecture changes, new dependencies
- **Medium Impact**: Implementation approach changes
- **Low Impact**: Code-level decisions

### Content Changes
Changes to law content scope.

- **High Impact**: Adding new laws
- **Medium Impact**: Expanding existing law coverage
- **Low Impact**: Scenario additions

---

## Change Log

| CR ID | Date | Description | Type | Status | Impact |
|-------|------|-------------|------|--------|--------|
| CR-001 | — | [Template] | Addition | Pending | Medium |

---

## Examples

### Example 1: Add Nigerian Pidgin Support (Deferred)

**CR-001: Add Nigerian Pidgin Language Support**

- **Requestor**: User Research
- **Date**: [Future]
- **Priority**: Medium
- **Type**: Addition

**Description**: Add Pidgin English translations for all explanations.

**Justification**: 30M+ Nigerians speak Pidgin as first language. Increases accessibility.

**Impact Analysis:**
| Dimension | Impact | Details |
|-----------|--------|---------|
| Scope | High | New feature across all content |
| Timeline | High | 2-3 weeks additional work |
| Cost | Medium | AI translation costs |
| Technical | Medium | Locale system needed |

**Trade-off**: Delays MVP launch by 2-3 weeks.

**Decision**: ☑ Deferred to Phase 2

**Rationale**: High value but not MVP-critical. English covers initial target users. Revisit after MVP launch.

---

### Example 2: Add Password Login (Rejected)

**CR-002: Add Password-Based Authentication**

- **Requestor**: Hypothetical user request
- **Date**: [Future]
- **Priority**: Low
- **Type**: Addition

**Description**: Allow users to create accounts with password.

**Justification**: Some users prefer passwords to OAuth/magic links.

**Impact Analysis:**
| Dimension | Impact | Details |
|-----------|--------|---------|
| Scope | Medium | New auth flow |
| Timeline | Low | 1 week |
| Cost | Low | Minimal |
| Technical | Medium | Password storage, reset flows |

**Decision**: ☑ Rejected

**Rationale**: Adds security burden (password storage, resets). OAuth and magic links are sufficient and more secure. No user friction observed in similar apps.

---

## Escalation Path

For solo developer project, escalation means:

1. **Technical Uncertainty**: Consult documentation, community, or AI assistance
2. **User Impact Uncertainty**: Gather more user feedback before deciding
3. **Legal Uncertainty**: Consult lawyer before proceeding
4. **Budget Uncertainty**: Model costs before committing

---

## Preventing Scope Creep

### Rules

1. **Default is No**: New scope defaults to "defer to post-MVP"
2. **One In, One Out**: Adding something means cutting something (for MVP)
3. **24-Hour Rule**: Non-critical changes wait 24 hours before approval
4. **Document Everything**: Even rejected changes are logged
5. **Question the Source**: Is this a real user need or hypothetical?

### Red Flags

- "While we're at it..."
- "It would be nice if..."
- "What if users want..."
- "Competitors have..."

### Green Flags

- "Users are blocked because..."
- "This is causing X% to drop off"
- "We can't launch without..."

---

*Document: 11 of 20 | Phase 3: Validation*
*Project: LawMadeSimple | Created: January 2026*
