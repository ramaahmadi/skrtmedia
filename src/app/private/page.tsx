import { redirect } from 'next/navigation'

export default async function PrivatePage() {
  // Supabase authentication removed - redirect to login
  redirect('/login')
}
