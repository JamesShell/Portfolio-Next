"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "@/hoc";
import { nyght } from "@/assets/font";
import { 
  TreeStructure, 
  PaintBrush, 
  RocketLaunch,
  ArrowRight
} from "@phosphor-icons/react";

// Animated Sitemap/Blueprint Illustration (Monochrome, Clear Tree)
const SitemapAnimation: React.FC = () => {
  return (
    <div className="w-full h-32 flex items-center justify-center">
      <motion.svg 
        viewBox="0 0 120 80" 
        className="w-full h-full max-w-[120px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        {/* Root Node */}
        <motion.rect
          x="45" y="10" width="30" height="20" rx="4"
          fill="none" stroke="currentColor" strokeWidth="2"
          className="text-zinc-600 dark:text-zinc-400"
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { 
              scale: 1, 
              opacity: 1,
              transition: { 
                duration: 0.4, 
                delay: 0.2,
                repeat: Infinity,
                repeatDelay: 4.5,
                repeatType: "reverse"
              }
            }
          }}
        />
        {/* Vertical Line from Root */}
        <motion.path
          d="M60 30 L60 45"
          fill="none" stroke="currentColor" strokeWidth="2"
          className="text-zinc-400 dark:text-zinc-600"
          variants={{
             hidden: { pathLength: 0, opacity: 0 },
             visible: { 
               pathLength: 1, 
               opacity: 1,
               transition: { 
                 duration: 0.4, 
                 delay: 0.6,
                 repeat: Infinity,
                 repeatDelay: 4.1,
                 repeatType: "reverse"
               }
             }
          }}
        />
        {/* Horizontal Branch Line */}
        <motion.path
          d="M30 45 L90 45"
          fill="none" stroke="currentColor" strokeWidth="2"
          className="text-zinc-400 dark:text-zinc-600"
          variants={{
             hidden: { pathLength: 0, opacity: 0 },
             visible: { 
               pathLength: 1, 
               opacity: 1,
               transition: { 
                 duration: 0.4, 
                 delay: 1.0,
                 repeat: Infinity,
                 repeatDelay: 3.7,
                 repeatType: "reverse"
               }
             }
          }}
        />
        {/* Connection Lines to Children */}
        <motion.path
          d="M30 45 L30 55 M60 45 L60 55 M90 45 L90 55"
          fill="none" stroke="currentColor" strokeWidth="2"
          className="text-zinc-400 dark:text-zinc-600"
          variants={{
             hidden: { pathLength: 0, opacity: 0 },
             visible: { 
               pathLength: 1, 
               opacity: 1,
               transition: { 
                 duration: 0.4, 
                 delay: 1.4,
                 repeat: Infinity,
                 repeatDelay: 3.3,
                 repeatType: "reverse"
               }
             }
          }}
        />
        {/* Child Nodes */}
        {[0, 1, 2].map((i) => (
          <motion.rect
            key={i}
            x={15 + i * 30} y="55" width="30" height="18" rx="3"
            fill="none" stroke="currentColor" strokeWidth="2"
            className="text-zinc-600 dark:text-zinc-400"
            variants={{
              hidden: { scale: 0, opacity: 0 },
              visible: { 
                scale: 1, 
                opacity: 1,
                transition: { 
                  duration: 0.3, 
                  delay: 1.8 + i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 3.0 - i * 0.1, 
                  repeatType: "reverse"
                }
              }
            }}
          />
        ))}
      </motion.svg>
    </div>
  );
};

