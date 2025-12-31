"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sun, Moon, ChatCircle, GithubLogo, LinkedinLogo, TwitterLogo, DribbbleLogo } from "@phosphor-icons/react";
import { SegmentedControl } from "./segmented-control";
import { cn } from "@/lib/utils";
import { socialLinks as SL } from "@/constants";
// FaDribbble replaced with DribbbleLogo from phosphor-icons above

interface SocialLink {
  id: number;
  name: string;
  handle: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

interface SocialLinksProps {
  className?: string;
  theme?: "light" | "dark" | "system";
  onThemeChange?: (theme: "light" | "dark" | "system") => void;
  onHover?: (hovered: string) => void;
}

const socialLinks: SocialLink[] = [
  {
    id: 1,
    name: "GitHub",
    handle: SL.github.handle,
    icon: <GithubLogo className="w-5 h-5" weight="fill" />,
    href: SL.github.link,
    color: "#333",
  },
  {
    id: 2,
    name: "LinkedIn",
    handle: SL.linkedin.handle,
    icon: <LinkedinLogo className="w-5 h-5" weight="fill" />,
    href: SL.linkedin.link,
    color: "#0077b5",
  },
  {
    id: 3,
    name: "Twitter",
    handle: SL.twitter.handle,
    icon: <TwitterLogo className="w-5 h-5" weight="fill" />,
    href: SL.twitter.link,
    color: "#1da1f2",
  },
  {
    id: 5,
    name: "Dribbble",
    handle: SL.dribble.handle,
    icon: <DribbbleLogo className="w-5 h-5" weight="fill" />,
    href: SL.dribble.link,
    color: "#ea4c89",
  },
];

const themeOptions = [
  { value: "light", label: "", icon: <Sun className="w-4 h-4" weight="fill" /> },
  { value: "dark", label: "", icon: <Moon className="w-4 h-4" weight="fill" /> },
  { value: "system", label: "", icon: <div className="w-4 h-4 rounded-full border-2 border-current border-l-transparent" /> },
];

const SocialIcon: React.FC<{ item: SocialLink; index: number; onHover?: (hovered: string) => void }> = ({ item, index, onHover }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const x = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 15 };
  
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate relative position from center (-1 to 1)
    const relativeX = (event.clientX - centerX) / (rect.width / 2);
    const relativeY = (event.clientY - centerY) / (rect.height / 2);
    
    // Apply stronger movement
    x.set(relativeX * 50); // Increased from default range
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => {
        setHoveredIndex(item.id);
        if (onHover) onHover(item.name.toLowerCase());
      }}
      onMouseLeave={() => {
        setHoveredIndex(null);
        if (onHover) onHover("");
      }}
    >
      <AnimatePresence>
        {hoveredIndex === item.id && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 10,
              },
            }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            style={{
              translateX: translateX,
              rotate: rotate,
              whiteSpace: "nowrap",
            }}
            className="absolute -top-16 z-50 -left-8 -translate-x-1/2 flex flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
          >
            <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
            <div className="relative z-30 text-base font-bold text-white">
              {item.name}
            </div>
            <div className="text-xs text-white">{item.handle}</div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        className="flex h-12 w-12 backdrop-blur-md items-center justify-center rounded-full bg-muted/50 backdrop-blur-sm border border-border/20 transition-all duration-300 hover:bg-muted hover:border-border/40 hover:shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="text-muted-foreground group-hover:text-foreground transition-colors">
          {item.icon}
        </div>
      </motion.a>
    </div>
  );
};

export const SocialLinks: React.FC<SocialLinksProps> = ({
  className,
  onHover,
}) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {socialLinks.map((item, index) => (
        <SocialIcon key={item.id} item={item} index={index} onHover={onHover} />
      ))}
    </div>
  );
};