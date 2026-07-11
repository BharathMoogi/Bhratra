'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Sparkles, MessageSquare, MapPin } from 'lucide-react';

interface FloatingCardProps {
  variant: 'ladakh' | 'verified' | 'safe' | 'matching' | 'chat';
  delay?: number;
  duration?: number;
  yOffset?: number;
  rotationOffset?: number;
  className?: string;
}

export default function FloatingCard({
  variant,
  delay = 0,
  duration = 6,
  yOffset = 15,
  rotationOffset = 2,
  className = '',
}: FloatingCardProps) {
  
  // Custom slow organic floating path
  const floatTransition = {
    duration: duration,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut' as const,
    delay: delay,
  };

  const floatVariants = {
    animate: {
      y: [0, -yOffset, 0],
      rotate: [0, rotationOffset, 0, -rotationOffset, 0],
    },
  };

  // Render variant contents
  const renderCardContent = () => {
    switch (variant) {
      case 'ladakh':
        return (
          <div className="relative rounded-3xl border border-white/20 dark:border-white/10 bg-card/60 dark:bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl h-full flex flex-col justify-between group">
            {/* Aspect image placeholder or generated cover */}
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src="/himalaya_expedition_hero.png"
                alt="Himalayan Ride"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Group</span>
                <h4 className="text-white font-bold text-md mt-0.5">Ladakh Expedition</h4>
                <p className="text-white/70 text-[10px] flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-emerald-400" /> Leh-Manali Pass
                </p>
              </div>
            </div>
            {/* Overlay card details */}
            <div className="p-4 flex items-center justify-between text-xs border-t border-white/10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-5.5 h-5.5 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-[8px]">
                    {i === 1 ? 'AK' : i === 2 ? 'SD' : 'RM'}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                2 Seats Left
              </span>
            </div>
          </div>
        );

      case 'verified':
        return (
          <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-card/60 dark:bg-card/40 backdrop-blur-xl p-5 shadow-xl flex items-start gap-4">
            <div className="p-2.5 bg-primary/10 rounded-2xl text-primary flex-none border border-primary/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Verified Travelers</h4>
              <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                100% government ID checked companions for secure trip matching.
              </p>
            </div>
          </div>
        );

      case 'safe':
        return (
          <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-card/60 dark:bg-card/40 backdrop-blur-xl p-5 shadow-xl flex items-start gap-4">
            <div className="p-2.5 bg-sky-500/10 rounded-2xl text-sky-500 flex-none border border-sky-500/20">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Safe Community</h4>
              <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                Strict safety filters with dedicated single-gender travel schedules.
              </p>
            </div>
          </div>
        );

      case 'matching':
        return (
          <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-card/60 dark:bg-card/40 backdrop-blur-xl p-5 shadow-xl flex items-start gap-4">
            <div className="p-2.5 bg-amber-500/10 rounded-2xl text-amber-500 flex-none border border-amber-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Smart Matching</h4>
              <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                Connect based on compatibility parameters, budgets, and habits.
              </p>
            </div>
          </div>
        );

      case 'chat':
        return (
          <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-card/60 dark:bg-card/40 backdrop-blur-xl p-5 shadow-xl flex items-start gap-4">
            <div className="p-2.5 bg-indigo-500/10 rounded-2xl text-indigo-500 flex-none border border-indigo-500/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Secure Chat</h4>
              <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                Realtime coordination chats with instant message file shares.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={floatVariants}
      animate="animate"
      transition={floatTransition}
      className={`w-full ${className}`}
    >
      {renderCardContent()}
    </motion.div>
  );
}
