"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { SocialLinks } from '@/components/ui/social-links';
import { Heart, Coffee, Monitor, Moon, Sun } from 'lucide-react';
import { nyght } from '@/assets/font';
import Link from 'next/link';
import { SegmentedControl } from '@/components/ui/segmented-control';
import MagneticButton from '../ui/magnatic-button';
import { socialLinks } from '@/constants';



// Footer Theme Toggle Component
const FooterThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const themeOptions = [
    { value: "light", label: "", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "", icon: <Moon className="w-4 h-4" /> },
    { value: "system", label: "", icon: <Monitor className="w-4 h-4" /> },
  ];

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as "light" | "dark" | "system" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("system");
    }
  }, []);

  // Theme handler with localStorage persistence
  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    const root = document.documentElement;
    
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const handleThemeChange = (newTheme: string) => {
    const themeValue = newTheme as "light" | "dark" | "system";
    setTheme(themeValue);
    localStorage.setItem('theme', themeValue);
    applyTheme(themeValue);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground/60">Theme:</span>
      <SegmentedControl
        options={themeOptions}
        value={theme}
        onChange={handleThemeChange}
        size="sm"
      />
    </div>
  );
};

// ... imports
import { useContactModal } from '@/context/ContactModalContext';

// ... (FooterThemeToggle remains same)

const CTAFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const containerRef = useRef<HTMLDivElement>(null);
  const { openMessage, openBooking } = useContactModal();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const leftLineX = useTransform(scrollYProgress, [0, 0.5], [-200, 0]);
  const rightLineX = useTransform(scrollYProgress, [0, 0.5], [200, 0]);
  const leftLineOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const rightLineOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const footerLinks = [
    {
      title: "Navigation",
      links: [
        { name: "Home", href: "/" },
        { name: "Experience", href: "/#experience" },
        { name: "Projects", href: "/#projects" },
        { name: "Contact", href: "#", action: openMessage },
      ]
    },
    {
      title: "Connect",
      links: [
        { name: "GitHub", href: socialLinks.github.link },
        { name: "LinkedIn", href: socialLinks.linkedin.link },
        { name: "Twitter", href: socialLinks.twitter.link },
        { name: "Email", href: `mailto:${socialLinks.mail.handle}` },
      ]
    }
  ];

  return (
    <div ref={containerRef} className="relative max-w-screen overflow-hidden">
      {/* CTA Section */}
      <div className="relative">
        
        <div className="container mx-auto px-6 py-24">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-block mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Badge className="flex items-center gap-2 text-muted-foreground uppercase" size={'xl'} variant={'default'}>
                                              <Heart className="w-3 h-3 text-foreground/60" />
                                              Ready to start?
              </Badge>
            </motion.div>
            
            <h2 className={`text-4xl lg:text-5xl xl:text-6xl overflow-hidden`}>
              <motion.div
                style={{ 
                  x: leftLineX,
                  opacity: leftLineOpacity 
                }}
                className={`font-semibold ${nyght.className}`}
              >
                Let's Build Something
              </motion.div>
              <br />
              <motion.div 
                style={{ 
                  x: rightLineX,
                  opacity: rightLineOpacity 
                }}
                className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic -mt-14 mb-6`}
              >
                Amazing Together
              </motion.div>
            </h2>
            
            <p className="text-xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed">
              Have a project in mind? I'd love to help bring your ideas to life with clean code, 
              modern design, and exceptional user experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <MagneticButton onClick={openMessage} className="text-lg">
                Get In Touch
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            {/* Brand Section */}
            <div className="md:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold ${nyght.className} mb-4`}>
                    Ettouzany
                  </h3>
                  <p className="text-foreground/60 max-w-sm leading-relaxed">
                    Full-stack developer passionate about creating exceptional digital experiences 
                    with modern technologies.
                  </p>
                </div>
                
                {/* Newsletter */}
                <div className="max-w-sm mt-8">
                  <h4 className="font-semibold text-foreground mb-3">Subscribe to newsletter</h4>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="flex-1 bg-muted/50 border border-border/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                      Join
                    </button>
                  </div>
                  <p className="text-xs text-foreground/40 mt-2">
                    No spam. Unsubscribe anytime.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="md:col-span-7 grid grid-cols-2 gap-8">
              {footerLinks.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * (sectionIndex + 1) }}
                >
                  <h4 className="text-foreground font-semibold mb-4">{section.title}</h4>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link 
                          href={link.href}
                          className="text-foreground/60 hover:text-foreground text-sm block hover:translate-x-1 transition-all duration-300"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
              

            </div>
          </div>

          {/* Bottom Section */}
          <motion.div 
            className="pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-4 text-sm text-foreground/60">
              <span>© {currentYear} Ettouzany. All rights reserved.</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="items-center gap-2 text-sm text-foreground/60 hidden sm:flex">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                <span>and</span>
                <Coffee className="w-4 h-4 text-amber-600" />
              </div>
              <FooterThemeToggle />
              <SocialLinks className="gap-3" />
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default CTAFooter;