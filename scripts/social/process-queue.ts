/**
 * Social Media Content Queue Helper
 *
 * This script provides TypeScript types and utility functions for managing
 * the LawMadeSimple social media content queue.
 *
 * Usage:
 *   DOTENV_CONFIG_PATH=.env.local npx tsx scripts/social/process-queue.ts [command]
 *
 * Commands:
 *   stats     - Show queue statistics
 *   today     - Show today's scheduled content
 *   pending   - List all pending drafts
 *   validate  - Validate all JSON files
 */

/* eslint-disable no-console */
// Console output is intentional - this is a CLI tool

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// =============================================================================
// Types
// =============================================================================

export type ContentType = 'educational' | 'reactive' | 'feature' | 'engagement';
export type Urgency = 'low' | 'normal' | 'high' | 'urgent';
export type DraftStatus = 'pending_review' | 'needs_revision' | 'approved' | 'rejected';
export type SlotStatus = 'idea' | 'draft' | 'scheduled' | 'posted';
export type MediaType = 'image' | 'screenshot';

export interface Idea {
  id: string;
  topic: string;
  type: ContentType;
  relatedLaw?: string;
  relatedScenario?: string;
  urgency: Urgency;
  addedAt: string;
  notes?: string;
}

export interface IdeasFile {
  ideas: Idea[];
}

export interface CalendarSlot {
  date: string;
  day: string;
  time: string;
  type: ContentType;
  topic: string;
  status: SlotStatus;
  ideaId?: string;
  draftId?: string;
}

export interface CalendarWeek {
  weekNumber: number;
  startDate: string;
  endDate: string;
  theme: string;
  focusLaw: string;
  slots: CalendarSlot[];
}

export interface CalendarFile {
  currentMonth: string;
  monthlyTheme: string;
  weeks: CalendarWeek[];
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  releaseDate: string;
  status: 'planned' | 'in_development' | 'released';
  highlights: string[];
  targetAudience: string[];
  suggestedFormat: 'single' | 'thread';
  announcementStatus: 'pending' | 'scheduled' | 'posted';
  link: string;
}

export interface UpcomingFeature {
  id: string;
  name: string;
  description: string;
  estimatedRelease: string;
  status: 'planned' | 'in_development';
  targetAudience: string[];
  teaserIdeas: string[];
}

export interface FeaturesFile {
  features: Feature[];
  upcoming: UpcomingFeature[];
}

export interface Media {
  type: MediaType;
  path: string;
  alt: string;
}

export interface Draft {
  id: string;
  ideaId?: string;
  calendarSlot?: string;
  type: 'single' | 'thread';
  content: string | null;
  hashtags: string[];
  thread: string[] | null;
  media: Media | null;
  generatedAt: string;
  status: DraftStatus;
  reviewNotes?: string;
}

export interface DraftsFile {
  drafts: Draft[];
}

export interface ScheduledItem {
  id: string;
  draftId: string;
  type: 'single' | 'thread';
  content: string | null;
  thread: string[] | null;
  hashtags: string[];
  media: Media | null;
  postTime: string;
  approvedAt: string;
  approvedBy: string;
}

export interface ScheduledFile {
  scheduled: ScheduledItem[];
}

export interface Metrics {
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  impressions: number;
  profileVisits: number;
  linkClicks: number;
  recordedAt: string;
}

export interface PostedItem {
  id: string;
  scheduledId: string;
  tweetId: string;
  tweetUrl: string;
  type: 'single' | 'thread';
  content: string;
  hashtags: string[];
  postedAt: string;
  metrics: Metrics;
  notes?: string;
}

export interface PostedFile {
  posted: PostedItem[];
}

// =============================================================================
// File Paths
// =============================================================================

const CONTENT_DIR = join(process.cwd(), 'content');

const PATHS = {
  ideas: join(CONTENT_DIR, 'input', 'ideas.json'),
  calendar: join(CONTENT_DIR, 'input', 'calendar.json'),
  features: join(CONTENT_DIR, 'input', 'features.json'),
  drafts: join(CONTENT_DIR, 'queue', 'drafts.json'),
  scheduled: join(CONTENT_DIR, 'queue', 'scheduled.json'),
  posted: join(CONTENT_DIR, 'queue', 'posted.json'),
  brandVoice: join(CONTENT_DIR, 'config', 'brand-voice.md'),
  hashtagStrategy: join(CONTENT_DIR, 'config', 'hashtag-strategy.md'),
  contentTypes: join(CONTENT_DIR, 'config', 'content-types.md'),
};

// =============================================================================
// File Loaders
// =============================================================================

