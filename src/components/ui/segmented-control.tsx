"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SegmentedControlOption {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  className,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-8 text-xs",
    md: "h-10 text-sm",
    lg: "h-12 text-base",
  };

  const itemSizeClasses = {
    sm: "px-3 h-6",
    md: "px-4 h-8", 
    lg: "px-6 h-10",
  };

  return (
    <div
      className={cn(
        "relative flex items-center rounded-full bg-muted p-1",
        sizeClasses[size],
        className
      )}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 flex items-center justify-center rounded-full transition-colors duration-200",
              itemSizeClasses[size],
              isSelected
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            style={{ flex: 1 }}
          >
            {isSelected && (
              <motion.div
                layoutId="segmented-control-indicator"
                className="absolute inset-0 rounded-full bg-background shadow-sm border"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                }}
              />
            )}
            <span className="relative z-20 flex items-center justify-center gap-2 whitespace-nowrap">
              {option.icon}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};