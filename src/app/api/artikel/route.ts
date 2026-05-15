import {
  getAllArtikel,
  createArtikel,
  updateArtikel,
  deleteArtikel
} from '@/lib/db-queries';

export async function GET() {
  try {
    console.log('Fetching artikel from database...');
    const data = await getAllArtikel();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching artikel:', error);
    return Response.json({ error: 'Failed to fetch artikel' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating artikel with data (saved to database):', JSON.stringify(body, null, 2));

    const newArtikel = {
      id: crypto.randomUUID(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const result = await createArtikel(newArtikel);
    console.log('Successfully created artikel (saved to database):', result);
    return Response.json(result);
  } catch (error) {
    console.error('Error creating artikel:', error);
    return Response.json({ error: 'Failed to create artikel' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const updatedArtikel = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    const result = await updateArtikel(id, updatedArtikel);

    if (!result) {
      return Response.json({ error: 'Artikel not found' }, { status: 404 });
    }

    console.log('Successfully updated artikel (saved to database):', result);
    return Response.json(result);
  } catch (error) {
    console.error('Error updating artikel:', error);
    return Response.json({ error: 'Failed to update artikel' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    console.log('Successfully deleted artikel (removed from database):', id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting artikel:', error);
    return Response.json({ error: 'Failed to delete artikel' }, { status: 500 });
  }
}
