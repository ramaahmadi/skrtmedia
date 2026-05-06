import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jigbkckgloaufcuyccyg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZ2JrY2tnbG9hdWZjdXljY3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNTkyMzIsImV4cCI6MjA3MzkzNTIzMn0.OqevJZOdabfVQAyhCgaSYu9eGkrM0AK8IrnOaWmY5Xw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeRamaAdmin() {
  try {
    // First, find the member named "rama" (case-insensitive)
    const { data: members, error: fetchError } = await supabase
      .from('skrt_anggota')
      .select('*')
      .ilike('name', '%rama%');

    if (fetchError) {
      console.error('Error fetching members:', fetchError);
      return;
    }

    if (!members || members.length === 0) {
      console.log('No member found with name containing "rama"');
      return;
    }

    console.log('Found members:', members);

    // Update the first matching member to be admin
    const member = members[0];
    const { data: updatedMember, error: updateError } = await supabase
      .from('skrt_anggota')
      .update({ is_admin: true })
      .eq('id', member.id)
      .select();

    if (updateError) {
      console.error('Error updating member:', updateError);
      return;
    }

    console.log('Successfully made member admin:', updatedMember);
  } catch (error) {
    console.error('Error:', error);
  }
}

makeRamaAdmin();
