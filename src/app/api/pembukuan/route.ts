import {
  getAllPembukuan,
  createPembukuan,
  updatePembukuan,
  deletePembukuan
} from '@/lib/db-queries';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const data = await getAllPembukuan();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching pembukuan:', error);
    return Response.json({ error: 'Failed to fetch pembukuan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();

    const newPembukuan = {
      id: crypto.randomUUID(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const result = await createPembukuan(newPembukuan);
    return Response.json(result);
  } catch (error) {
    console.error('Error creating pembukuan:', error);
    return Response.json({ error: 'Failed to create pembukuan' }, { status: 500 });
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

    const result = await updatePembukuan(id, updatedData);

    if (!result) {
      return Response.json({ error: 'Pembukuan not found' }, { status: 404 });
    }

    return Response.json(result);
  } catch (error) {
    console.error('Error updating pembukuan:', error);
    return Response.json({ error: 'Failed to update pembukuan' }, { status: 500 });
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

    const result = await deletePembukuan(id);

    if (!result) {
      return Response.json({ error: 'Pembukuan not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting pembukuan:', error);
    return Response.json({ error: 'Failed to delete pembukuan' }, { status: 500 });
  }
}
