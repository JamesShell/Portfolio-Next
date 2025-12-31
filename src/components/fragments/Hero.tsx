import React, { useState } from "react";
import { motion } from "framer-motion";
import { MonkeyCanvas, StarsCanvas } from "@/components/canvas";
import DoubleOutlinedCard from "@/components/ui/double-outlined-card";
import { TextEffect } from "@/components/ui/text-effect";
import { nyght } from "@/assets/font";
import { Badge } from "../ui/badge";
import { SocialLinks } from "../ui/social-links";
import { SegmentedControl } from "../ui/segmented-control";
import { Sun, Moon, Monitor } from "@phosphor-icons/react";


// Define a type for valid hover states
type HoverState = "" | "about" | "work" | "contact" | "github" | "linkedin" | "twitter" | "dribbble";

const Hero = () => {
  const [hoveredOne, setHoveredOne] = useState<HoverState>("");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [scrollY, setScrollY] = useState(0);
  // const navItems: HoverState[] = ["about", "work", "contact"];

  const themeOptions = [
    { value: "light", label: "", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "", icon: <Moon className="w-4 h-4" /> },
    { value: "system", label: "", icon: <Monitor className="w-4 h-4" /> },
  ];

  // Load theme from localStorage on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as "light" | "dark" | "system" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("system");
    }
  }, []);

  // Scroll handler
  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme handler with localStorage persistence
  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    const root = document.documentElement;
    
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        staggerChildren: 0.2,
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
        ease: [0.23, 1, 0.320, 1] // Custom cubic-bezier for smoother animation
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

  const navigationVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        staggerChildren: 0.1
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div
      className="relative w-screen h-screen max-w-6xl mx-auto"
      style={{ touchAction: "pan-y" }}>

      <motion.div
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center h-full w-full mt-18 lg:mt-0"
        variants={containerVariants}>
        
        <div className="w-full h-full max-w-6xl relative overflow-visible">

          <div className="flex flex-col md:flex-row justify-end gap-8 md:justify-between px-4 sm:px-6 lg:px-4 pb-12 lg:pb-0 items-start md:items-center h-full w-full">
            {/* Left side - Description */}
            <motion.div 
              className="text-left flex flex-col justify-center z-10"
              variants={itemVariants}
            >
              <motion.div variants={badgeVariants}>
                <Badge variant={'default'} size={'xl'} className="mb-4 w-fit font-medium">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Available for work
                </Badge>
              </motion.div>
              <motion.div 
                className="text-lg text-foreground/50 leading-relaxed"
                variants={itemVariants}
              >
                <h1 className="sr-only">Ettouzany - Full Stack Developer</h1>
                <div>
                  Full-stack developer with
                </div>
                <br/>
                <div className="mb-4 -mt-6">
                  4 years experience
                </div>
                <div>
                  building user-friendly web apps
                </div>
              </motion.div>
              <motion.div 
                className="mt-4 w-fit"
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

            {/* Right side - Navigation and Social Links */}
            <motion.div 
              className="flex flex-row-reverse md:flex-col items-center gap-6 justify-between md:justify-center z-10 w-full md:w-auto"
              variants={navigationVariants}
            >
              {/* Social Links - without theme control */}
              <motion.div variants={navItemVariants}>
                <SocialLinks 
                  className="flex-col absolute sm:relative bottom-4 right-4 sm:bottom-0 sm:right-0 sm:flex-row" 
                  onHover={(hovered) => setHoveredOne(hovered as HoverState)}
                />
              </motion.div>


            </motion.div>
          </div>

          {/* Central canvas - full screen and centered */}
          <div className="fixed inset-0 w-full h-full flex items-center justify-center">
            <div 
              className={`relative w-full h-full bg-transparent -z-10 transition-all duration-300 ease-out ${scrollY > 200 ? "blur-sm" : ""}` }
              style={{
                maskImage: 'linear-gradient(to top, transparent 10%, black 25%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to top, transparent 10%, black 25%, black 100%)',
                opacity: Math.max(0.3, 1 - scrollY / 800)
              }}
            >
              <MonkeyCanvas
                className="w-full h-screen invert dark:invert-0"
                hovered={hoveredOne}
              />
            </div>
          </div>
            
            {/* Large name positioned absolute bottom center */}
            

          {/* Navigation items */}
          {/* <div className="flex justify-center gap-8">
            {navItems.map((item) => (
              <div
                key={item}
                onMouseEnter={() => setHoveredOne(item)}
                onMouseLeave={() => setHoveredOne("")}
                className="cursor-pointer transition-colors duration-200 hover:text-secondary">
                <TextEffect as="a" preset="fade" per="char" href={`#${item}`} className="text-xl font-medium">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </TextEffect>
              </div>
            ))}
          </div> */}
        </div>
        
      </motion.div>
    </div>
  );
};

export default Hero;
