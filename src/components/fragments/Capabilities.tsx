"use client";

import React, { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { nyght } from "@/assets/font";
import { fadeIn, textVariant } from "@/utils/motion";
import { SectionWrapper } from "@/hoc";
import { NavbarButton } from "@/components/ui/resizable-navbar";

// Card Components matching the reference design
const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "w-full h-full p-8 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group transition-all duration-300 hover:scale-[1.02] relative overflow-hidden",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        "h-full rounded-xl z-40 relative overflow-hidden",
        className,
        showGradient &&
          "bg-neutral-300 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
      )}
    >
      {children}
    </div>
  );
};

// Sparkles Animation
const Sparkles = () => {
  const randomMove = () => Math.random() * 2 - 1;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: random() * 2 + 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: `2px`,
            height: `2px`,
            borderRadius: "50%",
            zIndex: 1,
          }}
          className="inline-block bg-black dark:bg-white"
        />
      ))}
    </div>
  );
};

// Profile Card Content
const ProfileCard = () => {
  return (
    <Card className="flex flex-col justify-between p-8">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Learn about my background, current role, and what drives me as a developer.
        </p>
      </div>

      {/* Dashboard-style Visual */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className="relative w-full max-w-sm">
          {/* Profile widget */}
          <div className="max-w-sm w-full mx-auto p-8 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] shadow-lg group">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700/50 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="text-gray-900 dark:text-white font-medium text-sm">Ettouzany Ettouzany</h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Full-stack Developer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <NavbarButton variant="primary">
          See More
        </NavbarButton>
      </div>

      <Sparkles />
    </Card>
  );
};

// Professional Card Content
const ProfessionalCard = () => {
  return (
    <Card className="flex flex-col justify-between p-8">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Professional</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Explore my technical skills, services offered, and professional experience.
        </p>
      </div>

      {/* Dashboard-style Visual */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className="w-full">
          {/* Skills metrics */}
          <div className="max-w-sm w-full mx-auto p-8 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] shadow-lg group">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700/50 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              </div>
              <h4 className="text-gray-900 dark:text-white font-medium text-sm">Tech Skills</h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">JavaScript • React • Node.js</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <NavbarButton variant="primary">
          See More
        </NavbarButton>
      </div>

      <Sparkles />
    </Card>
  );
};

// Personality Card Content
const PersonalityCard = () => {
  return (
    <Card className="flex flex-col justify-between p-8">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Personality</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Discover my values, approach to work, and what makes me unique.
        </p>
      </div>

      {/* Dashboard-style Visual */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className="w-full">
          {/* Values chart */}
          <div className="max-w-sm w-full mx-auto p-8 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] shadow-lg group">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700/50 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </div>
              <h4 className="text-gray-900 dark:text-white font-medium text-sm">Values</h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Clean Code • UX Focus • Innovation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <NavbarButton variant="primary">
          See More
        </NavbarButton>
      </div>

      <Sparkles />
    </Card>
  );
};

// Contact Card Content
const ContactCard = () => {
  return (
    <Card className="flex flex-col justify-between p-8">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Contact</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Ready to collaborate? Let's connect and discuss your next project.
        </p>
      </div>

      {/* Dashboard-style Visual */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className="w-full">
          {/* Contact analytics */}
          <div className="max-w-sm w-full mx-auto p-8 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] shadow-lg group">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700/50 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h4 className="text-gray-900 dark:text-white font-medium text-sm">Contact</h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Email • Chat • Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <NavbarButton variant="primary">
          See More
        </NavbarButton>
      </div>

      <Sparkles />
    </Card>
  );
};

const Capabilities = () => {
  return (
    <div className="relative py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          variants={textVariant({ delay: 0 })}
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-block px-4 py-2 bg-background/20 backdrop-blur-md border border-border/30 rounded-full mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-muted-foreground">What I can do</span>
            </div>
          </motion.div>
          <h2 className={`text-4xl md:text-6xl font-normal ${nyght.className} italic bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}>
            Capabilities
          </h2>
        </motion.div>

        {/* Asymmetric Bento Grid Layout */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 grid-rows-2 gap-6 h-[900px]"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Profile Card - Top Left (2:3 ratio) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: { 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 12
                }
              }
            }}
            className="lg:col-span-2 row-span-1"
          >
            <ProfileCard />
          </motion.div>

          {/* Professional Card - Top Right (1:3 ratio) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: { 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 12
                }
              }
            }}
            className="lg:col-span-1 row-span-1"
          >
            <ProfessionalCard />
          </motion.div>

          {/* Personality Card - Bottom Left (1:3 ratio) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: { 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 12
                }
              }
            }}
            className="lg:col-span-1 row-span-1"
          >
            <PersonalityCard />
          </motion.div>

          {/* Contact Card - Bottom Right (2:3 ratio) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: { 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 12
                }
              }
            }}
            className="lg:col-span-2 row-span-1"
          >
            <ContactCard />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(Capabilities, "capabilities");