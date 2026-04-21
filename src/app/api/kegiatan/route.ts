import { createClient } from '@supabase/supabase-js';
import { Activity } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Transform database record to match TypeScript interface
function transformToActivity(record: any): Activity {
  return {
    id: record.id || '',
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
    }
  };
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('skrt_kegiatan')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    // Transform data to match TypeScript interface
    const transformedData = (data || []).map(transformToActivity);
    return Response.json(transformedData);
  } catch (error) {
    console.error('Error fetching kegiatan:', error);
    return Response.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Transform form data to database format
    const dbRecord = {
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
      about_goals: body.about_section?.goals ? body.about_section.goals.join(', ') : ''
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
    
    // Transform form data to database format
    const dbRecord = {
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
      about_goals: formData.about_section?.goals ? formData.about_section.goals.join(', ') : ''
    };
    
    const { data, error } = await supabase
      .from('skrt_kegiatan')
      .update(dbRecord)
      .eq('id', id)
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
