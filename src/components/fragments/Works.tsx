import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { SectionWrapper } from "@/hoc";
import { projects, technologies } from "@/constants";
import { fadeIn, textVariant } from "@/utils/motion";
import DoubleOutlinedCard from "@/components/ui/double-outlined-card";
import { Button } from "@/components/ui/button";
import { styles } from "@/styles/style";
import { cn } from "@/lib/utils";
import { RocketIcon, GlobeIcon } from "@radix-ui/react-icons";
import { IconType } from "react-icons/lib";
import Image from "next/image";
import { useInView } from "framer-motion";
import { Download, Heart, Laptop, Sparkle, Sparkles } from "lucide-react";
import { nyght } from "@/assets/font";
import { Badge } from "../ui/badge";
import { InlineLoader } from "../ui/global-loader";
import { FaAppStore, FaAppStoreIos } from "react-icons/fa";

interface ProjectCardProps {
  index: number;
  name: string;
  description: string;
  tags: { name: string; color: string }[]; // Tags are objects with name and color
  image: string;
  link: string;
  Icon: IconType; // Use IconType for react-icons
}

// const ProjectCard: React.FC<ProjectCardProps> = ({
//   index,
//   name,
//   description,
//   tags,
//   image,
//   source_code_link,
//   Icon,
// }) => {
//   const variants = {
//     hidden: {
//       opacity: 0,
//       x: -20,
//     },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: {
//         duration: 0.5,
//         ease: "easeInOut",
//       },
//     },
//     exit: {
//       opacity: 0,
//       x: 20,
//       transition: {
//         duration: 0.3,
//         ease: "easeInOut",
//       },
//     },
//   };

//   return (
//     <motion.div
//       className="group w-full relative bg-background/20 backdrop-blur-xl border border-border/30 rounded-3xl shadow-2xl shadow-background/10 transition-all duration-500 hover:scale-[1.02]"
//       initial="hidden"
//       animate="visible"
//       exit="exit"
//       variants={variants}
//       whileHover={{ y: -8 }}
//     >
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl"></div>

//       {/* Project Image */}
//       <div className="relative aspect-video w-full overflow-hidden rounded-t-3xl">
//         <Image
//           src={image}
//           alt={name}
//           width={800}
//           height={450}
//           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
//       </div>

//       {/* Project Details */}
//       <div className="relative p-8">
//         <h3 className={cn("glow-text mb-4 text-2xl font-bold", styles.workHeadText)}>
//           {name}
//         </h3>

//         <p className="text-foreground/80 mb-6 leading-relaxed text-sm">
//           {description}
//         </p>

//         {/* Tags */}
//         {tags && tags.length > 0 && (
//           <div className="flex flex-wrap gap-2 mb-6">
//             {tags.map((tag, tagIndex) => (
//               <span
//                 key={tagIndex}
//                 className="px-3 py-1 text-xs font-medium bg-background/40 backdrop-blur-md border border-border/50 rounded-full text-foreground/70"
//                 style={{ borderColor: `${tag.color}30` }}
//               >
//                 {tag.name}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex space-x-4">
//           <motion.button
//             onClick={() => window.open(source_code_link, '_blank')}
//             className="flex-1 group/btn relative px-4 py-3 bg-background/30 backdrop-blur-md border border-border/50 rounded-xl text-foreground font-medium hover:bg-background/50 hover:border-border transition-all duration-300 overflow-hidden"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             <div className="flex items-center justify-center space-x-2 relative z-10">
//               <RocketIcon className="w-4 h-4" />
//               <span className="text-sm">View Project</span>
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -translate-x-full group-hover/btn:translate-x-full transform transition-transform duration-700"></div>
//           </motion.button>

//           <motion.button
//             onClick={() => window.open('https://jelth.com', '_blank')}
//             className="flex-1 group/btn relative px-4 py-3 bg-primary/10 backdrop-blur-md border border-primary/20 rounded-xl text-primary font-medium hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 overflow-hidden"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             <div className="flex items-center justify-center space-x-2 relative z-10">
//               <GlobeIcon className="w-4 h-4" />
//               <span className="text-sm">Live Demo</span>
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -translate-x-full group-hover/btn:translate-x-full transform transition-transform duration-700"></div>
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

