'use client';

import React, { useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate, motion } from 'framer-motion';
import { Star } from 'lucide-react';

function CountUpNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: 'easeOut' });
    return () => controls.stop();
  }, [value, count]);

  useEffect(() => {
    return rounded.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toLocaleString() + suffix;
      }
    });
  }, [rounded, suffix]);

  return (
    <span ref={ref} className="font-extrabold text-xl text-gray-900">
      0
    </span>
  );
}

interface StatsProps {
  light?: boolean;
}

export default function Stats({ light = false }: StatsProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-4 gap-6 pt-6 border-t border-gray-100 w-full max-w-sm"
    >
      {/* 25K+ Travelers */}
      <motion.div variants={itemVariants} className="space-y-0.5">
        <CountUpNumber value={25000} suffix="+" />
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Travelers</p>
      </motion.div>

      {/* 4.9 Rating with star */}
      <motion.div variants={itemVariants} className="space-y-0.5">
        <div className="flex items-center gap-0.5">
          <span className="font-extrabold text-xl text-gray-900">4.9</span>
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 mb-0.5" />
        </div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Rating</p>
      </motion.div>

      {/* 5K+ Trips */}
      <motion.div variants={itemVariants} className="space-y-0.5">
        <CountUpNumber value={5000} suffix="+" />
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Trips</p>
      </motion.div>

      {/* 100+ Countries */}
      <motion.div variants={itemVariants} className="space-y-0.5">
        <CountUpNumber value={100} suffix="+" />
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Countries</p>
      </motion.div>
    </motion.div>
  );
}
