import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('skrt_notulensi')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching notulensi:', error);
    return Response.json({ error: 'Failed to fetch notulensi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('skrt_notulensi')
      .insert([body])
      .select();

    if (error) throw error;

    return Response.json(data[0]);
  } catch (error) {
    console.error('Error creating notulensi:', error);
    return Response.json({ error: 'Failed to create notulensi' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const { data, error } = await supabase
      .from('skrt_notulensi')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return Response.json(data[0]);
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

    const { error } = await supabase
      .from('skrt_notulensi')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting notulensi:', error);
    return Response.json({ error: 'Failed to delete notulensi' }, { status: 500 });
  }
}