// Animated Design Sprint Illustration (Monochrome + Cursor)
const DesignAnimation: React.FC = () => {
  return (
    <div className="w-full h-32 flex items-center justify-center">
      <motion.svg 
        viewBox="0 0 120 80" 
        className="w-full h-full max-w-[120px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        {/* Canvas/artboard outline */}
        <motion.rect
          x="10" y="5" width="80" height="60" rx="4"
          fill="none" stroke="currentColor" strokeWidth="2"
          className="text-zinc-400 dark:text-zinc-600"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { 
              pathLength: 1, 
              opacity: 1,
              transition: { 
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 4.5,
                repeatType: "reverse"
              }
            }
          }}
        />
        
        {/* Wireframe Blocks */}
        {[
          { x: 15, y: 10, w: 70, h: 12, delay: 0.4 }, // Header
          { x: 15, y: 26, w: 30, h: 34, delay: 0.6 }, // Sidebar
        ].map((block, i) => (
          <motion.rect
            key={i}
            x={block.x} y={block.y} width={block.w} height={block.h} rx="2"
            className="fill-zinc-200 dark:fill-zinc-700"
            variants={{
              hidden: { scale: 0, opacity: 0 },
              visible: { 
                scale: 1, 
                opacity: 1,
                transition: { 
                  duration: 0.3, 
                  delay: block.delay,
                  repeat: Infinity,
                  repeatDelay: 4.7 - block.delay,
                  repeatType: "reverse"
                }
              }
            }}
            style={{ transformOrigin: `${block.x}px ${block.y}px` }}
          />
        ))}

        {/* The block being placed by cursor */}
        <motion.rect
          x="50" y="26" width="35" height="34" rx="2"
          className="fill-zinc-300 dark:fill-zinc-600"
          variants={{
             hidden: { x: 10, y: 10, opacity: 0, scale: 0.8 },
             visible: { 
               x: 0, 
               y: 0, 
               opacity: 1,
               scale: 1,
               transition: { 
                 duration: 0.5, 
                 delay: 1.0,
                 repeat: Infinity,
                 repeatDelay: 3.5,
                 repeatType: "reverse"
               }
             }
          }}
        />

        {/* Mouse Cursor */}
        <motion.path
          d="M0 0 L12 12 L16.5 7 L 0 0" 
          fill="currentColor" 
          className="text-zinc-800 dark:text-zinc-200"
          variants={{
            hidden: { x: 100, y: 70, opacity: 0 },
            visible: { 
               x: [100, 60, 60, 100], 
               y: [70, 40, 40, 70],
               opacity: [0, 1, 1, 0],
               transition: {
                 duration: 2.0,
                 delay: 0.8,
                 times: [0, 0.4, 0.6, 1],
                 repeat: Infinity,
                 repeatDelay: 3.0,
               }
            }
          }}
        />
      </motion.svg>
    </div>
  );
};

// Animated Build/Launch/Handoff Illustration (Terminal -> Browser -> Rocket)
const LaunchAnimation: React.FC = () => {
  return (
    <div className="w-full h-32 flex items-center justify-center">
      <motion.svg 
        viewBox="0 0 120 80" 
        className="w-full h-full max-w-[120px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        {/* Browser Window Frame */}
        <motion.rect
          x="20" y="10" width="80" height="60" rx="4"
          fill="none" stroke="currentColor" strokeWidth="2"
          className="text-zinc-400 dark:text-zinc-600"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { 
              pathLength: 1, 
              opacity: 1,
              transition: { 
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 4.5,
                repeatType: "reverse"
              }
            }
          }}
        />
        
        {/* Toggle: Code Lines (Build) -> UI Blocks (Launch) */}
        {/* Code Lines: Fade In then Fade Out */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: [0, 1, 1, 0],
              transition: { 
                duration: 2.0, 
                delay: 0.5,
                times: [0, 0.2, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 3.0
              } 
            }
          }}
        >
          <rect x="26" y="20" width="30" height="4" rx="2" className="fill-zinc-300 dark:fill-zinc-600" />
          <rect x="26" y="28" width="50" height="4" rx="2" className="fill-zinc-300 dark:fill-zinc-600" />
          <rect x="26" y="36" width="40" height="4" rx="2" className="fill-zinc-300 dark:fill-zinc-600" />
          <rect x="26" y="44" width="20" height="4" rx="2" className="fill-zinc-300 dark:fill-zinc-600" />
        </motion.g>

        {/* UI Blocks: Fade In after Code */}
        <motion.g
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { 
              opacity: [0, 1, 1, 0],
              scale: [0.95, 1, 1, 0.95],
              transition: { 
                duration: 2.0, 
                delay: 2.5, // Starts after code fades out
                times: [0, 0.2, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1.0
              } 
            }
          }}
          style={{ transformOrigin: "60px 40px" }}
        >
           {/* Header */}
           <rect x="25" y="18" width="70" height="10" rx="2" className="fill-zinc-300 dark:fill-zinc-500" />
           {/* Hero */}
           <rect x="25" y="32" width="70" height="25" rx="2" className="fill-zinc-200 dark:fill-zinc-700" />
           {/* Button */}
           <rect x="45" y="42" width="30" height="6" rx="3" className="fill-zinc-400 dark:fill-zinc-400" />
        </motion.g>

        {/* Rocket Icon Launching */}
        <motion.g
           variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { 
              y: [20, 0, -60], 
              opacity: [0, 1, 0],
              transition: { 
                duration: 1.5, 
                delay: 4.0, // Launches after UI is shown
                times: [0, 0.2, 1],
                repeat: Infinity,
                repeatDelay: 3.5
              } 
            }
          }}
        >
           {/* Simple Rocket Shape */}
           <path d="M60 25 C60 25 50 45 50 55 C50 60 54 65 60 65 C66 65 70 60 70 55 C70 45 60 25 60 25 Z" className="fill-zinc-800 dark:fill-zinc-200" />
           <path d="M50 55 L45 65 L52 62" className="fill-zinc-600 dark:fill-zinc-400" />
           <path d="M70 55 L75 65 L68 62" className="fill-zinc-600 dark:fill-zinc-400" />
           <circle cx="60" cy="45" r="3" className="fill-white dark:fill-black" />
        </motion.g>
      </motion.svg>
    </div>
  );
};

