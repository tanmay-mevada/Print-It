"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Printer, LayoutDashboard, LogOut } from "lucide-react";
import LogoutButton from "@/components/logout-button";
import { User } from "@supabase/supabase-js";

export default function Navbar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  // --- Scroll Logic State ---
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        if (currentScrollY === 0) {
          // Always show at the very top
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY) {
          // Scrolling DOWN -> Hide
          setIsVisible(false);
        } else {
          // Scrolling UP -> Show
          setIsVisible(true);
        }

        // Remember current position for the next check
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  return (
    // Wrapper to handle the fixed positioning and transition
    <nav 
      className={`fixed top-0 w-full z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Solid Background Container */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Print<span className="text-blue-600">It</span>
            </span>
          </Link>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            
            {user ? (
              // LOGGED IN STATE
              <>
                {!isDashboard && (
                  <Link 
                    href="/dashboard" 
                    className="text-sm font-medium text-slate-600 hover:text-blue-600 transition flex items-center gap-2 px-3 py-2"
                  >
                     <LayoutDashboard className="w-4 h-4" /> 
                     <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                )}

                {!isDashboard && <div className="h-6 w-px bg-slate-200 mx-1"></div>}
                
                <LogoutButton />
              </>
            ) : (
              // LOGGED OUT STATE
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition px-3 py-2">
                Log in
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}