import React from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, MapPin, ArrowRight, MessageSquare } from 'lucide-react';

export default function CommunityPage() {
  const stories = [
    {
      name: 'Arjun & Rahul',
      trip: 'Manali to Leh Ride',
      text: 'Conquering the Gata Loops and Rohtang Pass would have been impossible alone. Having a companion who knows basic bike repair and route navigation saved our trip when my chain sprocket gave up.',
      rating: 5,
      avatar: 'AR',
    },
    {
      name: 'Sneha & Meera',
      trip: 'Valley of Flowers Trek',
      text: 'Bhratra matched us based on our strict vegetarian preference and budget alignment. We spent 5 days trekking the mountains and ended up planning our next trek to Spiti Valley together.',
      rating: 5,
      avatar: 'SM',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-forest-green tracking-widest uppercase">Our Community</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Traveler Stories & Connections
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Discover how verified travel companions are safely exploring the world together.
          </p>
        </div>

        {/* Stories list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(story.rating)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 text-sunset-orange fill-sunset-orange" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                  "{story.text}"
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-mountain-blue text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {story.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                      {story.name}
                      <ShieldCheck className="h-4 w-4 text-forest-green fill-green-50" />
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{story.trip}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-[10px] font-bold">Verified Match</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action card */}
        <div className="bg-gradient-to-r from-mountain-blue to-blue-700 p-8 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-900/10">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold">Join the Bhratra Brotherhood</h3>
            <p className="text-xs text-blue-100/90 max-w-md">
              Create a verified traveler profile, discover ride groups, match preferences, and explore the outdoors safely.
            </p>
          </div>
          <Link
            href="/signup"
            className="bg-white hover:bg-slate-100 text-mountain-blue font-bold px-6 py-3.5 rounded-full text-sm shadow-md transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            Create Your Account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
