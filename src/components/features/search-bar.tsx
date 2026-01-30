'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { useSearchSuggestions, type TransformedSuggestion } from '@/hooks/use-api';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  size?: 'default' | 'hero';
}

export function SearchBar({
  placeholder = 'What legal situation are you dealing with?',
  className,
  defaultValue = '',
  onSearch,
  showSuggestions = true,
  autoFocus = false,
  size = 'default',
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const suggestionsId = 'search-suggestions';

  // Use the typed API hook with built-in debouncing
  const { suggestions, isLoading } = useSearchSuggestions(query, {
    enabled: showSuggestions && isFocused,
    debounceMs: 300,
    limit: 6,
  });

  // Clamp selected index to valid range (handles suggestions changing)
  const validSelectedIndex =
    selectedIndex >= 0 && selectedIndex < suggestions.length ? selectedIndex : -1;

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      if (onSearch) {
        onSearch(query.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: TransformedSuggestion) => {
    setQuery(suggestion.title);
    setIsFocused(false);
    setSelectedIndex(-1);

    // If it's a scenario, navigate directly to it
    if (suggestion.type === 'scenario' && suggestion.slug) {
      router.push(`/scenarios/${suggestion.slug}`);
      return;
    }

    // Otherwise, search for the title
    if (onSearch) {
      onSearch(suggestion.title);
    } else {
      router.push(`/search?q=${encodeURIComponent(suggestion.title)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        if (validSelectedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[validSelectedIndex]);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const sizeClasses =
    size === 'hero' ? 'h-14 px-6 text-base md:max-w-[640px]' : 'h-11 px-4 text-sm';

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form role="search" onSubmit={handleSubmit}>
        <div
          className={cn(
            'relative flex w-full items-center rounded-full border bg-white shadow-sm transition-all duration-200',
            isFocused
              ? 'border-primary ring-primary/20 shadow-md ring-2'
              : 'border-[var(--color-neutral-200)]',
            sizeClasses
          )}
        >
          <Search className="ml-1 size-5 shrink-0 text-[var(--color-neutral-400)]" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1); // Reset selection when typing
            }}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete="off"
            aria-label={placeholder}
            aria-autocomplete="list"
            aria-controls={
              showSuggestions && isFocused && suggestions.length > 0 ? suggestionsId : undefined
            }
            aria-expanded={showSuggestions && isFocused && suggestions.length > 0}
            aria-activedescendant={
              validSelectedIndex >= 0
                ? `suggestion-${suggestions[validSelectedIndex]?.id}`
                : undefined
            }
            className="h-full flex-1 bg-transparent px-3 outline-none placeholder:text-[var(--color-neutral-400)] focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="mr-1 rounded-full p-1 hover:bg-[var(--color-neutral-100)]"
              aria-label="Clear search"
            >
              <X className="size-4 text-[var(--color-neutral-400)]" />
            </button>
          )}
        </div>
      </form>

      {/* Screen reader announcement for results count */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {!isLoading && suggestions.length > 0 && isFocused && (
          <span>
            {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} available. Use
            arrow keys to navigate.
          </span>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && isFocused && (suggestions.length > 0 || isLoading) && (
        <div
          className="absolute top-full z-50 mt-2 w-full rounded-2xl border border-[var(--color-neutral-200)] bg-white p-2 shadow-lg"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Spinner size="sm" />
            </div>
          ) : (
            <ul id={suggestionsId} role="listbox" aria-label="Search suggestions">
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.id}
                  id={`suggestion-${suggestion.id}`}
                  role="option"
                  aria-selected={index === validSelectedIndex}
                >
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-[var(--color-neutral-50)]',
                      index === validSelectedIndex && 'bg-[var(--color-neutral-100)]'
                    )}
                  >
                    {suggestion.type === 'scenario' ? (
                      <Sparkles className="size-4 text-[var(--color-accent)]" />
                    ) : suggestion.type === 'recent' ? (
                      <Clock className="size-4 text-[var(--color-neutral-400)]" />
                    ) : (
                      <Search className="size-4 text-[var(--color-neutral-400)]" />
                    )}
                    <div className="flex-1">
                      <span className="text-sm text-[var(--color-neutral-800)]">
                        {suggestion.title}
                      </span>
                    </div>
                    {suggestion.type === 'scenario' && (
                      <span className="rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs text-[var(--color-accent)]">
                        Scenario
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
