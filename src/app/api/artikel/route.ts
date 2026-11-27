import {
  getAllArtikel,
  createArtikel,
  updateArtikel,
  deleteArtikel
} from '@/lib/db-queries';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const data = await getAllArtikel();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching artikel:', error);
    return Response.json({ error: 'Failed to fetch artikel' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();

    const newArtikel = {
      id: crypto.randomUUID(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const result = await createArtikel(newArtikel);
    return Response.json(result);
  } catch (error) {
    console.error('Error creating artikel:', error);
    return Response.json({ error: 'Failed to create artikel' }, { status: 500 });
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

    const updatedArtikel = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    const result = await updateArtikel(id, updatedArtikel);

    if (!result) {
      return Response.json({ error: 'Artikel not found' }, { status: 404 });
    }

    return Response.json(result);
  } catch (error) {
    console.error('Error updating artikel:', error);
    return Response.json({ error: 'Failed to update artikel' }, { status: 500 });
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

    const result = await deleteArtikel(id);

    if (!result) {
      return Response.json({ error: 'Artikel not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting artikel:', error);
    return Response.json({ error: 'Failed to delete artikel' }, { status: 500 });
  }
}
