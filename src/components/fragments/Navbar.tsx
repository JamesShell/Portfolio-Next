"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';
import { useContactModal } from '@/context/ContactModalContext';
import { 
  Navbar as ResizableNavbar, 
  NavBody, 
  NavItems, 
  NavbarLogo, 
  NavbarButton, 
  MobileNav, 
  MobileNavHeader, 
  MobileNavToggle, 
  MobileNavMenu 
} from '@/components/ui/resizable-navbar';

interface NavbarProps {
  connected?: boolean;
  variant?: 'home' | 'contact';
}

const Navbar = ({ connected = true, variant = 'home' }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { openMessage } = useContactModal();
  const [activeSection, setActiveSection] = useState<string>('');

  const navItems = [
        { 
          name: "About", 
          link: "/#about",
          action: () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        },
        { name: "Projects", link: "/#projects" },
        { name: "Pricing", link: "/#pricing" },
        { name: "Testimonials", link: "/#testimonials" },
      ];

  const mobileNavItems: Array<{ name: string; href: string; action?: () => void }> = [
        { name: "About", href: "/#about" },
        { name: "Projects", href: "/#projects" },
        { name: "Pricing", href: "/#pricing" },
        { name: "Testimonials", href: "/#testimonials" },
      ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'projects', 'pricing', 'testimonials'];
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const viewportMiddle = scrollPosition + windowHeight / 2;

      // If at the very top (within first 150px), set about
      if (scrollPosition < 150) {
        setActiveSection('about');
        return;
      }

      // Check each section - find which one is closest to viewport middle
      let closestSection = '';
      let closestDistance = Infinity;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollPosition;
          const elementMiddle = elementTop + rect.height / 2;
          const distance = Math.abs(viewportMiddle - elementMiddle);

          // If viewport middle is within this section's bounds
          if (viewportMiddle >= elementTop && viewportMiddle <= elementTop + rect.height) {
            if (distance < closestDistance) {
              closestDistance = distance;
              closestSection = section;
            }
          }
        }
      }

      // If we found a section in view, use it
      if (closestSection) {
        setActiveSection(closestSection);
        return;
      }

      // Fallback: find the section that's closest to viewport middle
      let fallbackSection = '';
      let fallbackDistance = Infinity;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollPosition;
          const elementMiddle = elementTop + rect.height / 2;
          const distance = Math.abs(viewportMiddle - elementMiddle);

          if (distance < fallbackDistance) {
            fallbackDistance = distance;
            fallbackSection = section;
          }
        }
      }

      if (fallbackSection) {
        setActiveSection(fallbackSection);
      }
    };

    // Initial check with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 200);

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === '#' || href.includes('#contact')) return false;
    const sectionId = href.replace('/#', '').replace('#', '');
    return activeSection === sectionId;
  };

  return (
    <ResizableNavbar className='mt-4'>
      <NavBody>
        <NavbarLogo />
        <NavItems 
          items={navItems}
          onItemClick={() => setMobileMenuOpen(false)}
          activeSection={activeSection}
        />
        <NavbarButton 
          as="button" 
          onClick={() => {
            trackEvent('open_contact', { source: 'navbar' });
            openMessage();
          }}
          variant="gradient"
        >
          Get in touch
        </NavbarButton>
      </NavBody>
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle 
            isOpen={mobileMenuOpen} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          />
        </MobileNavHeader>
        <MobileNavMenu 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)}
        >
          {mobileNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={cn(
                  "text-lg font-medium transition-colors",
                  active
                    ? "text-primary font-semibold"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-primary"
                )}
                onClick={(e) => {
                  if (item.action) {
                    e.preventDefault();
                    item.action();
                  }
                  setMobileMenuOpen(false);
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
};

export default Navbar;