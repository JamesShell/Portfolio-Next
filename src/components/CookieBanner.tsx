"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already acknowledged
    const hasAcknowledged = localStorage.getItem('cookie-acknowledged');
    if (!hasAcknowledged) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-acknowledged', 'true');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 max-w-md"
        >
          <div className="relative rounded-2xl bg-zinc-900 dark:bg-zinc-950 p-6 shadow-2xl border border-zinc-800 dark:border-zinc-700">
            <div className="space-y-4">
              <p className="text-white text-sm leading-relaxed">
                This website uses cookies to ensure you get the best experience on our website.{' '}
                <Link 
                  href="/cookies" 
                  className="text-white underline hover:text-zinc-300 transition-colors font-medium"
                >
                  Cookies Policy
                </Link>
              </p>
              <Button
                onClick={handleAccept}
                className="bg-white hover:bg-zinc-100 text-zinc-900 font-medium px-8 py-2.5 rounded-lg transition-all duration-200"
              >
                GOT IT
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
