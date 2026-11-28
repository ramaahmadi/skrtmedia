export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || 'https://skrtmedia.id';
  return raw.replace(/\/+$/, '');
}

export function cleanExcerpt(text: string | null | undefined, maxLength = 160): string {
  if (!text) return '';
  const cleaned = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`;
}

/**
 * Resolves a valid absolute HTTP(S) image URL for OpenGraph/Twitter previews.
 * Messaging apps (WhatsApp, Telegram) and social crawlers ignore data: URIs,
 * so base64 images fall back to the SKRT brand icon.
 */
export function resolveOgImage(candidate?: string | null): string {
  const siteUrl = getSiteUrl();
  const fallback = `${siteUrl}/icon-512.png`;

  if (!candidate || typeof candidate !== 'string') return fallback;
  const trimmed = candidate.trim();
  if (!trimmed || trimmed.startsWith('data:')) return fallback;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return `${siteUrl}${trimmed}`;
  }

  return fallback;
}
