import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the brand name', () => {
    render(<Home />);
    expect(screen.getByText('LawMadeSimple')).toBeInTheDocument();
  });

  it('renders Coming Soon message', () => {
    render(<Home />);
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Home />);
    expect(screen.getByText('Nigerian law, explained simply.')).toBeInTheDocument();
  });

  it('renders the legal disclaimer', () => {
    render(<Home />);
    expect(
      screen.getByText(/provides general legal information, not legal advice/i)
    ).toBeInTheDocument();
  });

  it('renders all three feature cards', () => {
    render(<Home />);
    expect(screen.getByText('Plain Language')).toBeInTheDocument();
    expect(screen.getByText('Practical Examples')).toBeInTheDocument();
    expect(screen.getByText('Easy Search')).toBeInTheDocument();
  });
});
