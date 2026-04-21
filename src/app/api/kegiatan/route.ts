import { createClient } from '@supabase/supabase-js';
import { Activity } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Set' : 'Not set');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Not set');
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to generate slug from hero_title and year only
function generateSlug(heroTitle: string, date?: string): string {
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  return `${heroTitle}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Transform database record to match TypeScript interface
function transformToActivity(record: any): Activity {
  // Handle sponsors - could be array of {name, logo} or array of URLs
  const sponsors = record.sponsors ? (Array.isArray(record.sponsors) ? record.sponsors : []) : [];
  const mediaPartners = record.media_partners ? (Array.isArray(record.media_partners) ? record.media_partners : []) : [];

  return {
    id: record.slug || record.id || '', // Use slug as ID for routing
    title: record.title || '',
    description: record.description || '',
    date: record.date || '',
    time: record.time || '',
    locations: record.location ? [record.location] : [''],
    status: record.status || 'upcoming',
    featured: false,
    hero_title: record.hero_title || undefined,
    hero_subtitle: record.hero_subtitle || undefined,
    hero_quote: record.hero_quote || undefined,
    about_section: {
      background: record.about_background || undefined,
      goals: record.about_goals && typeof record.about_goals === 'string'
        ? record.about_goals.split(',').map((g: string) => g.trim()).filter(g => g)
        : []
    },
    registration_link: record.registration_link || undefined,
    ticket_price: record.ticket_price || 0,
    max_participants: record.max_participants || 0,
    contact_person: record.contact_person || undefined,
    contact_phone: record.contact_phone || undefined,
    sponsors: sponsors,
    media_partners: mediaPartners
  };
}

export async function GET() {
  try {
    console.log('Fetching kegiatan from Supabase...');
    const { data, error } = await supabase
      .from('skrt_kegiatan')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Supabase error:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Successfully fetched kegiatan:', data?.length || 0, 'records');
    // Transform data to match TypeScript interface
    const transformedData = (data || []).map(transformToActivity);
    return Response.json(transformedData);
  } catch (error) {
    console.error('Error fetching kegiatan:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error && typeof error === 'object' && 'message' in error ? JSON.stringify(error) : errorMessage;
    return Response.json({ error: 'Failed to fetch kegiatan', details: errorDetails }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate slug from hero_title and year only
    const slug = body.hero_title ? generateSlug(body.hero_title, body.date) : null;

    // Transform form data to database format
    const dbRecord = {
      slug: slug,
      title: body.title,
      description: body.description,
      date: body.date,
      time: body.time,
      location: body.locations && body.locations.length > 0 ? body.locations[0] : '',
      status: body.status,
      hero_title: body.hero_title,
      hero_subtitle: body.hero_subtitle,
      hero_quote: body.hero_quote,
      about_background: body.about_section?.background,
      about_goals: body.about_section?.goals ? body.about_section.goals.join(', ') : '',
      registration_link: body.registration_link || null,
      ticket_price: body.ticket_price || 0,
      max_participants: body.max_participants || 0,
      contact_person: body.contact_person || null,
      contact_phone: body.contact_phone || null,
      sponsors: body.sponsors || null,
      media_partners: body.media_partners || null
    };

    const { data, error } = await supabase
      .from('skrt_kegiatan')
      .insert([dbRecord])
      .select();

    if (error) throw error;

    return Response.json(transformToActivity(data[0]));
  } catch (error) {
    console.error('Error creating kegiatan:', error);
    return Response.json({ error: 'Failed to create kegiatan' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...formData } = body;

    // Generate new slug from hero_title and year only
    const slug = formData.hero_title ? generateSlug(formData.hero_title, formData.date) : id;

    // Transform form data to database format
    const dbRecord = {
      slug: slug,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.locations && formData.locations.length > 0 ? formData.locations[0] : '',
      status: formData.status,
      hero_title: formData.hero_title,
      hero_subtitle: formData.hero_subtitle,
      hero_quote: formData.hero_quote,
      about_background: formData.about_section?.background,
      about_goals: formData.about_section?.goals ? formData.about_section.goals.join(', ') : '',
      registration_link: formData.registration_link || null,
      ticket_price: formData.ticket_price || 0,
      max_participants: formData.max_participants || 0,
      contact_person: formData.contact_person || null,
      contact_phone: formData.contact_phone || null,
      sponsors: formData.sponsors || null,
      media_partners: formData.media_partners || null
    };

    // Update by slug (since we're using slug as ID)
    const { data, error } = await supabase
      .from('skrt_kegiatan')
      .update(dbRecord)
      .eq('slug', id)
      .select();

    if (error) throw error;

    return Response.json(transformToActivity(data[0]));
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

    const { error } = await supabase
      .from('skrt_kegiatan')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting kegiatan:', error);
    return Response.json({ error: 'Failed to delete kegiatan' }, { status: 500 });
  }
}
