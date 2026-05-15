// Supabase connection removed

export async function GET() {
  try {
    // Supabase connection removed - return mock data
    const mockData = [
      { id: 1, date: '2024-01-01', description: 'Mock pembukuan 1', amount: 100000 },
      { id: 2, date: '2024-01-02', description: 'Mock pembukuan 2', amount: 200000 },
    ];
    return Response.json(mockData);
  } catch (error) {
    console.error('Error fetching pembukuan:', error);
    return Response.json({ error: 'Failed to fetch pembukuan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Supabase connection removed - return mock response
    const mockResponse = { id: Date.now(), ...body };
    return Response.json(mockResponse);
  } catch (error) {
    console.error('Error creating pembukuan:', error);
    return Response.json({ error: 'Failed to create pembukuan' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    // Supabase connection removed - return mock response
    const mockResponse = { id, ...updateData, updated: true };
    return Response.json(mockResponse);
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

    // Supabase connection removed - return mock response
    return Response.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Error deleting pembukuan:', error);
    return Response.json({ error: 'Failed to delete pembukuan' }, { status: 500 });
  }
}
