import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SEOHead from '@/components/SEO/Head';
import Navbar from '@/components/fragments/Navbar';
import CTAFooter from '@/components/fragments/cta-footer';
import { StarsCanvas } from '@/components/canvas';

const CookiesPolicy = () => {
  return (
    <>
      <SEOHead 
        title="Cookies Policy - Ettouzany Portfolio"
        description="Learn about how we use cookies on this portfolio website to improve your experience through analytics."
        keywords="cookies, privacy, policy, analytics"
        ogType="website"
      />

      <div className="relative z-0 min-h-screen">
        <Navbar variant="contact" />
        
        <div className="mx-4 sm:container sm:mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back Link */}
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Cookies Policy
              </h1>
              <p className="text-foreground/60 text-lg">
                Last updated: December 26, 2025
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies?</h2>
                <p className="text-foreground/80 leading-relaxed">
                  Cookies are small text files that are placed on your device when you visit a website. 
                  They help the website remember your preferences and improve your browsing experience.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Cookies</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  This portfolio website uses cookies solely for analytics purposes through Google Analytics. 
                  We use this data to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground/80">
                  <li>Understand how visitors interact with the website</li>
                  <li>Improve the user experience and website performance</li>
                  <li>Track page views and user engagement</li>
                  <li>Analyze website traffic and visitor demographics</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>
                <div className="bg-background/30 backdrop-blur-sm border border-border/30 rounded-xl p-6">
                  <h3 className="text-xl font-medium text-foreground mb-3">Analytics Cookies</h3>
                  <p className="text-foreground/80 leading-relaxed">
                    We use Google Analytics to collect anonymous information about how visitors use this website. 
                    This helps us understand visitor behavior and improve the website experience.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Your Data & Privacy</h2>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-3">
                  <p className="text-foreground/80 leading-relaxed">
                    <strong className="text-foreground">We respect your privacy.</strong> This is a personal portfolio website, and we want to be transparent about our practices:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80">
                    <li><strong>We do NOT sell your data</strong> - Your information is never sold to third parties</li>
                    <li><strong>Marketing use only</strong> - Data is used solely to understand and improve the website</li>
                    <li><strong>No personal information collection</strong> - We don't collect names, emails, or personal details through cookies</li>
                    <li><strong>Anonymous analytics</strong> - All analytics data is aggregated and anonymized</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Cookies</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  You can control and manage cookies in several ways:
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground/80">
                  <li>Clear your browser's cookies and browsing data at any time</li>
                  <li>Adjust your browser settings to refuse cookies</li>
                  <li>Use browser extensions to block tracking cookies</li>
                  <li>Opt out of Google Analytics tracking</li>
                </ul>
                <p className="text-foreground/60 text-sm mt-4">
                  Note: Blocking cookies may affect your experience on this website, but all content will remain accessible.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
                <p className="text-foreground/80 leading-relaxed">
                  If you have any questions about how we use cookies, please feel free to{' '}
                  <Link href="/contact" className="text-primary hover:underline">
                    contact me
                  </Link>
                  .
                </p>
              </section>
            </div>
          </motion.div>
        </div>

        <div className="relative z-0">
          <CTAFooter />
          <StarsCanvas />
        </div>
      </div>
    </>
  );
};

export default CookiesPolicy;