const steps = [
  {
    number: "01",
    Animation: SitemapAnimation,
    title: "Kickoff & Site Map",
    description: "We start with a short call and a clear plan. You'll know exactly which pages we're building, what each page needs to do, and what we're launching first—before any design work starts.",
  },
  {
    number: "02",
    Animation: DesignAnimation,
    title: "Design Sprint (No Templates)",
    description: "I design your homepage from a blank canvas, then we tighten it through fast feedback until it looks and reads like your brand—not a theme with swapped colors.",
  },
  {
    number: "03",
    Animation: LaunchAnimation,
    title: "Build → Launch → Handoff",
    description: "Once the design is approved, I build the site, test it on real screen sizes, connect the essentials, and hand it over in a way you can update without chasing a developer.",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <div className="relative py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Badge 
              variant="default" 
              size="xl" 
              className="text-muted-foreground uppercase"
            >
              <RocketLaunch className="w-3 h-3 mr-2" weight="bold" />
              How It Works
            </Badge>
          </motion.div>
          
          <h2 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 ${nyght.className}`}>
            Simple <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>Process</span>
          </h2>
          
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            From idea to launch in three simple steps. No complexity, just results.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const StepAnimation = step.Animation;
            
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.15,
                }}
              >
                {/* Outer Card Container */}
                <div className="h-full rounded-[2rem] p-3 border bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
                  {/* Inner Frame */}
                  <div className="relative h-full rounded-[1.5rem] p-6 border overflow-hidden bg-white border-zinc-200 shadow-[0_0_0_3px_#fafafa,0_0_0_4px_rgba(0,0,0,0.08)] dark:bg-zinc-900 dark:border-zinc-700 dark:shadow-[0_0_0_3px_#27272a,0_0_0_4px_rgba(255,255,255,0.08)]">
                    {/* Top gradient (Monochrome) */}
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-zinc-100/50 dark:from-zinc-800/20 via-zinc-50/30 dark:via-zinc-900/10 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10">
                      {/* Step number */}
                      <span className={`text-5xl font-bold text-zinc-200 dark:text-zinc-700 ${nyght.className}`}>
                        {step.number}
                      </span>
                      
                      {/* Animated Illustration */}
                      <motion.div
                        className="my-4"
                      >
                        <StepAnimation />
                      </motion.div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-foreground/50 flex items-center justify-center gap-2">
            Ready to start? <ArrowRight className="w-4 h-4" weight="bold" /> Check out the pricing below
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(HowItWorks, "process");
