'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
      {/* Primary Call to Action */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="w-full sm:w-auto"
      >
        <Link
          href="/auth/signup"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/95 px-8 py-3.5 rounded-full text-sm font-bold shadow-md shadow-primary/10 transition-colors"
        >
          Start Your Journey
          <ArrowRight className="h-4.5 w-4.5" />
        </Link>
      </motion.div>

      {/* Secondary Call to Action */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="w-full sm:w-auto"
      >
        <Link
          href="/trips"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-background border border-border hover:bg-secondary text-foreground px-8 py-3.5 rounded-full text-sm font-bold transition-colors"
        >
          Explore Trips
        </Link>
      </motion.div>
    </div>
  );
}
