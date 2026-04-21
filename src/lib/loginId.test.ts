import { vi, describe, it, expect, beforeEach } from 'vitest';
import { withUniqueLoginIdRetry } from './loginId';
import { sql } from './db';

// Mock the db module
vi.mock('./db', () => {
  const trxMock = vi.fn().mockResolvedValue([]);
  return {
    sql: {
      begin: vi.fn(async (cb) => cb(trxMock)),
    },
  };
});

describe('withUniqueLoginIdRetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('immediately returns if the insert succeeds on the first try', async () => {
    let attempts = 0;
    const insertFn = async (login_id: string, trx: any) => {
      attempts++;
      return { data: 'success', error: null };
    };

    const res = await withUniqueLoginIdRetry('supervisor', insertFn);

    expect(attempts).toBe(1);
    expect(res.error).toBeNull();
    expect(res.data).toBe('success');
    expect(res.login_id).toMatch(/^SUP-\d+-001$/);
  });

  it('aborts and propagates properly on error, returning the error block', async () => {
    let attempts = 0;
    const insertFn = async (login_id: string, trx: any) => {
      attempts++;
      return { data: null, error: { code: '500', message: 'Something went terribly wrong' } };
    };

    const res = await withUniqueLoginIdRetry('supervisor', insertFn);

    expect(attempts).toBe(1); // Should only execute once
    expect(res.error).not.toBeNull();
    expect(res.error.message).toBe('Something went terribly wrong');
  });
});
