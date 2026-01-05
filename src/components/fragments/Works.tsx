"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/hoc";
import { projects } from "@/constants";
import { trackEvent } from "@/lib/analytics";
import { Heart, Video } from "@phosphor-icons/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { nyght } from "@/assets/font";
import { Badge } from "../ui/badge";

const Works: React.FC = () => {
  // Duplicate projects for seamless infinite loop
  const duplicatedProjects = [...projects, ...projects, ...projects];




  return (
    <div className="w-full" id="work">
      {/* Section Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Badge 
              variant="default" 
              size="xl" 
              className="text-muted-foreground uppercase"
            >
              <Heart className="w-3 h-3 mr-2" weight="bold" />
              Built with passion
            </Badge>
          </motion.div>
          
          <h2 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 ${nyght.className}`}>
            Featured <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>Works</span>
          </h2>
        </motion.div>
      </div>

      {/* Infinite Looping Slider */}
      <div className="relative w-full">
        <div
          className="flex animate-marquee hover:[animation-play-state:paused]"
        >
          {duplicatedProjects.map((project, index) => (
            <motion.div
              key={`${project.name}-${index}`}
              whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
              className="flex-shrink-0 w-[450px] md:w-[600px] cursor-pointer group pr-6"
              onClick={() => trackEvent('view_project', { name: project.name })}
            >
              {/* Title Section - Top */}
              <div className="mb-3">
                {/* Small Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-primary rounded-sm" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {project.type === "web" ? "Web Project" : "Case Study"}
                  </span>
                </div>
                
                {/* Project Title */}
                <h3 className="text-3xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                
                {/* Subtitle */}
                <p className="text-sm text-muted-foreground mt-1">
                  {project.short_description || "Web Development"}
                </p>
              </div>

              {/* Image or Video - Bottom */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                {project.video ? (
                   <div className="w-full h-full bg-black relative">
                      <video 
                        src={project.video} 
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                   </div>
                ) : (
                    project.image && (
                    <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    )
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Works, "projects", true);
