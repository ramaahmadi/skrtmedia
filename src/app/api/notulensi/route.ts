import {
  getAllNotulensi,
  createNotulensi,
  updateNotulensi,
  deleteNotulensi
} from '@/lib/db-queries';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const data = await getAllNotulensi();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching notulensi:', error);
    return Response.json({ error: 'Failed to fetch notulensi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();

    const newNotulensi = {
      id: crypto.randomUUID(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const result = await createNotulensi(newNotulensi);
    return Response.json(result);
  } catch (error) {
    console.error('Error creating notulensi:', error);
    return Response.json({ error: 'Failed to create notulensi' }, { status: 500 });
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

    const result = await updateNotulensi(id, updatedData);

    if (!result) {
      return Response.json({ error: 'Notulensi not found' }, { status: 404 });
    }

    return Response.json(result);
  } catch (error) {
    console.error('Error updating notulensi:', error);
    return Response.json({ error: 'Failed to update notulensi' }, { status: 500 });
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

    const result = await deleteNotulensi(id);

    if (!result) {
      return Response.json({ error: 'Notulensi not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting notulensi:', error);
    return Response.json({ error: 'Failed to delete notulensi' }, { status: 500 });
  }
}