const Works: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.2, once: false });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Adjust the calculation to better sync with the visible image
    const adjustedProgress = Math.max(0, latest - 0.01); // Slight delay
    const projectIndex = Math.max(
      0,
      Math.min(
        Math.floor(adjustedProgress * projects.length),
        projects.length - 1
      )
    );
    setActiveCard(projectIndex);
  });

  useEffect(() => {
    if (!detailsRef.current) return;

    let parent = detailsRef.current.parentElement;

    while (parent) {
      const overflowY = getComputedStyle(parent).overflowY;
      const overflow = getComputedStyle(parent).overflow;

      if (overflow !== "visible" || overflowY !== "visible") {
        console.log("Sticky blocked by overflow:", {
          parent,
          overflow,
          overflowY,
        });
      }

      parent = parent.parentElement;
    }
  }, [detailsRef]);

  useEffect(() => {
    // Simulate loading time for canvas/images
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Calculate position constraints for fixed container
  const { scrollYProgress: detailsScrollProgress } = useScroll({
    target: imagesRef,
    offset: ["start start", "end end"],
  });

  const constrainedY = useTransform(
    detailsScrollProgress,
    [0, 1],
    [80, 80] // Keep it at top-20 (80px) but we'll use CSS to constrain it
  );

  return (
    <div className="w-full max-w-[100vw]" ref={containerRef} id="work">
      {/* Enhanced Section Header */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={textVariant({ delay: 0 })}
        className="mb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side - Content */}
          <motion.div
            className="flex-1 items-center text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn({ direction: "left", delay: 0.2, duration: 0.8 })}>
            <motion.div
              className="inline-block mb-6"
              whileHover={{ scale: 1.05 }}>
                <Badge className="flex items-center gap-2 text-muted-foreground uppercase" size={'xl'} variant={'default'}>
                                <Heart className="w-3 h-3 text-foreground/60" />
                                Built with passion
                              </Badge>
            </motion.div>
            <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold ${nyght.className}`}>
                            Featured
                            <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}> Works</span>
                          </h1>
          </motion.div>
        </div>
      </motion.div>

      {/* Desktop Layout */}
      <div
        className="hidden lg:flex self-start space-x-8 relative px-8 xl:px-24 w-full max-w-[100vw]"
        ref={ref}>
        {/* Left Side - Project Images Stack */}
        <div className="flex-1" ref={imagesRef}>
          {projects.map((project, index) => (
            <div
              key={project.name + index}
              className="h-fit flex items-center py-20 first:pt-0">
              <motion.div
                className="w-full group"
                whileHover="hover"
                initial="rest"
                animate="rest">
                <DoubleOutlinedCard
                  showHeader={false}
                  className={`h-[70vh] w-full max-w-[600px] cursor-pointer relative shadow-lg transition-all duration-300 ${
                    index === activeCard 
                      ? "scale-105" 
                      : ""
                  }`}
                  contentClassName="p-0 h-full relative overflow-visible"
                  onClick={() => window.open(`/projects/${index + 1}`, "_self")}>
                  <div className="relative w-full h-full overflow-hidden rounded-2xl p-6 flex flex-col">
                    {/* Top content area - 25% */}
                    <div className="h-1/4 flex flex-row justify-between items-start mb-4 z-10">
                      <p className="text-foreground/90 text-lg leading-relaxed mb-4 max-w-md">
                        {project.short_description}
                      </p>
                      <div className="flex justify-end">
                        <motion.div
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 backdrop-blur-sm border border-border/20 transition-all duration-300 hover:bg-muted hover:border-border/40 hover:shadow-lg cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open(`/projects/${index + 1}`, "_self")}
                        >
                          <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Image section - 75% height plus overflow */}
                    <div className="relative h-full">
                      <motion.div
                        className="absolute inset-0 top-0 rounded-xl border border-foreground/20 overflow-hidden"
                        style={{ height: "130%" }}
                        variants={{
                          rest: { y: 0, scale: 1 },
                          hover: { y: -10, scale: 1.02, rotate: 1 },
                        }}
                        transition={{ duration: 0.3, ease: "anticipate" }}>
                        {isLoading ? (
                          <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                            <InlineLoader />
                          </div>
                        ) : (
                          <Image
                            src={project.image}
                            alt={project.name}
                            width={1200}
                            height={800}
                            className="w-full h-full object-cover"
                            onLoad={() => setIsLoading(false)}
                          />
                        )}
                      </motion.div>
                    </div>
                  </div>
                </DoubleOutlinedCard>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Right Side - Sticky Project Details */}
        <div className="flex-1 inline-block max-w-xl">
          <div className="sticky top-20">
            <motion.div
              ref={detailsRef}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="h-fit max-w-lg"
              style={{
                // Ensure the sticky element stays within its container
                alignSelf: "flex-start",
              }}>
              <div className="space-y-8 p-8 rounded-2xl relative min-h-[600px]">
                <motion.div 
                  key={`details-${activeCard}`}
                  className="absolute inset-0 p-8 space-y-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}>
                {/* Project Title */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}>
                  <h3 className="text-3xl font-bold leading-relaxed text-foreground">
                    {projects[activeCard]?.name}
                  </h3>

                  <p className={`text-base leading-relaxed text-foreground/50`}>
                    {projects[activeCard]?.description}
                  </p>
                </motion.div>

                {/* Technologies */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}>
                  
                  <div className="flex flex-wrap gap-3">
                    {projects[activeCard]?.tags?.map(
                      (tag: any, tagIndex: number) => {
                        const tech = technologies.find(
                          (t) =>
                            t.name
                              .toLowerCase()
                              .includes(tag.name.toLowerCase()) ||
                            tag.name
                              .toLowerCase()
                              .includes(t.name.toLowerCase())
                        );
                        const IconComponent = tech?.icon;

                        return (
                          <motion.div
                            key={tagIndex}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.3 + tagIndex * 0.1,
                            }}>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-2">
                              {IconComponent && (
                                <IconComponent className="w-4 h-4" />
                              )}
                              <span className="capitalize">{tag.name}</span>
                            </Badge>
                          </motion.div>
                        );
                      }
                    )}
                  </div>
                </motion.div>

                {/* Key Features */}
                <motion.div
                  className="space-y-4 text-chart1 text-chart2 text-chart3 text-chart4 text-chart5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}>
                  <h4 className="text-foreground font-semibold text-xl flex items-center gap-2">
                    <Sparkles className={`w-4 h-4 fill-current text-glow-${activeCard % 4 + 1} text-chart${activeCard % 4 + 1}`} />
                    Key Features
                  </h4>

                  <div className="space-y-3 text-foreground/80">
                    {[
                      "Built with modern tech stack for optimal performance",
                      "Responsive design optimized for all devices",
                      "Clean, intuitive user interface and experience",
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.5 + index * 0.1,
                        }}>
                        <Sparkle className={`w-3 h-3 text-glow-${activeCard % 4 + 1} text-chart${activeCard % 4 + 1} fill-current`} />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex gap-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}>
                  <motion.button
                    onClick={() => window.open(`/projects/${activeCard + 1}`, "_self")}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-background/30 backdrop-blur-md border border-border/50 rounded-xl text-foreground font-medium hover:bg-background/50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}>
                    <RocketIcon className="w-4 h-4" />
                    <span>View Details</span>
                  </motion.button>

                  <motion.button
                    onClick={() =>
                      window.open(
                        projects[activeCard]?.link,
                        "_blank"
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-xl text-primary font-medium hover:bg-primary/20 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}>
                    {projects[activeCard]?.type === "web" ? <GlobeIcon className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    <span>{projects[activeCard]?.type === "web" ? "Live Demo" : "Donwload App"}</span>
                  </motion.button>
                </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden px-4 sm:px-6 w-full max-w-[100vw]">
        {projects.map((project, index) => (
          <div
            key={`mobile-${project.name}-${index}`}
            className="mb-16 last:mb-0">
            <motion.div
              className="w-full group"
              whileHover="hover"
              initial="rest"
              animate="rest">
              <DoubleOutlinedCard
                showHeader={false}
                className="w-full h-auto cursor-pointer relative overflow-visible shadow-lg"
                contentClassName="p-0 relative overflow-visible"
                onClick={() => window.open(`/projects/${index + 1}`, "_self")}>
                <div className="relative w-full overflow-hidden rounded-2xl">
                  {/* Image Section */}
                  <motion.div
                    className="relative aspect-[16/10] w-full rounded-xl overflow-hidden"
                    variants={{
                      rest: { scale: 1 },
                      hover: { scale: 1.02 },
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}>
                    <Image
                      src={project.image}
                      alt={project.name}
                      width={1200}
                      height={800}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
              </DoubleOutlinedCard>
            </motion.div>

            {/* Details Section */}
            <div className="mt-6 space-y-6 px-4">
              {/* Project Title */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">
                  {project.name}
                </h3>
                <p className="text-base leading-relaxed text-foreground/70">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="space-y-3">
                <h4 className="text-foreground font-semibold text-lg flex items-center gap-2">
                  <Laptop className={`w-4 h-4 fill-current text-glow-${index % 4 + 1} text-chart${index % 4 + 1}`} />
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag: any, tagIndex: number) => {
                    const tech = technologies.find(
                      (t) =>
                        t.name.toLowerCase().includes(tag.name.toLowerCase()) ||
                        tag.name.toLowerCase().includes(t.name.toLowerCase())
                    );
                    const IconComponent = tech?.icon;

                    return (
                      <Badge
                        key={tagIndex}
                        variant="outline"
                        className="flex items-center gap-2">
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                        <span className="capitalize">{tag.name}</span>
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-3">
                <h4 className="text-foreground font-semibold text-lg flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 fill-current text-glow-${index % 4 + 1} text-chart${activeCard % 4 + 1}`} />
                  Key Features
                </h4>

                <div className="space-y-2 text-foreground/80">
                  <div className="flex items-center gap-3">
                    <Sparkle className={`w-3 h-3 text-glow-${index % 4 + 1} text-chart${index % 4 + 1} fill-current`} />
                    <span>
                      Built with modern tech stack for optimal performance
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkle className={`w-3 h-3 text-glow-${index % 4 + 1} text-chart${index % 4 + 1} fill-current`} />
                    <span>Responsive design optimized for all devices</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkle className={`w-3 h-3 text-glow-${index % 4 + 1} text-chart${index % 4 + 1} fill-current`} />
                    <span>Clean, intuitive user interface and experience</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <motion.button
                  onClick={() => window.open(`/projects/${index + 1}`, "_self")}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-background/30 backdrop-blur-md border border-border/50 rounded-xl text-foreground font-medium hover:bg-background/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  <RocketIcon className="w-4 h-4" />
                  <span>View Details</span>
                </motion.button>

                <motion.button
                  onClick={() => window.open(project.link, "_blank")}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-xl text-primary font-medium hover:bg-primary/20 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  <GlobeIcon className="w-4 h-4" />
                  <span>Live Demo</span>
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Works, "work", true);
