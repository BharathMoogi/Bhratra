'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FloatingCard from './FloatingCard';
import Stats from './Stats';
import CTAButtons from './CTAButtons';

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  // Animating background gradient coordinates
  const gradientBgVariants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    },
  };

  const textContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 80,
        damping: 15,
      },
    },
  };

  const cardsContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardItemVariants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.9, y: shouldReduceMotion ? 0 : 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 90,
        damping: 14,
      },
    },
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:py-32 flex items-center justify-center min-h-[90vh]">
      
      {/* Animated Gradient Background */}
      <motion.div
        variants={shouldReduceMotion ? undefined : gradientBgVariants}
        animate="animate"
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-sky-500/10 via-amber-500/5 to-rose-500/10 bg-[length:200%_200%]"
      />

      {/* Decorative Blur Orbs */}
      <div className="absolute top-20 right-10 -z-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 -z-10 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Narrative Content */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-6 space-y-6 text-left flex flex-col items-start"
          >
            {/* Top Badge */}
            <motion.span
              variants={fadeUpVariants}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20"
            >
              Adventure Companion Network
            </motion.span>

            {/* Headline */}
            <motion.h1
              variants={fadeUpVariants}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]"
            >
              Never Travel<br />
              <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                Alone Again.
              </span>
            </motion.h1>

            {/* Testimonial Quote */}
            <motion.div
              variants={fadeUpVariants}
              className="border-l-4 border-primary pl-4 py-1.5 italic text-md text-primary bg-primary/5 rounded-r-2xl max-w-lg"
            >
              "I was just another dev in Bengaluru until I found my tribe."
            </motion.div>

            {/* Story Paragraph */}
            <motion.p
              variants={fadeUpVariants}
              className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg"
            >
              Arjun, a software engineer, dreamed of the Himalayas but had no one to ride with. Through Bhratra, he connected with 7 other verified enthusiasts. Together, they conquered the Khardung La pass, turning strangers into a lifelong brotherhood.
            </motion.p>

            {/* Action CTAs */}
            <motion.div variants={fadeUpVariants} className="w-full sm:w-auto">
              <CTAButtons />
            </motion.div>

            {/* Dynamic Count-up Stats */}
            <motion.div variants={fadeUpVariants} className="w-full">
              <Stats />
            </motion.div>

          </motion.div>

          {/* Right Column: Floating Composited Grid */}
          <motion.div
            variants={cardsContainerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
          >
            {/* Column 1 */}
            <div className="space-y-6">
              {/* Ladakh Expedition main Card */}
              <motion.div variants={cardItemVariants}>
                <FloatingCard
                  variant="ladakh"
                  delay={0}
                  duration={7}
                  yOffset={shouldReduceMotion ? 0 : 12}
                  rotationOffset={shouldReduceMotion ? 0 : 1.5}
                />
              </motion.div>

              {/* Verified Badge Card */}
              <motion.div variants={cardItemVariants}>
                <FloatingCard
                  variant="verified"
                  delay={0.5}
                  duration={6}
                  yOffset={shouldReduceMotion ? 0 : 10}
                  rotationOffset={shouldReduceMotion ? 0 : -1}
                />
              </motion.div>

              {/* Secure Chat Card */}
              <motion.div variants={cardItemVariants}>
                <FloatingCard
                  variant="chat"
                  delay={1}
                  duration={8}
                  yOffset={shouldReduceMotion ? 0 : 14}
                  rotationOffset={shouldReduceMotion ? 0 : 2}
                />
              </motion.div>
            </div>

            {/* Column 2 (Offset slightly higher on desktop) */}
            <div className="space-y-6 md:mt-8">
              {/* Safe Single-gender Card */}
              <motion.div variants={cardItemVariants}>
                <FloatingCard
                  variant="safe"
                  delay={1.5}
                  duration={6.5}
                  yOffset={shouldReduceMotion ? 0 : 11}
                  rotationOffset={shouldReduceMotion ? 0 : -1.5}
                />
              </motion.div>

              {/* Smart Matching Card */}
              <motion.div variants={cardItemVariants}>
                <FloatingCard
                  variant="matching"
                  delay={2}
                  duration={7.5}
                  yOffset={shouldReduceMotion ? 0 : 13}
                  rotationOffset={shouldReduceMotion ? 0 : 1}
                />
              </motion.div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
