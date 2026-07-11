'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Check, Sparkles } from 'lucide-react';
import Stats from './Stats';

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  // Basic entry fade up animation
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  });

  // Float animation for absolute elements with custom speed/offset
  const floatAnim = (delay = 0, yOffset = 8, duration = 4) =>
    shouldReduceMotion
      ? {}
      : {
          animate: { y: [0, -yOffset, 0] },
          transition: {
            duration,
            repeat: Infinity,
            repeatType: 'reverse' as const,
            ease: 'easeInOut' as const,
            delay,
          },
        };

  return (
    <section className="bg-white min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ─── LEFT COLUMN ─── */}
          <div className="flex flex-col items-start space-y-6 z-10">
            <motion.h1
              {...fadeUp(0.05)}
              className="text-5xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight text-gray-900"
            >
              Never Travel<br />
              <span className="text-blue-600">Alone Again.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.15)}
              className="italic text-gray-500 text-sm max-w-sm"
            >
              "I was just another dev in Bengaluru until I found my tribe."
            </motion.p>

            <motion.p
              {...fadeUp(0.22)}
              className="text-gray-500 text-sm leading-relaxed max-w-sm"
            >
              Arjun, a software engineer, dreamed of the Himalayas but had no one to ride with. Through Bhratra, he connected with 7 other verified enthusiasts. Together, they conquered the Khardung La pass, turning strangers into a lifelong brotherhood.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div {...fadeUp(0.3)} className="flex flex-row gap-3 pt-1">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-full shadow-md shadow-blue-200 transition-colors text-sm"
                >
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/trips"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3.5 rounded-full border border-gray-200 transition-colors text-sm"
                >
                  Explore Trips
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(0.4)} className="w-full">
              <Stats />
            </motion.div>
          </div>

          {/* ─── RIGHT COLUMN: Overlapping Card Composition ─── */}
          <div className="relative w-full h-[480px] sm:h-[520px] flex items-center justify-center select-none overflow-visible">

            {/* 1. Main large photo card */}
            <motion.div
              {...fadeUp(0.2)}
              className="relative w-[340px] sm:w-[420px] aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-100 z-10"
            >
              <img
                src="/himalaya_expedition_hero.png"
                alt="Ladakh Expedition"
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

              {/* Internal SVG Route Overlay */}
              {!shouldReduceMotion && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-20"
                  viewBox="0 0 420 315"
                  fill="none"
                >
                  {/* Winding road path */}
                  <motion.path
                    d="M 120 220 C 180 200, 200 240, 260 190 C 310 150, 280 120, 360 140"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="6,6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.5, ease: "easeInOut", delay: 0.6 }}
                  />

                  {/* Pulsating location marker dot moving along path */}
                  <motion.circle
                    r="6"
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth="2"
                    animate={{
                      cx: [120, 155, 195, 230, 260, 290, 325, 360],
                      cy: [220, 208, 218, 222, 190, 160, 134, 140],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />
                </svg>
              )}

              {/* Ladakh internal tag */}
              <div className="absolute left-[70px] top-[170px] bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10 text-[9px] font-bold text-white tracking-wider uppercase z-20">
                Ladakh
              </div>

              {/* 96% Compatibility internal tag */}
              <div className="absolute left-[165px] top-[145px] bg-black/45 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10 text-[9px] font-semibold text-teal-400 flex items-center gap-1 z-20">
                <Sparkles className="h-2 w-2" />
                96% Compatibility
              </div>

              {/* 8/8 Verified Riders badge */}
              <motion.div
                {...floatAnim(0.8, 5, 4.5)}
                className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white flex items-center gap-1.5 z-20"
              >
                <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <span className="text-[10px] font-bold text-gray-800">8/8 Verified Riders</span>
              </motion.div>
            </motion.div>

            {/* 2. Top-Left Card: Ladakh Expedition */}
            <motion.div
              {...fadeUp(0.3)}
              {...floatAnim(0.2, 7, 3.8)}
              whileHover={{ scale: 1.05, y: -5 }}
              className="absolute -top-3 left-4 sm:left-12 bg-white rounded-2xl shadow-xl border border-gray-100/80 px-4 py-2.5 flex items-center gap-3 z-30 pointer-events-auto cursor-pointer"
            >
              <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-lg">
                🚀
              </div>
              <div>
                <h4 className="text-[11px] font-extrabold text-gray-900 leading-none">Ladakh Expedition</h4>
                <p className="text-[9px] text-gray-500 mt-0.5">7 Riders Joined</p>
              </div>
            </motion.div>

            {/* 3. Top-Right Card: Sunny 14°C */}
            <motion.div
              {...fadeUp(0.35)}
              {...floatAnim(0.9, 6, 4.2)}
              whileHover={{ scale: 1.05 }}
              className="absolute top-10 right-4 sm:right-12 bg-white rounded-2xl shadow-lg border border-gray-100/80 px-3.5 py-2 flex items-center gap-2.5 z-30 pointer-events-auto cursor-pointer"
            >
              <div className="text-lg">🌤️</div>
              <div>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider leading-none">Sunny</p>
                <p className="text-[11px] font-extrabold text-gray-900 mt-0.5">14°C</p>
              </div>
            </motion.div>

            {/* 4. Middle-Right Card: 98% Compatibility */}
            <motion.div
              {...fadeUp(0.4)}
              {...floatAnim(1.4, 8, 4.8)}
              whileHover={{ scale: 1.05 }}
              className="absolute right-0 sm:right-4 top-[170px] bg-white rounded-2xl shadow-2xl border border-gray-100 px-4 py-3 w-40 z-30 pointer-events-auto cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs">😊</span>
                <span className="text-[10px] text-blue-600 font-bold">98% Compatibility</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden my-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "98%" }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                  className="bg-blue-600 h-full rounded-full"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-bold text-emerald-600 tracking-wider uppercase">Live Progress</span>
              </div>
              <p className="text-[9px] font-bold text-gray-700 mt-0.5">Manali → Leh</p>
            </motion.div>

            {/* 5. Bottom-Left Card: Group Chat */}
            <motion.div
              {...fadeUp(0.45)}
              {...floatAnim(2, 6, 4)}
              whileHover={{ scale: 1.03 }}
              className="absolute -bottom-6 left-4 sm:left-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-3.5 w-52 z-30 pointer-events-auto cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-gray-100">
                <div className="w-4 h-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-2.5 w-2.5 text-blue-600" />
                </div>
                <span className="text-[10px] font-extrabold text-gray-800 uppercase tracking-wider">Group Chat</span>
              </div>
              <div className="space-y-2">
                <div className="bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100 max-w-[90%]">
                  <p className="text-[9px] font-medium text-gray-600 leading-tight">"Fuel stop at Manali?"</p>
                </div>
                <div className="bg-blue-50 rounded-xl px-3 py-1.5 border border-blue-100/50 ml-auto max-w-[90%]">
                  <p className="text-[9px] font-semibold text-blue-700 leading-tight">"Let's camp near Pangong."</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
