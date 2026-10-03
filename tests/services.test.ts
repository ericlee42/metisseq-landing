import { afterEach, expect, it, vi } from 'vitest';
const settings = vi.hoisted(() => ({ serviceUrl: 'https://metadata.example' }));
vi.mock('@/configs/common', () => settings);
import { getAllUser } from '@/services';
afterEach(() => {
  vi.unstubAllGlobals();
  settings.serviceUrl = 'https://metadata.example';
});
it('indexes sequencers and resolves avatar URLs', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { address: '0xAB', seq_addr: '0x12', avatar: '{BASEDIR}/avatar.png', name: 'Alice' },
        { address: '0xCD', avatar: 'ignored.png' },
      ],
    }),
  );
  await expect(getAllUser()).resolves.toEqual({
    '0xab': { address: '0xAB', seq_addr: '0x12', avatar: 'https://metadata.example/avatar.png', name: 'Alice' },
  });
});
it('preserves empty and unconfigured responses', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
  vi.stubGlobal('fetch', fetchMock);
  await expect(getAllUser()).resolves.toBeNull();
  settings.serviceUrl = '';
  await expect(getAllUser()).resolves.toBeUndefined();
  expect(fetchMock).toHaveBeenCalledTimes(1);
});
it('preserves the service error contract', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
  await expect(getAllUser()).rejects.toThrow('Server Error');
});
