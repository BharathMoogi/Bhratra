'use client';

import React, { useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate, motion } from 'framer-motion';

function CountUpNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2.5,
      ease: 'easeOut',
    });
    return () => controls.stop();
  }, [value, count]);

  useEffect(() => {
    return rounded.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toLocaleString() + suffix;
      }
    });
  }, [rounded, suffix]);

  return <span ref={ref} className="font-extrabold text-3xl sm:text-4xl text-foreground">0</span>;
}

export default function Stats() {
  const statsData = [
    { value: 25000, suffix: '+', label: 'Travelers' },
    { value: 5000, suffix: '+', label: 'Trips' },
    { value: 100, suffix: '', label: 'Countries' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
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
      className="grid grid-cols-3 gap-6 pt-10 border-t border-border mt-12 w-full max-w-lg"
    >
      {statsData.map((stat, index) => (
        <motion.div key={index} variants={itemVariants} className="space-y-1">
          <div className="flex items-baseline">
            <CountUpNumber value={stat.value} suffix={stat.suffix} />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
