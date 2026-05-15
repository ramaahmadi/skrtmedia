import {
  getAllPembukuan,
  createPembukuan,
  updatePembukuan,
  deletePembukuan
} from '@/lib/db-queries';

export async function GET() {
  try {
    console.log('Fetching pembukuan from database...');

    const data = await getAllPembukuan();
    console.log('Successfully fetched pembukuan:', data.length, 'records');
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching pembukuan:', error);
    return Response.json({ error: 'Failed to fetch pembukuan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating pembukuan with data:', JSON.stringify(body, null, 2));

    const newPembukuan = {
      id: crypto.randomUUID(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const result = await createPembukuan(newPembukuan);
    console.log('Pembukuan created and saved to database:', result.description);
    return Response.json(result);
  } catch (error) {
    console.error('Error creating pembukuan:', error);
    return Response.json({ error: 'Failed to create pembukuan' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const updatedData = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    const result = await updatePembukuan(id, updatedData);

    if (!result) {
      return Response.json({ error: 'Pembukuan not found' }, { status: 404 });
    }

    console.log('Pembukuan updated and saved to database:', result.description);
    return Response.json(result);
  } catch (error) {
    console.error('Error updating pembukuan:', error);
    return Response.json({ error: 'Failed to update pembukuan' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    console.log('Attempting to delete pembukuan with ID:', id);

    const result = await deletePembukuan(id);

    if (!result) {
      console.log('Pembukuan not found for deletion:', id);
      return Response.json({ error: 'Pembukuan not found' }, { status: 404 });
    }

    console.log('Pembukuan deleted successfully:', id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting pembukuan:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return Response.json({ error: 'Failed to delete pembukuan' }, { status: 500 });
  }
}
