"use client";

import React, { useRef, useState } from "react";
// import { Tilt } from "react-tilt";
import { AnimatePresence, motion } from "framer-motion";
import { styles } from "@/styles/style";
import { services } from "@/constants/index";
import { fadeIn, textVariant } from "@/utils/motion";
import { SectionWrapper } from "@/hoc";
import { Cursor } from "@/components/ui/cursor";
import {
  CalendarDots,
  Code,
  CursorClick,
  Users,
  Certificate,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogContainer,
  DialogSubtitle,
  DialogDescription,
} from "@/components/ui/animated-dialog";
import { Badge } from "@/components/ui/badge";
// Icon imports from @phosphor-icons/react above
import { IconProps } from "@phosphor-icons/react";
import { nyght } from "@/assets/font";
import { AboutCanvas } from "@/components/canvas";
import profileImage from "@/assets/profile.png";
import Image from "next/image";
import MagneticButton from "../ui/magnatic-button";
import { SocialLinks } from "../ui/social-links";

// HoverCursor component with correct type for targetRef
const HoverCursor: React.FC<{ targetRef: React.RefObject<HTMLDivElement> }> = ({
  targetRef,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const handlePositionChange = (x: number, y: number) => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const isInside =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      setIsHovering(isInside);
    }
  };

  return (
    <Cursor
      attachToParent
      variants={{
        initial: { scale: 0.3, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.3, opacity: 0 },
      }}
      springConfig={{
        bounce: 0.001,
      }}
      transition={{
        ease: "easeInOut",
        duration: 0.15,
      }}
      onPositionChange={handlePositionChange}>
      <motion.div
        animate={{
          width: isHovering ? 80 : 16,
          height: isHovering ? 32 : 16,
        }}
        className="flex items-center justify-center rounded-[24px] bg-black/20 backdrop-blur-md">
        <AnimatePresence>
          {isHovering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex w-full items-center justify-center">
              <div className="inline-flex items-center text-sm text-white">
                Click <CursorClick className="ml-1 h-4 w-4" weight="fill" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Cursor>
  );
};

