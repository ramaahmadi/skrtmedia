import {
  getAllGaleri,
  createGaleri,
  updateGaleri,
  deleteGaleri,
} from '@/lib/db-queries';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wantsAll = searchParams.get('all') === 'true';

    if (wantsAll) {
      const { errorResponse } = await requireAuth();
      if (errorResponse) return errorResponse;
      const allItems = await getAllGaleri(false);
      return Response.json(allItems, { headers: NO_STORE_HEADERS });
    }

    const featuredItems = await getAllGaleri(true);
    return Response.json(featuredItems, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Error fetching galeri:', error);
    return Response.json(
      { error: 'Failed to fetch galeri' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function POST(request: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const title = String(body.title || '').trim();
    const driveUrl = String(body.drive_url || '').trim();

    if (!title || !driveUrl) {
      return Response.json(
        { error: 'Judul dan link Google Drive wajib diisi.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const result = await createGaleri({
      id: crypto.randomUUID(),
      title,
      caption: String(body.caption || '').trim(),
      category: String(body.category || 'Dokumentasi').trim() || 'Dokumentasi',
      media_type: body.media_type === 'video' ? 'video' : 'photo',
      drive_url: driveUrl,
      album_url: String(body.album_url || '').trim(),
      is_featured: body.is_featured !== undefined ? Boolean(body.is_featured) : true,
      sort_order: Number(body.sort_order || 0),
      created_at: now,
      updated_at: now,
    });

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating galeri item:', error);
    return Response.json({ error: 'Failed to create galeri item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const id = String(body.id || '').trim();
    const title = String(body.title || '').trim();
    const driveUrl = String(body.drive_url || '').trim();

    if (!id || !title || !driveUrl) {
      return Response.json(
        { error: 'ID, judul, dan link Google Drive wajib diisi.' },
        { status: 400 }
      );
    }

    const result = await updateGaleri(id, {
      title,
      caption: String(body.caption || '').trim(),
      category: String(body.category || 'Dokumentasi').trim() || 'Dokumentasi',
      media_type: body.media_type === 'video' ? 'video' : 'photo',
      drive_url: driveUrl,
      album_url: String(body.album_url || '').trim(),
      is_featured: Boolean(body.is_featured),
      sort_order: Number(body.sort_order || 0),
      updated_at: new Date().toISOString(),
    });

    if (!result) {
      return Response.json({ error: 'Item galeri tidak ditemukan' }, { status: 404 });
    }

    return Response.json(result);
  } catch (error) {
    console.error('Error updating galeri item:', error);
    return Response.json({ error: 'Failed to update galeri item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'ID wajib disertakan' }, { status: 400 });
    }

    const result = await deleteGaleri(id);
    if (!result) {
      return Response.json({ error: 'Item galeri tidak ditemukan' }, { status: 404 });
    }

    return Response.json({ message: 'Item galeri berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting galeri item:', error);
    return Response.json({ error: 'Failed to delete galeri item' }, { status: 500 });
  }
}
