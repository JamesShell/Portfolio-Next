import React, { Suspense, lazy, useEffect, useState } from 'react';
import { sfPro } from '@/assets/font'
import Loading from '@/pages/_loading';
import Navbar from '@/components/fragments/Navbar';
import SEOHead from '@/components/SEO/Head';
import { personStructuredData, websiteStructuredData } from '@/utils/structuredData';

// Import components lazily
const Hero = lazy(() => import('@/components/fragments/Hero'));
const About = lazy(() => import('@/components/fragments/About'));
const Tech = lazy(() => import('@/components/fragments/Tech'));
const Works = lazy(() => import('@/components/fragments/Works'));
const Feedbacks = lazy(() => import('@/components/fragments/Feedback'));
const CTAFooter = lazy(() => import('@/components/fragments/cta-footer'));
// const StarsCanvas = lazy(() => import('@/components/canvas/Stars'));
import { StarsCanvas, AsteroidsCanvas } from '@/components/canvas';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <SEOHead 
        title="Ettouzany Portfolio - Full Stack Developer & UI/UX Designer"
        description="Portfolio of Ettouzany - Full Stack Developer specializing in React, Next.js, TypeScript, and modern web technologies. Explore my projects, skills, and experience in creating innovative web solutions."
        keywords="full stack developer, react developer, next.js, typescript, web development, portfolio, UI/UX design, frontend, backend, javascript, node.js"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [personStructuredData, websiteStructuredData]
        }}
      />
      <div className={`relative z-0 ${sfPro.className}`}>
        <Suspense fallback={<Loading />}>
        {isClient && (
          <>
          <Navbar />
            <div className="hero-container">
              
              <Hero />
            </div>
            
            {/* Enhanced section spacing */}
            <div className="space-y-32 py-20">
              <About />
              <Tech />
              <Works />
              <Feedbacks />
            </div>
            
            {/* CTA and Footer */}
            <div className="relative z-0" id='contact'>
              <CTAFooter />
              <StarsCanvas />
            </div>
          </>
        )}
        </Suspense>
      </div>
    </>
  );
}
