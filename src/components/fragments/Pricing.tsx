"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "@/hoc";
import { nyght } from "@/assets/font";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { 
  Check,
  Calendar,
  Sparkle
} from "@phosphor-icons/react";
import { useContactModal } from "@/context/ContactModalContext";
import { trackEvent } from "@/lib/analytics";

type PlanCategory = "all" | "design" | "development";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  category: PlanCategory[];
  badge?: string;
  fastDelivery?: boolean;
  variant: "default" | "gradient" | "dark";
  fullWidth?: boolean;
}

const plans: Plan[] = [
  {
    id: "landing-page",
    name: "Landing Page",
    description: "A high-converting, launch-ready landing page designed and built fast.",
    price: "$1,999",
    period: "/fixed",
    features: [
      "1-page design + build (responsive)",
      "Kickoff call + goal alignment",
      "Wireframe + final UI design",
      "Development (Webflow / Framer / custom)",
      "Basic on-page SEO",
      "Analytics setup + conversion tracking",
      "Lead capture form + email notifications",
      "2 rounds of revisions",
      "7 days post-launch support",
    ],
    category: ["all", "design"],
    fastDelivery: true,
    variant: "default",
  },
  {
    id: "premium-page",
    name: "Premium Page",
    description: "A premium, conversion-focused page with advanced polish and integrations.",
    price: "$2,999",
    period: "/fixed",
    features: [
      "Everything in Landing Page",
      "Deeper conversion structure",
      "Advanced interactions/animations",
      "Speed + performance optimization",
      "Stronger integration set",
      "3 rounds of revisions",
      "14 days post-launch support",
      "Mini style guide",
    ],
    category: ["all", "design"],
    variant: "gradient",
  },
  {
    id: "product-partnership",
    name: "Product Partnership Retainer",
    description: "Ongoing design + development support to ship improvements every month.",
    price: "$1,499",
    period: "/month",
    features: [
      "Monthly strategy + planning call",
      "Priority support + async comms",
      "Landing page tweaks + new sections",
      "UI improvements + component updates",
      "A/B test support",
      "Analytics review + recommendations",
      "Bug fixes + emergency fixes",
      "Ship list summary at month end",
    ],
    badge: "Limited availability",
    category: ["all", "development"],
    variant: "dark",
    fullWidth: true,
  },
];

const Pricing: React.FC = () => {
  const [category, setCategory] = useState<string>("all");
  const { openBooking } = useContactModal();

  const filteredPlans = plans.filter((plan) =>
    plan.category.includes(category as PlanCategory)
  );

  return (
    <div className="relative py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 ${nyght.className}`}>
            Flexible plans for{" "}
            <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>
              every business
            </span>
          </h2>
          
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto mb-8">
            Your product design partner. Unlock instant, world-class design with a simple monthly fee.
          </p>
        </motion.div>

        {/* Pricing Cards Grid - 2 cols max, with spanning */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className={`
                  relative 
                  ${plan.fullWidth ? "lg:col-span-2" : "col-span-1"}
                `}
              >
                {/* Outer Card Container - "Doubled Outline" effect via padding + border */}
                <div className={`
                  h-full rounded-[2rem] p-3 border transition-all duration-300
                  bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700
                `}>
                  {/* Inner Frame (Title, Desc, Price, CTA) */}
                  <div className={`
                    relative rounded-[1.5rem] p-8 mb-8 border overflow-hidden
                    ${plan.variant === "dark"
                      ? "bg-zinc-950 border-zinc-800" 
                      : "bg-white border-zinc-200 shadow-[0_0_0_3px_#fafafa,0_0_0_4px_rgba(0,0,0,0.08)] dark:bg-zinc-900 dark:border-zinc-700 dark:shadow-[0_0_0_3px_#27272a,0_0_0_4px_rgba(255,255,255,0.08)]"
                    }
                  `}>
                    {/* Subtle gradient at top for non-dark variants */}
                    {plan.variant == "gradient" && (
                      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-purple-100/50 dark:from-purple-900/10 via-pink-50/30 dark:via-pink-900/5 to-transparent dark:to-zinc-900/0 pointer-events-none" />
                    )}
                    
                    {/* Badge for Limited Availability */}
                    {plan.badge && (
                      <div className="absolute top-8 right-8 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs uppercase tracking-wide font-medium text-white/70">
                          {plan.badge}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex flex-col h-full relative z-10">
                        <h3 className={`text-3xl font-bold mb-3 tracking-tight ${
                          plan.variant === "dark" ? "text-white" : "text-zinc-900 dark:text-white"
                        }`}>
                          {plan.name}
                        </h3>
                        <p className={`text-base mb-8 max-w-xs leading-relaxed font-medium ${
                          plan.variant === "dark" ? "text-zinc-400" : "text-zinc-500"
                        }`}>
                          {plan.description}
                        </p>

                        {/* Price Block */}
                        <div className="mb-8">
                          <div className="flex items-baseline gap-0.5">
                            <span className={`text-xl font-medium ${
                              plan.variant === "dark" ? "text-white" : "text-zinc-900 dark:text-white"
                            }`}>
                              $
                            </span>
                            <span className={`text-5xl font-bold tracking-tighter  ${
                              plan.variant === "dark" ? "text-white" : "text-zinc-900 dark:text-white"
                            }`}>
                              {plan.price.replace("$", "").replace(",", "")}
                            </span>
                            {plan.period && (
                              <span className={`text-lg font-medium ml-1 ${
                                plan.variant === "dark" ? "text-zinc-600" : "text-zinc-400"
                              }`}>
                                {plan.period}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 text-base transition-all duration-300 ${
                            plan.variant === "dark"
                              ? "bg-white text-black hover:bg-zinc-200"
                              : "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
                          }`}
                          onClick={() => {
                            trackEvent('select_plan', { plan_id: plan.id, plan_name: plan.name });
                            openBooking && openBooking(plan.id);
                          }}
                        >
                          Book a call
                          <Calendar className="w-4 h-4" />
                        </motion.button>
                    </div>
                  </div>

                  {/* Features & Extra Content - Outside Inner Frame */}
                  <div className="px-6 pb-6">
                     <div className={`${plan.fullWidth ? "lg:flex lg:justify-between lg:items-center" : ""}`}>
                        <ul className={`grid gap-x-8 gap-y-4 ${
                          plan.fullWidth ? "grid-cols-1 sm:grid-cols-2 lg:flex-1" : "space-y-4"
                        }`}>
                          {plan.features.map((feature, featureIndex) => (
                            <li 
                              key={featureIndex}
                              className={`flex items-start gap-3 text-sm font-semibold ${
                                "text-zinc-600 dark:text-zinc-400"
                              }`}
                            >
                              <div className={`mt-0.5 rounded-full p-0.5 ${
                                "bg-black text-white dark:bg-white dark:text-black"
                              }`}>
                                <Check className="w-3 h-3" strokeWidth={4} />
                              </div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Pricing, "pricing");
