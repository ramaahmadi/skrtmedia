// server action
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  'use server'
  const phone = formData.get('phone') as string

  if (!phone) {
    throw new Error('Nomor HP harus diisi')
  }

  const supabase = await createClient(cookies())
  
  // Cek anggota di tabel anggota
  const { data: anggota, error } = await supabase
    .from('anggota')
    .select('*')
    .eq('phone', phone)
    .single()

  if (error || !anggota) {
    throw new Error('Nomor HP tidak terdaftar sebagai anggota')
  }

  // Set user data in cookie (custom auth)
  const cookieStore = await cookies()
  cookieStore.set('user_session', JSON.stringify({
    id: anggota.id,
    name: anggota.name,
    phone: anggota.phone,
    role: anggota.role
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return anggota
}
