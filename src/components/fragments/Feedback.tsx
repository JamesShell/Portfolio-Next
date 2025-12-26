'use client';

import React, { useRef, useEffect } from 'react';
import { SectionWrapper } from '@/hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '@/utils/motion';
import { testimonials } from '@/constants';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User } from 'lucide-react';
import { nyght } from '@/assets/font';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const Feedback: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    if (!containerRef.current || cardsRef.current.length === 0) return;

    const cards = cardsRef.current;
    const isMobile = window.innerWidth < 768;
    const viewportWidth = window.innerWidth;
    
    // Create a timeline for the arch animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=150%', // Balance between smoothness and no dead zones
        pin: true,
        scrub: 10, // Increased for smoother, less jittery animation
        anticipatePin: 1,
      }
    });

    // Calculate arch path for each card - RIGHT TO LEFT
    cards.forEach((card, index) => {
      // Start position: offscreen RIGHT, at BOTTOM of viewport
      const startX = viewportWidth + 20; // Minimal buffer so they appear sooner
      const startY = isMobile ? 350 : 450; 
      
      // Arch peak position: CENTER of screen, BOTTOM half
      const archX = 0;
      const archHeight = isMobile ? 200 : 250; 
      
      // End position: offscreen LEFT, at BOTTOM of viewport
      const endX = -(viewportWidth + 20); // Minimal buffer
      const endY = isMobile ? 350 : 450; 
      
      // Slight rotation as cards move
      const startRotation = 15;
      const endRotation = -15;

      // Set initial position
      gsap.set(card, {
        x: startX,
        y: startY,
        rotation: startRotation,
        scale: 0.9,
        willChange: 'transform', // Optimization for smoothness
      });

      // Animate along arch path from RIGHT → CENTER (peak) → LEFT
      tl.to(card, {
        scale: 1,
        motionPath: {
          path: [
            { x: startX, y: startY },        // Start: Offscreen right
            { x: archX, y: archHeight },     // Peak: Center bottom
            { x: endX, y: endY }             // End: Offscreen left
          ],
          curviness: 2.5,
        },
        rotation: endRotation,
        duration: 1,
        ease: 'power4.inOut', // Slightly less extreme than expo to reduce start/end delay
      }, index * 0.06); // Reduced staggering to 0.1 as requested
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, { scope: containerRef, dependencies: [] });

  return (
    <div ref={containerRef} className="relative w-full min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Enhanced Section Header - Fixed at top of pinned section */}
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={textVariant({ delay: 0 })}
        className="absolute top-8 left-0 right-0 px-4 sm:px-6 lg:px-8 z-10"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side - Content */}
          <motion.div 
            className="flex-1 items-center text-center"
            variants={fadeIn({ direction: "left", delay: 0.2, duration: 0.8 })}
          >
            <motion.div 
              className="inline-block mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Badge className="flex items-center gap-2 text-muted-foreground font-medium uppercase" size={'xl'}>
                <MessageSquare className="w-3 h-3 text-foreground/60" />
                What others are saying
              </Badge>
            </motion.div>
            
            <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 ${nyght.className}`}>
              Client <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>Feedback</span>
            </h1>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Arching Testimonials */}
      <div className="relative flex justify-center items-center min-h-[400px] w-full">
        {testimonials.map((item: any, index: number) => {
          return (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="absolute"
              style={{ zIndex: testimonials.length - index }}
            >
              <div className="bg-black dark:bg-white backdrop-blur-md border border-zinc-800 dark:border-zinc-200 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 w-[85vw] max-w-[400px] h-[60vh] p-8 sm:p-10 flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 dark:from-black/5 dark:to-black/5 rounded-xl pointer-events-none"></div>
                
                {/* Testimonial Content - TOP LEFT */}
                <div className="relative z-10 flex-1 flex items-start justify-start pt-4">
                  <blockquote className="text-zinc-100 dark:text-zinc-900 leading-relaxed text-lg sm:text-xl font-semibold text-left">
                    "{item.testimonial}"
                  </blockquote>
                </div>
                
                {/* Author Info - BOTTOM */}
                <div className="relative z-10 flex items-center space-x-4 pt-6 border-t border-zinc-800 dark:border-zinc-200">
                  <div className="w-14 h-14 bg-white/10 dark:bg-black/5 backdrop-blur-sm border border-zinc-700/50 dark:border-zinc-300/50 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-white/90 dark:text-black/70" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white dark:text-black font-medium text-lg">{item.name}</h4>
                    {item.company && (
                      <p className="text-zinc-400 dark:text-zinc-500 text-base font-light">{item.company}</p>
                    )}
                  </div>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 via-transparent to-white/5 dark:from-black/5 dark:to-black/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionWrapper(Feedback, 'feedback');
