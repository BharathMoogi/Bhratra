import Link from 'next/link';
import { Shield, Compass, Calendar, Users, MapPin, ArrowRight, CheckSquare, MessageSquare, ShieldCheck, Lock, Sparkles, Star } from 'lucide-react';
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
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* 1. Cinematic Storytelling Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Storytelling Narrative */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
                Never Travel<br />
                <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                  Alone Again.
                </span>
              </h1>

              {/* Arjun quotes testimonial */}
              <div className="border-l-4 border-primary pl-4 py-1 italic text-md text-primary bg-primary/5 rounded-r-xl max-w-lg">
                "I was just another dev in Bengaluru until I found my tribe."
              </div>

              {/* Story introduction */}
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                Arjun, a software engineer, dreamed of the Himalayas but had no one to ride with. Through Bhratra, he connected with 7 other verified enthusiasts. Together, they conquered the Khardung La pass, turning strangers into a lifelong brotherhood.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  href="/auth/signup"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3.5 rounded-full text-sm font-bold shadow-md transition-colors"
                >
                  Start Your Journey
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
                <Link
                  href="/trips"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-background border border-border hover:bg-secondary text-foreground px-8 py-3.5 rounded-full text-sm font-bold transition-colors"
                >
                  Explore Trips
                </Link>
              </div>
              
              {/* Quick stats grid */}
              <div className="pt-8 border-t border-border grid grid-cols-4 gap-4 max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-foreground">25K+</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Travelers</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-0.5">
                    4.9
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Rating</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-foreground">5K+</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Trips</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-foreground">100+</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Countries</div>
                </div>
              </div>
            </div>

            {/* Right Column: Pixar Illustration Card & Value Grid */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Pixar mountain illustration card */}
              <div className="relative rounded-3xl border border-border bg-card overflow-hidden shadow-xl aspect-video w-full group">
                <img
                  src="/himalaya_expedition_hero.png"
                  alt="Himalayan motorcycle expedition illustration"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Featured Expedition</span>
                  <h4 className="text-white font-bold text-lg mt-1">Leh-Manali Adventure Ride</h4>
                  <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-400" /> Bengaluru to Leh Rider Tribe
                  </p>
                </div>
              </div>

              {/* 2x2 Feature badges grid */}
              <div className="grid grid-cols-2 gap-4 bg-card border border-border p-5 rounded-3xl shadow-lg">
                
                {/* 1. Verified Travelers */}
                <div className="p-3.5 rounded-2xl bg-secondary/35 border border-border/30 flex flex-col gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg text-primary w-fit">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Verified Travelers</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Government ID safety checks.</p>
                  </div>
                </div>

                {/* 2. Safe Community */}
                <div className="p-3.5 rounded-2xl bg-secondary/35 border border-border/30 flex flex-col gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg text-primary w-fit">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Safe Community</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Gender-specific filters.</p>
                  </div>
                </div>

                {/* 3. Smart Matching */}
                <div className="p-3.5 rounded-2xl bg-secondary/35 border border-border/30 flex flex-col gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg text-primary w-fit">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Smart Matching</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Preferences & behavior filters.</p>
                  </div>
                </div>

                {/* 4. Secure Chat */}
                <div className="p-3.5 rounded-2xl bg-secondary/35 border border-border/30 flex flex-col gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg text-primary w-fit">
                    <MessageSquare className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Secure Chat</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Realtime companion planning.</p>
                  </div>
                </div>

              </div>

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
