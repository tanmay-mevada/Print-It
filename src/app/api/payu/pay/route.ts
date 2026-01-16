import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const firstname = String(form.get('firstname') || 'Customer')
    const email = String(form.get('email') || 'no-reply@printlink.local')
    const amount = String(form.get('amount') || form.get('totalAmount') || '0')
    const productinfo = String(form.get('productinfo') || 'Print Link Order')
    const uploadId = String(form.get('uploadId') || '')
    const shopId = String(form.get('shopId') || '')
    let txnid = String(form.get('txnid') || '')

    // Ensure a fresh txnid when not provided
    if (!txnid) txnid = 'txn_' + Math.random().toString(36).substring(2, 12)

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

    // Create a payment record in Supabase
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        txnid,
        upload_id: uploadId,
        amount: parseFloat(amount),
        status: 'pending',
        payment_method: 'payu',
      })

    if (paymentError) {
      console.error('Error creating payment record:', paymentError)
      return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 })
    }

    // Check if we're in test/demo mode (no valid PayU credentials)
    const key = process.env.PAYU_MERCHANT_KEY
    const salt = process.env.PAYU_SALT
    const USE_DEMO_MODE = process.env.PAYU_DEMO_MODE === 'true'

    // If no valid credentials or demo mode enabled, use demo/test flow
    if (!key || !salt || USE_DEMO_MODE) {
      // In demo mode, redirect to success page
      // The success page will check if payment exists (it was just created above with 'pending' status)
      // User must scan UPI QR or manually confirm payment
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const successUrl = new URL('/success', siteUrl)
      successUrl.searchParams.set('uploadId', uploadId)
      successUrl.searchParams.set('shopId', shopId)
      successUrl.searchParams.set('txnid', txnid)

      return NextResponse.redirect(successUrl.toString(), { status: 303 })
    }

    // Real PayU flow (when valid credentials are provided)
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`
    const hash = createHash('sha512').update(hashString).digest('hex')
    const PAYU_TEST_URL = process.env.PAYU_TEST_URL || 'https://test.payu.in/_payment'

    // Construct HTML that auto-submits to PayU
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirecting to PayU</title>
  </head>
  <body onload="document.forms[0].submit()">
    <center><h3>Redirecting to PayU Secure Gateway...</h3></center>
    <form action="${PAYU_TEST_URL}" method="post">
      <input type="hidden" name="key" value="${key}" />
      <input type="hidden" name="txnid" value="${txnid}" />
      <input type="hidden" name="amount" value="${amount}" />
      <input type="hidden" name="productinfo" value="${productinfo}" />
      <input type="hidden" name="firstname" value="${escapeHtml(firstname)}" />
      <input type="hidden" name="email" value="${escapeHtml(email)}" />
      <input type="hidden" name="phone" value="${String(form.get('phone') || '9999999999')}" />
      <input type="hidden" name="surl" value="${String(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')}/api/payu/success" />
      <input type="hidden" name="furl" value="${String(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')}/api/payu/failure" />
      <input type="hidden" name="hash" value="${hash}" />
      <input type="hidden" name="udf1" value="${escapeHtml(uploadId)}" />
      <input type="hidden" name="udf2" value="${escapeHtml(shopId)}" />
    </form>
    <p>If you are not redirected automatically, <button onclick="document.forms[0].submit()">click here</button>.</p>
  </body>
</html>`

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (err) {
    console.error('PAYU /pay error', err)
    return NextResponse.json({ error: 'Failed to prepare payment' }, { status: 500 })
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
