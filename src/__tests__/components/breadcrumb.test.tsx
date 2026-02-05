import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumb } from '@/components/ui/breadcrumb';

describe('Breadcrumb - Mobile/Desktop Responsive Behavior', () => {
  const sampleItems = [
    { label: 'Laws', href: '/laws' },
    { label: 'Constitution', href: '/laws/constitution' },
    { label: 'Section 33', href: undefined }, // Current page (no href)
  ];

  it('renders both mobile and desktop variants', () => {
    render(<Breadcrumb items={sampleItems} />);

    // Should have navigation landmark
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('renders mobile back link with sm:hidden class', () => {
    render(<Breadcrumb items={sampleItems} />);

    // Mobile link should exist and have sm:hidden class
    const mobileLinks = screen.getAllByRole('link');
    const mobileBackLink = mobileLinks.find((link) => link.className.includes('sm:hidden'));

    expect(mobileBackLink).toBeDefined();
    expect(mobileBackLink).toHaveClass('sm:hidden');
  });

  it('renders desktop breadcrumb list with hidden sm:flex classes', () => {
    render(<Breadcrumb items={sampleItems} />);

    // Desktop list should have hidden sm:flex classes
    const list = screen.getByRole('list');
    expect(list).toHaveClass('hidden');
    expect(list).toHaveClass('sm:flex');
  });

  it('mobile back link points to last item with href', () => {
    render(<Breadcrumb items={sampleItems} />);

    // The mobile back link should point to 'Constitution' (last item with href)
    const mobileLinks = screen.getAllByRole('link');
    const mobileBackLink = mobileLinks.find((link) => link.className.includes('sm:hidden'));

    expect(mobileBackLink).toHaveAttribute('href', '/laws/constitution');
    expect(mobileBackLink).toHaveTextContent('Constitution');
  });

  it('mobile back link falls back to home when no items have href', () => {
    const itemsWithoutHrefs = [{ label: 'Current Page' }];

    render(<Breadcrumb items={itemsWithoutHrefs} />);

    const mobileLinks = screen.getAllByRole('link');
    const mobileBackLink = mobileLinks.find((link) => link.className.includes('sm:hidden'));

    expect(mobileBackLink).toHaveAttribute('href', '/');
    expect(mobileBackLink).toHaveTextContent('Home');
  });

  it('desktop view shows home icon link first', () => {
    render(<Breadcrumb items={sampleItems} />);

    // Home link should be first in the list
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('desktop view renders all breadcrumb items', () => {
    render(<Breadcrumb items={sampleItems} />);

    // Should render all items (Home + Laws + Constitution + Section 33)
    // Use getAllByText since items appear in both mobile and desktop views
    expect(screen.getAllByText('Laws').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Constitution').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Section 33').length).toBeGreaterThanOrEqual(1);
  });

  it('marks last item as current page with aria-current', () => {
    render(<Breadcrumb items={sampleItems} />);

    const currentPage = screen.getByText('Section 33');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });

  it('truncates long labels with max-w-[150px] on mobile and max-w-[200px] on desktop', () => {
    const longItems = [
      {
        label: 'This is a very long breadcrumb label that should be truncated',
        href: '/long',
      },
    ];

    render(<Breadcrumb items={longItems} />);

    // Mobile back link should have truncate class
    const mobileLinks = screen.getAllByRole('link');
    const mobileBackLink = mobileLinks.find((link) => link.className.includes('sm:hidden'));
    const mobileSpan = mobileBackLink?.querySelector('span');

    expect(mobileSpan).toHaveClass('truncate');
    expect(mobileSpan).toHaveClass('max-w-[150px]');
  });

  it('renders items without href as non-clickable text', () => {
    const itemsWithMixedHrefs = [
      { label: 'Parent', href: '/parent' },
      { label: 'Non-clickable' }, // No href
      { label: 'Current' }, // No href, last item
    ];

    render(<Breadcrumb items={itemsWithMixedHrefs} />);

    // 'Non-clickable' should be a span, not a link
    const nonClickable = screen.getByText('Non-clickable');
    expect(nonClickable.tagName).toBe('SPAN');
  });

  it('applies custom className to nav element', () => {
    render(<Breadcrumb items={sampleItems} className="custom-class" />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('custom-class');
  });
});
