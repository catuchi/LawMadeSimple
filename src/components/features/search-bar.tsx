'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'recent' | 'popular' | 'result';
  category?: string;
}

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
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const suggestionsId = 'search-suggestions';

  // Debounced search suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/v1/search/suggestions?q=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch {
      // Silently fail on suggestion fetch errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showSuggestions && query) {
        fetchSuggestions(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, showSuggestions, fetchSuggestions]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

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
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setIsFocused(false);
    setSelectedIndex(-1);
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
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedIndex]);
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
            onChange={(e) => setQuery(e.target.value)}
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
              selectedIndex >= 0 ? `suggestion-${suggestions[selectedIndex]?.id}` : undefined
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
                  aria-selected={index === selectedIndex}
                >
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-[var(--color-neutral-50)]',
                      index === selectedIndex && 'bg-[var(--color-neutral-100)]'
                    )}
                  >
                    <Search className="size-4 text-[var(--color-neutral-400)]" />
                    <div className="flex-1">
                      <span className="text-sm text-[var(--color-neutral-800)]">
                        {suggestion.title}
                      </span>
                      {suggestion.category && (
                        <span className="ml-2 text-xs text-[var(--color-neutral-500)]">
                          in {suggestion.category}
                        </span>
                      )}
                    </div>
                    {suggestion.type === 'recent' && (
                      <span className="text-xs text-[var(--color-neutral-400)]">Recent</span>
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
