import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button, buttonVariants } from '@/components/ui/button';

describe('Button - Touch Target Sizes and Responsive Behavior', () => {
  describe('data attributes', () => {
    it('sets data-slot attribute to "button"', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'button');
    });

    it('sets data-variant attribute based on variant prop', () => {
      const { rerender } = render(<Button variant="default">Default</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'default');

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'outline');

      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'ghost');
    });

    it('sets data-size attribute based on size prop', () => {
      const { rerender } = render(<Button size="default">Default</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-size', 'default');

      rerender(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-size', 'sm');

      rerender(<Button size="xs">Extra Small</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-size', 'xs');
    });
  });

  describe('mobile-friendly touch target sizes', () => {
    it('xs size uses h-8 (32px) on mobile and h-6 (24px) on sm+ screens', () => {
      render(<Button size="xs">XS Button</Button>);
      const button = screen.getByRole('button');

      // Check for mobile-friendly responsive classes
      // Mobile gets larger touch targets, desktop can use smaller sizes
      expect(button).toHaveClass('h-8'); // Mobile: 32px
      expect(button).toHaveClass('sm:h-6'); // Desktop: 24px
    });

    it('sm size uses h-10 (40px) on mobile and h-8 (32px) on sm+ screens', () => {
      render(<Button size="sm">SM Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('h-10'); // Mobile: 40px (close to 44px guideline)
      expect(button).toHaveClass('sm:h-8'); // Desktop: 32px
    });

    it('icon-xs size uses size-8 (32px) on mobile and size-6 (24px) on sm+ screens', () => {
      render(<Button size="icon-xs">X</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('size-8'); // Mobile: 32px
      expect(button).toHaveClass('sm:size-6'); // Desktop: 24px
    });

    it('icon-sm size uses size-10 (40px) on mobile and size-8 (32px) on sm+ screens', () => {
      render(<Button size="icon-sm">X</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('size-10'); // Mobile: 40px
      expect(button).toHaveClass('sm:size-8'); // Desktop: 32px
    });
  });

  describe('default sizes (non-responsive)', () => {
    it('default size uses h-10 (40px)', () => {
      render(<Button size="default">Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-10');
    });

    it('lg size uses h-12 (48px)', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-12');
    });

    it('xl size uses h-14 (56px)', () => {
      render(<Button size="xl">Extra Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-14');
    });

    it('icon size uses size-10 (40px)', () => {
      render(<Button size="icon">Icon</Button>);
      expect(screen.getByRole('button')).toHaveClass('size-10');
    });

    it('icon-lg size uses size-12 (48px)', () => {
      render(<Button size="icon-lg">Icon LG</Button>);
      expect(screen.getByRole('button')).toHaveClass('size-12');
    });
  });

  describe('buttonVariants function', () => {
    it('generates correct classes for xs size with mobile-friendly touch targets', () => {
      const classes = buttonVariants({ size: 'xs' });

      expect(classes).toContain('h-8'); // Mobile
      expect(classes).toContain('sm:h-6'); // Desktop
    });

    it('generates correct classes for sm size with mobile-friendly touch targets', () => {
      const classes = buttonVariants({ size: 'sm' });

      expect(classes).toContain('h-10'); // Mobile
      expect(classes).toContain('sm:h-8'); // Desktop
    });
  });

  describe('accessibility', () => {
    it('has active:scale-[0.98] for tactile feedback', () => {
      render(<Button>Tactile Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('active:scale-[0.98]');
    });

    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('has focus-visible ring for keyboard navigation', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('focus-visible:ring-[3px]');
      expect(button).toHaveClass('focus-visible:ring-ring/50');
    });
  });

  describe('variants', () => {
    const variants = [
      'default',
      'destructive',
      'outline',
      'secondary',
      'ghost',
      'accent',
      'link',
    ] as const;

    variants.forEach((variant) => {
      it(`renders ${variant} variant correctly`, () => {
        render(<Button variant={variant}>{variant}</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant);
      });
    });
  });

  describe('asChild prop', () => {
    it('renders as child element when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );

      // Should render as an anchor, not a button
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveAttribute('data-slot', 'button');
    });
  });
});
