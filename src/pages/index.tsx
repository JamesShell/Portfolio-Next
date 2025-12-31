import React, { Suspense, lazy, useEffect, useState } from 'react';
import { nyght, sfPro } from '@/assets/font'
import Loading from '@/pages/_loading';
import Navbar from '@/components/fragments/Navbar';
import SEOHead from '@/components/SEO/Head';
import { personStructuredData, websiteStructuredData } from '@/utils/structuredData';
import About from '@/components/fragments/About';
import Timeline from '@/components/fragments/Timeline';

// Import components lazily
const Hero = lazy(() => import('@/components/fragments/Hero'));
const WhyChooseMe = lazy(() => import('@/components/fragments/WhyChooseMe'));
const Works = lazy(() => import('@/components/fragments/Works'));

const Pricing = lazy(() => import('@/components/fragments/Pricing'));
const Features = lazy(() => import('@/components/fragments/Features'));
const Feedbacks = lazy(() => import('@/components/fragments/Feedback'));
const FAQ = lazy(() => import('@/components/fragments/FAQ'));
const CTAFooter = lazy(() => import('@/components/fragments/cta-footer'));
// const StarsCanvas = lazy(() => import('@/components/canvas/Stars'));
import { StarsCanvas, AsteroidsCanvas } from '@/components/canvas';
import GradualBlur from "@/components/GradualBlur";

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
          "@graph": [personStructuredData, websiteStructuredData],
        }}
      />
      <div className={`relative z-0 ${sfPro.className}`}>
        <Suspense fallback={<Loading />}>
          {isClient && (
            <>
              {/* Gradient blur behind navbar */}
              <GradualBlur
                target="page"
                position="top"
                height="6rem"
                strength={2}
                divCount={5}
                curve="bezier"
                exponential={true}
                opacity={1}
                className="!z-[20]"
              />
              <Navbar />
              <div className="hero-container">
                <Hero />
              </div>

              {/* High-converting section flow */}
              <div className="space-y-8">
                {/* Social Proof */}
                {/* <LogoCloud /> */}
                
                
                {/* Features & Benefits */}
                <Features />

                {/* About Me */}
                {/* <About /> */}
                
                {/* Features & Benefits */}
                <WhyChooseMe />
                
                {/* Experience Timeline */}
                {/* <Timeline /> */}
                
                {/* Tech Stack */}
                {/* <Tech /> */}
                
                {/* Portfolio Work */}
                <Works />
                
                {/* Process Flow */}
                
                {/* Pricing Plans */}
                <Pricing />
                
                {/* Testimonials */}
                <Feedbacks />
                
                {/* FAQ */}
                <FAQ />
              </div>

              {/* CTA and Footer */}
              <div className="relative z-0" id="contact">
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

