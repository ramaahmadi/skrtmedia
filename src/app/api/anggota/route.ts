import {
  getAllAnggota,
  createAnggota,
  updateAnggota,
  deleteAnggota
} from '@/lib/db-queries';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const data = await getAllAnggota();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching anggota:', error);
    return Response.json({ error: 'Failed to fetch anggota' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();

    const newAnggota = {
      id: crypto.randomUUID(),
      name: body.name,
      phone: body.phone,
      position: body.position || null,
      email: body.email || null,
      join_date: body.join_date || body.joinDate || null,
      is_admin: body.is_admin || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const result = await createAnggota(newAnggota);
    return Response.json(result);
  } catch (error) {
    console.error('Error creating anggota:', error);
    return Response.json({ error: 'Failed to create anggota' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { id, joinDate, ...updateData } = body;

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    const updatedAnggota = {
      ...updateData,
      join_date: updateData.join_date ?? joinDate ?? null,
      updated_at: new Date().toISOString()
    };

    const result = await updateAnggota(id, updatedAnggota);

    if (!result) {
      return Response.json({ error: 'Anggota not found' }, { status: 404 });
    }

    return Response.json(result);
  } catch (error) {
    console.error('Error updating anggota:', error);
    return Response.json({ error: 'Failed to update anggota' }, { status: 500 });
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

    const result = await deleteAnggota(id);

    if (!result) {
      return Response.json({ error: 'Anggota not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting anggota:', error);
    return Response.json({ error: 'Failed to delete anggota' }, { status: 500 });
  }
}
