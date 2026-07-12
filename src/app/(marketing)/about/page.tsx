import React from 'react';
import Link from 'next/link';
import { Compass, Users, Heart, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-sunset-orange tracking-widest uppercase">Our Mission</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Connecting Travelers, Building Brotherhood
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Bhratra was founded to solve a simple problem: the open road is beautiful, but it's meant to be shared with trusted companions.
          </p>
        </div>

        {/* Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <div className="p-3 bg-blue-50 text-mountain-blue rounded-xl w-fit">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">1. Freedom</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore the most challenging mountain peaks, winding roads, and hidden lakes with absolute confidence and safety.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <div className="p-3 bg-green-50 text-forest-green rounded-xl w-fit">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">2. Friendship</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Turn strangers into lifelong brothers on motorcycle expeditions, treks, backpacking trails, and international travels.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <div className="p-3 bg-orange-50 text-sunset-orange rounded-xl w-fit">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">3. Trust</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              With government ID verification, mutual compatibility check, and companion ratings, travel with zero anxiety.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">The Bhratra Journey</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            In Sanskrit, "Bhratra" means brother. We believe that group travel isn't just about sharing fuel costs or itinerary plans—it is about shared responsibility, safety, and mutual support under unpredictable circumstances. Whether you are navigating the high-altitude Khardung La pass in Ladakh, camping under stars at Pangong Lake, or backpacking across Southeast Asia, having the right companion makes all the difference.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our platform helps you specify your exact pacing style, vehicle specs, interest tags, and dietary choices. The Bhratra matching engine handles the rest, ensuring that every travel group is built on a foundation of safety and alignment.
          </p>
          
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-lg font-extrabold text-slate-900">Ready to join your tribe?</p>
              <p className="text-xs text-slate-500">Create a verified account in just 2 minutes.</p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-mountain-blue hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full text-sm shadow-md transition-colors"
            >
              Start Exploring
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
