import React, { useState, useEffect } from "react";
import { SectionWrapper } from "@/hoc";
import { motion } from "framer-motion";
import { styles } from "@/styles/style";
import { Tilt } from "react-next-tilt";
import { fadeIn, textVariant } from "@/utils/motion";
import { technologies } from "@/constants";
import { IconType } from "react-icons";
import { nyght } from "@/assets/font";
import { Badge } from "../ui/badge";
import { Laptop, Stars } from "lucide-react";
import { MoonCanvas } from "@/components/canvas";

const Tech = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      <div className="container relative z-10">
        {/* Tech Hero Section */}
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
                  <Stars className="w-4 h-4 text-foreground/80" />
                  <span className="text-muted-foreground text-base">MY SKILLS</span>
                </Badge>
              </motion.div>
              
              <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 ${nyght.className}`}>
                Technologies &<br />
                <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>Tools I Use</span>
              </h1>
              
              <div className="space-y-4 text-lg text-foreground/70 leading-relaxed mb-8 text-center">
                <p>
                  I have expertise in JavaScript, React, Node.js, Python, Flask, and
                  Django, using these technologies to build scalable web applications,
                  APIs, and solutions to complex problems.
                </p>
                {/* <p>
                  I am passionate about exploring new technologies and applying my skills 
                  to create efficient and user-friendly projects that make a real impact.
                </p>
                <p className="font-semibold text-foreground">
                  Always learning, always growing!
                </p> */}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Tech Grid */}
        <motion.div 
          className="technologies mt-8 xs:mt-10"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  show: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 12
                    }
                  }
                }}
              >
                <TechItem
                  index={index}
                  title={item.name}
                  Icon={item.icon}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

interface TechItemProps {
  Icon: IconType; // or React.ComponentType if using other icon components
  title: string;
  index: number;
}


const TechItem: React.FC<TechItemProps> = ({ Icon, title, index }) => {
  return (
    <Tilt className="cursor-pointer relative" borderRadius="12px" perspective="600px" tiltClass="rounded-lg">
      <motion.div
        className="w-full shadow-sm bg-muted/40 backdrop-blur-md rounded-lg p-3 flex items-center"
      >
          <div className="flex-shrink-0 mr-4">
            <div className="text-foreground/20 text-[20px]">
              <Icon />
            </div>
          </div>
          <div>
            <div className="text-primary text-[15px] font-bold">{title}</div>
          </div>
      </motion.div>
    </Tilt>
  );
};

export default SectionWrapper(Tech, "tech");
