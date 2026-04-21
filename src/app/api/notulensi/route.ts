import { createClient } from '@supabase/supabase-js';
import { sendWhatsAppNotification, formatNotulensiMessage } from '@/lib/whatsapp';

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
    console.log('Fetching notulensi from Supabase...');
    const { data, error } = await supabase
      .from('skrt_notulensi')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Supabase error:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Successfully fetched notulensi:', data?.length || 0, 'records');
    return Response.json(data || []);
  } catch (error) {
    console.error('Error fetching notulensi:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error && typeof error === 'object' && 'message' in error ? JSON.stringify(error) : errorMessage;
    return Response.json({ error: 'Failed to fetch notulensi', details: errorDetails }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating notulensi with data:', JSON.stringify(body, null, 2));
    
    // Transform camelCase to snake_case for database
    const dbData = {
      date: body.date,
      title: body.title,
      content: body.content,
      created_by: body.createdBy
    };
    
    const { data, error } = await supabase
      .from('skrt_notulensi')
      .insert([dbData])
      .select();

    if (error) {
      console.error('Supabase error:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Successfully created notulensi:', data[0]);

    // Send WhatsApp notification to selected anggota (temporarily awaited for debugging)
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFromNumber = process.env.TWILIO_FROM_NUMBER;
    const selectedPhones = body.selectedPhones; // Array of phone numbers

    if (twilioAccountSid && twilioAuthToken && twilioFromNumber) {
      const message = formatNotulensiMessage(
        body.title,
        body.date,
        body.createdBy
      );
      
      // Temporarily await to see response logs
      try {
        const notificationResult = await sendWhatsAppNotification(
          message,
          {
            accountSid: twilioAccountSid,
            authToken: twilioAuthToken,
            fromNumber: twilioFromNumber
          },
          selectedPhones
        );
        console.log('WhatsApp notification result:', notificationResult);
      } catch (error) {
        console.error('WhatsApp notification error:', error);
      }
    } else {
      console.warn('Twilio credentials not configured, skipping WhatsApp notification');
    }

    return Response.json(data[0]);
  } catch (error) {
    console.error('Error creating notulensi:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error && typeof error === 'object' && 'message' in error ? JSON.stringify(error) : errorMessage;
    return Response.json({ error: 'Failed to create notulensi', details: errorDetails }, { status: 500 });
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
