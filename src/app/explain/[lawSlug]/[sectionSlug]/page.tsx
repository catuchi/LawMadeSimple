'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  BookmarkCheck,
  FileText,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBadge } from '@/components/ui/disclaimer-badge';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import type { SectionDetail, ExplanationData, ApiSuccessResponse } from '@/types/api';

// Category display info
const categoryInfo: Record<string, { label: string; iconEmoji: string }> = {
  constitution: { label: 'Constitution', iconEmoji: '📜' },
  criminal: { label: 'Criminal Law', iconEmoji: '👮' },
  business: { label: 'Business Law', iconEmoji: '🏢' },
  labour: { label: 'Labour Law', iconEmoji: '💼' },
  property: { label: 'Property Law', iconEmoji: '🏠' },
  tax: { label: 'Tax Law', iconEmoji: '💰' },
  intellectual_property: { label: 'Intellectual Property', iconEmoji: '©️' },
};

export default function ExplanationPage() {
  const params = useParams<{ lawSlug: string; sectionSlug: string }>();
  const { user } = useAuth();

  const [section, setSection] = useState<SectionDetail | null>(null);
  const [explanation, setExplanation] = useState<ExplanationData | null>(null);
  const [isLoadingSection, setIsLoadingSection] = useState(true);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorVariant, setErrorVariant] = useState<'default' | 'not-found' | 'rate-limited'>(
    'default'
  );
  const [isRetrying, setIsRetrying] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'helpful' | 'not-helpful' | null>(null);
  const [lawCategory, setLawCategory] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch section details
  const fetchSection = useCallback(async () => {
    if (!params.lawSlug || !params.sectionSlug) return;

    // Cancel any in-flight request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsLoadingSection(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/v1/laws/${params.lawSlug}/sections/${params.sectionSlug}`,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('Section not found');
          setErrorVariant('not-found');
          return;
        }
        if (response.status === 429) {
          setError('Too many requests. Please wait a moment and try again.');
          setErrorVariant('rate-limited');
          return;
        }
        throw new Error('Failed to fetch section');
      }

      const json: ApiSuccessResponse<SectionDetail> = await response.json();
      setSection(json.data);

      // Fetch law to get category
      const lawResponse = await fetch(`/api/v1/laws/${params.lawSlug}`, {
        signal: abortControllerRef.current.signal,
      });
      if (lawResponse.ok) {
        const lawJson = await lawResponse.json();
        setLawCategory(lawJson.data.category);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
      setErrorVariant('default');
    } finally {
      setIsLoadingSection(false);
      setIsRetrying(false);
    }
  }, [params.lawSlug, params.sectionSlug]);

  // Initial fetch
  useEffect(() => {
    fetchSection();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchSection]);

  // Retry handler
  const handleRetry = useCallback(() => {
    setIsRetrying(true);
    fetchSection();
  }, [fetchSection]);

  // Fetch or generate explanation
  useEffect(() => {
    if (!section) return;

    const fetchExplanation = async () => {
      setIsLoadingExplanation(true);

      try {
        // Try to get cached explanation
        const response = await fetch(`/api/v1/explanations/section/${section.id}`);

        if (response.ok) {
          const json: ApiSuccessResponse<ExplanationData> = await response.json();
          setExplanation(json.data);
        } else if (response.status === 404) {
          // No cached explanation, we'll show "generate" option
          setExplanation(null);
        }
      } catch {
        // Failed to fetch, show generate option
        setExplanation(null);
      } finally {
        setIsLoadingExplanation(false);
      }
    };

    fetchExplanation();
  }, [section]);

  // Generate explanation with streaming
  const generateExplanation = useCallback(async () => {
    if (!section) return;

    setIsGenerating(true);
    setStreamedText('');

    try {
      const response = await fetch('/api/v1/explanations/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: 'section',
          contentId: section.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate explanation');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'chunk') {
                accumulatedText += data.content;
                setStreamedText(accumulatedText);
              } else if (data.type === 'done') {
                setExplanation(data.explanation);
                setStreamedText('');
              } else if (data.type === 'error') {
                throw new Error(data.message);
              }
            } catch {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate explanation');
    } finally {
      setIsGenerating(false);
    }
  }, [section]);

  // Handle bookmark
  const handleBookmark = async () => {
    if (!user) {
      toast.info('Sign in to save this explanation');
      return;
    }

    if (!section) return;

    try {
      if (isBookmarked) {
        // Remove bookmark (would need bookmark ID)
        toast.success('Removed from saved items');
      } else {
        const response = await fetch('/api/v1/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contentType: 'section',
            contentId: section.id,
          }),
        });

        if (response.ok) {
          toast.success('Saved to your bookmarks');
        } else {
          throw new Error('Failed to save');
        }
      }
      setIsBookmarked(!isBookmarked);
    } catch {
      toast.error('Failed to save. Please try again.');
    }
  };

  // Handle share
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: section?.title || 'Law Explanation',
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    }
  };

  // Handle feedback
  const handleFeedback = async (type: 'helpful' | 'not-helpful') => {
    if (!explanation) return;

    try {
      await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          explanationId: explanation.id,
          feedbackType: type === 'helpful' ? 'helpful' : 'unclear',
        }),
      });

      setFeedbackGiven(type);
      toast.success('Thank you for your feedback!');
    } catch {
      toast.error('Failed to submit feedback');
    }
  };

  const catInfo = categoryInfo[lawCategory] || { label: lawCategory, iconEmoji: '📄' };
  const explanationText = explanation?.explanation || streamedText;

  if (error && !isLoadingSection) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center p-4">
          <ErrorState
            variant={errorVariant}
            message={
              errorVariant === 'not-found'
                ? "The section you're looking for doesn't exist or has been moved."
                : error
            }
            onRetry={errorVariant !== 'not-found' ? handleRetry : undefined}
            isRetrying={isRetrying}
            backHref="/laws"
            backLabel="Browse Laws"
            className="max-w-md"
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="animate-page-enter flex-1">
        {/* Page Header */}
        <section className="border-b border-[var(--color-neutral-200)] bg-white px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-3xl">
            {/* Back link and Breadcrumb */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={`/laws/${params.lawSlug}`}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--color-neutral-500)] transition-colors hover:text-[var(--color-primary-500)]"
              >
                <ArrowLeft className="size-4" />
                Back to {section?.law.shortTitle || 'Law'}
              </Link>
              <Breadcrumb
                items={[
                  { label: 'Laws', href: '/laws' },
                  { label: section?.law.shortTitle || 'Law', href: `/laws/${params.lawSlug}` },
                  { label: section?.number || 'Section' },
                ]}
                className="hidden sm:flex"
              />
            </div>

            {/* Title and Meta */}
            {isLoadingSection ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            ) : section ? (
              <>
                <div className="flex gap-2">
                  <Badge variant="primary">{catInfo.label}</Badge>
                  <Badge variant="success">Verified</Badge>
                </div>

                <h1 className="font-heading mt-3 text-2xl font-bold text-[var(--color-neutral-800)] md:text-3xl">
                  {section.number}: {section.title}
                </h1>

                <div className="mt-2 flex items-center gap-3 text-sm text-[var(--color-neutral-500)]">
                  <div className="flex items-center gap-1">
                    <FileText className="size-4" />
                    <span>{section.law.shortTitle}</span>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-b border-[var(--color-neutral-200)] bg-[var(--color-warning-light)] px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <DisclaimerBadge />
          </div>
        </section>

        {/* Main Content */}
        <section className="bg-[var(--background-secondary)] px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-sm">
              {isLoadingSection || isLoadingExplanation ? (
                <div className="p-6">
                  <Skeleton className="mb-4 h-6 w-48" />
                  <Skeleton className="mb-2 h-4 w-full" />
                  <Skeleton className="mb-2 h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <Accordion type="multiple" defaultValue={['explanation']} className="p-0">
                  {/* Plain Language Explanation */}
                  <AccordionItem
                    value="explanation"
                    className="border-b border-[var(--color-neutral-200)] px-6"
                  >
                    <AccordionTrigger className="text-base font-semibold text-[var(--color-neutral-800)]">
                      Plain Language Explanation
                    </AccordionTrigger>
                    <AccordionContent className="text-[var(--color-neutral-600)]">
                      {explanationText ? (
                        <div className="prose prose-sm max-w-none">
                          <p className="leading-relaxed whitespace-pre-wrap">{explanationText}</p>
                          {isGenerating && (
                            <span className="inline-block size-2 animate-pulse rounded-full bg-[var(--color-primary-500)]" />
                          )}
                        </div>
                      ) : (
                        <div className="py-4 text-center">
                          <p className="mb-4 text-[var(--color-neutral-500)]">
                            No explanation available yet. Generate one with AI.
                          </p>
                          <Button
                            onClick={generateExplanation}
                            disabled={isGenerating}
                            className="gap-2"
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              'Generate Explanation'
                            )}
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Practical Examples */}
                  <AccordionItem
                    value="examples"
                    className="border-b border-[var(--color-neutral-200)] px-6"
                  >
                    <AccordionTrigger className="text-base font-semibold text-[var(--color-neutral-800)]">
                      Practical Examples
                    </AccordionTrigger>
                    <AccordionContent className="text-[var(--color-neutral-600)]">
                      {explanation?.examples && explanation.examples.length > 0 ? (
                        <div className="space-y-4">
                          {explanation.examples.map((example, index) => (
                            <div
                              key={index}
                              className="rounded-lg bg-[var(--color-neutral-50)] p-4"
                            >
                              <h4 className="font-medium text-[var(--color-neutral-800)]">
                                {example.title}
                              </h4>
                              <p className="mt-2 text-sm">
                                <strong>Scenario:</strong> {example.scenario}
                              </p>
                              <p className="mt-1 text-sm">
                                <strong>Application:</strong> {example.application}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[var(--color-neutral-500)]">
                          Examples will appear after generating an explanation.
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Original Law Text */}
                  <AccordionItem value="original" className="px-6">
                    <AccordionTrigger className="text-base font-semibold text-[var(--color-neutral-800)]">
                      Original Law Text
                    </AccordionTrigger>
                    <AccordionContent>
                      {section?.content ? (
                        <div className="rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-4">
                          <p className="font-mono text-sm whitespace-pre-wrap text-[var(--color-neutral-700)]">
                            {section.content}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[var(--color-neutral-500)]">
                          Original text not available.
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              {/* Feedback Section */}
              {explanation && (
                <div className="border-t border-[var(--color-neutral-200)] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-neutral-700)]">
                        Was this explanation helpful?
                      </p>
                    </div>
                    {feedbackGiven ? (
                      <p className="text-sm text-[var(--color-neutral-500)]">
                        Thanks for your feedback!
                      </p>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFeedback('helpful')}
                          className="gap-1.5"
                        >
                          <ThumbsUp className="size-4" />
                          Yes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFeedback('not-helpful')}
                          className="gap-1.5"
                        >
                          <ThumbsDown className="size-4" />
                          No
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions Section */}
              <div className="border-t border-[var(--color-neutral-200)] p-6">
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
                    <Share2 className="size-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBookmark} className="gap-1.5">
                    {isBookmarked ? (
                      <>
                        <BookmarkCheck className="size-4" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="size-4" />
                        Save
                      </>
                    )}
                  </Button>
                  {section && (
                    <Link
                      href={`/laws/${params.lawSlug}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-neutral-300)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:bg-[var(--color-neutral-50)]"
                    >
                      <ExternalLink className="size-4" />
                      View Full Law
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Related Scenarios */}
            {section?.relatedScenarios && section.relatedScenarios.length > 0 && (
              <div className="mt-8">
                <h2 className="font-heading mb-4 text-lg font-semibold text-[var(--color-neutral-800)]">
                  Related Scenarios
                </h2>
                <div className="flex flex-wrap gap-3">
                  {section.relatedScenarios.map((scenario) => (
                    <Link
                      key={scenario.id}
                      href={`/scenarios/${scenario.slug}`}
                      className="rounded-full border border-[var(--color-neutral-200)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)]"
                    >
                      {scenario.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
