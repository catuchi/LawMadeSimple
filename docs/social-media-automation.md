# Social Media Automation Strategy for LawMadeSimple

This document outlines three automation options for managing LawMadeSimple's Twitter/X presence, from simple to fully automated.

## Table of Contents

1. [Current Implementation (Option 3)](#current-implementation-option-3)
2. [All Three Options Compared](#all-three-options-compared)
3. [Option 1: Manual with Templates](#option-1-manual-with-templates)
4. [Option 2: Full Automation](#option-2-full-automation)
5. [Option 3: Content Queue System](#option-3-content-queue-system)
6. [Migration Paths](#migration-paths)
7. [Cost Comparison](#cost-comparison)

---

## Current Implementation (Option 3)

We're using **Option 3: Content Queue System** which provides:

- Claude Code generates content on-demand during dev sessions
- Human reviews and approves all posts
- Manual posting via Twitter web/app
- Full control with AI assistance

### Directory Structure

```
content/
├── config/
│   ├── brand-voice.md           # Voice guidelines
│   ├── hashtag-strategy.md      # Hashtag usage rules
│   └── content-types.md         # Types of content we create
│
├── input/
│   ├── ideas.json               # Raw ideas queue
│   ├── calendar.json            # Monthly content calendar
│   └── features.json            # Feature announcements pipeline
│
├── queue/
│   ├── drafts.json              # Generated content pending review
│   ├── scheduled.json           # Approved content ready to post
│   └── posted.json              # Archive of posted content
│
└── media/
    └── (screenshots, graphics)
```

---

## All Three Options Compared

| Aspect | Option 1: Manual | Option 2: Full Auto | Option 3: Queue System |
|--------|------------------|---------------------|------------------------|
| **Setup Complexity** | None | High | Low |
| **Monthly Cost** | $0 | ~$120+ | $0 |
| **Time per Post** | 15-20 min | 0 min | 5 min |
| **Human Oversight** | 100% | Optional | 100% |
| **Consistency** | Variable | High | High |
| **Risk Level** | None | Medium | None |
| **Best For** | Getting started | Scale | Growing accounts |

---

## Option 1: Manual with Templates

### Overview

Traditional approach with template assistance. No automation infrastructure needed.

### Implementation

Create reusable templates in your notes app or Notion:

```markdown
## Template: Educational Thread

Tweet 1: [Hook - Question or Bold Statement]
🧵 Thread time!

Tweet 2: The law says...
[Quote relevant section]

Tweet 3: In plain English...
[Simple explanation]

Tweet 4: Real-world example...
[Scenario]

Tweet 5: CTA
Learn more: [link]

#NigerianLaw #LawMadeSimple
```

### Workflow

1. Check trending topics related to Nigerian law
2. Pick a template that fits
3. Fill in the content manually
4. Post directly to Twitter

### Pros

- Zero setup cost
- Full control over every word
- No technical dependencies

### Cons

- Time-consuming (15-20 min per post)
- Inconsistent posting schedule
- No AI assistance for ideation

---

## Option 2: Full Automation

### Overview

Fully autonomous system that generates, reviews, and posts content automatically.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FULL AUTOMATION PIPELINE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│   │   Triggers   │────▶│   Generate   │────▶│   Review     │   │
│   │              │     │   (Claude)   │     │   (Claude)   │   │
│   │ • Cron jobs  │     │              │     │              │   │
│   │ • Webhooks   │     │ • Templates  │     │ • Safety     │   │
│   │ • Events     │     │ • Brand voice│     │ • Quality    │   │
│   └──────────────┘     └──────────────┘     └──────────────┘   │
│                                                    │             │
│                              ┌─────────────────────┘             │
│                              ▼                                   │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│   │   Monitor    │◀────│    Post      │◀────│   Queue      │   │
│   │              │     │  (Twitter)   │     │              │   │
│   │ • Analytics  │     │              │     │ • Schedule   │   │
│   │ • Errors     │     │ • API calls  │     │ • Priority   │   │
│   │ • Alerts     │     │ • Media      │     │ • Holdback   │   │
│   └──────────────┘     └──────────────┘     └──────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Required Infrastructure

1. **Twitter API Basic** ($100/month)
   - 50,000 tweets/month read
   - 3,000 tweets/month post
   - Media upload support

2. **Claude API** (~$10-20/month)
   - Content generation
   - Safety review
   - Engagement responses

3. **Hosting** (Vercel/Railway)
   - Cron job execution
   - Webhook handling

### Implementation Code

#### 1. Twitter Client Setup

```typescript
// src/services/twitter/twitter.service.ts
import { TwitterApi } from 'twitter-api-v2';

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

export async function postTweet(text: string, mediaIds?: string[]) {
  return twitterClient.v2.tweet({
    text,
    media: mediaIds ? { media_ids: mediaIds } : undefined,
  });
}

export async function uploadMedia(buffer: Buffer, mimeType: string) {
  return twitterClient.v1.uploadMedia(buffer, { mimeType });
}

export async function postThread(tweets: string[]) {
  let lastTweetId: string | undefined;

  for (const text of tweets) {
    const response = await twitterClient.v2.tweet({
      text,
      reply: lastTweetId ? { in_reply_to_tweet_id: lastTweetId } : undefined,
    });
    lastTweetId = response.data.id;
  }

  return lastTweetId;
}
```

#### 2. Content Generator

```typescript
// src/services/social/content-generator.ts
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';

const anthropic = new Anthropic();

const BRAND_VOICE = readFileSync('content/config/brand-voice.md', 'utf-8');

export async function generateTweet(topic: string, type: 'educational' | 'reactive' | 'feature') {
  const systemPrompt = `You are a social media manager for LawMadeSimple,
a Nigerian legal education platform. Follow these brand guidelines:

${BRAND_VOICE}

Generate a single tweet (max 280 chars) about the given topic.
Return JSON: { "tweet": "...", "hashtags": ["..."], "confidence": 0-100 }`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: systemPrompt,
    messages: [{ role: 'user', content: `Generate a ${type} tweet about: ${topic}` }],
  });

  return JSON.parse(response.content[0].text);
}

export async function generateThread(topic: string, sections: string[]) {
  // Similar implementation for thread generation
}
```

#### 3. Cron Job Handler

```typescript
// src/app/api/cron/social/route.ts
import { NextResponse } from 'next/server';
import { generateTweet, postTweet, reviewContent } from '@/services/social';

export const runtime = 'edge';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get next scheduled topic from calendar
    const topic = await getNextScheduledTopic();

    // 2. Generate content
    const content = await generateTweet(topic.subject, topic.type);

    // 3. AI safety review
    const review = await reviewContent(content.tweet);
    if (!review.safe) {
      await logRejection(content, review.reason);
      return NextResponse.json({ status: 'rejected', reason: review.reason });
    }

    // 4. Post to Twitter
    const result = await postTweet(content.tweet + ' ' + content.hashtags.join(' '));

    // 5. Log success
    await logPosted(topic, content, result);

    return NextResponse.json({ status: 'posted', tweetId: result.data.id });
  } catch (error) {
    await logError(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

#### 4. Vercel Cron Configuration

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/social",
      "schedule": "0 9,13,18 * * *"
    }
  ]
}
```

### Safety Measures

```typescript
// src/services/social/content-reviewer.ts
export async function reviewContent(tweet: string): Promise<ReviewResult> {
  const checks = [
    checkForLegalAdvice(tweet),      // Must have disclaimers
    checkForProfanity(tweet),         // No inappropriate language
    checkForMisinformation(tweet),    // Fact-check claims
    checkBrandVoice(tweet),           // Matches our tone
    checkCharacterLimit(tweet),       // Under 280
  ];

  const results = await Promise.all(checks);
  return {
    safe: results.every(r => r.passed),
    issues: results.filter(r => !r.passed).map(r => r.reason),
  };
}
```

### Monitoring Dashboard

```typescript
// src/app/admin/social/page.tsx
// Shows:
// - Posts scheduled/published today
// - Engagement metrics
// - Failed posts with reasons
// - Content pipeline status
```

---

## Option 3: Content Queue System

### Overview

The balanced approach we're currently using. AI generates, human reviews, manual posting.

### Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     CONTENT QUEUE WORKFLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐                                              │
│   │    INPUT     │ ideas.json, calendar.json, features.json    │
│   └──────┬───────┘                                              │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────┐                                              │
│   │Claude Code   │ "Generate 5 tweets from ideas.json"         │
│   │   Session    │ "Create thread for tenant-rights feature"   │
│   └──────┬───────┘                                              │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────┐                                              │
│   │   DRAFTS     │ drafts.json - pending human review          │
│   └──────┬───────┘                                              │
│          │                                                       │
│          ▼  (Human reviews, edits, approves)                    │
│   ┌──────────────┐                                              │
│   │  SCHEDULED   │ scheduled.json - ready to post              │
│   └──────┬───────┘                                              │
│          │                                                       │
│          ▼  (Human posts manually at scheduled time)            │
│   ┌──────────────┐                                              │
│   │   POSTED     │ posted.json - archive with metrics          │
│   └──────────────┘                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Claude Code Commands

During a development session, use these prompts:

```bash
# Generate content from ideas
"Read content/input/ideas.json and generate tweets for the first 3 ideas.
Save to content/queue/drafts.json following the schema."

# Generate feature announcement
"We just shipped the Lagos Tenancy Law expansion. Create an announcement
thread using content/config/brand-voice.md guidelines."

# Process calendar
"Check content/input/calendar.json for today's scheduled topics and
generate the content."

# Move approved to scheduled
"Move draft with id 'draft-001' to scheduled.json with postTime
set to tomorrow 9am WAT."

# Archive posted content
"Move scheduled item 'sched-001' to posted.json with these metrics:
likes: 45, retweets: 12, replies: 8"
```

### JSON Schemas

#### ideas.json

```json
{
  "ideas": [
    {
      "id": "idea-001",
      "topic": "Can your landlord increase rent mid-tenancy?",
      "type": "educational",
      "relatedLaw": "Lagos Tenancy Law 2011",
      "urgency": "normal",
      "addedAt": "2026-02-05T10:00:00Z",
      "notes": "Common question from users"
    }
  ]
}
```

#### drafts.json

```json
{
  "drafts": [
    {
      "id": "draft-001",
      "ideaId": "idea-001",
      "type": "single",
      "content": "Your landlord CANNOT increase your rent during an active tenancy...",
      "hashtags": ["#NigerianLaw", "#TenantRights", "#LawMadeSimple"],
      "media": null,
      "generatedAt": "2026-02-05T14:00:00Z",
      "status": "pending_review"
    }
  ]
}
```

#### scheduled.json

```json
{
  "scheduled": [
    {
      "id": "sched-001",
      "draftId": "draft-001",
      "content": "Your landlord CANNOT increase your rent during an active tenancy...",
      "hashtags": ["#NigerianLaw", "#TenantRights", "#LawMadeSimple"],
      "postTime": "2026-02-06T09:00:00+01:00",
      "approvedAt": "2026-02-05T18:00:00Z",
      "approvedBy": "manual"
    }
  ]
}
```

#### posted.json

```json
{
  "posted": [
    {
      "id": "post-001",
      "scheduledId": "sched-001",
      "tweetId": "1234567890",
      "content": "Your landlord CANNOT increase your rent...",
      "postedAt": "2026-02-06T09:02:00+01:00",
      "metrics": {
        "likes": 45,
        "retweets": 12,
        "replies": 8,
        "impressions": 2400,
        "recordedAt": "2026-02-07T09:00:00Z"
      }
    }
  ]
}
```

---

## Migration Paths

### Option 3 → Option 2 (Full Automation)

When you're ready to upgrade from the current queue system to full automation:

#### Prerequisites

1. **Budget**: $100+/month for Twitter API
2. **Content Volume**: Consistent posting schedule for 30+ days
3. **Trust**: AI-generated content quality is consistently good
4. **Monitoring**: Time to review automated posts daily

#### Migration Steps

1. **Set up Twitter Developer Account**
   ```bash
   # Apply at developer.twitter.com
   # Subscribe to Basic tier ($100/month)
   # Create app and get credentials
   ```

2. **Install Dependencies**
   ```bash
   npm install twitter-api-v2 @anthropic-ai/sdk
   ```

3. **Add Environment Variables**
   ```env
   TWITTER_API_KEY=xxx
   TWITTER_API_SECRET=xxx
   TWITTER_ACCESS_TOKEN=xxx
   TWITTER_ACCESS_SECRET=xxx
   TWITTER_BEARER_TOKEN=xxx
   ANTHROPIC_API_KEY=xxx
   CRON_SECRET=xxx
   ```

4. **Create API Routes**
   - `/api/cron/social` - Main cron handler
   - `/api/social/post` - Manual post trigger
   - `/api/social/review` - Content review endpoint

5. **Set up Cron Jobs**
   ```json
   // vercel.json
   {
     "crons": [
       { "path": "/api/cron/social", "schedule": "0 9 * * *" },
       { "path": "/api/cron/social", "schedule": "0 13 * * *" },
       { "path": "/api/cron/social", "schedule": "0 18 * * *" }
     ]
   }
   ```

6. **Add Monitoring**
   - Sentry alerts for failed posts
   - Daily digest email of posted content
   - Dashboard for metrics review

7. **Gradual Rollout**
   - Week 1: Auto-generate, manually review and post
   - Week 2: Auto-post with same-day review
   - Week 3: Full automation with monitoring

### Option 2 → Option 3 (Downgrade)

If automation isn't working out:

1. Disable cron jobs in `vercel.json`
2. Continue using queue system manually
3. Keep Twitter API for posting via script (optional)

---

## Cost Comparison

### Option 1: Manual with Templates

| Item | Monthly Cost |
|------|--------------|
| Tools | $0 |
| Time (20 posts × 15 min) | 5 hours |
| **Total** | **$0 + 5 hours** |

### Option 2: Full Automation

| Item | Monthly Cost |
|------|--------------|
| Twitter API Basic | $100 |
| Claude API (est. 200 calls) | $10-20 |
| Vercel Pro (for crons) | $20 |
| **Total** | **~$130-140/month** |

### Option 3: Content Queue (Current)

| Item | Monthly Cost |
|------|--------------|
| Tools | $0 |
| Time (20 posts × 5 min) | 1.7 hours |
| **Total** | **$0 + 1.7 hours** |

---

## Recommended Posting Schedule

Based on Nigerian Twitter activity patterns:

| Day | Times (WAT) | Content Type |
|-----|-------------|--------------|
| Monday | 9am, 1pm | Educational, Weekly theme intro |
| Tuesday | 9am, 6pm | Scenario-based, Engagement |
| Wednesday | 9am, 1pm | Educational, Thread |
| Thursday | 9am, 6pm | Feature highlight, Engagement |
| Friday | 9am, 1pm | Weekend prep, Light content |
| Saturday | 11am | Casual/trending |
| Sunday | 6pm | Week preview |

---

## Screenshot Automation (Future)

For feature announcements with screenshots:

```typescript
// scripts/social/capture-screenshot.ts
import { chromium } from 'playwright';

export async function captureFeatureScreenshot(
  url: string,
  selector: string,
  outputPath: string
) {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 }, // Twitter card size
  });

  await page.goto(url);
  await page.waitForSelector(selector);

  const element = await page.$(selector);
  await element?.screenshot({ path: outputPath });

  await browser.close();
  return outputPath;
}
```

---

## Content Ideas by Category

### Educational (40% of posts)
- "Did you know?" legal facts
- Section-of-the-week breakdowns
- Common misconceptions debunked
- Legal term definitions

### Reactive/Trending (25% of posts)
- Respond to trending legal news
- Legal takes on viral situations
- Celebrity legal issues explained

### Feature Announcements (15% of posts)
- New laws added
- New scenarios
- App updates
- Milestone celebrations

### Engagement (20% of posts)
- Polls ("Have you ever...?")
- Questions ("What legal topic confuses you most?")
- User story prompts
- Friday fun facts

---

*Last updated: February 2026*
*Current implementation: Option 3 (Content Queue System)*
