import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== Supabase Configuration (Berita) ===');
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'Not set');
console.log('All env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));

if (!supabaseUrl || !supabaseKey) {
  console.error('=== Missing Supabase environment variables ===');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Not set');
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    console.log('=== Starting GET request for berita ===');
    console.log('Fetching berita from Supabase...');
    console.log('Supabase URL being used:', supabaseUrl);
    
    const { data, error } = await supabase
      .from('skrt_berita')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('=== Supabase Query Error ===');
      console.error('Error:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('=== Successfully fetched berita ===');
    console.log('Records:', data?.length || 0);
    return Response.json(data || []);
  } catch (error) {
    console.error('=== Error fetching berita ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error && typeof error === 'object' && 'message' in error ? JSON.stringify(error) : errorMessage;
    return Response.json({ error: 'Failed to fetch berita', details: errorDetails }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('skrt_berita')
      .insert([body])
      .select();

    if (error) throw error;

    return Response.json(data[0]);
  } catch (error) {
    console.error('Error creating berita:', error);
    return Response.json({ error: 'Failed to create berita' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const { data, error } = await supabase
      .from('skrt_berita')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return Response.json(data[0]);
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

    const { error } = await supabase
      .from('skrt_berita')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting berita:', error);
    return Response.json({ error: 'Failed to delete berita' }, { status: 500 });
  }
}
