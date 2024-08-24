"use client"

import React, { useRef, useState } from "react";
// import { Tilt } from "react-tilt";
import { AnimatePresence, motion } from "framer-motion";
import { styles } from "@/styles/style";
import { services } from "@/constants/index";
import { fadeIn, textVariant } from "@/utils/motion";
import { SectionWrapper } from "@/hoc";
import { Cursor } from "@/components/ui/cursor";
import {
  CalendarDaysIcon,
  CodeIcon,
  MousePointerClickIcon,
  Users2Icon,
} from "lucide-react";
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
import { FaCertificate } from "react-icons/fa";
import { IconType } from "react-icons/lib";

// HoverCursor component with correct type for targetRef
const HoverCursor: React.FC<{ targetRef: React.RefObject<HTMLDivElement> }> = ({ targetRef }) => {
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
      ease: 'easeInOut',
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
                Click <MousePointerClickIcon className="ml-1 h-4 w-4" />
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
  icon: IconType;
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
  details
}) => {
  const targetRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog
    transition={{
      type: 'spring',
      stiffness: 240,
      damping: 24,
    }}
    >
      <DialogTrigger triggerRef={targetRef}>
        <HoverCursor targetRef={targetRef} />
        <div
          className="w-full service-card max-w-xs max-h-fit"
          style={{ "--glow-color": `var(--chart-${index + 2})` } as React.CSSProperties}
        >
          <motion.div
            variants={fadeIn({ direction: "right", type: "spring", delay: index * 0.5, duration: 0.75 })}
            className="relative w-full bg-shiny-header pt-[2px] rounded-[20px] shadow-sm service-card-inside"
          >
            <div className="relative w-full bg-muted/95 rounded-[18px] py-5 px-12 min-h-[240px] flex justify-evenly items-center flex-col">
              <DialogSubtitle>
                <Icon className="text-[40px]" />
              </DialogSubtitle>
              <DialogTitle className="text-[20px] font-bold text-center">
                {title}
              </DialogTitle>
            </div>
          </motion.div>
        </div>
      </DialogTrigger>
      <DialogContainer>
        <DialogContent className="pointer-events-auto overflow-hidden rounded-[15px] sm:w-[500px]">
          <div className="service-card-dialog" style={{ "--glow-color": `var(--chart-${index + 2})` } as React.CSSProperties}>
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
                  <DialogDescription className="text-start text-foreground mt-2" style={{ textShadow: "none" }}>
                    {description}
                  </DialogDescription>
                  {skills.length > 0 && (<>
                  
                    <h4 className="font-semibold mt-4">Skills:</h4>
                    <ul className="flex flex-row gap-2 mt-2 flex-wrap">
                    
                      {skills.map((skill, i) => (
                        <li style={{ textShadow: "none" }} key={i}>
                          <Badge>{skill}</Badge>
                        </li>
                      ))}
                    </ul>
                  </>)}
                  {tools.length > 0 && (<>
                    <h4 className="font-semibold mt-4">Tools:</h4><ul className="flex flex-row gap-2 mt-2">
                    
                      {tools.map((tool, i) => (
                        <li style={{ textShadow: "none" }} key={i}>
                          <Badge>{tool}</Badge>
                        </li>
                      ))}
                    </ul>
                  </>)}
                  <div className="mt-6 flex flex-row gap-x-4 gap-y-6 items-start justify-start" style={{ textShadow: "none" }}>
                    {details?.experience && (
                      <div className="flex items-center justify-center">
                        <CalendarDaysIcon className="mr-2 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          {details.experience} Years Exp
                        </span>
                      </div>
                    )}
                    {details?.projects && (
                      <div className="flex items-center justify-center">
                        <CodeIcon className="mr-2 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          {details.projects} Projects
                        </span>
                      </div>
                    )}
                    {details?.clients && (
                      <div className="flex items-center justify-center">
                        <Users2Icon className="mr-2 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          {details.clients} Clients
                        </span>
                      </div>
                    )}
                    {details?.certifications && (
                      <div className="flex items-center justify-center">
                        <FaCertificate className="mr-2 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
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
    <div className="container">
      <motion.div variants={textVariant({ delay: 0 })}>
        <h3 className={styles.sectionSubText}>Who I am?</h3>
        <h2 className={styles.sectionHeadText}>About</h2>
      </motion.div>
      <motion.p
        variants={fadeIn({ delay: 0.1, duration: 1 })}
        className={styles.sectionPargText}>
        As a Full Stack Developer with 3 years of experience, I am well-versed
        in a range of programming languages and technologies. During my career,
        I have worked on several projects, from developing responsive and
        user-friendly web applications to designing and implementing RESTful
        APIs.
      </motion.p>

      <div className="services mt-8 xs:mt-10 flex flex-wrap xs:justify-center sm:justify-start gap-[2rem]">
        {services.map((item, index) => (
          <div
            className="relative w-full md:max-w-[calc(50%-2rem)] max-w-[100%] lg:max-w-[calc(25%-2rem)]"
            key={item.title}
          >
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
