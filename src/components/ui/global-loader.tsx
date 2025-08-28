"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalLoaderProps {
  isLoading?: boolean;
  message?: string;
  overlay?: boolean;
  className?: string;
}

// Blinking smiley face component
interface BlinkingSmileyProps {
  animate?: boolean;
}

const BlinkingSmiley: React.FC<BlinkingSmileyProps> = ({ animate = true }) => {
  const [blinkKey, setBlinkKey] = useState(0); // force rerun animation

  useEffect(() => {
    if (!animate) return;

    let timeout: NodeJS.Timeout;

    const scheduleBlink = () => {
      // Random interval between 1s and 2s
      const nextBlink = 1000 + Math.random() * 1000;

      timeout = setTimeout(() => {
        setBlinkKey(prev => prev + 1); // trigger new blink cycle
        scheduleBlink();

        // Sometimes do a quick double blink
        if (Math.random() > 0.7) {
          setTimeout(() => setBlinkKey(prev => prev + 1), 200);
        }
      }, nextBlink);
    };

    scheduleBlink();
    return () => clearTimeout(timeout);
  }, [animate]);

  return (
    <div className="relative w-20 h-20">
      {/* Face Circle */}
      <div className="w-20 h-20 border border-foreground rounded-full bg-background"></div>

      {/* Eyes (animate scaleY instead of resizing) */}
      {animate ? (
        <>
          <motion.div
            key={`left-${blinkKey}`}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-6 left-6 w-3 h-5 bg-foreground rounded-full origin-center"
          />
          <motion.div
            key={`right-${blinkKey}`}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-6 right-6 w-3 h-5 bg-foreground rounded-full origin-center"
          />
        </>
      ) : (
        <>
          <div className="absolute top-6 left-6 w-3 h-1 bg-foreground rounded-full" />
          <div className="absolute top-6 right-6 w-3 h-1 bg-foreground rounded-full" />
        </>
      )}
    </div>
  );
};


// Global loader component
const GlobalLoader: React.FC<GlobalLoaderProps> = ({ 
  isLoading = true, 
  message,
  overlay = true,
  className = ""
}) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`
            ${overlay ? 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm' : 'absolute inset-0'} 
            flex items-center justify-center
            ${className}
          `}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col items-center space-y-4"
          >
            <BlinkingSmiley />
            
            {message && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-foreground/80 text-sm font-medium"
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Page loader component for full-screen loading
const PageLoader: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
  return (
    <GlobalLoader 
      isLoading={true}
      overlay={true}
      className="bg-background"
    />
  );
};

// Inline loader component for sections/components
const InlineLoader: React.FC<{ message?: string; className?: string }> = ({ 
  message, 
  className = "h-32" 
}) => {
  return (
    <GlobalLoader 
      isLoading={true} 
      message={message} 
      overlay={false}
      className={`relative ${className}`}
    />
  );
};

export { GlobalLoader, PageLoader, InlineLoader, BlinkingSmiley };
export default GlobalLoader;