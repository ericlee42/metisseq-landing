import { describe, expect, it } from 'vitest';
import { getImageUrl } from '@/utils/tools';

describe('image assets', () => {
  const sources = import.meta.glob<string>('/src/**/*.{ts,tsx}', {
    eager: true,
    query: '?raw',
    import: 'default',
  });

  it('resolves every static image reference to an image URL', () => {
    const paths = Object.values(sources).flatMap((source) =>
      Array.from(source.matchAll(/getImageUrl\(['"]([^'"]+)['"]\)/g), (match) => match[1]),
    );
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(getImageUrl(path)).toMatch(/\.(svg|png)(\?|$)|^data:image\//);
      expect(getImageUrl(path)).not.toContain('undefined');
    }
  });

  it.each(['hide', 'open'])('resolves the dynamic password icon: %s', (state) => {
    expect(getImageUrl(`@/assets/images/profile/icon-eye-${state}.svg`)).toMatch(/\.svg(\?|$)|^data:image\/svg\+xml/);
  });

  it('reports missing images instead of producing an undefined URL', () => {
    expect(() => getImageUrl('@/assets/images/missing.svg')).toThrow('Unknown image:');
  });
});
