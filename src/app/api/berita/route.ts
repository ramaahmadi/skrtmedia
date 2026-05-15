import {
  getAllBerita,
  createBerita,
  updateBerita,
  deleteBerita
} from '@/lib/db-queries';

export async function GET() {
  try {
    console.log('Fetching berita from database...');
    const data = await getAllBerita();
    console.log('Successfully fetched berita:', data.length, 'records');
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching berita:', error);
    return Response.json({ error: 'Failed to fetch berita' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newBerita = {
      id: crypto.randomUUID(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const result = await createBerita(newBerita);
    console.log('Berita created and saved to database:', result.title);
    return Response.json(result);
  } catch (error) {
    console.error('Error creating berita:', error);
    return Response.json({ error: 'Failed to create berita' }, { status: 500 });
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

    const result = await updateBerita(id, updatedData);

    if (!result) {
      return Response.json({ error: 'Berita not found' }, { status: 404 });
    }

    console.log('Berita updated and saved to database:', result.title);
    return Response.json(result);
  } catch (error) {
    console.error('Error updating berita:', error);
    return Response.json({ error: 'Failed to update berita' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    console.log('Attempting to delete berita with ID:', id);

    const result = await deleteBerita(id);

    if (!result) {
      console.log('Berita not found for deletion:', id);
      return Response.json({ error: 'Berita not found' }, { status: 404 });
    }

    console.log('Berita deleted successfully:', id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting berita:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return Response.json({
      error: 'Failed to delete berita',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
