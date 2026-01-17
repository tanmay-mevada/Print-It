import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Use the origin from the request to ensure we redirect to the correct domain
  // (e.g., https://print-it.vercel.app or http://localhost:3000)
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth Exchange Error:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // 1. Fetch existing profile from public table
      const { data: existingProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      let profile = existingProfile

      // 2. If no profile exists (First time Google Login), create it
      if (!existingProfile) {
        const defaultRole = 'student' // Default role for Google Sign-ups
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

        const { data: newProfile, error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            full_name: fullName,
            role: defaultRole,
            phone: null, // Google doesn't provide phone
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (insertError) {
          console.error('Profile Creation Error:', insertError)
          return NextResponse.redirect(`${origin}/login?error=profile_creation_failed`)
        }
        
        // Update the local variable so subsequent checks work
        profile = newProfile
      }

      // 3. Routing Logic based on Database Profile
      if (profile?.role === 'shopkeeper') {
        const { data: shop } = await supabase
          .from('shops')
          .select('id')
          .eq('owner_id', user.id)
          .single()

        // If shopkeeper hasn't set up shop, send to setup
        if (!shop) {
          return NextResponse.redirect(`${origin}/shop/setup`)
        }
        return NextResponse.redirect(`${origin}/shop/dashboard`)
      }

      // Student Routing
      // If phone number is missing (common for Google Auth), force setup
      if (!profile?.phone) {
        return NextResponse.redirect(`${origin}/user/setup`)
      }
    }
  }

  // Default redirect for complete profiles
  return NextResponse.redirect(`${origin}/dashboard`)
}