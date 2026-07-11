import Link from 'next/link';
import { Shield, Compass, Calendar, Users, MapPin, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Hero from '@/components/features/Hero';
import Footer from '@/components/shared/Footer';

export default function Home() {
  const categories = [
    {
      title: 'Road Trips',
      description: 'Find driving partners to share fuel, stories, and the open road.',
      icon: Compass,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Bike Rides',
      description: 'Team up with fellow riders for scenic cruises and weekend tours.',
      icon: Compass,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Trekking & Hiking',
      description: 'Never hike alone. Find experienced trekkers for mountain trails.',
      icon: MapPin,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Backpacking',
      description: 'Explore hostel hopping and off-the-beaten-path journeys with budget travelers.',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Weekend Trips',
      description: 'Escape the city grind with quick weekend getaways and camping groups.',
      icon: Calendar,
      color: 'from-indigo-500 to-violet-500',
    },
    {
      title: 'International Travel',
      description: 'Partner with global globetrotters for overseas explorations.',
      icon: Shield,
      color: 'from-rose-500 to-red-500',
    },
  ];

  const benefits = [
    {
      title: 'Government ID Verification',
      description: 'Every companion uploads a validated ID. Spot the blue verification badge on trusted profiles.',
      icon: Shield,
    },
    {
      title: 'Compatibility Matching',
      description: 'Match based on dietary preferences, smoking choices, languages, and interests.',
      icon: Users,
    },
    {
      title: 'Safe Spaces & Preferences',
      description: 'Set custom filters. Create gender-specific trips (e.g. women-only trekking) to feel completely secure.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky transparent header navbar */}
      <Navbar />
      
      {/* Animated landing Hero section */}
      <Hero />

      {/* Categories Grid */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Explore Trips by Travel Style
            </h2>
            <p className="text-lg text-muted-foreground">
              Whatever your pace, discover active trips posting daily looking for reliable co-travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${cat.color} text-white shadow-sm`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mt-4 group-hover:text-primary transition-colors text-foreground">
                  {cat.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Trust Banner */}
      <section id="safety" className="py-20 bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Travel Safety is Our #1 Priority
              </h2>
              <p className="text-lg text-muted-foreground">
                We believe sharing experiences should never compromise safety. That's why we've engineered Bhratra around robust identity verification and compatibility.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-none p-1.5 rounded-lg bg-primary/10 text-primary h-fit">
                      <benefit.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Visual Callout */}
            <div className="bg-gradient-to-br from-primary/10 to-sky-500/10 border border-primary/20 p-8 rounded-3xl space-y-6 text-center">
              <Shield className="h-16 w-16 text-primary mx-auto stroke-[1.5]" />
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">Get Verified in 3 Steps</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Verify your email, submit an official ID securely, and receive the trust badge on your traveler profile.
                </p>
              </div>
              <Link
                href="/verifications"
                className="inline-flex bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold shadow-sm transition-colors"
              >
                Start Verification
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Footer Banner */}
      <section id="community" className="py-20 bg-background text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Ready to Find Your Next Adventure Buddy?
          </h2>
          <p className="text-lg text-muted-foreground">
            Sign up today to discover verified travelers who share your schedules, budgets, and travel style.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-full text-base font-semibold shadow-md transition-all duration-200"
            >
              Sign Up Now
            </Link>
            <Link
              href="/trips"
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/80 text-foreground border border-border px-8 py-4 rounded-full text-base font-semibold transition-all duration-200"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