function loadJSON<T>(path: string): T {
  if (!existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }
  const content = readFileSync(path, 'utf-8');
  return JSON.parse(content) as T;
}

function saveJSON<T>(path: string, data: T): void {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

export function loadIdeas(): IdeasFile {
  return loadJSON<IdeasFile>(PATHS.ideas);
}

export function loadCalendar(): CalendarFile {
  return loadJSON<CalendarFile>(PATHS.calendar);
}

export function loadFeatures(): FeaturesFile {
  return loadJSON<FeaturesFile>(PATHS.features);
}

export function loadDrafts(): DraftsFile {
  return loadJSON<DraftsFile>(PATHS.drafts);
}

export function loadScheduled(): ScheduledFile {
  return loadJSON<ScheduledFile>(PATHS.scheduled);
}

export function loadPosted(): PostedFile {
  return loadJSON<PostedFile>(PATHS.posted);
}

export function saveDrafts(data: DraftsFile): void {
  saveJSON(PATHS.drafts, data);
}

export function saveScheduled(data: ScheduledFile): void {
  saveJSON(PATHS.scheduled, data);
}

export function savePosted(data: PostedFile): void {
  saveJSON(PATHS.posted, data);
}

// =============================================================================
// Helpers
// =============================================================================

export function generateDraftId(): string {
  const drafts = loadDrafts();
  const maxId = drafts.drafts.reduce((max, d) => {
    const num = parseInt(d.id.replace('draft-', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `draft-${String(maxId + 1).padStart(3, '0')}`;
}

export function generateScheduledId(): string {
  const scheduled = loadScheduled();
  const maxId = scheduled.scheduled.reduce((max, s) => {
    const num = parseInt(s.id.replace('sched-', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `sched-${String(maxId + 1).padStart(3, '0')}`;
}

export function generatePostedId(): string {
  const posted = loadPosted();
  const maxId = posted.posted.reduce((max, p) => {
    const num = parseInt(p.id.replace('post-', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `post-${String(maxId + 1).padStart(3, '0')}`;
}

export function getTodaySlots(): CalendarSlot[] {
  const calendar = loadCalendar();
  const today = new Date().toISOString().split('T')[0];

  const slots: CalendarSlot[] = [];
  for (const week of calendar.weeks) {
    for (const slot of week.slots) {
      if (slot.date === today) {
        slots.push(slot);
      }
    }
  }
  return slots;
}

export function getPendingDrafts(): Draft[] {
  const drafts = loadDrafts();
  return drafts.drafts.filter((d) => d.status === 'pending_review');
}

export function getIdeasByUrgency(urgency?: Urgency): Idea[] {
  const ideas = loadIdeas();
  if (!urgency) {
    return ideas.ideas.sort((a, b) => {
      const urgencyOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });
  }
  return ideas.ideas.filter((i) => i.urgency === urgency);
}

export function getReleasedFeaturesPendingAnnouncement(): Feature[] {
  const features = loadFeatures();
  return features.features.filter(
    (f) => f.status === 'released' && f.announcementStatus === 'pending'
  );
}

export function validateAllFiles(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  try {
    loadIdeas();
  } catch (e) {
    errors.push(`ideas.json: ${(e as Error).message}`);
  }

  try {
    loadCalendar();
  } catch (e) {
    errors.push(`calendar.json: ${(e as Error).message}`);
  }

  try {
    loadFeatures();
  } catch (e) {
    errors.push(`features.json: ${(e as Error).message}`);
  }

  try {
    loadDrafts();
  } catch (e) {
    errors.push(`drafts.json: ${(e as Error).message}`);
  }

  try {
    loadScheduled();
  } catch (e) {
    errors.push(`scheduled.json: ${(e as Error).message}`);
  }

  try {
    loadPosted();
  } catch (e) {
    errors.push(`posted.json: ${(e as Error).message}`);
  }

  // Validate config files exist
  for (const [name, path] of Object.entries(PATHS)) {
    if (!existsSync(path)) {
      errors.push(`${name}: File not found at ${path}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// =============================================================================
// CLI Commands
// =============================================================================

function printStats(): void {
  console.log('\n📊 Content Queue Statistics\n');
  console.log('='.repeat(50));

  const ideas = loadIdeas();
  const calendar = loadCalendar();
  const features = loadFeatures();
  const drafts = loadDrafts();
  const scheduled = loadScheduled();
  const posted = loadPosted();

  console.log('\n📥 INPUT');
  console.log(`   Ideas: ${ideas.ideas.length}`);
  console.log(`   - Urgent: ${ideas.ideas.filter((i) => i.urgency === 'urgent').length}`);
  console.log(`   - High: ${ideas.ideas.filter((i) => i.urgency === 'high').length}`);
  console.log(`   - Normal: ${ideas.ideas.filter((i) => i.urgency === 'normal').length}`);

  const totalSlots = calendar.weeks.reduce((sum, w) => sum + w.slots.length, 0);
  console.log(`\n   Calendar: ${totalSlots} slots in ${calendar.weeks.length} weeks`);
  console.log(`   Theme: ${calendar.monthlyTheme}`);

  console.log(
    `\n   Features: ${features.features.length} released, ${features.upcoming.length} upcoming`
  );
  console.log(
    `   - Pending announcement: ${features.features.filter((f) => f.announcementStatus === 'pending').length}`
  );

  console.log('\n📝 QUEUE');
  console.log(`   Drafts: ${drafts.drafts.length}`);
  console.log(
    `   - Pending review: ${drafts.drafts.filter((d) => d.status === 'pending_review').length}`
  );
  console.log(
    `   - Needs revision: ${drafts.drafts.filter((d) => d.status === 'needs_revision').length}`
  );
  console.log(`   - Approved: ${drafts.drafts.filter((d) => d.status === 'approved').length}`);

  console.log(`\n   Scheduled: ${scheduled.scheduled.length}`);

  console.log('\n📤 POSTED');
  console.log(`   Total: ${posted.posted.length}`);

  if (posted.posted.length > 0) {
    const totalLikes = posted.posted.reduce((sum, p) => sum + (p.metrics?.likes || 0), 0);
    const totalRetweets = posted.posted.reduce((sum, p) => sum + (p.metrics?.retweets || 0), 0);
    console.log(`   - Total likes: ${totalLikes}`);
    console.log(`   - Total retweets: ${totalRetweets}`);
  }

  console.log('\n' + '='.repeat(50));
}

function printToday(): void {
  const today = new Date().toISOString().split('T')[0];
  console.log(`\n📅 Today's Content (${today})\n`);
  console.log('='.repeat(50));

  const slots = getTodaySlots();

  if (slots.length === 0) {
    console.log('\nNo content scheduled for today.');
    return;
  }

  for (const slot of slots) {
    console.log(`\n⏰ ${slot.time} WAT - ${slot.type.toUpperCase()}`);
    console.log(`   Topic: ${slot.topic}`);
    console.log(`   Status: ${slot.status}`);
    if (slot.draftId) {
      console.log(`   Draft: ${slot.draftId}`);
    }
  }

  console.log('\n' + '='.repeat(50));
}

function printPending(): void {
  console.log('\n📝 Pending Drafts\n');
  console.log('='.repeat(50));

  const pending = getPendingDrafts();

  if (pending.length === 0) {
    console.log('\nNo drafts pending review.');
    return;
  }

  for (const draft of pending) {
    console.log(`\n[${draft.id}] ${draft.type.toUpperCase()}`);
    console.log(`   Generated: ${draft.generatedAt}`);
    if (draft.ideaId) {
      console.log(`   From idea: ${draft.ideaId}`);
    }
    console.log(`\n   Content:`);
    if (draft.content) {
      console.log(`   "${draft.content.substring(0, 100)}..."`);
    } else if (draft.thread) {
      console.log(`   Thread with ${draft.thread.length} tweets`);
    }
    console.log(`\n   Hashtags: ${draft.hashtags.join(' ')}`);
  }

  console.log('\n' + '='.repeat(50));
}

function printValidation(): void {
  console.log('\n✅ Validating Files\n');
  console.log('='.repeat(50));

  const { valid, errors } = validateAllFiles();

  if (valid) {
    console.log('\n✅ All files valid!');
  } else {
    console.log('\n❌ Validation errors:');
    for (const error of errors) {
      console.log(`   - ${error}`);
    }
  }

  console.log('\n' + '='.repeat(50));
}

// =============================================================================
// Main
// =============================================================================

const command = process.argv[2];

switch (command) {
  case 'stats':
    printStats();
    break;
  case 'today':
    printToday();
    break;
  case 'pending':
    printPending();
    break;
  case 'validate':
    printValidation();
    break;
  default:
    console.log(`
Social Media Content Queue Helper

Usage:
  npx tsx scripts/social/process-queue.ts [command]

Commands:
  stats     Show queue statistics
  today     Show today's scheduled content
  pending   List all pending drafts
  validate  Validate all JSON files

Examples:
  npx tsx scripts/social/process-queue.ts stats
  npx tsx scripts/social/process-queue.ts today
`);
}
