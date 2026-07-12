'use client';

import React, { useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate, motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';

function CountUpNumber({ value, suffix = '', light = false }: { value: number; suffix?: string; light?: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);
  // Fire the count-up only when the number is scrolled into view
  const isInView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, value, { duration: 2, ease: 'easeOut' });
    return () => controls.stop();
  }, [isInView, value, count]);

  useEffect(() => {
    return rounded.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toLocaleString() + suffix;
      }
    });
  }, [rounded, suffix]);

  return (
    <span ref={ref} className="font-extrabold text-xl" style={{ color: light ? '#ffffff' : '#0F172A' }}>
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
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      className={`grid grid-cols-4 gap-6 pt-6 border-t w-full max-w-sm ${
        light ? 'border-white/15' : 'border-gray-100'
      }`}
    >
      {/* 25K+ Travelers */}
      <motion.div variants={itemVariants} className="space-y-0.5">
        <CountUpNumber value={25000} suffix="+" light={light} />
        <p className={`text-[9px] font-bold uppercase tracking-widest ${light ? 'text-blue-100' : 'text-gray-400'}`}>
          Travelers
        </p>
      </motion.div>

      {/* 4.9 Rating with Sunset Orange star */}
      <motion.div variants={itemVariants} className="space-y-0.5">
        <div className="flex items-center gap-0.5">
          <span className="font-extrabold text-xl" style={{ color: light ? '#ffffff' : '#0F172A' }}>4.9</span>
          <Star className="h-3.5 w-3.5 mb-0.5" style={{ color: '#F97316', fill: '#F97316' }} />
        </div>
        <p className={`text-[9px] font-bold uppercase tracking-widest ${light ? 'text-blue-100' : 'text-gray-400'}`}>
          Rating
        </p>
      </motion.div>

      {/* 5K+ Trips */}
      <motion.div variants={itemVariants} className="space-y-0.5">
        <CountUpNumber value={5000} suffix="+" light={light} />
        <p className={`text-[9px] font-bold uppercase tracking-widest ${light ? 'text-blue-100' : 'text-gray-400'}`}>
          Trips
        </p>
      </motion.div>

      {/* 100+ Countries */}
      <motion.div variants={itemVariants} className="space-y-0.5">
        <CountUpNumber value={100} suffix="+" light={light} />
        <p className={`text-[9px] font-bold uppercase tracking-widest ${light ? 'text-blue-100' : 'text-gray-400'}`}>
          Countries
        </p>
      </motion.div>
    </motion.div>
  );
}
