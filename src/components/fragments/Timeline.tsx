"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { nyght } from "@/assets/font";
import { SectionWrapper } from "@/hoc";
import { 
  Calendar, 
  MapPin, 
  Briefcase, 
  Award, 
  ExternalLink,
  Clock,
  Users,
  Code2,
  GraduationCap
} from "lucide-react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineData {
  period: string;
  role: string;
  company: string;
  location: string;
  type: "work" | "education" | "achievement";
  description: string;
  highlights: string[];
  skills: string[];
  link?: string;
}

const timelineData: TimelineData[] = [
  {
    period: "2023 - Present",
    role: "Full-Stack Developer",
    company: "Freelance",
    location: "Remote",
    type: "work",
    description: "Creating modern web applications with cutting-edge technologies, focusing on user experience and performance optimization.",
    highlights: [
      "Built 15+ responsive web applications",
      "Improved client conversion rates by 40%",
      "Specialized in React, Next.js, and Node.js"
    ],
    skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"]
  },
  {
    period: "2022 - 2023",
    role: "Frontend Developer",
    company: "Tech Startup",
    location: "San Francisco, CA",
    type: "work",
    description: "Developed user interfaces for SaaS products, collaborated with design teams to create intuitive user experiences.",
    highlights: [
      "Led frontend architecture decisions",
      "Reduced page load times by 60%",
      "Mentored 3 junior developers"
    ],
    skills: ["React", "Vue.js", "JavaScript", "CSS", "Figma"],
    link: "https://example.com"
  },
  {
    period: "2018 - 2022",
    role: "Bachelor of Computer Science",
    company: "University of Technology",
    location: "California, USA",
    type: "education",
    description: "Focused on software engineering, algorithms, and web development. Graduated with honors.",
    highlights: [
      "GPA: 3.8/4.0",
      "President of Computer Science Club",
      "Winner of 3 hackathons"
    ],
    skills: ["Java", "Python", "C++", "Data Structures", "Algorithms"]
  },
  {
    period: "2023",
    role: "AWS Solutions Architect",
    company: "Amazon Web Services",
    location: "Online Certification",
    type: "achievement",
    description: "Certified in designing distributed systems and cloud architecture on AWS platform.",
    highlights: [
      "Passed with 85% score",
      "Specialized in serverless architecture",
      "Expertise in cloud security"
    ],
    skills: ["AWS", "Cloud Architecture", "DevOps", "Security"],
    link: "https://aws.amazon.com"
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "work":
      return <Briefcase className="w-4 h-4" />;
    case "education":
      return <GraduationCap className="w-4 h-4" />;
    case "achievement":
      return <Award className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "work":
      return "border-blue-500/50 bg-blue-500/10";
    case "education":
      return "border-green-500/50 bg-green-500/10";
    case "achievement":
      return "border-purple-500/50 bg-purple-500/10";
    default:
      return "border-gray-500/50 bg-gray-500/10";
  }
};

const getTypeVariant = (type: string) => {
  switch (type) {
    case "work":
      return "success";
    case "education":
      return "destructive";
    case "achievement":
      return "warning";
    default:
      return "secondary";
  }
}

const TimelineContent: React.FC<{ item: TimelineData; index: number }> = ({ item, index }) => {
  return (
    <Card className="mb-8 border-border/30 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-foreground">
                {item.role}
              </h3>
              {item.link && (
                <motion.a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              )}
            </div>
            <p className="text-xl font-semibold text-foreground/80 mb-2">
              {item.company}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-foreground/60">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{item.location}</span>
              </div>
              <span className="hidden sm:block">•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{item.period}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              className={`capitalize shrink-0`}
              variant={getTypeVariant(item.type)}
            >
              <span className="flex items-center gap-1">
                {getTypeIcon(item.type)}
                {item.type}
              </span>
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p className="text-foreground/70 mb-6 leading-relaxed text-lg">
          {item.description}
        </p>

        {/* Highlights */}
        {item.highlights.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Key Achievements
            </h4>
            <ul className="space-y-2">
              {item.highlights.map((highlight, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-2 text-foreground/70"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{highlight}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {item.skills.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {item.skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-transparent dark:bg-transparent font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        {/* Section Header */}
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-block mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Badge className="flex items-center gap-2" size={'xl'}>
              <Clock className="w-4 h-4 text-foreground/80" />
              <span className="text-muted-foreground text-base uppercase">My Journey</span>
            </Badge>
          </motion.div>
          
          <h2 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 ${nyght.className}`}>
            Professional <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>Timeline</span>
          </h2>
          
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            A chronological overview of my professional experience, education, and key achievements 
            that have shaped my development journey.
          </p>
        </motion.div>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background border border-border flex items-center justify-center shadow-lg">
                <div className="h-4 w-4 rounded-full bg-primary border border-primary/20 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-foreground/60 dark:text-foreground/60">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-foreground/60 dark:text-foreground/60">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border dark:via-border to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

// Default Timeline component for the experience page
const DefaultTimeline = () => {
  const timelineEntries: TimelineEntry[] = timelineData.map((item, index) => ({
    title: item.period,
    content: <TimelineContent item={item} index={index} />,
  }));

  return <Timeline data={timelineEntries} />;
};

export default SectionWrapper(DefaultTimeline, "timeline");