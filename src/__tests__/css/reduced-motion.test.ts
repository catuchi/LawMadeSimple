import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Reduced Motion - CSS Accessibility', () => {
  const globalsCss = readFileSync(resolve(__dirname, '../../app/globals.css'), 'utf-8');

  it('contains prefers-reduced-motion media query', () => {
    expect(globalsCss).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('disables animations for users with reduced-motion preference', () => {
    // Verify the CSS rule sets animation-duration to near-zero
    expect(globalsCss).toContain('animation-duration: 0.01ms !important');
  });

  it('limits animation to single iteration for reduced-motion', () => {
    expect(globalsCss).toContain('animation-iteration-count: 1 !important');
  });

  it('disables transitions for users with reduced-motion preference', () => {
    expect(globalsCss).toContain('transition-duration: 0.01ms !important');
  });

  it('disables smooth scrolling for users with reduced-motion preference', () => {
    expect(globalsCss).toContain('scroll-behavior: auto !important');
  });

  it('applies reduced-motion to all elements including pseudo-elements', () => {
    // The CSS should target *, *::before, *::after
    const reducedMotionSection = globalsCss.match(
      /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n\}/
    );

    expect(reducedMotionSection).not.toBeNull();

    const sectionContent = reducedMotionSection?.[0] ?? '';
    expect(sectionContent).toContain('*,');
    expect(sectionContent).toContain('*::before,');
    expect(sectionContent).toContain('*::after');
  });

  it('uses !important to ensure reduced-motion takes precedence', () => {
    const reducedMotionSection = globalsCss.match(
      /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n\}/
    );

    expect(reducedMotionSection).not.toBeNull();

    const sectionContent = reducedMotionSection?.[0] ?? '';

    // Count !important declarations (should be at least 4)
    const importantCount = (sectionContent.match(/!important/g) || []).length;
    expect(importantCount).toBeGreaterThanOrEqual(4);
  });
});

describe('Animation and Transition Support', () => {
  const globalsCss = readFileSync(resolve(__dirname, '../../app/globals.css'), 'utf-8');

  it('has page transition animation section defined', () => {
    // Verify page transitions are documented and implemented
    expect(globalsCss).toContain('Page transition animation');
  });

  it('defines CSS keyframes or animation classes', () => {
    // Check for animation-related CSS (keyframes, animation classes, or transition utilities)
    const hasAnimationContent =
      globalsCss.includes('@keyframes') ||
      globalsCss.includes('animation:') ||
      globalsCss.includes('transition:') ||
      globalsCss.includes('.animate-');

    expect(hasAnimationContent).toBe(true);
  });
});
