import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== Supabase Configuration ===');
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
    console.log('=== Starting GET request for anggota ===');
    console.log('Fetching anggota from Supabase...');
    console.log('Supabase URL being used:', supabaseUrl);
    
    const { data, error } = await supabase
      .from('skrt_anggota')
      .select('*')
      .order('join_date', { ascending: false });

    if (error) {
      console.error('=== Supabase Query Error ===');
      console.error('Error:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('=== Successfully fetched anggota ===');
    console.log('Records:', data?.length || 0);
    return Response.json(data || []);
  } catch (error) {
    console.error('=== Error fetching anggota ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error && typeof error === 'object' && 'message' in error ? JSON.stringify(error) : errorMessage;
    return Response.json({ error: 'Failed to fetch anggota', details: errorDetails }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating anggota with data:', JSON.stringify(body, null, 2));
    
    const { data, error } = await supabase
      .from('skrt_anggota')
      .insert([body])
      .select();

    if (error) {
      console.error('Supabase error:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Successfully created anggota:', data[0]);
    return Response.json(data[0]);
  } catch (error) {
    console.error('Error creating anggota:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error && typeof error === 'object' && 'message' in error ? JSON.stringify(error) : errorMessage;
    return Response.json({ error: 'Failed to create anggota', details: errorDetails }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    console.log('Updating anggota with id:', id, 'data:', JSON.stringify(updateData, null, 2));
    
    const { data, error } = await supabase
      .from('skrt_anggota')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Successfully updated anggota:', data[0]);
    return Response.json(data[0]);
  } catch (error) {
    console.error('Error updating anggota:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error && typeof error === 'object' && 'message' in error ? JSON.stringify(error) : errorMessage;
    return Response.json({ error: 'Failed to update anggota', details: errorDetails }, { status: 500 });
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
    const { error } = await supabase
      .from('skrt_anggota')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Successfully deleted anggota with id:', id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting anggota:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error && typeof error === 'object' && 'message' in error ? JSON.stringify(error) : errorMessage;
    return Response.json({ error: 'Failed to delete anggota', details: errorDetails }, { status: 500 });
  }
}
