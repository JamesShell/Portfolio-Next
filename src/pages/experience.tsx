import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sfPro } from '@/assets/font';
import Loading from '@/pages/_loading';
import Navbar from '@/components/fragments/Navbar';
import About from '@/components/fragments/About';
import Timeline from '@/components/fragments/Timeline';
import CTAFooter from '@/components/fragments/cta-footer';
import { StarsCanvas } from '@/components/canvas';
import SEOHead from '@/components/SEO/Head';
import { personStructuredData } from '@/utils/structuredData';

export default function Experience() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <SEOHead 
        title="Experience - Ettouzany Portfolio"
        description="Discover Ettouzany' professional journey as a Full Stack Developer. Explore work experience, technical skills, education, and career achievements in web development and modern technologies."
        keywords="experience, work history, education, achievements, timeline, career, full stack developer, professional journey, skills, web development"
        structuredData={personStructuredData}
      />

      <div className={`relative z-0 ${sfPro.className}`}>
        <Suspense fallback={<Loading />}>
          {isClient && (
            <>
              <Navbar variant="contact" />
              
              {/* Hero Section with smooth entrance */}
              <motion.div 
                className="pt-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {/* About Section */}
                <div className="relative">
                  <About />
                </div>
                
                {/* Enhanced section spacing */}
                <div className="py-20">
                  <Timeline />
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