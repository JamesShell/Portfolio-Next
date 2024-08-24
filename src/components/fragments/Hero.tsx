import React, { useState } from "react";
import { motion } from "framer-motion";
import { MonkeyCanvas } from "@/components/canvas";
import DoubleOutlinedCard from "@/components/ui/double-outlined-card";
import { TextEffect } from "@/components/ui/text-effect";

// Define a type for valid hover states
type HoverState = "" | "about" | "work" | "contact";

const Hero = () => {
  const [hoveredOne, setHoveredOne] = useState<HoverState>("");
  const navItems: HoverState[] = ["about", "work", "contact"];

  const containerVariants = {
    hidden: { opacity: 0, y: 500 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 2, ease: "easeOut" },
    },
  };

  return (
    <div
      className="relative w-screen container"
      style={{ touchAction: "pan-y" }}>
      <motion.div
        initial="hidden"
        animate="visible"
        className="relative faded mt-36"
        variants={containerVariants}>
        <DoubleOutlinedCard>
          <h1 className="text-5xl font-bold text-foreground">
            Hi, I&apos;m <span className="text-secondary glow-text">Ettouzany</span>
          </h1>
          <TextEffect as="p" per="word" preset="fade" className="mt-2 text-xl text-foreground/60">
            Full-stack developer with 3 years experience building user-friendly
            web apps.
          </TextEffect>

          <div className="relative flex flex-row items-center -mt-12 md:mt-0 justify-start md:items-center w-full h-full">
            <ul className="absolute md:relative side-nav w-full md:w-2/12 text-3xl font-semibold text-foreground gap-3 flex flex-col ml-5">
              {navItems.map((item) => (
                <li
                  key={item}
                  onMouseEnter={() => setHoveredOne(item)}
                  onMouseLeave={() => setHoveredOne("")}
                  className="cursor-pointer">
                  <TextEffect as="a" preset="fade" per="char" href={`#${item}`}>{item.charAt(0).toUpperCase() + item.slice(1)}</TextEffect>
                </li>
              ))}
            </ul>
            <MonkeyCanvas
              className="absolute md:relative inset-0 md:z-[1] z-[-1] w-full md:w-10/12 md:h-full md:top-0 md:left-0"
              hovered={hoveredOne}
            />
          </div>
        </DoubleOutlinedCard>
      </motion.div>
    </div>
  );
};

export default Hero;
