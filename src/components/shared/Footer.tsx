import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-secondary border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Discover</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/trips?type=ROAD_TRIP" className="hover:text-foreground transition-colors">Road Trips</Link></li>
              <li><Link href="/trips?type=BIKE_RIDE" className="hover:text-foreground transition-colors">Bike Rides</Link></li>
              <li><Link href="/trips?type=TREKKING" className="hover:text-foreground transition-colors">Trekking & Hiking</Link></li>
              <li><Link href="/trips?type=INTERNATIONAL" className="hover:text-foreground transition-colors">International Journeys</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Safety & Trust</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/safety/verification" className="hover:text-foreground transition-colors">Verification Process</Link></li>
              <li><Link href="/safety/guidelines" className="hover:text-foreground transition-colors">Community Guidelines</Link></li>
              <li><Link href="/safety/tips" className="hover:text-foreground transition-colors">Travel Safety Tips</Link></li>
              <li><Link href="/safety/reporting" className="hover:text-foreground transition-colors">Report an Issue</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Bhratra</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Travel Blog</Link></li>
              <li><Link href="/press" className="hover:text-foreground transition-colors">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal/cookies" className="hover:text-foreground transition-colors">Cookie Settings</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
              Bhratra
            </span>
            <span className="text-xs text-muted-foreground">
              © {currentYear} Bhratra Technologies. All rights reserved.
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md text-center md:text-right">
            Bhratra is a platform designed to connect travelers. Always verify companion credentials, meet in public spaces prior to trip departure, and travel responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
