'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Loader, AlertCircle, ArrowRight } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const uploadId = searchParams.get('uploadId')
  const shopId = searchParams.get('shopId')
  const txnid = searchParams.get('txnid')

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('Verifying payment...')
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!uploadId || !shopId || !txnid) {
          setStatus('error')
          setMessage('Invalid payment information. Please try again.')
          return
        }

        // Fetch order details
        const { data: upload } = await supabase
          .from('uploads')
          .select('*')
          .eq('id', uploadId)
          .single()

        if (!upload) {
          setStatus('error')
          setMessage('Order not found.')
          return
        }

        setOrderDetails(upload)

        // Verify payment record exists and is successful
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .select('*')
          .eq('txnid', txnid)
          .eq('status', 'success')
          .single()

        if (paymentError || !payment) {
          setStatus('error')
          setMessage('Payment record not found or payment failed. Please contact support.')
          return
        }

        // Payment verified! Now update order status
        const { error: updateError } = await supabase
          .from('uploads')
          .update({
            status: 'payment_verified',
          })
          .eq('id', uploadId)

        if (updateError) {
          console.error('Error updating order status:', updateError)
          setStatus('error')
          setMessage('Failed to confirm payment in system. Please contact support.')
          return
        }

        // Payment verified successfully
        setStatus('success')
        setMessage('Payment verified successfully! Your order is now in the queue.')
      } catch (err) {
        console.error('Payment verification error:', err)
        setStatus('error')
        setMessage('An error occurred during verification. Please try again.')
      }
    }

    verifyPayment()
  }, [uploadId, shopId, txnid, supabase])

  const handleRedirect = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-2xl mx-auto px-6 py-20 flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center w-full">
          {status === 'verifying' && (
            <>
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Verifying Payment</h1>
              <p className="text-slate-600 mb-8">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Verified!</h1>
              <p className="text-slate-600 mb-8">{message}</p>

              {orderDetails && (
                <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200 text-left">
                  <h2 className="font-bold text-slate-900 mb-4">Order Details</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Order ID:</span>
                      <span className="font-semibold text-slate-900 font-mono text-xs">
                        {uploadId?.substring(0, 12)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">File:</span>
                      <span className="font-semibold text-slate-900">{orderDetails.file_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        Payment Verified
                      </span>
                    </div>
                    {txnid && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Transaction ID:</span>
                        <span className="font-mono text-xs text-slate-900">{txnid}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleRedirect}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Verification Failed</h1>
              <p className="text-slate-600 mb-8">{message}</p>

              <button
                onClick={handleRedirect}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                Return to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}