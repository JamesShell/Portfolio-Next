"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "@/hoc";
import { nyght } from "@/assets/font";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How long does a typical project take?",
    answer: "Timeline varies by project scope. A landing page typically takes 1-2 weeks, while a full web application can take 4-8 weeks. I'll give you an accurate estimate after our discovery call.",
  },
  {
    question: "What's your revision policy?",
    answer: "All plans include revisions. For fixed-price projects, I include 2 rounds of revisions. For monthly partnerships, unlimited revisions are included.",
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer: "Yes! I offer post-launch support to fix bugs and make minor updates. Extended maintenance packages are available for ongoing updates.",
  },
  {
    question: "What technologies do you work with?",
    answer: "I specialize in React, Next.js, Node.js, TypeScript, and Flutter. For databases, I work with PostgreSQL, MongoDB, and Firebase.",
  },
  {
    question: "How do we communicate during the project?",
    answer: "We'll have regular check-ins via video calls or messages. I provide frequent updates so you're always in the loop on progress.",
  },
];

const FAQ: React.FC = () => {
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
          <motion.div
            className="inline-block mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Badge 
              variant="default" 
              size="xl" 
              className="text-muted-foreground uppercase"
            >
              <HelpCircle className="w-3 h-3 mr-2" />
              FAQ
            </Badge>
          </motion.div>
          
          <h2 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 ${nyght.className}`}>
            Frequently asked{" "}
            <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>
              questions
            </span>
          </h2>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl bg-muted/30 border border-border/20 backdrop-blur-sm px-6 data-[state=open]:bg-muted/50"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(FAQ, "faq");
