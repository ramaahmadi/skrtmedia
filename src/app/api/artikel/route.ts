import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('skrt_artikel')
      .select('*')
      .order('publish_date', { ascending: false });

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching artikel:', error);
    return Response.json({ error: 'Failed to fetch artikel' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('skrt_artikel')
      .insert([body])
      .select();

    if (error) throw error;

    return Response.json(data[0]);
  } catch (error) {
    console.error('Error creating artikel:', error);
    return Response.json({ error: 'Failed to create artikel' }, { status: 500 });
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
