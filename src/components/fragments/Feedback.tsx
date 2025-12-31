"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SectionWrapper } from '@/hoc';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { textVariant } from '@/utils/motion';
import { testimonials, Testimonial } from '@/constants';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { nyght } from '@/assets/font';

// Reusable Testimonial Card Component (Unchanged)
const TestimonialCard: React.FC<{ testimonial: Testimonial; className?: string }> = ({ testimonial, className = "" }) => (
  <div className={`bg-zinc-50 dark:bg-zinc-900 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 flex flex-col justify-between h-full min-h-[400px] text-left mx-2 select-none ${className}`}>
    <div>
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className="w-5 h-5 text-zinc-900 fill-zinc-900 dark:text-amber-500 dark:fill-amber-500" 
          />
        ))}
      </div>

      <blockquote className="text-zinc-900 dark:text-zinc-100 leading-relaxed text-xl sm:text-2xl font-medium">
        "{testimonial.testimonial}"
      </blockquote>
    </div>
    
    <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
      <div className="w-14 h-14 bg-black/5 dark:bg-white/10 backdrop-blur-sm border border-zinc-300/50 dark:border-zinc-700/50 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="w-6 h-6 text-black/70 dark:text-white/90" />
      </div>
      <div className="text-left">
        <h4 className="text-black dark:text-white font-semibold text-lg">
          {testimonial.name}
        </h4>
        {testimonial.company && (
          <p className="text-zinc-500 dark:text-zinc-400 text-base">
            {testimonial.company}
          </p>
        )}
      </div>
    </div>
  </div>
);

const Feedback: React.FC = () => {
  // Triple the data for infinite loop buffer
  // [Set 1 (buffer)] [Set 2 (main)] [Set 3 (buffer)]
  const displayTestimonials = [...testimonials, ...testimonials, ...testimonials];
  
  // Start in the middle set
  const startIndex = testimonials.length; 
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const controls = useAnimation();
  const CARD_WIDTH_PERCENT = 40; // Desktop grid width (2.5 items)
  
  // Dynamic card width based on screen size could be handled via CSS/responsive logic,
  // but for simplicity in Framer Motion x-calculation, we'll assume the desktop logic mostly.
  // For mobile, we might want 100%.
  // We can use a simple check or just CSS classes forcing width.
  // But motion 'x' percent depends on the item width.
  // If item is 100% on mobile, shift is 100%. If 40% on desktop, shift is 40%.
  // Let's use a state or ref for screen width? Or strictly use % and let CSS handle the width.
  // If I move container -40%, and items are 40%, it moves 1 item.
  // If items are 100% (mobile), I need to move -100%.
  // Solution: Responsive shift amount.
  
  const [slidePercent, setSlidePercent] = useState(100);
  const skipAnimation = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setSlidePercent(window.innerWidth >= 768 ? 40 : 100);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
        handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex, slidePercent]);

  const handleNext = () => {
    if (isTransitioning) return;
    skipAnimation.current = false;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => { 
    if (isTransitioning) return;
    skipAnimation.current = false;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  };

  const onAnimationComplete = () => {
    setIsTransitioning(false);
    const totalOriginal = testimonials.length;
    
    // Snap logic
    if (currentIndex >= startIndex + totalOriginal) {
      skipAnimation.current = true;
      setCurrentIndex(currentIndex - totalOriginal);
    }
    if (currentIndex < startIndex) {
        skipAnimation.current = true;
        setCurrentIndex(currentIndex + totalOriginal);
    }
  };

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsAutoPlaying(false);
    if (info.offset.x < -50) {
        handleNext();
    } else if (info.offset.x > 50) {
        handlePrev();
    }
  };

  return (
    <div className="relative w-full py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Section Header */}
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={textVariant({ delay: 0 })}
        className="text-center mb-12"
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
          Partners <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>Feedback</span>
        </h1>
      </motion.div>
      
      {/* Carousel Container */}
      <div 
        className="relative max-w-[1400px] mx-auto px-4"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      > 
        {/* Navigation Arrows (Desktop) */}
        <div className="hidden md:flex justify-end gap-2 mb-4 pr-4">
           <button 
             onClick={() => { setIsAutoPlaying(false); handlePrev(); }}
             className="z-10 w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
           >
             <ChevronLeft className="w-6 h-6" />
           </button>
           <button 
             onClick={() => { setIsAutoPlaying(false); handleNext(); }}
             className="z-10 w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
           >
             <ChevronRight className="w-6 h-6" />
           </button>
        </div>


        {/* Track */}
        <div className="overflow-hidden md:overflow-visible md:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div 
            className="flex cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }} 
            dragElastic={0.05}
            onDragEnd={onDragEnd}
            animate={{
              x: `-${currentIndex * slidePercent}%`
            }}
            transition={{ 
                duration: skipAnimation.current ? 0 : 0.5,
                ease: "easeInOut",
                type: skipAnimation.current ? "tween" : "spring",
                stiffness: 300, 
                damping: 30 
            }}
            onAnimationComplete={onAnimationComplete}
          >
            {displayTestimonials.map((testimonial, index) => (
              <motion.div 
                key={`${index}-${testimonial.name}`}
                className="flex-shrink-0 w-full md:w-[40%] px-2 transition-opacity duration-300"
              >
                 <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Mobile Controls */}
      <div className="flex md:hidden justify-center gap-4 mt-8">
           <button onClick={() => { setIsAutoPlaying(false); handlePrev(); }} className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
             <ChevronLeft className="w-5 h-5" />
           </button>
           <button onClick={() => { setIsAutoPlaying(false); handleNext(); }} className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
             <ChevronRight className="w-5 h-5" />
           </button>
      </div>

    </div>
  );
};

export default SectionWrapper(Feedback, 'testimonials');
