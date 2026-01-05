"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "@/hoc";
import { nyght } from "@/assets/font";
import { 
  Star,
  Lightning
} from "@phosphor-icons/react";

// Card configuration for scroll animation - exaggerated values for dramatic effect
const cardConfigs = [
  { initialRotation: -15, finalRotation: 0, initialX: 300, finalX: 0 },   // Card 1 - far left
  { initialRotation: -5, finalRotation: 0, initialX: 100, finalX: 0 },    // Card 2 - inner left  
  { initialRotation: 5, finalRotation: 0, initialX: -100, finalX: 0 },    // Card 3 - inner right
  { initialRotation: 15, finalRotation: 0, initialX: -300, finalX: 0 },   // Card 4 - far right
];

const Features: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Track scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"] // Animation completes when section reaches center of viewport
  });

  // Track when animation completes
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setAnimationComplete(latest >= 0.9);
  });

  // Transform values for each card (rotation, position, scale, and Y offset)
  const card1Rotation = useTransform(scrollYProgress, [0, 0.85], [cardConfigs[0].initialRotation, cardConfigs[0].finalRotation]);
  const card1X = useTransform(scrollYProgress, [0, 0.85], [cardConfigs[0].initialX, cardConfigs[0].finalX]);
  const card1Scale = useTransform(scrollYProgress, [0, 0.85], [0.8, 1]);
  const card1Y = useTransform(scrollYProgress, [0, 0.85], [60, 0]); // Outer card - more Y offset
  
  const card2Rotation = useTransform(scrollYProgress, [0, 0.85], [cardConfigs[1].initialRotation, cardConfigs[1].finalRotation]);
  const card2X = useTransform(scrollYProgress, [0, 0.85], [cardConfigs[1].initialX, cardConfigs[1].finalX]);
  const card2Scale = useTransform(scrollYProgress, [0, 0.85], [0.8, 1]);
  const card2Y = useTransform(scrollYProgress, [0, 0.85], [20, 0]); // Inner card - less Y offset
  
  const card3Rotation = useTransform(scrollYProgress, [0, 0.85], [cardConfigs[2].initialRotation, cardConfigs[2].finalRotation]);
  const card3X = useTransform(scrollYProgress, [0, 0.85], [cardConfigs[2].initialX, cardConfigs[2].finalX]);
  const card3Scale = useTransform(scrollYProgress, [0, 0.85], [0.8, 1]);
  const card3Y = useTransform(scrollYProgress, [0, 0.85], [20, 0]); // Inner card - less Y offset
  
  const card4Rotation = useTransform(scrollYProgress, [0, 0.85], [cardConfigs[3].initialRotation, cardConfigs[3].finalRotation]);
  const card4X = useTransform(scrollYProgress, [0, 0.85], [cardConfigs[3].initialX, cardConfigs[3].finalX]);
  const card4Scale = useTransform(scrollYProgress, [0, 0.85], [0.8, 1]);
  const card4Y = useTransform(scrollYProgress, [0, 0.85], [60, 0]); // Outer card - more Y offset

  return (
    <div ref={containerRef} className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        > 
          <h2 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 ${nyght.className}`}>
            Built for <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>Results</span>
          </h2>
        </motion.div>

        {/* Cards Layout - Scroll-animated spread */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-4">
          
          {/* Card 1: 4 Years Experience */}
          <motion.div
            style={!animationComplete ? { rotate: card1Rotation, x: card1X, y: card1Y, scale: card1Scale, willChange: 'transform' } : undefined}
            className={`w-[85%] lg:w-[280px] h-[340px] rounded-2xl bg-zinc-100 dark:bg-zinc-200 p-5 flex flex-col relative overflow-hidden group shadow-xl z-[1] origin-bottom transform-gpu ${animationComplete ? "hover:scale-[1.03] hover:z-20 transition-all duration-300" : ""}`}

          >
            {/* Visual: Big 4 */}
            <div className="flex-1 relative flex items-center justify-center">
              <span className={`text-[10rem] font-bold text-zinc-300 select-none leading-none ${nyght.className}`}>
                4
              </span>
            </div>
            
            {/* Title & Description */}
            <div className="mt-auto pt-4 border-t border-zinc-200">
              <h4 className="text-lg font-bold text-zinc-900">Years of Experience</h4>
              <p className="text-xs text-zinc-600 mt-1">
                Bringing seasoned expertise to every project
              </p>
            </div>
          </motion.div>

          {/* Card 2: Fast Turnaround */}
          <motion.div
            style={!animationComplete ? { rotate: card2Rotation, x: card2X, y: card2Y, scale: card2Scale, background: 'radial-gradient(circle at bottom right, #1e1b2e 0%, #18181b 60%)', willChange: 'transform' } : { background: 'radial-gradient(circle at bottom right, #1e1b2e 0%, #18181b 60%)' }}
            className={`w-[85%] lg:w-[280px] h-[340px] rounded-2xl p-5 flex flex-col relative overflow-hidden group shadow-xl z-[2] origin-bottom transform-gpu ${animationComplete ? "hover:scale-[1.03] hover:z-20 transition-all duration-300" : ""}`}

          >
            {/* Visual: Lightning */}
            <div className="flex-1 relative flex items-center justify-center">
              <Lightning className="w-32 h-32 text-zinc-700" weight="fill" />
            </div>
            
            {/* Title & Description */}
            <div className="mt-auto pt-4 border-t border-zinc-800">
              <h4 className="text-lg font-bold text-white">Lightning-Fast Turnaround</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Your requests delivered in days, not weeks or months
              </p>
            </div>
          </motion.div>

          {/* Card 3: Built for Conversions */}
          <motion.div
            style={!animationComplete ? { rotate: card3Rotation, x: card3X, y: card3Y, scale: card3Scale, willChange: 'transform' } : undefined}
            className={`w-[85%] lg:w-[280px] h-[340px] rounded-2xl bg-zinc-100 dark:bg-zinc-200 p-5 flex flex-col relative overflow-hidden group shadow-xl z-[3] origin-bottom transform-gpu ${animationComplete ? "hover:scale-[1.03] hover:z-20 transition-all duration-300" : ""}`}

          >
            {/* Visual: Simple conversion funnel */}
            <div className="flex-1 relative flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                {/* Funnel bars */}
                <div className="w-32 h-4 bg-zinc-300 rounded-sm" />
                <div className="w-24 h-4 rounded-sm" style={{ backgroundColor: '#c4c4c4' }} />
                <div className="w-16 h-4 bg-zinc-400 rounded-sm" />
                <div className="w-10 h-4 bg-zinc-500 rounded-sm" />
                <div className="w-6 h-4 bg-zinc-900 rounded-sm" />
              </div>
            </div>
            
            {/* Title & Description */}
            <div className="mt-auto pt-4 border-t border-zinc-200">
              <h4 className="text-lg font-bold text-zinc-900">Built for Conversions</h4>
              <p className="text-xs text-zinc-600 mt-1">
                Turn visitors into paying customers
              </p>
            </div>
          </motion.div>

          {/* Card 4: Affordable Excellence */}
          <motion.div
            style={!animationComplete ? { rotate: card4Rotation, x: card4X, y: card4Y, scale: card4Scale, background: 'radial-gradient(circle at bottom right, #1e1b2e 0%, #18181b 60%)', willChange: 'transform' } : { background: 'radial-gradient(circle at bottom right, #1e1b2e 0%, #18181b 60%)' }}
            className={`w-[85%] lg:w-[280px] h-[340px] rounded-2xl p-5 flex flex-col relative overflow-hidden group shadow-xl z-[4] origin-bottom transform-gpu ${animationComplete ? "hover:scale-[1.03] hover:z-20 transition-all duration-300" : ""}`}

          >
            {/* Visual: Savings indicator */}
            <div className="flex-1 relative flex flex-col items-center justify-center">
              <p className="text-sm font-medium text-zinc-500 mb-3">Your Savings</p>
              
              {/* Simple upward trend */}
              <div className="w-full h-20 relative px-4">
                <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="greenFade" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Dashed baseline */}
                  <line x1="0" y1="45" x2="200" y2="45" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 2" />
                  
                  {/* Area fill under the line */}
                  <path 
                    d="M0 50 Q50 45 80 35 T140 20 T200 8 L200 60 L0 60 Z" 
                    fill="url(#greenFade)"
                  />
                  
                  {/* Line */}
                  <path 
                    d="M0 50 Q50 45 80 35 T140 20 T200 8" 
                    fill="none" 
                    stroke="#22c55e" 
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  
                  {/* End dot */}
                  <circle cx="200" cy="8" r="4" fill="#22c55e" />
                </svg>
              </div>
            </div>
            
            {/* Title & Description */}
            <div className="mt-auto pt-4 border-t border-zinc-800">
              <h4 className="text-lg font-bold text-white">Affordable Excellence</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Premium quality without the agency price tag
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Features, "benefits");

