import { afterEach, expect, it, vi } from 'vitest';
import { fetchJson } from '@/utils/http';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
it('returns parsed JSON and clears its timeout', async () => {
  vi.useFakeTimers();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ value: 0 }) }));
  await expect(fetchJson('/data')).resolves.toEqual({ value: 0 });
  expect(vi.getTimerCount()).toBe(0);
});
it('rejects unsuccessful HTTP status and invalid JSON', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce({ ok: false, status: 503 })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new SyntaxError('Invalid JSON');
      },
    });
  vi.stubGlobal('fetch', fetchMock);
  await expect(fetchJson('/data')).rejects.toThrow('HTTP 503');
  await expect(fetchJson('/data')).rejects.toThrow(SyntaxError);
});
it('aborts stalled response bodies and clears the timer', async () => {
  vi.useFakeTimers();
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url, { signal }) => ({
      ok: true,
      json: () =>
        new Promise((_resolve, reject) =>
          signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))),
        ),
    })),
  );
  const result = expect(fetchJson('/data', 100)).rejects.toMatchObject({ name: 'AbortError' });
  await vi.advanceTimersByTimeAsync(100);
  await result;
  expect(vi.getTimerCount()).toBe(0);
});
