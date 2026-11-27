import { Activity } from '@/lib/types';
import {
  getAllKegiatan,
  createKegiatan,
  updateKegiatan,
  deleteKegiatan
} from '@/lib/db-queries';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
};

// Function to generate slug from hero_title (or title) and year
function generateSlug(title: string, heroTitle?: string, date?: string): string {
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  const slugBase = heroTitle || title; // Fallback to title if hero_title is missing
  return `${slugBase}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Fungsi untuk validasi activity data
function validateActivity(data: any): Activity {
  return {
    id: data.id || generateSlug(data.title, data.hero_title, data.date),
    title: data.title || '',
    description: data.description || '',
    date: data.date || '',
    time: data.time || '',
    locations: Array.isArray(data.locations) ? data.locations : [''],
    status: data.status || 'upcoming',
    featured: Boolean(data.featured),
    category: data.category || undefined,
    hero_title: data.hero_title || undefined,
    hero_subtitle: data.hero_subtitle || undefined,
    hero_quote: data.hero_quote || undefined,
    about_section: {
      background: data.about_section?.background || undefined,
      goals: data.about_section?.goals || []
    },
    registration_link: data.registration_link || undefined,
    ticket_price_min: typeof data.ticket_price_min === 'number' && Number.isFinite(data.ticket_price_min) ? data.ticket_price_min : undefined,
    ticket_price_max: typeof data.ticket_price_max === 'number' && Number.isFinite(data.ticket_price_max) ? data.ticket_price_max : undefined,
    ticket_price: typeof data.ticket_price === 'number' && Number.isFinite(data.ticket_price) ? data.ticket_price : 0,
    max_participants: typeof data.max_participants === 'number' && Number.isFinite(data.max_participants) ? data.max_participants : 0,
    contact_person: data.contact_person || undefined,
    contact_phone: data.contact_phone || undefined,
    sponsors: data.sponsors || [],
    media_partners: data.media_partners || []
  };
}

export async function GET() {
  try {
    const data = await getAllKegiatan();
    return Response.json(data, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Error fetching kegiatan:', error);
    return Response.json({ error: 'Failed to fetch kegiatan' }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

export async function POST(request: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();

    const newActivity = validateActivity({
      ...body,
      id: crypto.randomUUID()
    });

    const result = await createKegiatan(newActivity);
    return Response.json(result);
  } catch (error) {
    console.error('Error creating kegiatan:', error);
    return Response.json({ error: 'Failed to create kegiatan' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { id, ...formData } = body;

    if (!id) {
      return Response.json({ error: 'ID is required for update' }, { status: 400 });
    }

    const updatedActivity = validateActivity({ id, ...formData });
    const result = await updateKegiatan(id, updatedActivity);

    if (!result) {
      return Response.json({ error: 'Activity not found' }, { status: 404 });
    }

    return Response.json(result);
  } catch (error) {
    console.error('Error updating kegiatan:', error);
    return Response.json({ error: 'Failed to update kegiatan' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    const result = await deleteKegiatan(id);

    if (!result) {
      return Response.json({ error: 'Activity not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting kegiatan:', error);
    return Response.json({ error: 'Failed to delete kegiatan' }, { status: 500 });
  }
}
