"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "@/hoc";
import { nyght } from "@/assets/font";
import { 
  ArrowsLeftRight,
  Check,
  X
} from "@phosphor-icons/react";

interface ComparisonItem {
  category: string;
  me: string;
  others: string;
}

const comparisonData: ComparisonItem[] = [
  {
    category: "Strategy & conversion",
    me: "Conversion-first structure (CTA, sections, messaging). Includes basic tracking setup.",
    others: "“Looks good” first—conversion decisions come later (or not at all)."
  },
  {
    category: "Design approach",
    me: "Tailored layout + visuals for your product—no cookie-cutter pages.",
    others: "Template-first or reused patterns across clients."
  },
  {
    category: "Turnaround",
    me: "First draft in 3–5 days. Typical launch 7–14 days (scope-dependent).",
    others: "Queue-based timelines—often weeks before real progress."
  },
  {
    category: "Communication",
    me: "Direct to me. Updates every 48h. Avg reply same day.",
    others: "Handoffs + waiting on multiple people."
  },
  {
    category: "Pricing",
    me: "Fixed packages. Clear deliverables, no surprise add-ons.",
    others: "Retainers/change fees + unclear scope creep."
  },
  {
    category: "Delivery & handoff (agency-friendly)",
    me: "Clean handoff: Figma files + components + docs (or Webflow/WordPress ready).",
    others: "Hard to maintain later / limited documentation."
  },
];

const WhyChooseMe: React.FC = () => {
  return (
    <div className="relative py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 ${nyght.className}`}>
            Why choose <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>me?</span>
          </h2>
          
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Before you hire or sign with an agency, compare what I include (and what they usually don't).
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >


          {/* Responsive Table View */}
          <div className="block p-3 overflow-x-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 relative gap-4 min-w-full md:min-w-[700px]">
              
              {/* Backdrop Card for Me/Others columns */}
              <div 
                className="col-start-1 md:col-start-2 col-span-2 row-start-1 row-end-[-1] relative rounded-[1.5rem] border overflow-hidden bg-white border-zinc-200 shadow-[0_0_0_3px_#fafafa,0_0_0_4px_rgba(0,0,0,0.08)] dark:bg-zinc-900 dark:border-zinc-700 dark:shadow-[0_0_0_3px_#27272a,0_0_0_4px_rgba(255,255,255,0.08)]"
                style={{ gridRow: `1 / span ${comparisonData.length + 1}` }}
              >
                 {/* Top gradients */}
                 <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none flex z-10">
                  {/* Me column - green gradient */}
                  <div className="flex-1 bg-gradient-to-b from-emerald-100/60 dark:from-emerald-900/20 via-green-50/30 dark:via-green-900/10 to-transparent" />
                  {/* Others column - red gradient */}
                  <div className="flex-1 bg-gradient-to-b from-red-100/50 dark:from-red-900/15 via-rose-50/25 dark:via-rose-900/8 to-transparent" />
                </div>
              </div>

              {/* Header Row */}
              <div className="col-start-1 hidden md:flex p-6 items-center" style={{ gridRow: 1 }}>
                 {/* Empty Category Header */}
              </div>
              <div className="col-start-1 md:col-start-2 p-6 text-center border-b border-zinc-100 dark:border-zinc-800 relative z-20" style={{ gridRow: 1 }}>
                <span className="text-lg font-bold text-zinc-900 dark:text-white">Working with me</span>
              </div>
              <div className="col-start-2 md:col-start-3 p-6 text-center border-b border-zinc-100 dark:border-zinc-800 relative z-20" style={{ gridRow: 1 }}>
                <span className="text-base font-semibold text-zinc-500 dark:text-zinc-400">Typical agency process</span>
              </div>

              {/* Data Rows */}
              {comparisonData.map((item, index) => (
                <React.Fragment key={index}>
                  {/* Category */}
                  <div className="col-start-1 hidden md:flex p-6 items-start text-sm font-semibold text-zinc-800 dark:text-zinc-200" style={{ gridRow: index + 2 }}>
                    {item.category}
                  </div>

                  {/* Me Column */}
                  <div className={`col-start-1 md:col-start-2 p-6 flex items-start gap-2 relative z-20 ${
                    index !== comparisonData.length - 1 ? "border-b border-zinc-100 dark:border-zinc-800" : ""
                  }`} style={{ gridRow: index + 2 }}>
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" weight="bold" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{item.me}</span>
                  </div>

                  {/* Others Column */}
                  <div className={`col-start-2 md:col-start-3 p-6 flex items-start gap-2 relative z-20 ${
                    index !== comparisonData.length - 1 ? "border-b border-zinc-100 dark:border-zinc-800" : ""
                  }`} style={{ gridRow: index + 2 }}>
                    <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" weight="bold" />
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">{item.others}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(WhyChooseMe, "features");
