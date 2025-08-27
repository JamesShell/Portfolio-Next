import React, { Suspense, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Loading from "@/pages/_loading";
import { Navbar } from "@/components/fragments";
import { SectionWrapper } from "@/hoc";
import { styles } from "@/styles/style";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { fadeIn, textVariant } from "@/utils/motion";
import { sfPro, nyght } from "@/assets/font";
import { CheckCircle, ExternalLink, Github, Globe, ArrowLeft, Calendar, User, Clock, House } from "lucide-react";
import Image from "next/image";
import { StarsCanvas } from "@/components/canvas";
import MagneticButton from "@/components/ui/magnatic-button";
import { jelth, portfolio } from "@/assets";
import { StaticImageData } from "next/image";
import * as di from 'react-icons/di';
import { IconType } from 'react-icons/lib';
import { BlinkingSmiley } from "@/components/ui/global-loader";
import { Spotlight } from "@/components/ui/spotlight-new";

// Merged project data with working images from constants and detailed case study info
const allProjects = [
  {
    id: "1",
    title: "Portfolio Website",
    subtitle: "A modern, responsive portfolio website showcasing my work and skills. Built with cutting-edge technologies for optimal performance and user experience.",
    description: "A modern, responsive portfolio website showcasing my work and skills. Built with Next.js 14, TypeScript, and Tailwind CSS, featuring smooth animations with Framer Motion, 3D elements with Three.js, and a clean, accessible design system.",
    category: "Web Development",
    year: "2024",
    status: "Completed",
    client: "Personal Project",
    duration: "3 months",
    role: "Full Stack Developer",
    image: portfolio,
    // Icon: di.DiGithub, // Removed for serialization
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"],
    tags: [
      { name: "next.js", color: "#000000" },
      { name: "typescript", color: "#3178c6" },
      { name: "tailwind", color: "#3d8dd8" },
      { name: "three.js", color: "#000000" },
    ],
    features: [
      "SEO & Accessibility Focused",
      "Mobile & Responsive Design", 
      "Smooth Animations with Framer Motion",
      "3D Elements with Three.js",
      "Clean Design System",
      "TypeScript for Type Safety"
    ],
    architecture: [
      { title: "Frontend", description: "Built with Next.js 14 using the app directory structure with TypeScript and modern React patterns" },
      { title: "Styling", description: "Tailwind CSS with shadcn/ui components for consistent and accessible design" },
      { title: "Animations", description: "Framer Motion for smooth page transitions and scroll-based animations" },
      { title: "3D Graphics", description: "Three.js integration for interactive 3D elements and visual effects" },
      { title: "Performance", description: "Optimized for Core Web Vitals with lazy loading and efficient asset delivery" },
      { title: "Accessibility", description: "WCAG compliant with proper semantic HTML and keyboard navigation support" }
    ],
    techStack: [
      "TypeScript", "Next.js", "React", "Tailwind CSS", "Framer Motion", "Three.js", "shadcn/ui", "Vercel"
    ],
    challenges: [
      { 
        title: "Performance Optimization with 3D Elements",
        description: "Balancing visual appeal with performance by optimizing Three.js scenes and implementing efficient rendering strategies."
      },
      {
        title: "Accessibility in Animated Interfaces", 
        description: "Ensuring all animations respect user preferences and maintain accessibility standards while providing engaging interactions."
      },
      {
        title: "Type Safety Across Complex Components",
        description: "Implementing comprehensive TypeScript types for all components, especially complex animation and 3D element props."
      },
      {
        title: "Cross-Device Compatibility",
        description: "Ensuring consistent experience across different devices and screen sizes while maintaining interactive elements."
      }
    ],
    results: [
      "Perfect Lighthouse scores across all categories",
      "100% accessibility compliance with WCAG guidelines", 
      "Fast loading times with optimized assets and lazy loading",
      "Smooth animations that respect user motion preferences"
    ],
    faq: [
      {
        question: "What makes this portfolio stand out?",
        answer: "This portfolio combines modern web technologies with thoughtful design, featuring 3D elements, smooth animations, and accessibility-first approach while maintaining excellent performance metrics."
      },
      {
        question: "How are the 3D elements optimized?",
        answer: "The Three.js scenes are optimized using efficient geometries, texture compression, and selective rendering to ensure smooth performance across different devices."
      },
      {
        question: "Is the site accessible?",
        answer: "Yes, the site follows WCAG guidelines with proper semantic HTML, keyboard navigation, screen reader support, and respects user motion preferences for animations."
      },
      {
        question: "What's the tech stack?",
        answer: "Built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion for animations, and Three.js for 3D elements, all deployed on Vercel for optimal performance."
      }
    ],
    liveUrl: "https://aayushbharti.in",
    githubUrl: "https://github.com/aayushbharti/portfolio-next",
    source_code_link: "https://github.com/aayushbharti/portfolio-next"
  },
  {
    id: "2",
    title: "Jelth",
    subtitle: "A fully responsive web app where users complete tasks to earn gift cards. Built with modern technologies.",
    description: "A fully responsive web app where users complete tasks to earn gift cards. Built with React (Vite) for the frontend, Node.js for the backend, Firebase for authentication and database, and Redis for caching. Showcases a modern tech stack and effective web design.",
    category: "Web Application",
    year: "2023",
    status: "Completed",
    client: "Freelance Project",
    duration: "4 months",
    role: "Full Stack Developer",
    image: jelth,
    // Icon: di.DiGithub, // Removed for serialization
    technologies: ["React", "Node.js", "Firebase", "Redis", "Tailwind CSS"],
    tags: [
      { name: "react", color: "#1267b7" },
      { name: "nodejs", color: "#309700" },
      { name: "tailwind", color: "#3d8dd8" },
      { name: "firebase", color: "#ffa611" },
    ],
    features: [
      "User Task Management System",
      "Gift Card Rewards Integration", 
      "Real-time Progress Tracking",
      "Firebase Authentication",
      "Redis Caching for Performance",
      "Responsive Design"
    ],
    architecture: [
      { title: "Frontend", description: "React with Vite for fast development and optimized builds" },
      { title: "Backend", description: "Node.js server with Express for API endpoints and business logic" },
      { title: "Database", description: "Firebase Firestore for real-time data synchronization" },
      { title: "Authentication", description: "Firebase Auth for secure user management and authentication" },
      { title: "Caching", description: "Redis for caching frequently accessed data and improving performance" },
      { title: "Styling", description: "Tailwind CSS for responsive and modern UI design" }
    ],
    techStack: [
      "React", "Vite", "Node.js", "Express", "Firebase", "Firestore", "Firebase Auth", "Redis", "Tailwind CSS", "JavaScript"
    ],
    challenges: [
      { 
        title: "Real-time Data Synchronization",
        description: "Implementing efficient real-time updates across multiple users while maintaining data consistency and performance."
      },
      {
        title: "Reward System Architecture", 
        description: "Designing a scalable reward system that accurately tracks user progress and distributes gift cards reliably."
      },
      {
        title: "Performance with Large User Base",
        description: "Optimizing application performance using Redis caching and efficient database queries for smooth user experience."
      },
      {
        title: "User Experience Design",
        description: "Creating an intuitive interface that motivates users to complete tasks while maintaining clear progress tracking."
      }
    ],
    results: [
      "Successful deployment with active user base",
      "Efficient task completion and reward distribution system", 
      "Fast loading times with Redis caching implementation",
      "Positive user feedback on interface design and usability"
    ],
    faq: [
      {
        question: "How does the reward system work?",
        answer: "Users complete various tasks within the app and earn points that can be redeemed for gift cards. The system tracks progress in real-time and automatically processes rewards."
      },
      {
        question: "What technologies power the real-time features?",
        answer: "Firebase Firestore provides real-time database synchronization, while Redis caching ensures fast data retrieval for frequently accessed information."
      },
      {
        question: "Is the app mobile-responsive?",
        answer: "Yes, the app is built with a mobile-first approach using Tailwind CSS, ensuring it works seamlessly across all device sizes and screen orientations."
      },
      {
        question: "How is user data secured?",
        answer: "The app uses Firebase Authentication for secure user management, with proper data validation and secure API endpoints to protect user information."
      }
    ],
    liveUrl: "https://jelth-app.vercel.app",
    githubUrl: "https://github.com/JamesShell",
    source_code_link: "https://github.com/JamesShell"
  },
];


interface ProjectTag {
  name: string;
  color: string;
}

type Project = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category?: string;
  year?: string;
  status?: string;
  client?: string;
  duration?: string;
  role?: string;
  image?: StaticImageData;
  // Icon?: IconType; // Removed for serialization
  technologies?: string[];
  tags?: ProjectTag[];
  features?: string[];
  architecture?: { title: string; description: string }[];
  techStack?: string[];
  challenges?: { title: string; description: string }[];
  results?: string[];
  faq?: { question: string; answer: string }[];
  liveUrl?: string;
  githubUrl?: string;
  source_code_link?: string;
};

