'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Lock, Sparkles, MessageSquare, MapPin, Star } from 'lucide-react';
import Stats from './Stats';

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  });

  const floatAnim = (delay = 0, yOffset = 10, rotation = 1.5) =>
    shouldReduceMotion
      ? {}
      : {
          animate: {
            y: [0, -yOffset, 0],
            rotate: [0, rotation, 0, -rotation, 0],
          },
          transition: {
            duration: 6 + delay,
            repeat: Infinity,
            repeatType: 'reverse' as const,
            ease: 'easeInOut' as const,
            delay,
          },
        };

  const cardReveal = (delay = 0) => ({
    initial: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.88, y: shouldReduceMotion ? 0 : 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-10">
      {/* Background: Blue → Warm Sunset Gradient (matching Stitch canvas) */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(160deg, #c8dff7 0%, #d6e8f8 20%, #e8d5c0 60%, #f0c090 80%, #f5b870 100%)',
        }}
      />

      {/* Subtle animated shimmer layer */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(255,200,100,0.25) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">

          {/* ─── LEFT COLUMN ─── */}
          <div className="flex flex-col items-start space-y-6">

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.1)}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-slate-800"
            >
              Never Travel<br />
              <span className="text-blue-600">Alone Again.</span>
            </motion.h1>

            {/* Testimonial quote */}
            <motion.p
              {...fadeUp(0.22)}
              className="italic text-slate-600 text-base border-l-4 border-blue-400 pl-4 max-w-md"
            >
              "I was just another dev in Bengaluru until I found my tribe."
            </motion.p>

            {/* Story paragraph */}
            <motion.p
              {...fadeUp(0.32)}
              className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md"
            >
              Arjun, a software engineer, dreamed of the Himalayas but had no one to ride with. Through Bhratra, he connected with 7 other verified enthusiasts. Together, they conquered the Khardung La pass, turning strangers into a lifelong brotherhood.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div {...fadeUp(0.42)} className="flex flex-col sm:flex-row gap-3 pt-1">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-blue-500/20 transition-colors text-sm"
                >
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/trips"
                  className="inline-flex items-center justify-center gap-2 bg-white/60 backdrop-blur-sm hover:bg-white/80 text-slate-700 font-bold px-7 py-3.5 rounded-full border border-white/60 transition-colors text-sm"
                >
                  Explore Trips
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(0.52)}>
              <Stats light />
            </motion.div>
          </div>

          {/* ─── RIGHT COLUMN: Floating Card Cluster ─── */}
          <div className="relative flex items-start justify-center lg:justify-end h-[480px] sm:h-[520px]">

            {/* Ladakh Expedition Card — floating left/center */}
            <motion.div
              {...cardReveal(0.3)}
              {...floatAnim(0, 12, 1.5)}
              className="absolute left-0 sm:left-4 top-4 w-52 sm:w-60 z-20"
            >
              <div className="rounded-3xl overflow-hidden bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl">
                <div className="relative aspect-[4/3] w-full">
                  <img
                    src="/himalaya_expedition_hero.png"
                    alt="Ladakh Expedition"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent p-3 flex flex-col justify-end">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Featured</span>
                    <h4 className="text-white font-bold text-sm leading-tight">Ladakh Expedition</h4>
                    <p className="text-white/70 text-[10px] flex items-center gap-1 mt-0.5">
                      <MapPin className="h-2.5 w-2.5 text-emerald-400" /> Leh-Manali Pass
                    </p>
                  </div>
                </div>
                {/* Mini details row */}
                <div className="px-3 py-2 flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {['AK', 'SD', 'RM'].map((initials) => (
                      <div
                        key={initials}
                        className="w-5 h-5 rounded-full bg-blue-100 border border-white flex items-center justify-center text-[7px] font-bold text-blue-700"
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                    2 Seats Left
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 2×2 Feature Cards Grid — floating right */}
            <motion.div
              {...cardReveal(0.45)}
              className="absolute right-0 sm:right-2 top-0 w-56 sm:w-64 z-10"
            >
              <div className="grid grid-cols-2 gap-3">

                {/* Verified Travelers */}
                <motion.div {...floatAnim(0.4, 10, -1.2)}>
                  <div className="rounded-2xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg p-3.5 flex flex-col gap-2">
                    <div className="p-1.5 bg-blue-100/80 rounded-xl text-blue-600 w-fit">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-800 leading-tight">Verified Travelers</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">Govt. ID checked</p>
                    </div>
                  </div>
                </motion.div>

                {/* Safe Community */}
                <motion.div {...floatAnim(0.9, 9, 1.5)}>
                  <div className="rounded-2xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg p-3.5 flex flex-col gap-2">
                    <div className="p-1.5 bg-sky-100/80 rounded-xl text-sky-600 w-fit">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-800 leading-tight">Safe Community</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">Gender filters</p>
                    </div>
                  </div>
                </motion.div>

                {/* Smart Matching */}
                <motion.div {...floatAnim(1.4, 11, -1)}>
                  <div className="rounded-2xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg p-3.5 flex flex-col gap-2">
                    <div className="p-1.5 bg-amber-100/80 rounded-xl text-amber-600 w-fit">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-800 leading-tight">Smart Matching</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">Preference filters</p>
                    </div>
                  </div>
                </motion.div>

                {/* Secure Chat */}
                <motion.div {...floatAnim(1.9, 8, 2)}>
                  <div className="rounded-2xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg p-3.5 flex flex-col gap-2">
                    <div className="p-1.5 bg-indigo-100/80 rounded-xl text-indigo-600 w-fit">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-800 leading-tight">Secure Chat</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">Realtime planning</p>
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>

            {/* Rating pill — decorative, matching Stitch design */}
            <motion.div
              {...cardReveal(0.65)}
              {...floatAnim(2.5, 7, -1)}
              className="absolute bottom-14 left-14 sm:left-24 z-30"
            >
              <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-xl border border-white/60 shadow-md rounded-full px-3 py-1.5">
                <Star className="h-3 w-3 text-amber-500 fill-amber-400" />
                <span className="text-[11px] font-bold text-slate-700">4.9 Rating</span>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
