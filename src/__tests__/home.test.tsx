import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '@/app/page';

// Mock the useAuth hook
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: null,
    session: null,
    isLoading: false,
    isAuthenticated: false,
    signOut: vi.fn(),
    refreshSession: vi.fn(),
  }),
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

describe('Home Page', () => {
  it('renders the brand name in hero section', () => {
    render(<Home />);
    // Target the h1 specifically for the main hero brand name
    const heading = screen.getByRole('heading', { level: 1, name: 'LawMadeSimple' });
    expect(heading).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Home />);
    expect(screen.getByText('Nigerian law in plain language')).toBeInTheDocument();
  });

  it('renders the legal disclaimer', () => {
    render(<Home />);
    expect(screen.getByText(/provides legal information, not legal advice/i)).toBeInTheDocument();
  });

  it('renders all three feature cards', () => {
    render(<Home />);
    expect(screen.getByText('Plain Language')).toBeInTheDocument();
    expect(screen.getByText('Practical Examples')).toBeInTheDocument();
    expect(screen.getByText('Easy Search')).toBeInTheDocument();
  });

  it('renders popular topics section', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: 'Popular Topics' })).toBeInTheDocument();
    expect(screen.getByText('Tenant Rights')).toBeInTheDocument();
    expect(screen.getByText('Know Your Rights')).toBeInTheDocument();
  });
});
