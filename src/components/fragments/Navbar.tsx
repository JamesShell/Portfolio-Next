"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
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

  const navItems = [
        { name: "Home", link: "/" },
        { name: "Experience", link: "/experience" },
        { name: "Projects", link: "/projects" },
        { name: "Contact", link: "/contact" }
      ];

  const mobileNavItems = [
        { name: "Home", href: "/" },
        { name: "Experience", href: "/experience" },
        { name: "Projects", href: "/projects" },
        { name: "Contact", href: "/contact" }
      ];

  const isActive = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname === href;
  };

  return (
    <ResizableNavbar className='mt-4'>
      <NavBody>
        <NavbarLogo />
        <NavItems 
          items={navItems}
          onItemClick={() => setMobileMenuOpen(false)}
        />
        <NavbarButton href="/contact" variant="gradient">
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
                onClick={() => setMobileMenuOpen(false)}
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