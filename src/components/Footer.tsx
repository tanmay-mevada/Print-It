import Link from "next/link";
import { Printer, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-10">
        
        {/* Left Section: Brand & Mission */}
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">PrintIt</span>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Saving engineering students from long queues and loose change. The smart way to print.
          </p>
          
          <div className="flex items-center gap-4">
            <SocialLink href="https://github.com" icon={<Github className="w-4 h-4" />} />
            <span className="text-slate-300">|</span>
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} PrintIt.
            </p>
          </div>
        </div>

        {/* Right Section: Essential Links */}
        <div className="flex flex-col md:items-end justify-center">
          <h4 className="font-bold text-slate-900 mb-4">Support & Legal</h4>
          <ul className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-slate-600">
            <FooterLink href="/contact">Contact Support</FooterLink>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
          </ul>
        </div>

      </div>
    </footer>
  );
}

// Helper Components
function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="hover:text-blue-600 transition-colors font-medium">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
    >
      {icon}
    </Link>
  );
}