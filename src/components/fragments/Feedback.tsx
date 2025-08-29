import React, { useRef, useState } from 'react';
import { SectionWrapper } from '@/hoc';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, textVariant } from '@/utils/motion';
import { testimonials } from '@/constants';
import { Badge } from '@/components/ui/badge';
import { DraggableCardBody, DraggableCardContainer } from '@/components/ui/draggable-card';
import { MessageSquare, User, MousePointerClickIcon } from 'lucide-react';
import { nyght } from '@/assets/font';
import { Cursor } from '@/components/ui/cursor';

const Feedback: React.FC = () => {
  return (
    <div className="w-full max-w-[100vw] px-4 sm:px-6 lg:px-8">
      {/* Enhanced Section Header */}
      <motion.div 
        variants={textVariant({ delay: 0 })}
        className="mb-16"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side - Content */}
          <motion.div 
            className="flex-1 items-center text-center"
            variants={fadeIn({ direction: "left", delay: 0.2, duration: 0.8 })}
          >
            <motion.div 
              className="inline-block mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Badge className="flex items-center gap-2" size={'xl'}>
                <MessageSquare className="w-4 h-4 text-foreground/80" />
                <span className="text-muted-foreground text-base uppercase">What others are saying</span>
              </Badge>
            </motion.div>
            
            <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 ${nyght.className}`}>
              Client <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>Feedback</span>
            </h1>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Draggable Testimonials */}
      <DraggableCardContainer className="relative flex flex-wrap justify-center gap-4 min-h-96 w-full max-w-[100vw]">
        {testimonials.map((item: any, index: number) => {
          // Generate consistent random values for each card based on index
          const randomRotation = (index * 17) % 21 - 10; // Random rotation between -10 and 10 degrees
          const randomX = Math.max(-20, Math.min(20, (index * 23) % 41 - 20)); // Constrained X offset between -20 and 20px
          const zIndex = testimonials.length - index; // Stack order (first card on top)
          
          // Calculate safe horizontal positioning that won't overflow
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          const cardWidth = 280; // Approximate card width
          const maxCards = Math.floor(typeof window !== 'undefined' ? window.innerWidth / (cardWidth + 40) : 3);
          const safeSpacing = isMobile ? 60 : Math.min(120, Math.max(40, (typeof window !== 'undefined' ? window.innerWidth : 1200) / testimonials.length * 0.8));
          const centerOffset = (testimonials.length - 1) * safeSpacing * 0.5;
          
          return (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0, 
                y: 0,
                x: randomX,
                rotate: randomRotation,
                z: index * -2 // Slight depth stacking
              }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                x: randomX,
                rotate: randomRotation 
              }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              viewport={{ once: true }}
              className="absolute"
              style={{
                zIndex: zIndex,
                left: `calc(50% + ${Math.max(-centerOffset, Math.min(centerOffset, index * safeSpacing - centerOffset))}px)`, // Safe horizontal distribution
                transform: `translateX(-50%)`, // Center each card on its position
              }}
            >
              <DraggableCardBody className="bg-background/90 backdrop-blur-md border border-border/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:z-[999] w-fit max-w-[280px] sm:max-w-[300px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 rounded-2xl"></div>
                
                {/* Quote Icon */}
                <div className="relative mb-4">
                  <MessageSquare className="w-8 h-8 text-primary/60" />
                </div>
                
                {/* Testimonial Content */}
                <div className="relative z-10">
                  <blockquote className="text-foreground/80 mb-6 leading-relaxed text-sm italic">
                    "{item.testimonial}"
                  </blockquote>
                  
                  {/* Author Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted/50 backdrop-blur-sm border border-border/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-medium text-base">{item.name}</h4>
                      {item.company && (
                        <p className="text-muted-foreground text-xs">{item.company}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </DraggableCardBody>
            </motion.div>
          );
        })}
      </DraggableCardContainer>
    </div>
  );
};

export default SectionWrapper(Feedback, 'feedback');