// ServiceCard component with correct types
const ServiceCard: React.FC<{
  index: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  skills: string[];
  tools: string[];
  percentage: number;
  details?: {
    experience?: number;
    projects?: number;
    clients?: number;
    certifications?: number;
  };
}> = ({
  index,
  title,
  icon: Icon,
  description,
  skills,
  tools,
  percentage,
  details,
}) => {
  const targetRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 24,
      }}>
      <DialogTrigger triggerRef={targetRef}>
        <HoverCursor targetRef={targetRef} />
        <div
          className="w-full service-card max-w-xs max-h-fit"
          style={
            {
              "--glow-color": `var(--chart-${index + 2})`,
            } as React.CSSProperties
          }>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              delay: index * 0.15,
              duration: 0.6,
              type: "spring",
              stiffness: 120,
              damping: 15
            }}
            className="relative w-full bg-shiny-header pt-[2px] rounded-[20px] shadow-sm service-card-inside">
            <div className="relative w-full bg-muted/95 rounded-[18px] py-5 px-12 min-h-[240px] flex justify-evenly items-center flex-col">
              <DialogSubtitle>
                <Icon className="text-[40px] text-foreground/20" />
              </DialogSubtitle>
              <DialogTitle className="text-[20px] text-foreground/80 font-medium text-center">
                {title}
              </DialogTitle>
            </div>
          </motion.div>
        </div>
      </DialogTrigger>
      <DialogContainer>
        <DialogContent className="pointer-events-auto overflow-hidden rounded-[15px] sm:w-[500px]">
          <div
            className="service-card-dialog"
            style={
              {
                "--glow-color": `var(--chart-${index + 2})`,
              } as React.CSSProperties
            }>
            <div className="bg-shiny-header pt-[2px] shadow-sm service-card-inside-dialog relative">
              <div className="w-full h-full bg-muted/95">
                <div className="p-6 flex flex-col items-start">
                  <div className="flex items-center space-x-3 p-3">
                    <Icon className="text-[40px]" />
                    <div className="flex flex-col items-start justify-center space-y-0">
                      <DialogTitle className="text-[20px] font-bold text-center">
                        {title}
                      </DialogTitle>
                      <DialogSubtitle className="text-[10px] sm:text-xs">
                        {Math.round(percentage * 100)}% [
                        {`=`.repeat(Math.round(percentage * 20))}
                        {`-`.repeat(20 - Math.round(percentage * 20))}]
                      </DialogSubtitle>
                    </div>
                  </div>
                  <DialogDescription
                    className="text-start text-foreground mt-2"
                    style={{ textShadow: "none" }}>
                    {description}
                  </DialogDescription>
                  {skills.length > 0 && (
                    <>
                      <h4 className="font-semibold mt-4">Skills:</h4>
                      <ul className="flex flex-row gap-2 mt-2 flex-wrap">
                        {skills.map((skill, i) => (
                          <li style={{ textShadow: "none" }} key={i}>
                            <Badge>{skill}</Badge>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {tools.length > 0 && (
                    <>
                      <h4 className="font-semibold mt-4">Tools:</h4>
                      <ul className="flex flex-row gap-2 mt-2">
                        {tools.map((tool, i) => (
                          <li style={{ textShadow: "none" }} key={i}>
                            <Badge>{tool}</Badge>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <div
                    className="mt-6 flex flex-row gap-x-4 gap-y-6 items-start justify-start"
                    style={{ textShadow: "none" }}>
                    {details?.experience && (
                      <div className="flex items-center justify-center">
                        <CalendarDots className="mr-2 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          {details.experience} Years Exp
                        </span>
                      </div>
                    )}
                    {details?.projects && (
                      <div className="flex items-center justify-center">
                        <Code className="mr-2 text-neutral-700 dark:text-neutral-300 h-4 w-4" weight="bold" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          {details.projects} Projects
                        </span>
                      </div>
                    )}
                    {details?.clients && (
                      <div className="flex items-center justify-center">
                        <Users className="mr-2 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          {details.clients} Clients
                        </span>
                      </div>
                    )}
                    {details?.certifications && (
                      <div className="flex items-center justify-center">
                        <Certificate className="mr-2 text-neutral-700 dark:text-neutral-300 h-4 w-4" weight="fill" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          {details.certifications} Certifications
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogClose className="text-zinc-50" />
          </div>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
};

const About = () => {
  return (
    <div className="relative">
      <div className="container relative z-10">
        {/* About Hero Section */}
        <motion.div variants={textVariant({ delay: 0 })} className="mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left side - Content */}
            <motion.div
              className="flex-1 text-left"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}>
              <motion.div
                className="inline-block mb-6"
                whileHover={{ scale: 1.05 }}>
                <Badge className="flex items-center gap-2 text-muted-foreground uppercase" size={"xl"}>
                  Know About Me
                </Badge>
              </motion.div>

              <h1
                className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 ${nyght.className}`}>
                Apps Don’t 
                <br />Build Themselves,{" "}
                <br /><span
                  className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>
                   Ettouzany
                </span>
              </h1>

              <div className="space-y-4 text-lg text-foreground/70 leading-relaxed mb-8">
                <p>
                  I’m Ettouzany Abdelkadr, a full-stack developer experienced in
                  both frontend and backend development. I work with React,
                  Next.js, Node.js, and Flutter to build scalable and reliable
                  applications across platforms.
                </p>
                <p>
                  I like taking projects from idea to launch, handling everything from server logic to smooth user interfaces. Clean code and practical problem-solving are at the core of how I work.
                </p>
                <p>
                  Alongside development, I’m also a <strong>UI/UX designer</strong>, focused on creating intuitive and visually engaging designs that make applications both functional and enjoyable to use.
                </p>
                <p
                  className={
                    "font-light italic text-foreground tracking-wider text-xl " +
                    nyght.className
                  }>
                  “It’s not knowing what to do, it’s doing what you know.” <br /> — Tony Robbins
                </p>
              </div>

              {/* Work Experience Link */}
              <motion.div whileHover={{ x: 5 }}>
                <MagneticButton href="/experience">
                  Work Experience
                </MagneticButton>
              </motion.div>
            </motion.div>

            {/* Right side - 3D Character */}
            <motion.div
              className="flex-shrink-0 flex flex-col items-center lg:items-end justify-center group"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 100 }}>
              <motion.div
                className="relative w-80 h-60 lg:w-96 lg:h-80"
                initial="rest"
                animate="rest"
                whileHover="hover">
                {/* 3D Character Canvas */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden border border-border/20 shadow-2xl">
                  {/* Profile Image Background */}
                  <Image
                    src={profileImage}
                    alt="Profile Image"
                    fill
                    className="object-cover object-[0px_15%] hover:object-[0px_40%] transition-all duration-500"
                  />
                  {/* Optional: Add overlay for better text readability */}
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div> */}
                </div>

                {/* Waving Emoji */}
                <motion.div
                  className="absolute -bottom-4 -left-4 text-7xl pointer-events-none"
                  variants={{
                    rest: { opacity: 0, y: 20, scale: 0 },
                    hover: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}>
                  <motion.span
                    className="inline-block"
                    variants={{
                      rest: { rotate: 0 },
                      hover: { rotate: [0, 14, -8, 14, -4, 10, 0] },
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}>
                    👋
                  </motion.span>
                </motion.div>
              </motion.div>

              {/* Social Links */}
              <SocialLinks className="mt-6" />
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Services Grid */}
        {/* <motion.div
          className="services mt-8 xs:mt-10"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}>
          <div className="flex flex-wrap xs:justify-center sm:justify-start gap-[2rem]">
            {services.map((item, index) => (
              <motion.div
                className="relative w-full md:max-w-[calc(50%-2rem)] max-w-[100%] lg:max-w-[calc(25%-2rem)]"
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                    },
                  },
                }}>
                <ServiceCard
                  index={index}
                  title={item.title}
                  icon={item.icon}
                  description={item.description}
                  skills={item.skills}
                  tools={item.tools}
                  percentage={item.percentage}
                  details={item.details}
                />
              </motion.div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
