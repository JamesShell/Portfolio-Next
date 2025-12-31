"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

// Placeholder logos - Replace with actual client/company logos
const logos = [
  { name: "Company 1", placeholder: true },
  { name: "Company 2", placeholder: true },
  { name: "Company 3", placeholder: true },
  { name: "Company 4", placeholder: true },
  { name: "Company 5", placeholder: true },
  { name: "Company 6", placeholder: true },
];

const LogoCloud: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge 
            variant="default" 
            size="lg" 
            className="mb-4 text-muted-foreground uppercase"
          >
            <Building2 className="w-3 h-3 mr-2" />
            Trusted By
          </Badge>
          <p className="text-foreground/60 text-lg">
            Companies and clients I've worked with
          </p>
        </motion.div>

        {/* Logo Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center"
        >
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.1 }}
              className="w-24 h-12 flex items-center justify-center rounded-lg bg-muted/30 border border-border/20 backdrop-blur-sm transition-all duration-300 hover:bg-muted/50 hover:border-border/40"
            >
              {logo.placeholder ? (
                <span className="text-foreground/40 text-xs font-medium">
                  {logo.name}
                </span>
              ) : (
                // Replace with actual Image component when logos available
                <span className="text-foreground/40 text-xs font-medium">
                  {logo.name}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent"
        />
      </div>
    </section>
  );
};

export default LogoCloud;