type Props = {
  project: Project | null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const project = allProjects.find((p) => p.id === id) || null;

  return { props: { project } };
};

// Create wrapper component that uses SectionWrapper
const ProjectPageContent: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="relative">
      <div className="container relative z-10">
        {/* Project Header */}
        <motion.div
          variants={textVariant({ delay: 0 })}
          className="mb-16"
        >
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
            {/* Left side - Content */}
            <motion.div 
              className="flex-1 text-left"
              variants={fadeIn({ direction: "left", delay: 0.2, duration: 0.8 })}
            >
              {/* Back Button */}
              <motion.div
                className="mb-6"
                whileHover={{ x: -5 }}
              >
                <MagneticButton href="/" variant="outline" className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </MagneticButton>
              </motion.div>

              {/* Category Badge */}
              <motion.div 
                className="inline-block mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Badge className="flex items-center gap-2" size={'xl'}>
                  <span className="text-muted-foreground text-base uppercase">
                    {project.category || "PROJECT CASE STUDY"}
                  </span>
                </Badge>
              </motion.div>
              
              {/* Title */}
              <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 ${nyght.className}`}>
                {project.title}
              </h1>
              
              {/* Subtitle */}
              {project.subtitle && (
                <p className="text-xl text-foreground/70 leading-relaxed mb-8 max-w-3xl">
                  {project.subtitle}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 mb-8 text-foreground/60">
                {project.year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{project.year}</span>
                  </div>
                )}
                {project.client && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{project.client}</span>
                  </div>
                )}
                {project.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{project.duration}</span>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {project.liveUrl && (
                  <MagneticButton href={project.liveUrl} target="_blank">
                    <Globe className="w-4 h-4 mr-2" />
                    View Live
                  </MagneticButton>
                )}
                {project.githubUrl && (
                  <MagneticButton href={project.githubUrl} target="_blank" variant="outline">
                    <Github className="w-4 h-4 mr-2" />
                    Source Code
                  </MagneticButton>
                )}
              </div>
            </motion.div>
            
            {/* Right side - Hero Image */}
            <motion.div 
              className="flex-shrink-0 w-full lg:w-1/2 max-w-2xl"
              variants={fadeIn({ direction: "right", delay: 0.4, duration: 0.8 })}
            >
              {project.image && (
                <motion.div 
                  className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-border/20 group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.ui8.net/uploads/annual-performance-report-2025-pitch-deck-chihiro-detail-image1_1753071305861.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Project Content Sections */}
        <motion.div
          className="space-y-20"
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
          {/* Overview Section */}
          <motion.section
            variants={fadeIn({ direction: "up", delay: 0.1, duration: 0.8 })}
          >
            <motion.div 
              className="inline-block mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Badge className="flex items-center gap-2" size={'xl'}>
                <span className="text-muted-foreground text-base uppercase">OVERVIEW</span>
              </Badge>
            </motion.div>
            
            <h2 className={`text-3xl lg:text-4xl font-semibold mb-6 ${nyght.className}`}>
              Project <span className="bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent font-medium italic">Overview</span>
            </h2>
            
            <p className="text-lg text-foreground/70 leading-relaxed max-w-4xl">
              {project.description}
            </p>
          </motion.section>

          {/* Tech Stack Section */}
          {project.techStack && (
            <motion.section
              variants={fadeIn({ direction: "up", delay: 0.2, duration: 0.8 })}
            >
              <motion.div 
                className="inline-block mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Badge className="flex items-center gap-2" size={'xl'}>
                  <span className="text-muted-foreground text-base uppercase">TECHNOLOGY STACK</span>
                </Badge>
              </motion.div>
              
              <h2 className={`text-3xl lg:text-4xl font-semibold mb-8 ${nyght.className}`}>
                Built with Modern <span className="bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent font-medium italic">Technologies</span>
              </h2>
              
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    viewport={{ once: true }}
                  >
                    <Badge 
                      variant="outline" 
                      className="text-base px-4 py-2"
                      style={{ "--glow-color": `var(--chart-${(index % 4) + 1})` } as React.CSSProperties}
                    >
                      {tech}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Features Section */}
          {project.features && (
            <motion.section
              variants={fadeIn({ direction: "up", delay: 0.3, duration: 0.8 })}
            >
              <motion.div 
                className="inline-block mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Badge className="flex items-center gap-2" size={'xl'}>
                  <span className="text-muted-foreground text-base uppercase">KEY FEATURES</span>
                </Badge>
              </motion.div>
              
              <h2 className={`text-3xl lg:text-4xl font-semibold mb-8 ${nyght.className}`}>
                Feature <span className="bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent font-medium italic">Highlights</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {project.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/20 hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <CheckCircle className={`w-6 h-6 mt-1 flex-shrink-0 text-glow-${(index % 4) + 1} text-chart${(index % 4) + 1}`} />
                    <span className="text-foreground/80 leading-relaxed">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Challenges Section */}
          {project.challenges && (
            <motion.section
              variants={fadeIn({ direction: "up", delay: 0.4, duration: 0.8 })}
            >
              <motion.div 
                className="inline-block mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Badge className="flex items-center gap-2" size={'xl'}>
                  <span className="text-muted-foreground text-base uppercase">CHALLENGES & SOLUTIONS</span>
                </Badge>
              </motion.div>
              
              <h2 className={`text-3xl lg:text-4xl font-semibold mb-8 ${nyght.className}`}>
                Overcoming <span className="bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent font-medium italic">Challenges</span>
              </h2>
              
              <Accordion type="multiple" className="w-full space-y-4">
                {project.challenges.map((challenge, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`challenge-${index}`} 
                    className="border border-border/20 rounded-xl px-6 bg-muted/20"
                  >
                    <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-6">
                      {challenge.title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <p className="text-foreground/70 leading-relaxed text-lg">
                        {challenge.description}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.section>
          )}

          {/* Results Section */}
          {project.results && (
            <motion.section
              variants={fadeIn({ direction: "up", delay: 0.5, duration: 0.8 })}
            >
              <motion.div 
                className="inline-block mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Badge className="flex items-center gap-2" size={'xl'}>
                  <span className="text-muted-foreground text-base uppercase">PROJECT RESULTS</span>
                </Badge>
              </motion.div>
              
              <h2 className={`text-3xl lg:text-4xl font-semibold mb-8 ${nyght.className}`}>
                Achieved <span className="bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent font-medium italic">Results</span>
              </h2>
              
              <div className="bg-gradient-to-br from-muted/40 via-muted/20 to-transparent rounded-2xl p-8 border border-border/20">
                <div className="space-y-4">
                  {project.results.map((result, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle className={`w-6 h-6 mt-1 flex-shrink-0 text-glow-${(index % 4) + 1} text-chart${(index % 4) + 1}`} />
                      <span className="text-foreground text-lg leading-relaxed">{result}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* FAQ Section */}
          {project.faq && (
            <motion.section
              variants={fadeIn({ direction: "up", delay: 0.6, duration: 0.8 })}
            >
              <motion.div 
                className="inline-block mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Badge className="flex items-center gap-2" size={'xl'}>
                  <span className="text-muted-foreground text-base uppercase">FREQUENTLY ASKED</span>
                </Badge>
              </motion.div>
              
              <h2 className={`text-3xl lg:text-4xl font-semibold mb-8 ${nyght.className}`}>
                Common <span className="bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent font-medium italic">Questions</span>
              </h2>
              
              <Accordion type="single" collapsible className="w-full space-y-4">
                {project.faq.map((item, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`} 
                    className="border border-border/20 rounded-xl px-6 bg-muted/20"
                  >
                    <AccordionTrigger className="text-left font-medium text-lg hover:no-underline py-6">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <p className="text-foreground/70 leading-relaxed text-lg">
                        {item.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.section>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default function ProjectPage({ project }: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Always show coming soon for now
  return (
    <div className={`relative z-0 ${sfPro.className}`}>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Spotlight />
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.1
                  }
                }
              }}
              className="max-w-2xl mx-auto"
            >
              {/* Icon */}
              <motion.div
                variants={fadeIn({ direction: "up", delay: 0, duration: 0.6 })}
                className="mb-8 flex flex-col items-center justify-center gap-y-3"
              >
                <BlinkingSmiley />
                
                <motion.div 
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge className="flex items-center gap-2" size={'xl'}>
                    <span className="text-muted-foreground text-base uppercase">
                      COMING SOON
                    </span>
                  </Badge>
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.div
                variants={fadeIn({ direction: "up", delay: 0.2, duration: 0.6 })}
                className="mb-6"
              >
                <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-4 ${nyght.className}`}>
                  Project Case <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>Studies</span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.div
                variants={fadeIn({ direction: "up", delay: 0.3, duration: 0.6 })}
                className="mb-12"
              >
                <p className="text-xl text-foreground/70 leading-relaxed max-w-xl mx-auto">
                  Detailed project case studies are currently being crafted. Check back soon to see in-depth breakdowns of my work.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                variants={fadeIn({ direction: "up", delay: 0.4, duration: 0.6 })}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.div whileHover={{ x: -5 }}>
                  <MagneticButton href="/" className="flex items-center gap-2">
                    <House className="w-4 h-4" />
                    Back to Home
                  </MagneticButton>
                </motion.div>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                variants={fadeIn({ direction: "up", delay: 0.6, duration: 0.6 })}
                className="mt-12"
              >
                <div className="bg-background/50 backdrop-blur-md border border-border/30 rounded-2xl p-6 max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 rounded-2xl"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <p className="text-foreground/80 font-medium">
                      Expected: Soon™
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Stars Canvas Background */}
        {isClient && (
          <StarsCanvas />
        )}
      </div>
  );

  // Wrap the content with SectionWrapper
  const WrappedProjectContent = SectionWrapper(ProjectPageContent, "project");

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className={`relative z-0 ${sfPro.className}`}>
        <Navbar />
        
        <Suspense fallback={<Loading />}>
          {isClient && (
            <>
              <div className="space-y-32 py-20">
                <WrappedProjectContent project={project} />
              </div>
              
              {/* Stars Canvas Background */}
              <div className="relative z-0">
                <StarsCanvas />
              </div>
            </>
          )}
        </Suspense>
      </div>
    </ThemeProvider>
  );
}
