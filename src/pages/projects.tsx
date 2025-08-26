import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sfPro } from '@/assets/font';
import Loading from '@/pages/_loading';
import Navbar from '@/components/fragments/Navbar';
import Works from '@/components/fragments/Works';
import CTAFooter from '@/components/fragments/cta-footer';
import { StarsCanvas } from '@/components/canvas';
import SEOHead from '@/components/SEO/Head';
import { portfolioStructuredData } from '@/utils/structuredData';
import { Spotlight } from '@/components/ui/spotlight-new';

export default function Projects() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <SEOHead 
        title="Projects - Ettouzany Portfolio"
        description="Explore Ettouzany's portfolio of innovative web development projects featuring React, Next.js, TypeScript, and modern technologies. See real-world applications and creative solutions."
        keywords="projects, portfolio, web development, react, next.js, typescript, full stack, javascript, node.js, frontend, backend"
        structuredData={portfolioStructuredData}
      />

      <div className={`relative z-0 ${sfPro.className}`}>
        <Suspense fallback={<Loading />}>
          {isClient && (
            <>
              <Navbar variant="contact" />
              <Spotlight className="sticky" />
              {/* Hero Section with smooth entrance */}
              <motion.div 
                className="pt-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {/* Works Section */}
                <div className="relative">
                  <Works />
                </div>
              </motion.div>
              
              {/* CTA and Footer */}
              <div className="relative z-0">
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