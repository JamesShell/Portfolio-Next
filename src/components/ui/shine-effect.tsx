"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const ShineEffect = () => {
  const controls = useAnimation();

  useEffect(() => {
    // Define the async function within the effect
    const startShine = async () => {
      while (true) {
        await controls.start({
          backgroundPosition: ["200% 0", "-70% 0"],
          opacity: [0, 0.3, 0],
          transition: {
            duration: 4,
            times: [0, 0.5, 1],
          },
        });
        // Delay before restarting
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    };

    // Call the async function
    startShine();

    // Optional: Clean up if needed
    return () => {
      controls.stop(); // Clean up the animation when component unmounts
    };
  }, [controls]);

  // Start animation on mouse enter
  const handleMouseEnter = () => {
    controls.start({
      backgroundPosition: ["200% 0", "-70% 0"],
      opacity: [0, 0.3, 0],
      transition: {
        duration: 4,
        times: [0, 0.5, 1],
      },
    });
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          filter: "blur(10px)",
          background: `linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 47.5%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0) 52.5%,
            rgba(255, 255, 255, 0.2) 53%,
            rgba(255, 255, 255, 0) 53.5%
          )`,
          backgroundSize: "200% 100%",
          borderRadius: "inherit",
          zIndex: 10,
          pointerEvents: "none",
        }}
        animate={controls}
      />
    </div>
  );
};

export default ShineEffect;
