import { resolveUrl } from './uploads.util';

describe('resolveUrl', () => {
  const originalBaseUrl = process.env.API_BASE_URL;

  afterEach(() => {
    process.env.API_BASE_URL = originalBaseUrl;
  });

  it('monta a URL absoluta a partir do nome do arquivo salvo', () => {
    process.env.API_BASE_URL = 'https://api.runnercircle.com/';

    expect(resolveUrl('abc.webp')).toBe(
      'https://api.runnercircle.com/uploads/abc.webp',
    );
  });

  it('devolve URLs externas sem alteração', () => {
    const external = 'https://i.pravatar.cc/300?img=59';

    expect(resolveUrl(external)).toBe(external);
  });

  it('devolve null quando não há arquivo', () => {
    expect(resolveUrl(null)).toBeNull();
    expect(resolveUrl(undefined)).toBeNull();
  });
});
