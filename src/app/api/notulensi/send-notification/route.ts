import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating notulensi notification with data:', JSON.stringify(body, null, 2));

    const { notulensiId, anggotaId, title, date, createdBy } = body;

    // Validate that anggotaId is provided
    if (!anggotaId) {
      return Response.json(
        { error: 'anggotaId is required' },
        { status: 400 }
      );
    }

    // Fetch notulensi data if notulensiId is provided
    let notulensiData;
    if (notulensiId) {
      const { data, error } = await supabase
        .from('skrt_notulensi')
        .select('*')
        .eq('id', notulensiId)
        .single();

      if (error || !data) {
        console.error('Error fetching notulensi:', error);
        return Response.json(
          { error: 'Notulensi not found' },
          { status: 404 }
        );
      }

      notulensiData = data;
    } else {
      // Use notulensi data from request body
      notulensiData = {
        title: title,
        date: date,
        created_by: createdBy
      };
    }

    // Format the notification message
    const message = `📋 Notulensi Baru Ditambahkan\n\nJudul: ${notulensiData.title}\nTanggal: ${notulensiData.date}\nDibuat oleh: ${notulensiData.created_by}\n\nSilakan cek dashboard untuk detail lengkap.`;

    // Create notification record in database
    const { data: notification, error } = await supabase
      .from('skrt_notifications')
      .insert([{
        anggota_id: anggotaId,
        notulensi_id: notulensiId || null,
        type: 'notulensi',
        title: notulensiData.title,
        message: message,
        is_read: false
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return Response.json(
        { error: 'Failed to create notification', details: error.message },
        { status: 500 }
      );
    }

    console.log('Successfully created notification:', notification);
    return Response.json({
      success: true,
      message: 'Notification created successfully',
      notification: notification
    });
  } catch (error) {
    console.error('Error creating notulensi notification:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: 'Failed to create notification', details: errorMessage },
      { status: 500 }
    );
  }
}
