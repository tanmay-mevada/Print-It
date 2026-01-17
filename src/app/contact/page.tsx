"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  // Simple state for form submission simulation
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Homepage
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Contact Support</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Got a question about an order? Found a bug? We are here to help you 24/7.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left Side: Contact Info Cards */}
          <div className="md:col-span-1 space-y-6">
             
             {/* Email Card */}
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                 <Mail className="w-5 h-5 text-blue-600"/>
               </div>
               <h3 className="font-bold text-slate-900 mb-1">Email Us</h3>
               <p className="text-slate-500 text-sm mb-3">For general queries & refunds</p>
               <a href="mailto:support@printlink.in" className="text-blue-600 font-semibold text-sm hover:underline">
                 turbo.cpp.nu@gmail.com
               </a>
             </div>

             {/* Phone Card */}
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="bg-green-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                 <Phone className="w-5 h-5 text-green-600"/>
               </div>
               <h3 className="font-bold text-slate-900 mb-1">Helpline</h3>
               <p className="text-slate-500 text-sm mb-3">Urgent order issues</p>
               <a href="tel:+919876543210" className="text-green-600 font-semibold text-sm hover:underline">
                 +91 7990026069
               </a>
             </div>

             {/* Address Card */}
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="bg-purple-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                 <MapPin className="w-5 h-5 text-purple-600"/>
               </div>
               <h3 className="font-bold text-slate-900 mb-1">HQ</h3>
               <p className="text-slate-500 text-sm">
                 3rd Floor, Crystal Business Center<br/>
                 Indira Marg, Jamnagar, Gujarat 361001<br/>
               </p>
             </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="md:col-span-2 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 h-fit">
            
            {!submitted ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">First Name</label>
                    <input required type="text" placeholder="Aum" className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Last Name</label>
                    <input required type="text" placeholder="Patel" className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input required type="email" placeholder="student@bvm.edu.in" className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Message / Issue</label>
                  <textarea required rows={5} placeholder="Hi, I faced an issue with order #1234..." className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"></textarea>
                </div>

                <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2">
                  Send Message <Send className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500 max-w-md">
                  Thanks for reaching out. Our team has received your message and will get back to you within 2 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-blue-600 font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}