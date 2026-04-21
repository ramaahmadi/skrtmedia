import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const anggotaId = searchParams.get('anggotaId');

    if (!anggotaId) {
      return Response.json(
        { error: 'anggotaId is required' },
        { status: 400 }
      );
    }

    console.log('Fetching notifications for anggota:', anggotaId);

    const { data, error } = await supabase
      .from('skrt_notifications')
      .select('*')
      .eq('anggota_id', anggotaId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }

    console.log('Successfully fetched notifications:', data?.length || 0, 'records');
    return Response.json(data || []);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: 'Failed to fetch notifications', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, is_read } = body;

    if (!id) {
      return Response.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    console.log('Updating notification:', id, 'is_read:', is_read);

    const { data, error } = await supabase
      .from('skrt_notifications')
      .update({ is_read: is_read !== undefined ? is_read : true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating notification:', error);
      throw error;
    }

    console.log('Successfully updated notification:', data);
    return Response.json(data);
  } catch (error) {
    console.error('Error updating notification:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: 'Failed to update notification', details: errorMessage },
      { status: 500 }
    );
  }
}
