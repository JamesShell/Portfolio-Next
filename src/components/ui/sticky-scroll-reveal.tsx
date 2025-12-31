"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import IconCanvas, { IconKey } from "../canvas/Icons";

const TEXT_COLORS = [
  "var(--chart-2)", // matching your ICONS_COLORS for about
  "var(--chart-3)", // work
  "var(--chart-4)", // contact
  "var(--chart-1)", // fallback
];

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    icon?: IconKey;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const [rotationValue, setRotationValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const clamped = Math.min(Math.max(latest, 0), 1);
    setRotationValue(clamped);

    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(clamped - breakpoint);
        return distance < Math.abs(clamped - cardsBreakpoints[acc]) ? index : acc;
      },
      0
    );

    setActiveCard(closestBreakpointIndex);
  });

  // Update CSS variable for glowing text color based on active card
  useEffect(() => {
    const color = TEXT_COLORS[activeCard % TEXT_COLORS.length] ?? TEXT_COLORS[0];
    document.documentElement.style.setProperty("--glowing-text-color", color);
    return () => {
      document.documentElement.style.setProperty("--glowing-text-color", TEXT_COLORS[0]);
    };
  }, [activeCard]);

  return (
    <div
      ref={ref}
      className="relative flex h-[40rem] w-full flex-col lg:flex-row overflow-y-auto my-6 px-16 hide-scrollbar fade-scroll-mask lg:my-10 lg:px-24 bg-transparent"
    >
      {/* Icon Background for Mobile */}
      <div className="sticky h-[80rem] inset-0 z-0 flex items-center justify-center lg:hidden">
        {content[activeCard]?.icon && (
          <IconCanvas
            icon={content[activeCard].icon!}
            rotationValue={rotationValue}
            className="opacity-10 blur-sm w-full h-full"
          />
        )}
      </div>

      {/* Text Section */}
      <div className="relative z-10 w-full lg:w-2/3 px-2 lg:px-4">
        {content.map((item, index) => (
          <div key={item.title + index} className="my-20">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: activeCard === index ? 1 : 0.3 }}
              className="text-2xl lg:text-4xl font-bold"
            >
              {item.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: activeCard === index ? 1 : 0.3 }}
              className="mt-6 text-base lg:text-lg text-foreground/60 max-w-xl leading-relaxed"
            >
              {item.description}
            </motion.p>
          </div>
        ))}
        <div className="h-40" />
      </div>

      {/* Icon Section for Desktop */}
      <div
        className={cn(
          "sticky -top-10 hidden lg:flex w-1/3 items-start justify-start z-10",
          contentClassName
        )}
      >
        <div className="w-full max-w-md h-[28rem] flex items-center justify-center">
          {content[activeCard]?.icon && (
            <IconCanvas
              icon={content[activeCard].icon!}
              rotationValue={rotationValue}
            />
          )}
        </div>
      </div>
    </div>
  );
};
