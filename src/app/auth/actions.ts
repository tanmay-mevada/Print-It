'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// --- SIGNUP ACTION ---
export async function signup(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const full_name = formData.get('full_name') as string;
  const phone = formData.get('phone') as string;
  const role = formData.get('role') as string;

  // 1. Sign up the user in Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        phone,
        role,
      },
    },
  });

  if (error) {
    return { error: error.message, success: false };
  }

  // 2. Create the Public Profile immediately
  // This ensures the database trigger doesn't fail or lag, and data is consistent
  if (data.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: email,
        full_name: full_name,
        phone: phone,
        role: role,
      });

    if (profileError) {
      console.error("Profile creation failed:", profileError);
      // We don't stop the flow here, but logging is critical
    }
  }
  
  revalidatePath('/', 'layout');
  
  // 3. Smart Redirect based on Role
  if (role === 'shopkeeper') {
    redirect('/shop/setup');
  } else {
    redirect('/dashboard');
  }
}

// --- LOGIN ACTION ---
export async function login(prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Get user role from the PUBLIC table (more reliable than metadata)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: "User not found" }

  const { data: profile } = await supabase
    .from('users')
    .select('role, phone')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role || user.user_metadata?.role

  // Shopkeeper Logic
  if (userRole === 'shopkeeper') {
    const { data: shop } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!shop) {
      redirect('/shop/setup')
    }
    redirect('/shop/dashboard')
  }

  // Student Logic
  if (userRole === 'student') {
    // If phone is missing in public profile, force setup
    if (!profile?.phone) {
      redirect('/user/setup')
    }
    redirect('/dashboard')
  }

  // Fallback
  redirect('/dashboard')
}

// --- LOGOUT ACTION ---
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}

// --- GOOGLE OAUTH ACTION ---
export async function signInWithGoogle() {
  const supabase = await createClient()
  
  // Dynamic Origin Logic
  // This prevents the issue where it redirects to "localhost" on production
  const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Crucial: Redirect to your callback route, not just the home page
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  
  if (error) {
    console.error("Google Sign-in Error:", error)
    return { error: error.message }
  }
  
  if (data.url) {
    redirect(data.url)
  }
}

// --- SHOP SETUP ACTION ---
export async function setupShop(prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized', success: false }
  }

  const name = formData.get('name') as string
  const location = formData.get('location') as string
  // Ensure we parse floats correctly, default to 0 if NaN
  const bw_price = parseFloat(formData.get('bw_price') as string) || 0
  const color_price = parseFloat(formData.get('color_price') as string) || 0
  const spiral_price = parseFloat(formData.get('spiral_price') as string) || 0
  const lamination_price = parseFloat(formData.get('lamination_price') as string) || 0

  if (!name || !location) {
    return { error: 'Name and Location are required', success: false }
  }

  const { error } = await supabase.from('shops').insert({
    owner_id: user.id,
    name,
    location,
    bw_price,
    color_price,
    spiral_price,
    lamination_price,
    is_open: true // Default to open
  })

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath('/', 'layout')
  redirect('/shop/dashboard')
}

// --- USER PROFILE SETUP ACTION ---
export async function setupUserProfile(prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized', success: false }
  }

  const full_name = formData.get('full_name') as string
  const phone = formData.get('phone') as string

  if (!full_name || !phone) {
    return { error: 'All fields are required', success: false }
  }

  // Upsert allows updating if exists, inserting if not (safest for OAuth flows)
  const { error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      full_name,
      phone,
      role: 'student', // Enforce role
      updated_at: new Date().toISOString(),
    })

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}