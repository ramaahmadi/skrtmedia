import {
  getAllBerita,
  createBerita,
  updateBerita,
  deleteBerita
} from '@/lib/db-queries';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const data = await getAllBerita();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching berita:', error);
    return Response.json({ error: 'Failed to fetch berita' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();

    const newBerita = {
      id: crypto.randomUUID(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const result = await createBerita(newBerita);
    return Response.json(result);
  } catch (error) {
    console.error('Error creating berita:', error);
    return Response.json({ error: 'Failed to create berita' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    const updatedData = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    const result = await updateBerita(id, updatedData);

    if (!result) {
      return Response.json({ error: 'Berita not found' }, { status: 404 });
    }

    return Response.json(result);
  } catch (error) {
    console.error('Error updating berita:', error);
    return Response.json({ error: 'Failed to update berita' }, { status: 500 });
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

    const result = await deleteBerita(id);

    if (!result) {
      return Response.json({ error: 'Berita not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting berita:', error);
    return Response.json({ error: 'Failed to delete berita' }, { status: 500 });
  }
}
