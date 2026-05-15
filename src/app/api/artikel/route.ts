import { getArtikelStorage } from '@/lib/storage';

// Get storage instance
const artikelStorage = getArtikelStorage();

export async function GET() {
  try {
    console.log('Fetching artikel from file storage...');
    const data = await artikelStorage.getAll();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching artikel:', error);
    return Response.json({ error: 'Failed to fetch artikel' }, { status: 500 });
  }
}

    
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating artikel with data (saved to file):', JSON.stringify(body, null, 2));
    
    const newArtikel = {
      id: Date.now().toString(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await artikelStorage.add(newArtikel);
    console.log('Successfully created artikel (saved to file):', newArtikel);
    return Response.json(newArtikel);
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
    
    const result = await artikelStorage.update(id, updatedArtikel);
    
    if (!result) {
      return Response.json({ error: 'Artikel not found' }, { status: 404 });
    }

    console.log('Successfully updated artikel (saved to file):', result);
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

    const success = await artikelStorage.delete(id);
    
    if (!success) {
      return Response.json({ error: 'Artikel not found' }, { status: 404 });
    }

    console.log('Successfully deleted artikel (removed from file):', id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting artikel:', error);
    return Response.json({ error: 'Failed to delete artikel' }, { status: 500 });
  }
}
