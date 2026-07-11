'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Check, Sparkles, Play, X, ChevronRight, ChevronLeft, Laptop, Navigation } from 'lucide-react';
import Stats from './Stats';

// Story slides data for the interactive storyteller
const STORY_SLIDES = [
  {
    title: "1. The Dream",
    subtitle: "Coding in Bengaluru, dreaming of peaks",
    text: "Arjun, a software engineer in Bengaluru, spent long hours coding while dreaming of riding through the snow-capped peaks of the Himalayas. But finding companions with matching schedules and trust was nearly impossible.",
    illustration: "coding",
  },
  {
    title: "2. The Connection",
    subtitle: "Bhratra safety & preference matching",
    text: "Bhratra's matching engine connected him with 7 other verified motorcycle riders who shared his exact route preference, pace, and schedule. Verified IDs and reviews gave everyone peace of mind.",
    illustration: "matching",
  },
  {
    title: "3. The Conquering",
    subtitle: "Conquering Khardung La together",
    text: "Together, they conquered the Khardung La pass at 17,582 feet. What started as a post by strangers on a website became a lifelong bond of brotherhood.",
    illustration: "conquering",
  }
];

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-advance logic for storytelling slides
  useEffect(() => {
    if (!isStoryOpen) return;
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((prevSlide) => (prevSlide + 1) % STORY_SLIDES.length);
          return 0;
        }
        return prev + 1.25; // Speed of auto-advance (approx 4 seconds per slide)
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isStoryOpen, currentSlide]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % STORY_SLIDES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + STORY_SLIDES.length) % STORY_SLIDES.length);
    setProgress(0);
  };

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
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* ─── Hero Gradient Background ─── */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, #1E40AF 0%, #38BDF8 60%, #F8FAFC 100%)',
        }}
      />

      {/* ─── Natural Drifting Clouds (Visual Storytelling Effect) ─── */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            animate={{ x: [-80, 80, -80] }}
            transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[10%] w-72 h-20 bg-white/10 blur-xl rounded-full -z-10 pointer-events-none"
          />
          <motion.div
            animate={{ x: [60, -60, 60] }}
            transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[35%] right-[15%] w-96 h-28 bg-white/15 blur-2xl rounded-full -z-10 pointer-events-none"
          />
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] left-[45%] w-3 h-3 bg-white/40 rounded-full -z-10 pointer-events-none"
          />
          <motion.div
            animate={{ y: [0, -35, 0], x: [0, -15, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[30%] left-[52%] w-2 h-2 bg-white/30 rounded-full -z-10 pointer-events-none"
          />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ─── LEFT COLUMN ─── */}
          <div className="flex flex-col items-start space-y-6 z-10">
            <motion.h1
              {...fadeUp(0.05)}
              className="text-5xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight text-white"
            >
              Never Travel<br />
              <span className="text-sunset-orange">Alone Again.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.15)}
              className="italic text-blue-100/80 text-sm max-w-sm"
            >
              "I was just another dev in Bengaluru until I found my tribe."
            </motion.p>

            <motion.p
              {...fadeUp(0.22)}
              className="text-blue-50/90 text-sm leading-relaxed max-w-sm"
            >
              Arjun, a software engineer, dreamed of the Himalayas but had no one to ride with. Through Bhratra, he connected with 7 other verified enthusiasts. Together, they conquered the Khardung La pass, turning strangers into a lifelong brotherhood.
            </motion.p>

            {/* Watch Story Play Trigger */}
            <motion.button
              {...fadeUp(0.26)}
              onClick={() => { setIsStoryOpen(true); setCurrentSlide(0); setProgress(0); }}
              className="inline-flex items-center gap-3 text-white hover:text-sunset-orange font-bold text-xs tracking-wider uppercase transition-colors group focus:outline-none"
            >
              <span className="relative flex h-9 w-9">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/30 opacity-20"></span>
                <span className="relative rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center w-9 h-9 transition-colors border border-white/20">
                  <Play className="h-3 w-3 fill-white stroke-white ml-0.5" />
                </span>
              </span>
              Watch Arjun's Journey
            </motion.button>

            {/* CTA Buttons */}
            <motion.div {...fadeUp(0.3)} className="flex flex-row gap-3 pt-1">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 bg-mountain-blue hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-[16px] shadow-lg shadow-blue-900/30 transition-colors text-sm"
                >
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/trips"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-50/50 text-mountain-blue font-semibold px-6 py-3.5 rounded-[16px] border border-white/60 shadow-sm transition-colors text-sm"
                >
                  Explore Trips
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(0.4)} className="w-full">
              <Stats light />
            </motion.div>
          </div>

          {/* ─── RIGHT COLUMN: Overlapping Card Composition ─── */}
          <div className="relative w-full h-[480px] sm:h-[520px] flex items-center justify-center select-none overflow-visible">

            {/* 1. Main large photo card */}
            <motion.div
              {...fadeUp(0.2)}
              className="relative w-[340px] sm:w-[420px] aspect-[4/3] rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-white/20 z-10"
            >
              <img
                src="/himalaya_expedition_hero.png"
                alt="Ladakh Expedition"
                className="w-full h-full object-cover animate-pulse-slow"
              />
              {/* Dark overlay for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

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
                    stroke="#38BDF8" /* Sky Blue glowing animated travel route */
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
                    fill="#F97316" /* Sunset Orange location pin / progress dot */
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
              <div className="absolute left-[165px] top-[145px] bg-black/45 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10 text-[9px] font-semibold text-sky-300 flex items-center gap-1 z-20">
                <Sparkles className="h-2 w-2 text-sunset-orange" />
                96% Compatibility
              </div>

              {/* 8/8 Verified Riders badge */}
              <motion.div
                {...floatAnim(0.8, 5, 4.5)}
                className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white flex items-center gap-1.5 z-20"
              >
                <div className="w-4 h-4 bg-forest-green rounded-full flex items-center justify-center text-white">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <span className="text-[10px] font-bold text-gray-800">8/8 Verified Riders</span>
              </motion.div>
            </motion.div>

            {/* 2. Top-Left Card: Ladakh Expedition */}
            <motion.div
              {...fadeUp(0.3)}
              {...floatAnim(0.2, 7, 3.8)}
              whileHover={{ scale: 1.03, y: -5 }}
              className="absolute -top-3 left-4 sm:left-12 glass-card px-4 py-2.5 flex items-center gap-3 z-30 pointer-events-auto cursor-pointer"
            >
              <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center text-lg shadow-inner">
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
              className="absolute top-10 right-4 sm:right-12 glass-card px-3.5 py-2 flex items-center gap-2.5 z-30 pointer-events-auto cursor-pointer"
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
              className="absolute right-0 sm:right-4 top-[170px] glass-card px-4 py-3 w-40 z-30 pointer-events-auto cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs">😊</span>
                <span className="text-[10px] text-mountain-blue font-bold">98% Compatibility</span>
              </div>
              <div className="w-full bg-gray-200/50 rounded-full h-1.5 overflow-hidden my-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "98%" }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                  className="bg-forest-green h-full rounded-full"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 bg-forest-green rounded-full animate-pulse" />
                <span className="text-[8px] font-bold text-forest-green tracking-wider uppercase">Live Progress</span>
              </div>
              <p className="text-[9px] font-bold text-gray-700 mt-0.5">Manali → Leh</p>
            </motion.div>

            {/* 5. Bottom-Left Card: Group Chat */}
            <motion.div
              {...fadeUp(0.45)}
              {...floatAnim(2, 6, 4)}
              whileHover={{ scale: 1.03 }}
              className="absolute -bottom-6 left-4 sm:left-10 glass-card p-3.5 w-52 z-30 pointer-events-auto cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-gray-100">
                <div className="w-4 h-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-2.5 w-2.5 text-mountain-blue" />
                </div>
                <span className="text-[10px] font-extrabold text-gray-800 uppercase tracking-wider">Group Chat</span>
              </div>
              <div className="space-y-2">
                <div className="bg-gray-100/50 rounded-xl px-3 py-1.5 border border-gray-200/20 max-w-[90%]">
                  <p className="text-[9px] font-medium text-gray-600 leading-tight">"Fuel stop at Manali?"</p>
                </div>
                <div className="bg-blue-50 rounded-xl px-3 py-1.5 border border-blue-100/30 ml-auto max-w-[90%]">
                  <p className="text-[9px] font-semibold text-mountain-blue leading-tight">"Let's camp near Pangong."</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ─── IMMERSIVE STORYTELLER MODAL ─── */}
      <AnimatePresence>
        {isStoryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-[24px] max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsStoryOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Progress Bar Indicators at top */}
              <div className="flex gap-1.5 mb-6">
                {STORY_SLIDES.map((_, idx) => (
                  <div key={idx} className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="bg-mountain-blue h-full transition-all duration-75"
                      style={{
                        width:
                          idx < currentSlide
                            ? "100%"
                            : idx === currentSlide
                            ? `${progress}%`
                            : "0%",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Slide Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Category Header */}
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-mountain-blue uppercase">
                      {STORY_SLIDES[currentSlide].title}
                    </span>
                    <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                      {STORY_SLIDES[currentSlide].subtitle}
                    </h3>
                  </div>

                  {/* Animated Visual/Illustration Area */}
                  <div className="w-full h-40 bg-slate-50 rounded-[24px] border border-gray-100 flex items-center justify-center overflow-hidden relative">
                    
                    {/* Visual 1: Coding */}
                    {STORY_SLIDES[currentSlide].illustration === "coding" && (
                      <div className="flex flex-col items-center gap-3">
                        <Laptop className="h-10 w-10 text-gray-400 animate-pulse" />
                        <div className="w-48 space-y-1.5 flex flex-col items-center">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "90%" }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                            className="h-2 bg-blue-500/20 rounded-full"
                          />
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "65%" }}
                            transition={{ duration: 1.2, delay: 0.3, repeat: Infinity, repeatType: "reverse" }}
                            className="h-2 bg-blue-500/20 rounded-full"
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-gray-400 font-mono">localhost:3000</span>
                      </div>
                    )}

                    {/* Visual 2: Matching */}
                    {STORY_SLIDES[currentSlide].illustration === "matching" && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-400 flex items-center justify-center text-mountain-blue z-10"
                        >
                          <Sparkles className="h-6 w-6 text-sunset-orange" />
                        </motion.div>

                        {/* Connected User Node Avatars */}
                        {[
                          { x: -55, y: -35, init: "AK" },
                          { x: 55, y: -35, init: "RM" },
                          { x: -60, y: 30, init: "SD" },
                          { x: 60, y: 30, init: "JP" }
                        ].map((node, i) => (
                          <React.Fragment key={i}>
                            {/* Connector line */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                              <motion.line
                                x1="240"
                                y1="80"
                                x2={240 + node.x}
                                y2={80 + node.y}
                                stroke="#93c5fd"
                                strokeWidth="1.5"
                                strokeDasharray="4,4"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, delay: i * 0.2 }}
                              />
                            </svg>

                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", delay: 0.3 + i * 0.2 }}
                              style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
                              className="absolute w-7 h-7 rounded-full bg-white border border-blue-200 shadow-md flex items-center justify-center text-[9px] font-bold text-mountain-blue"
                            >
                              {node.init}
                            </motion.div>
                          </React.Fragment>
                        ))}
                      </div>
                    )}

                    {/* Visual 3: Conquering */}
                    {STORY_SLIDES[currentSlide].illustration === "conquering" && (
                      <div className="relative w-full h-full flex flex-col items-center justify-center">
                        {/* Winding mountain road sketch */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 160">
                          <motion.path
                            d="M 50 120 Q 150 60 250 110 T 350 70"
                            stroke="#cbd5e1"
                            strokeWidth="2"
                            fill="none"
                          />
                          <motion.path
                            d="M 50 120 Q 150 60 250 110 T 350 70"
                            stroke="#15803D"
                            strokeWidth="2"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                        </svg>

                        <motion.div
                          animate={{
                            x: [-120, 120],
                            y: [15, -15],
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute bg-white px-2.5 py-1 rounded-full border border-gray-100 shadow-lg flex items-center gap-1 z-10"
                        >
                          <Navigation className="h-3 w-3 text-mountain-blue rotate-45" />
                          <span className="text-[9px] font-bold text-gray-800">17,582 ft</span>
                        </motion.div>
                      </div>
                    )}

                  </div>

                  {/* Narrative Text */}
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {STORY_SLIDES[currentSlide].text}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors focus:outline-none"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors focus:outline-none"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => setIsStoryOpen(false)}
                  className="bg-mountain-blue hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-[16px] text-xs transition-colors focus:outline-none"
                >
                  Join Like Arjun
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
