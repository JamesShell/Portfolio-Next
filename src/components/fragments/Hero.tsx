"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { MonkeyCanvas } from "@/components/canvas";
import { Badge } from "../ui/badge";
import { SegmentedControl } from "../ui/segmented-control";
import { Sun, Moon, Monitor, Star, ArrowRight, CaretDown } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { useBookingModal } from "@/context/BookingModalContext";
import { sendGAEvent } from "@next/third-parties/google";

// Define a type for valid hover states
type HoverState = "" | "about" | "work" | "contact" | "github" | "linkedin" | "twitter" | "dribbble";

const Hero = () => {
  const [hoveredOne, setHoveredOne] = useState<HoverState>("");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { open: openBooking } = useBookingModal();

  // Framer Motion scroll tracking
  const { scrollY } = useScroll();
  
  // Smooth spring physics for buttery animations
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  // All transforms defined at top level (hooks rules compliant)
  // Canvas horizontal offset: starts RIGHT (+25vw), ends CENTER (0vw)
  const canvasTranslateXValue = useTransform(smoothScrollY, [0, 600], [25, 0]);
  // Convert to string with vw unit
  const canvasTranslateX = useTransform(canvasTranslateXValue, (v) => `${v}vw`);
  
  // Canvas opacity: 1 -> 0.3
  const canvasOpacity = useTransform(smoothScrollY, [0, 1000], [1, 0.3]);
  // Canvas vertical offset for parallax
  const canvasTranslateY = useTransform(smoothScrollY, [0, 600], [0, 30]);
  
  // Text content transforms
  const textOpacity = useTransform(smoothScrollY, [0, 400], [1, 0]);
  const textBlurValue = useTransform(smoothScrollY, [0, 400], [0, 8]);
  const textBlur = useTransform(textBlurValue, (v) => `blur(${v}px)`);
  const textTranslateY = useTransform(smoothScrollY, [0, 400], [0, -30]);

  const themeOptions = [
    { value: "light", label: "", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "", icon: <Moon className="w-4 h-4" /> },
    { value: "system", label: "", icon: <Monitor className="w-4 h-4" /> },
  ];

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as "light" | "dark" | "system" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("system");
    }
  }, []);

  // Handle Resize for Desktop check
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    const root = document.documentElement;
    
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const handleThemeChange = (newTheme: string) => {
    const themeValue = newTheme as "light" | "dark" | "system";
    setTheme(themeValue);
    localStorage.setItem('theme', themeValue);
    applyTheme(themeValue);
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        staggerChildren: 0.15,
        delayChildren: 0.1
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.23, 1, 0.320, 1]
      },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { 
        duration: 0.7, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 15
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className="relative w-screen min-h-screen lg:min-h-[100vh] max-w-7xl mx-auto flex items-center"
      style={{ touchAction: "pan-y" }}>

      <motion.div
        initial="hidden"
        animate="visible"
        className="flex flex-col lg:flex-row items-center justify-between w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-0"
        variants={containerVariants}>
        
        {/* Left side - Hero Content */}
        <motion.div 
          className="flex flex-col justify-center z-10 w-full lg:w-1/2 max-w-2xl lg:pr-8"
          variants={itemVariants}
          style={{ 
            opacity: textOpacity,
            filter: textBlur,
            y: textTranslateY
          }}
        >
          {/* Badge */}
          <motion.div variants={badgeVariants}>
            <Badge variant={'default'} size={'xl'} className="mb-6 w-fit font-medium">
              <div className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Available for work
            </Badge>
          </motion.div>

          {/* Headline - forced 2 lines */}
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4 tracking-tight"
            variants={itemVariants}
          >
            <span className="whitespace-nowrap">Fast. Stunning.</span>
            <br />
            <span className="whitespace-nowrap">Built for conversion.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            className="text-base sm:text-lg text-foreground/60 leading-relaxed mb-6 max-w-lg"
            variants={itemVariants}
          >
            I design + build conversion-focused pages for startups and agencies. 
            <span className="text-foreground/80 font-medium block sm:inline sm:ml-1">
              15+ projects shipped • 4 years • 5 stars rating
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 mb-6"
            variants={itemVariants}
          >
            <Button 
              variant="default"
              size="lg" 
              className="font-semibold"
              onClick={openBooking}
              onMouseEnter={() => setHoveredOne("about")}
              onMouseLeave={() => setHoveredOne("")}
            >
              Book a 15-min call
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => {
                sendGAEvent('event', 'secondary_cta_click', { location: 'hero' });
                scrollToPricing();
              }}
              className="font-medium"
              onMouseEnter={() => setHoveredOne("work")}
              onMouseLeave={() => setHoveredOne("")}
            >
              See packages
            </Button>
          </motion.div>

          {/* Microcopy & Proof */}
          <motion.div variants={itemVariants} className="space-y-3">
             <p className="text-sm text-foreground/50">
              Reply within 24 hours • Next slots this week
            </p>

            <div className="flex items-center gap-2 text-sm bg-accent/30 w-fit px-3 py-1.5 rounded-full border border-border/40 backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-foreground/70 italic text-xs sm:text-sm">
                "Delivered beyond expectations, fast and professional."
              </span>
              <span className="text-foreground/50 text-xs sm:text-sm">— Sybelle</span>
            </div>
          </motion.div>

          {/* Theme Selector */}
          <motion.div 
            className="mt-8 lg:mt-12 w-fit"
            variants={itemVariants}
          >
            <SegmentedControl
              options={themeOptions}
              value={theme}
              onChange={handleThemeChange}
              size="sm"
            />
          </motion.div>
        </motion.div>

        {/* Fixed Canvas - Starts RIGHT (+25vw), animates to CENTER (0) */}
        <motion.div 
          className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none will-change-transform overflow-visible"
          style={{
            // Desktop: animated translateX from right to center
            // Mobile: no horizontal offset (centered)
            x: isDesktop ? canvasTranslateX : 0,
          }}
        >
          <motion.div 
            className="relative w-full h-full bg-transparent will-change-transform overflow-visible"
            style={{
              opacity: canvasOpacity,
              y: canvasTranslateY,
              maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
            }}
          >
            <div className="w-full h-full transform translate-y-12 scale-110 lg:scale-100">
              <MonkeyCanvas
                className="w-full h-full invert dark:invert-0 object-contain"
                hovered={hoveredOne}
              />
            </div>
          </motion.div>
        </motion.div>
        
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        style={{ opacity: textOpacity }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <CaretDown className="w-6 h-6 text-foreground/40" weight="bold" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
