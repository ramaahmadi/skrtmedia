import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

interface WhatsAppConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export async function sendWhatsAppNotification(
  message: string,
  config: WhatsAppConfig,
  phoneNumbers?: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('=== WhatsApp Notification Debug (Twilio) ===');
    console.log('Config accountSid:', config.accountSid ? config.accountSid.substring(0, 10) + '...' : 'Not set');
    console.log('Config fromNumber:', config.fromNumber);
    console.log('Phone numbers provided:', phoneNumbers);
    console.log('Message:', message);

    let phonesToSend: string[] = [];

    if (phoneNumbers && phoneNumbers.length > 0) {
      // Use provided phone numbers
      phonesToSend = phoneNumbers;
      console.log('Using provided phone numbers:', phonesToSend);
    } else {
      // Fetch all anggota phone numbers (fallback to original behavior)
      console.log('Fetching all anggota phone numbers...');
      const { data: anggota, error } = await supabase
        .from('skrt_anggota')
        .select('phone')
        .not('phone', 'is', null);

      if (error) {
        console.error('Error fetching anggota:', error);
        return { success: false, error: 'Failed to fetch anggota data' };
      }

      if (!anggota || anggota.length === 0) {
        console.log('No anggota found to notify');
        return { success: true };
      }

      phonesToSend = anggota.map((member) => member.phone);
      console.log('Fetched anggota phones:', phonesToSend);
    }

    if (phonesToSend.length === 0) {
      console.log('No phone numbers to send to');
      return { success: true };
    }

    // Send WhatsApp message to each phone number
    console.log('Starting to send messages to', phonesToSend.length, 'phone numbers');
    const results = await Promise.allSettled(
      phonesToSend.map(async (phone) => {
        // Convert Indonesian phone format (08xx) to international format (628xx)
        const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
        console.log(`Sending to ${phone} -> formatted: ${formattedPhone}`);

        // Twilio API endpoint
        const apiUrl = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`;
        console.log('API URL:', apiUrl);

        // Twilio requires Basic Auth with accountSid:authToken
        const auth = btoa(`${config.accountSid}:${config.authToken}`);
        
        const requestBody = new URLSearchParams({
          From: `whatsapp:${config.fromNumber}`,
          To: `whatsapp:${formattedPhone}`,
          Body: message,
        });
        console.log('Request body:', requestBody.toString());

        // Add timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${auth}`,
            },
            body: requestBody,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          console.log('Response status:', response.status);
          console.log('Response headers:', response.headers);

          const responseText = await response.text();
          console.log('Response raw text:', responseText);

          let data;
          try {
            data = JSON.parse(responseText);
            console.log('Response data:', JSON.stringify(data, null, 2));
          } catch (e) {
            console.log('Response is not JSON, using raw text');
            data = { raw: responseText };
          }

          if (!response.ok) {
            console.error(`Failed to send WhatsApp to ${formattedPhone}:`, data);
            throw new Error(data.message || data.error || `HTTP ${response.status}: ${responseText}`);
          }

          console.log(`WhatsApp sent successfully to ${formattedPhone}`);
          return data;
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError.name === 'AbortError') {
            console.error('Request timeout - Twilio API did not respond within 30 seconds');
            throw new Error('Twilio API timeout - check if the service is available');
          }
          throw fetchError;
        }
      })
    );

    const failures = results.filter((r) => r.status === 'rejected');
    if (failures.length > 0) {
      console.error(`${failures.length} messages failed to send`);
      return {
        success: true,
        error: `${failures.length} out of ${results.length} messages failed`
      };
    }

    console.log('=== WhatsApp Notification Complete ===');
    return { success: true };
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export function formatNotulensiMessage(
  title: string,
  date: string,
  createdBy: string
): string {
  return `📋 *Notulensi Baru Ditambahkan*

Judul: ${title}
Tanggal: ${date}
Dibuat oleh: ${createdBy}

Silakan cek dashboard untuk detail lengkap.

_SKRT Army Management_`;
}
