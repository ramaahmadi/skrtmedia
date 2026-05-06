import { createClient } from '@supabase/supabase-js';

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

export async function GET() {
  try {
    console.log('Fetching artikel from Supabase...');
    const { data, error } = await supabase
      .from('skrt_artikel')
      .select('*')
      .order('publish_date', { ascending: false });

    if (error) {
      console.error('Supabase error:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Successfully fetched artikel:', data?.length || 0, 'records');
    return Response.json(data || []);
  } catch (error) {
    console.error('Error fetching artikel:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error && typeof error === 'object' && 'message' in error ? JSON.stringify(error) : errorMessage;
    return Response.json({ error: 'Failed to fetch artikel', details: errorDetails }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating artikel with data:', JSON.stringify(body, null, 2));
    
    const { data, error } = await supabase
      .from('skrt_artikel')
      .insert([body])
      .select();

    if (error) {
      console.error('Supabase error:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Successfully created artikel:', data[0]);
    return Response.json(data[0]);
  } catch (error) {
    console.error('Error creating artikel:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error && typeof error === 'object' && 'message' in error ? JSON.stringify(error) : errorMessage;
    return Response.json({ error: 'Failed to create artikel', details: errorDetails }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const { data, error } = await supabase
      .from('skrt_artikel')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return Response.json(data[0]);
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

    const { error } = await supabase
      .from('skrt_artikel')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting artikel:', error);
    return Response.json({ error: 'Failed to delete artikel' }, { status: 500 });
  }
}
