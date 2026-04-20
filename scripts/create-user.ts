import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createUser() {
  const phone = '082122451622'
  const name = 'RAMA'
  const email = `${phone}@skrtmedia.com`
  const password = 'rama123456'

  try {
    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        phone,
        role: 'admin'
      }
    })

    if (authError) {
      console.error('Error creating user:', authError)
      return
    }

    console.log('✅ User created successfully!')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('Name:', name)
    console.log('Phone:', phone)
    console.log('User ID:', authData.user?.id)

  } catch (error) {
    console.error('Error:', error)
  }
}

createUser()
