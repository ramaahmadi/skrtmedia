export type GalleryMediaType = 'photo' | 'video';

export interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  category: string;
  media_type: GalleryMediaType;
  drive_url: string;
  album_url?: string;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ResolvedDriveMedia {
  fileId: string | null;
  isDrive: boolean;
  thumbnailUrl: string;
  fullImageUrl: string;
  fallbackImageUrl: string | null;
  embedUrl: string | null;
  originalUrl: string;
}

/**
 * Extracts a Google Drive file ID from common sharing URL formats:
 * - https://drive.google.com/file/d/<ID>/view?usp=sharing
 * - https://drive.google.com/open?id=<ID>
 * - https://drive.google.com/uc?id=<ID>&export=view
 * - https://drive.google.com/thumbnail?id=<ID>
 * - https://lh3.googleusercontent.com/d/<ID>
 */
export function extractGoogleDriveFileId(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const url = rawUrl.trim();

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]{10,})/,
    /\/d\/([a-zA-Z0-9_-]{10,})/,
    /[?&]id=([a-zA-Z0-9_-]{10,})/,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(url);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function isGoogleDriveFolderUrl(rawUrl: string): boolean {
  if (!rawUrl) return false;
  return /drive\.google\.com\/drive\/(u\/\d+\/)?folders\/[a-zA-Z0-9_-]+/.test(rawUrl);
}

export function resolveDriveMedia(
  driveUrl: string,
  mediaType: GalleryMediaType = 'photo'
): ResolvedDriveMedia {
  const cleanUrl = (driveUrl || '').trim();
  const fileId = extractGoogleDriveFileId(cleanUrl);

  if (fileId) {
    return {
      fileId,
      isDrive: true,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,
      fullImageUrl:
        mediaType === 'photo'
          ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`
          : `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,
      fallbackImageUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      originalUrl: cleanUrl,
    };
  }

  return {
    fileId: null,
    isDrive: false,
    thumbnailUrl: cleanUrl,
    fullImageUrl: cleanUrl,
    fallbackImageUrl: null,
    embedUrl: mediaType === 'video' ? cleanUrl : null,
    originalUrl: cleanUrl,
  };
}

/**
 * Curated default showcase items used gracefully before any Google Drive items
 * are added via the SKRT Army dashboard.
 */
export const DEFAULT_CURATED_GALLERY: GalleryItem[] = [
  {
    id: 'curated-1',
    title: 'Kajian Rutin SKRT MEDIA',
    caption: 'Suasana kajian rutin generasi muda Muslim untuk saling menguatkan dalam ketaatan.',
    category: 'Kajian',
    media_type: 'photo',
    drive_url: '/images/hero/portrait1.JPG',
    is_featured: true,
    sort_order: 1,
  },
  {
    id: 'curated-2',
    title: 'Kebersamaan Keluarga Besar SKRT',
    caption: 'Momen hangat penuh keakraban dan persaudaraan di setiap pertemuan komunitas.',
    category: 'Kebersamaan',
    media_type: 'photo',
    drive_url: '/images/hero/landscape1.JPG',
    is_featured: true,
    sort_order: 2,
  },
  {
    id: 'curated-3',
    title: 'Diskusi Positif & Karya Kebaikan',
    caption: 'Ruang kolaborasi anak muda untuk melahirkan karya kreatif yang bermanfaat.',
    category: 'Event',
    media_type: 'photo',
    drive_url: '/images/hero/portrait2.JPG',
    is_featured: true,
    sort_order: 3,
  },
  {
    id: 'curated-4',
    title: 'Good Vibes, Good Circle',
    caption: 'Dokumentasi pilihan kegiatan komunitas SKRT MEDIA Indonesia.',
    category: 'Kebersamaan',
    media_type: 'photo',
    drive_url: '/images/hero/landscape2.JPG',
    is_featured: true,
    sort_order: 4,
  },
];
