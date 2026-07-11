'use client';

import React, { useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate, motion } from 'framer-motion';

function CountUpNumber({ value, suffix = '', light = false }: { value: number; suffix?: string; light?: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, { duration: 2.5, ease: 'easeOut' });
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
    <span
      ref={ref}
      className={`font-extrabold text-3xl sm:text-4xl ${light ? 'text-slate-800' : 'text-foreground'}`}
    >
      0
    </span>
  );
}

interface StatsProps {
  light?: boolean;
}

export default function Stats({ light = false }: StatsProps) {
  const statsData = [
    { value: 25000, suffix: '+', label: 'Travelers' },
    { value: 5000, suffix: '+', label: 'Trips' },
    { value: 100, suffix: '', label: 'Countries' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`grid grid-cols-3 gap-6 pt-8 border-t ${light ? 'border-slate-300/60' : 'border-border'} w-full max-w-sm`}
    >
      {statsData.map((stat, index) => (
        <motion.div key={index} variants={itemVariants} className="space-y-1">
          <CountUpNumber value={stat.value} suffix={stat.suffix} light={light} />
          <p className={`text-[10px] font-bold uppercase tracking-wider ${light ? 'text-slate-500' : 'text-muted-foreground'}`}>
            {stat.label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
