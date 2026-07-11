import Link from 'next/link';
import { Compass, Globe, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-blue-600 tracking-tight">Bhratra</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
              Revolutionizing travel through community and trust. Connecting explorers to create memories that last a lifetime.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="#"
                aria-label="Globe"
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
              </a>
              <a
                href="#"
                aria-label="Share"
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">Company</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-blue-600 transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">Resources</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/safety" className="hover:text-blue-600 transition-colors">Safety Guide</Link></li>
              <li><Link href="/community" className="hover:text-blue-600 transition-colors">Community Stories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">Support</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/legal/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">© 2024 Bhratra. All rights reserved.</p>
          <p className="text-xs text-gray-400">Made with ♡ for explorers</p>
        </div>
      </div>
    </footer>
  );
}
