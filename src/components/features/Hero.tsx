'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, MessageCircle, Map, Star, Users, CheckCircle } from 'lucide-react';
import Stats from './Stats';

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  });

  const floatAnim = (delay = 0, yOffset = 8) =>
    shouldReduceMotion
      ? {}
      : {
          animate: { y: [0, -yOffset, 0] },
          transition: {
            duration: 4 + delay,
            repeat: Infinity,
            repeatType: 'reverse' as const,
            ease: 'easeInOut' as const,
            delay,
          },
        };

  return (
    <section className="bg-white min-h-screen flex items-center pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ─── LEFT COLUMN ─── */}
          <div className="flex flex-col items-start space-y-5">

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
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-md shadow-blue-200 transition-colors text-sm"
                >
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/trips"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-full border border-gray-200 transition-colors text-sm"
                >
                  Explore Trips
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(0.4)}>
              <Stats />
            </motion.div>
          </div>

          {/* ─── RIGHT COLUMN: Overlapping Card Composition ─── */}
          <div className="relative h-[420px] sm:h-[460px] flex items-center justify-center">

            {/* Main large photo card */}
            <motion.div
              {...fadeUp(0.2)}
              {...floatAnim(0, 10)}
              className="absolute inset-x-8 top-0 bottom-8 rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
            >
              <img
                src="/himalaya_expedition_hero.png"
                alt="Ladakh Expedition"
                className="w-full h-full object-cover"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Ladakh Expedition pill — top left */}
              <motion.div
                {...floatAnim(0.5, 6)}
                className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg"
              >
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xs">🚀</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-800 leading-none">Ladakh Expedition</p>
                  <p className="text-[9px] text-gray-500 mt-0.5">7 days in ladakh</p>
                </div>
              </motion.div>

              {/* Verified Riders pill — bottom left */}
              <motion.div
                {...floatAnim(1, 7)}
                className="absolute bottom-5 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5 shadow-md"
              >
                <CheckCircle className="h-3 w-3 text-blue-500" />
                <span className="text-[10px] font-semibold text-gray-700">618 Verified Riders</span>
              </motion.div>
            </motion.div>

            {/* 98% Compatibility card — right side */}
            <motion.div
              {...fadeUp(0.35)}
              {...floatAnim(1.2, 9)}
              className="absolute right-0 top-1/4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 w-40"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-[9px]">✓</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">Compatibility</span>
              </div>
              <div className="text-2xl font-extrabold text-teal-500">98%</div>
              <div className="mt-1.5 flex gap-0.5">
                {[75, 90, 60, 98, 80].map((v, i) => (
                  <div key={i} className="flex-1 bg-gray-100 rounded-full overflow-hidden h-1.5">
                    <div className="bg-teal-400 h-full rounded-full" style={{ width: `${v}%` }} />
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-gray-400 mt-1">LIVE PROGRESS</p>
              <p className="text-[9px] font-semibold text-gray-600">Manali → Leh</p>
            </motion.div>

            {/* Group Chat card — bottom right area */}
            <motion.div
              {...fadeUp(0.5)}
              {...floatAnim(2, 8)}
              className="absolute bottom-0 right-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 w-44"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-2.5 w-2.5 text-blue-500" />
                </div>
                <span className="text-[11px] font-bold text-gray-700">Group Chat</span>
              </div>
              <div className="space-y-1.5">
                <div className="bg-gray-50 rounded-lg px-2 py-1">
                  <p className="text-[9px] text-gray-500">"First stop at Manali?"</p>
                </div>
                <div className="bg-blue-50 rounded-lg px-2 py-1">
                  <p className="text-[9px] text-blue-600">"Let's camp near Rohtang!"</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
