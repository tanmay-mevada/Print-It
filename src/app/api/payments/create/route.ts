import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { uploadId, amount } = body

    if (!uploadId || !amount) {
      return NextResponse.json(
        { error: 'Missing uploadId or amount' },
        { status: 400 }
      )
    }

    // Generate transaction ID
    const txnid = 'txn_' + Math.random().toString(36).substring(2, 12)

    // Initialize Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignore errors in server components
            }
          },
        },
      }
    )

    // Create payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        txnid,
        upload_id: uploadId,
        amount: parseFloat(amount),
        status: 'pending',
      })

    if (paymentError) {
      console.error('Payment insertion error:', paymentError)
      return NextResponse.json(
        { error: 'Failed to create payment record' },
        { status: 500 }
      )
    }

    return NextResponse.json({ txnid, success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
