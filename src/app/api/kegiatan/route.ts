import { Activity } from '@/lib/types';
import { getKegiatanStorage } from '@/lib/storage';

// Get storage instance
const kegiatanStorage = getKegiatanStorage();

// Function to generate slug from hero_title (or title) and year
function generateSlug(title: string, heroTitle?: string, date?: string): string {
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  const slugBase = heroTitle || title; // Fallback to title if hero_title is missing
  return `${slugBase}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Fungsi untuk validasi activity data
function validateActivity(data: any): Activity {
  return {
    id: data.id || generateSlug(data.title, data.hero_title, data.date),
    title: data.title || '',
    description: data.description || '',
    date: data.date || '',
    time: data.time || '',
    locations: data.locations || [''],
    status: data.status || 'upcoming',
    featured: data.featured || false,
    hero_title: data.hero_title || undefined,
    hero_subtitle: data.hero_subtitle || undefined,
    hero_quote: data.hero_quote || undefined,
    about_section: {
      background: data.about_section?.background || undefined,
      goals: data.about_section?.goals || []
    },
    registration_link: data.registration_link || undefined,
    ticket_price: data.ticket_price || 0,
    max_participants: data.max_participants || 0,
    contact_person: data.contact_person || undefined,
    contact_phone: data.contact_phone || undefined,
    sponsors: data.sponsors || [],
    media_partners: data.media_partners || []
  };
}

export async function GET() {
  try {
    console.log('Fetching kegiatan from file storage...');
    
    // Load data dari file storage
    const data = await kegiatanStorage.getAll();
    console.log('Successfully fetched kegiatan:', data.length, 'records');
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching kegiatan:', error);
    return Response.json({ error: 'Failed to fetch kegiatan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validasi dan buat activity baru
    const newActivity = validateActivity(body);
    
    // Simpan ke file storage (persisten)
    await kegiatanStorage.add(newActivity);

    console.log('Activity created and saved to file:', newActivity.title);
    return Response.json(newActivity);
  } catch (error) {
    console.error('Error creating kegiatan:', error);
    return Response.json({ error: 'Failed to create kegiatan' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...formData } = body;

    // Validasi data update
    const updatedActivity = validateActivity(formData);
    
    // Update di file storage
    const result = await kegiatanStorage.update(id, updatedActivity);
    
    if (!result) {
      return Response.json({ error: 'Activity not found' }, { status: 404 });
    }

    console.log('Activity updated and saved to file:', result.title);
    return Response.json(result);
  } catch (error) {
    console.error('Error updating kegiatan:', error);
    return Response.json({ error: 'Failed to update kegiatan' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    console.log('Attempting to delete activity with ID:', id);
    
    // Hapus dari file storage
    const success = await kegiatanStorage.delete(id);
    
    if (!success) {
      console.log('Activity not found for deletion:', id);
      return Response.json({ error: 'Activity not found' }, { status: 404 });
    }

    console.log('Activity deleted successfully:', id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting kegiatan:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return Response.json({ 
      error: 'Failed to delete kegiatan', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
