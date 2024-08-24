import React from "react";
import { SectionWrapper } from "@/hoc";
import { motion } from "framer-motion";
import { styles } from "@/styles/style";
import { Tilt } from "react-next-tilt";
import { fadeIn, textVariant } from "@/utils/motion";
import { technologies } from "@/constants";
import { IconType } from "react-icons";

const Tech = () => {
  return (
    <div>
      <motion.div variants={textVariant({ delay: 0 })}>
        <h3 className={styles.sectionSubText}>Tools & Frameworks</h3>
        <h2 className={styles.sectionHeadText}>Tech</h2>
      </motion.div>
      <motion.p
        variants={fadeIn({ direction: 'up', type: 'spring', delay: 0.1, duration: 1 })}
        className={styles.sectionPargText}
      >
        I have expertise in JavaScript, React, Node.js, Python, Flask, and
        Django, using these technologies to build scalable web applications,
        APIs, and solutions to complex problems. I am passionate about exploring
        new technologies and applying my skills to create efficient and
        user-friendly projects.
      </motion.p>

      <div className="mt-8 xs:mt-10 flex flex-wrap gap-3">
        {technologies.map((item, index) => (
          <TechItem
            key={index}
            index={index}
            title={item.name}
            Icon={item.icon}
          />
        ))}
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
        variants={fadeIn({
          direction: 'up',
          type: 'spring',
          delay: index * 0.2,
          duration: 0.5
        })}
        className="w-full bg-shiny-header pt-[1px] rounded-lg shadow-sm"
      >
        <div className="bg-muted/90 rounded-lg p-3 flex items-center">
          <div className="flex-shrink-0 mr-4">
            <div className="text-foreground/20 text-[20px]">
              <Icon />
            </div>
          </div>
          <div>
            <div className="text-primary text-[15px] font-bold">{title}</div>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
};

export default SectionWrapper(Tech, "tech");
