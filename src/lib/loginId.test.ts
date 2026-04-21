import { vi, describe, it, expect, beforeEach } from 'vitest';
import { withUniqueLoginIdRetry, nextUniqueLoginId } from './loginId';
import { supabase } from './supabase';

// Mock the supabase module
vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('withUniqueLoginIdRetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('immediately returns if the insert succeeds on the first try', async () => {
    // Mock the supervisor query to return an empty array (no existing IDs)
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      like: vi.fn().mockResolvedValue({ data: [] }),
    } as any);

    let attempts = 0;
    const insertFn = async (login_id: string) => {
      attempts++;
      return { data: 'success', error: null };
    };

    const res = await withUniqueLoginIdRetry('supervisor', insertFn);

    expect(attempts).toBe(1);
    expect(res.error).toBeNull();
    expect(res.data).toBe('success');
    expect(res.login_id).toMatch(/^SUP-\d+-001$/);
  });

  it('retries up to 5 times if a duplicate key constraint violation (23505) occurs', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      like: vi.fn().mockResolvedValue({ data: [] }),
    } as any);

    let attempts = 0;
    const insertFn = async (login_id: string) => {
      attempts++;
      if (attempts < 3) {
        // Fail the first 2 times with Postgres duplicate key error
        return { data: null, error: { code: '23505', message: 'duplicate key value violates unique constraint' } };
      }
      // Succeed on the 3rd time
      return { data: 'success', error: null };
    };

    const res = await withUniqueLoginIdRetry('supervisor', insertFn);

    expect(attempts).toBe(3); // Prove it retried 2 extra times!
    expect(res.error).toBeNull();
    expect(res.data).toBe('success');
  });

  it('aborts immediately and does not retry if the error is unrelated (e.g. 500 Network Error)', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      like: vi.fn().mockResolvedValue({ data: [] }),
    } as any);

    let attempts = 0;
    const insertFn = async (login_id: string) => {
      attempts++;
      // Not a duplicate key error
      return { data: null, error: { code: '500', message: 'Something went terribly wrong' } };
    };

    const res = await withUniqueLoginIdRetry('supervisor', insertFn);

    expect(attempts).toBe(1); // Should not retry!
    expect(res.error).not.toBeNull();
    expect(res.error.message).toBe('Something went terribly wrong');
  });
});
