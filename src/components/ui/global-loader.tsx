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
const BlinkingSmiley: React.FC = () => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 500 + Math.random() * 500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Fallback for SSR
  if (!isMounted) {
    return (
      <div className="relative w-20 h-20">
        <div className="w-20 h-20 border-2 border-foreground rounded-full bg-background"></div>
        <div className="absolute top-6 left-6 w-3 h-5 bg-foreground rounded-full"></div>
        <div className="absolute top-6 right-6 w-3 h-5 bg-foreground rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="relative w-20 h-20">
      {/* Face Circle */}
      <div className="w-20 h-20 border-2 border-foreground rounded-full bg-background"></div>
      
      {/* Left Eye */}
      <div 
        className={`absolute top-6 left-6 bg-foreground transition-all duration-150 ${
          isBlinking ? 'w-3 h-0.5 rounded-full' : 'w-3 h-5 rounded-full'
        }`}
      ></div>
      
      {/* Right Eye */}
      <div 
        className={`absolute top-6 right-6 bg-foreground transition-all duration-150 ${
          isBlinking ? 'w-3 h-0.5 rounded-full' : 'w-3 h-5 rounded-full'
        }`}
      ></div>
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
      message={message} 
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