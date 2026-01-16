import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const data: Record<string, string> = {}
    form.forEach((v, k) => { data[k] = String(v) })

    // TODO: verify hash here before trusting the payload.
    // You may update order status in DB using data.udf1 (uploadId) / udf2 (shopId)

    const html = `<!doctype html><html><body><h1 style="color:green">Payment Successful</h1><pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre></body></html>`

    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
  } catch (err) {
    console.error('PayU success handler error', err)
    return NextResponse.json({ error: 'Failed to process success callback' }, { status: 500 })
  }
}

// Handle GET requests (for demo mode redirect)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const uploadId = url.searchParams.get('uploadId') || ''
    const shopId = url.searchParams.get('shopId') || ''
    const txnid = url.searchParams.get('txnid') || ''
    const status = url.searchParams.get('status') || 'success'

    if (uploadId && shopId && status === 'success') {
      // Redirect to success page with order details
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      return NextResponse.redirect(`${siteUrl}/success?uploadId=${uploadId}&shopId=${shopId}&txnid=${txnid}`)
    }

    // Fallback
    const html = `<!doctype html><html><body><h1 style="color:green">Payment Successful</h1><p>Transaction ID: ${txnid}</p></body></html>`
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
  } catch (err) {
    console.error('PayU success handler error', err)
    return NextResponse.json({ error: 'Failed to process success callback' }, { status: 500 })
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
