<<<<<<< HEAD
"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight, Printer } from "lucide-react";
import { useEffect } from "react";
// If you didn't install canvas-confetti, delete the import and useEffect below
// import confetti from "canvas-confetti"; 

export default function SuccessPage() {
  
  // Optional: Simple animation on load
  useEffect(() => {
    // You can add simple JS confetti here or just leave it blank
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-200">
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
        <p className="text-slate-500 mb-8">
          Your file has been sent to <span className="font-semibold text-slate-900">Raju Xerox</span>.
        </p>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 text-left flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-lg">
             <Printer className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Pickup Code: 8291</p>
            <p className="text-xs text-slate-500">Show this code at the shop counter.</p>
          </div>
        </div>

        <Link href="/">
          <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2">
            Back to Home <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
=======
'use client' // <--- Required for hooks

import { useActionState } from 'react' // React 19 hook (formerly useFormState)
import { signup } from '@/app/auth/actions'

export default function SignupPage() {
  // state contains the return value from your action (e.g., error messages)
  // isPending tells you if the form is currently submitting
  const [state, action, isPending] = useActionState(signup, { error: null as string | null, success: false })

  return (
    <form action={action} className="flex flex-col gap-4 p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Create Account</h1>
      
      {/* Show Error Message if exists */}
      {state.error && (
        <p className="bg-red-100 text-red-600 p-2 rounded">{state.error}</p>
      )}

      <input name="email" type="email" placeholder="Email" required className="border p-2" />
      <input name="password" type="password" placeholder="Password" required className="border p-2" />
      <input name="full_name" type="text" placeholder="Full Name" required className="border p-2" />
      <input name="phone" type="tel" placeholder="Phone Number" className="border p-2" />
      
      <select name="role" required className="border p-2">
        <option value="student">Student</option>
        <option value="shopkeeper">Shopkeeper</option>
      </select>

      <button 
        type="submit" 
        disabled={isPending}
        className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
      >
        {isPending ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  )
>>>>>>> de95813e8eeebd77f1d1f65164b88283337248da
}