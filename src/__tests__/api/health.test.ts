import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/health/route';

describe('Health API', () => {
  it('returns healthy status', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.version).toBe('0.1.0');
  });

  it('includes timestamp', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.timestamp).toBeDefined();
    expect(new Date(data.timestamp).toString()).not.toBe('Invalid Date');
  });
});
