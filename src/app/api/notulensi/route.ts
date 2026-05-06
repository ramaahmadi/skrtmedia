import { getNotulensiStorage } from '@/lib/storage';

// Get storage instance
const notulensiStorage = getNotulensiStorage();

export async function GET() {
  try {
    console.log('Fetching notulensi from file storage...');
    
    // Load data dari file storage
    const data = await notulensiStorage.getAll();
    console.log('Successfully fetched notulensi:', data.length, 'records');
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching notulensi:', error);
    return Response.json({ error: 'Failed to fetch notulensi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating notulensi with data:', JSON.stringify(body, null, 2));

    // Simpan ke file storage (persisten)
    await notulensiStorage.add(body);

    console.log('Notulensi created and saved to file:', body.title);
    return Response.json(body);
  } catch (error) {
    console.error('Error creating notulensi:', error);
    return Response.json({ error: 'Failed to create notulensi' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    // Update di file storage
    const result = await notulensiStorage.update(id, updateData);
    
    if (!result) {
      return Response.json({ error: 'Notulensi not found' }, { status: 404 });
    }

    console.log('Notulensi updated and saved to file:', result.title);
    return Response.json(result);
  } catch (error) {
    console.error('Error updating notulensi:', error);
    return Response.json({ error: 'Failed to update notulensi' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    console.log('Attempting to delete notulensi with ID:', id);
    
    // Hapus dari file storage
    const success = await notulensiStorage.delete(id);
    
    if (!success) {
      console.log('Notulensi not found for deletion:', id);
      return Response.json({ error: 'Notulensi not found' }, { status: 404 });
    }

    console.log('Notulensi deleted successfully:', id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting notulensi:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return Response.json({ 
      error: 'Failed to delete notulensi', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
