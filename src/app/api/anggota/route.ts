import { getAnggotaStorage } from '@/lib/storage';

// Get storage instance
const anggotaStorage = getAnggotaStorage();

export async function GET() {
  try {
    console.log('Fetching anggota from file storage...');
    const data = await anggotaStorage.getAll();
    console.log('Records:', data.length);
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching anggota:', error);
    return Response.json({ error: 'Failed to fetch anggota' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating anggota with data (saved to file):', JSON.stringify(body, null, 2));
    
    // Buat anggota baru
    const newAnggota = {
      id: Date.now().toString(),
      name: body.name,
      phone: body.phone,
      position: body.position || null,
      email: body.email || null,
      join_date: body.joinDate || null,
      is_admin: body.is_admin || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Simpan ke file storage
    await anggotaStorage.add(newAnggota);

    console.log('Successfully created anggota (saved to file):', newAnggota);
    return Response.json(newAnggota);
  } catch (error) {
    console.error('Error creating anggota:', error);
    return Response.json({ error: 'Failed to create anggota' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    console.log('Updating anggota with id:', id, 'data (saved to file):', JSON.stringify(updateData, null, 2));
    
    // Update anggota di file storage
    const updatedAnggota = {
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    const result = await anggotaStorage.update(id, updatedAnggota);
    
    if (!result) {
      return Response.json({ error: 'Anggota not found' }, { status: 404 });
    }

    console.log('Successfully updated anggota (saved to file):', result);
    return Response.json(result);
  } catch (error) {
    console.error('Error updating anggota:', error);
    return Response.json({ error: 'Failed to update anggota' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    console.log('Deleting anggota with id:', id);
    
    // Hapus dari file storage
    const success = await anggotaStorage.delete(id);
    
    if (!success) {
      return Response.json({ error: 'Anggota not found' }, { status: 404 });
    }

    console.log('Successfully deleted anggota (removed from file):', id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting anggota:', error);
    return Response.json({ error: 'Failed to delete anggota' }, { status: 500 });
  }
}
