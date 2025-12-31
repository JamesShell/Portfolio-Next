"use client";
import { nyght } from "@/assets/font";
import { cn } from "@/lib/utils";
import { List, X } from "@phosphor-icons/react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

import React, { useRef, useState } from "react";
import { BlinkingSmiley } from "./global-loader";


interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
    action?: () => void;
  }[];
  className?: string;
  onItemClick?: () => void;
  activeSection?: string;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      // IMPORTANT: Change this to class of `fixed` if you want the navbar to be fixed
      className={cn("fixed inset-x-0 top-0 z-40 w-full", className)}
    >
      
      
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "40%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "800px",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex",
        visible && "bg-gradient-to-b from-white/20 via-white/10 to-transparent backdrop-blur-md border border-white/20 dark:from-black/20 dark:via-black/10 dark:to-transparent dark:border-white/10",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick, activeSection }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const router = useRouter();

  const isActive = (link: string) => {
    // If activeSection is provided (one-page mode), use it
    if (activeSection) {
      if (link === '/') return activeSection === 'hero';
      // Extract section ID from link (e.g., "/#about" -> "about")
      const linkSection = link.replace('/#', '').replace('#', '');
      return linkSection === activeSection;
    }
    
    // Fallback to router path (multi-page mode)
    if (link === '/') {
      return router.pathname === '/';
    }
    if (link.startsWith('/#')) {
      return router.pathname === '/' && router.asPath.includes(link);
    }
    return router.pathname === link;
  };

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2",
        className,
      )}
    >
      {items.map((item, idx) => {
        const active = isActive(item.link);
        
        return (
          <Link
            key={`link-${idx}`}
            href={item.link}
            className={cn(
              "relative px-4 py-2 transition-colors duration-200",
              active 
                ? "text-primary font-medium" 
                : "text-neutral-600 dark:text-neutral-300 hover:text-primary font-normal"
            )}
            onMouseEnter={() => setHovered(idx)}
            onClick={(e) => {
              if (item.action) {
                e.preventDefault();
                item.action();
              }
              onItemClick?.();
            }}
            scroll={item.action ? false : true}
          >
            {(hovered === idx || active) && (
              <motion.div
                layoutId={active ? "active" : "hovered"}
                className={cn(
                  "absolute inset-0 h-full w-full rounded-full backdrop-blur-md",
                  active 
                    ? "bg-primary/10" 
                    : "bg-primary/5"
                )}
              />
            )}
            <span className="relative z-20">{item.name}</span>
          </Link>
        );
      })}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
        visible && "bg-gradient-to-b from-white/20 via-white/10 to-transparent backdrop-blur-md border border-white/20 dark:from-black/20 dark:via-black/10 dark:to-transparent dark:border-white/10",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] dark:bg-neutral-950",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <X className="text-black dark:text-white" onClick={onClick} weight="bold" />
  ) : (
    <List className="text-black dark:text-white" onClick={onClick} weight="bold" />
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="#"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
    >
      <div className="relative h-8 w-8 flex items-center justify-center">
        <div className="scale-[0.3]">
          <BlinkingSmiley />
        </div>
      </div>
      <span className={`text-lg tracking-wide italic text-black dark:text-white ${nyght.className}`}>Ettouzany</span>
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  return (
    <Tag
      href={href || undefined}
      className={cn(
        "bg-shiny-header pt-[1px] rounded-full shadow-sm cursor-pointer inline-block hover:-translate-y-0.5 transition duration-200 relative z-30",
        className
      )}
      {...props}
    >
      <div className="bg-muted/90 rounded-full px-4 py-2 flex items-center pointer-events-auto">
        <span className="text-primary text-sm font-bold">{children}</span>
      </div>
    </Tag>
  );
};
