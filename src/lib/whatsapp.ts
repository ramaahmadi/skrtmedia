import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

interface WhatsAppConfig {
  token: string;
  uid: string;
}

export async function sendWhatsAppNotification(
  message: string,
  config: WhatsAppConfig,
  phoneNumbers?: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    let phonesToSend: string[] = [];

    if (phoneNumbers && phoneNumbers.length > 0) {
      // Use provided phone numbers
      phonesToSend = phoneNumbers;
    } else {
      // Fetch all anggota phone numbers (fallback to original behavior)
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
    }

    // Send WhatsApp message to each phone number
    const results = await Promise.allSettled(
      phonesToSend.map(async (phone) => {
        // Convert Indonesian phone format (08xx) to international format (628xx)
        const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;

        const response = await fetch(
          `https://www.waboxapp.com/api/send/${config.token}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid: config.uid,
              to: formattedPhone,
              text: message,
            }),
          }
        );

        const data = await response.json();
        
        if (!response.ok) {
          console.error(`Failed to send WhatsApp to ${formattedPhone}:`, data);
          throw new Error(data.error || 'Failed to send message');
        }

        console.log(`WhatsApp sent successfully to ${formattedPhone}`);
        return data;
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

    return { success: true };
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
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
