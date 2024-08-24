import React, { Suspense, lazy, useEffect, useState } from 'react';
import { IBM_Plex_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/theme-provider';
import Loading from '@/pages/_loading';

// Import components lazily
const Navbar = lazy(() => import('@/components/fragments/Navbar'));
const Hero = lazy(() => import('@/components/fragments/Hero'));
const About = lazy(() => import('@/components/fragments/About'));
const Tech = lazy(() => import('@/components/fragments/Tech'));
const Works = lazy(() => import('@/components/fragments/Works'));
const Feedbacks = lazy(() => import('@/components/fragments/Feedback'));
const Contact = lazy(() => import('@/components/fragments/Contact'));
const StarsCanvas = lazy(() => import('@/components/canvas/Stars'));

// Load the IBM Plex Mono font
const IBMPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '500',
});

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="fixed w-screen h-screen bg-radial-gradient bg-cover bg-no-repeat bg-center animate-zoom" />
      <div className={`relative z-0 ${IBMPlexMono.className}`}>
        <Suspense fallback={<Loading />}>
          {isClient && (
            <>
              <div className="hero-container">
                <Navbar />
                <Hero />
              </div>
              <About />
              <Tech />
              <Works />
              <Feedbacks />
              <div className="relative z-0 h-full">
                <Contact />
                <StarsCanvas />
              </div>
            </>
          )}
        </Suspense>
      </div>
    </ThemeProvider>
  );
}
