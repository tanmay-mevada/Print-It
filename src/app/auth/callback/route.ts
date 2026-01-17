import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(new URL('/signup?error=auth_failed', request.url))
    }

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
    return new Response("Unauthorized", { status: 401 });
    }

    if (user) {
      // Check if user already exists in the users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      // If user doesn't exist in users table, create them
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            phone: user.user_metadata?.phone || null,
            role: user.user_metadata?.role || 'student',
            created_at: new Date().toISOString(),
          })

        if (insertError) {
          console.error('Error creating user profile:', insertError)
          return NextResponse.redirect(new URL('/signup?error=profile_creation_failed', request.url))
        }
      }
    }

    // Check user role and redirect accordingly
    const userRole = user?.user_metadata?.role
    
    if (userRole === 'shopkeeper') {
      // Check if shopkeeper has shop setup
      const { data: shop } = await supabase
        .from('shops')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (!shop) {
        return NextResponse.redirect(new URL('/shop/setup', request.url))
      }

      return NextResponse.redirect(new URL('/shop/dashboard', request.url))
    }

    // For students, check if profile is complete
    if (userRole === 'student' || userRole === null) {
      const { data: userProfile } = await supabase
        .from('users')
        .select('phone')
        .eq('id', user.id)
        .single()

      if (!userProfile?.phone) {
        return NextResponse.redirect(new URL('/user/setup', request.url))
      }
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
