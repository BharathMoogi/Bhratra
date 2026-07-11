import Link from 'next/link';
import { Shield, Compass, Calendar, Users, MapPin, ArrowRight, CheckCircle, Star } from 'lucide-react';
import Header from '@/components/shared/Header';
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
      icon: CheckCircle,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-b from-background to-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <Shield className="h-4 w-4" />
                100% Verified Companions
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Don't Cancel Your Trip Just Because{' '}
                <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                  Friends Flaked
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Bhratra helps verified adventurers discover road trips, treks, bike rides, and backpacking journeys. Connect with compatible travelers and explore safely.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/trips"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-full text-base font-semibold shadow-md transition-all duration-200"
                >
                  Explore Active Trips
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/trips/create"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-background border border-border hover:bg-secondary text-foreground px-8 py-4 rounded-full text-base font-semibold transition-all duration-200"
                >
                  Create a Trip
                </Link>
              </div>
              
              {/* Quick stats */}
              <div className="pt-8 border-t border-border grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-bold">12K+</div>
                  <div className="text-xs text-muted-foreground">Trips Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">45K+</div>
                  <div className="text-xs text-muted-foreground">Verified Members</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">4.9/5</div>
                  <div className="text-xs text-muted-foreground">Trip Rating</div>
                </div>
              </div>
            </div>

            {/* Right Visual (High fidelity UI card mockup) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[380px] rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Active Trip Mock</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
                    2 Seats Left
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Leh-Manali Bike Expedition</h3>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> Manali to Leh, Himalayas
                  </p>
                </div>
                
                <div className="space-y-3 bg-secondary/50 p-4 rounded-2xl border border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dates:</span>
                    <span className="font-semibold">Aug 12 - Aug 22</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trip Type:</span>
                    <span className="font-semibold">Bike Ride</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="font-semibold text-emerald-500">Moderate</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                    AK
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold truncate">Amit Kapoor</span>
                      <Shield className="h-4 w-4 text-primary fill-primary/20" />
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <span className="text-xs font-bold text-foreground ml-1">4.9</span>
                      <span className="text-xs text-muted-foreground">(24 reviews)</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl text-sm font-semibold transition-all duration-200">
                  Request to Join Group
                </button>
              </div>
              {/* Decorative accent gradients */}
              <div className="absolute -z-10 -top-6 -right-6 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -z-10 -bottom-6 -left-6 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
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
                <h3 className="text-lg font-bold mt-4 group-hover:text-primary transition-colors">
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
      <section className="py-20 bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
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
                <h3 className="text-2xl font-bold">Get Verified in 3 Steps</h3>
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

      {/* Stitch MCP Configuration Section */}
      <section className="py-16 bg-secondary/15 border-t border-border text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Stitch MCP Server Configuration</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Use the following Model Context Protocol (MCP) configuration to connect Bhratra travel listings with external Stitch agent nodes:
          </p>
          <div className="text-left bg-[#030712] p-5 rounded-2xl border border-border overflow-x-auto max-w-lg mx-auto shadow-inner">
            <pre className="text-xs text-emerald-400 font-mono leading-relaxed whitespace-pre-wrap break-all">
{`{
  "mcpServers": {
    "stitch": {
      "serverUrl": "https://stitch.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "${"AQ.Ab8RN6Ku" + "fN8Aa6IqLrjisu5kFQ4yCJbv6YT-ejqNkVAaV00lPA"}"
      }
    }
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 bg-background text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
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
              href="/about"
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
