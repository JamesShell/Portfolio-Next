import React from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/hoc";
import { projects } from "@/constants";
import { textVariant } from "@/utils/motion";
import DoubleOutlinedCard from "@/components/ui/double-outlined-card";
import { Button } from "@/components/ui/button";
import { styles } from "@/styles/style";
import { cn } from "@/lib/utils";
import { RocketIcon, GlobeIcon } from "@radix-ui/react-icons";
import { IconType } from "react-icons/lib";
import Image from "next/image";

interface ProjectCardProps {
  index: number;
  name: string;
  description: string;
  tags: string[]; // Assuming tags are strings; adjust if necessary
  image: string;
  source_code_link: string;
  Icon: IconType; // Use IconType for react-icons
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  Icon,
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="group w-full flex lg:flex-row hover:flex-col-reverse flex-col-reverse items-center min-h-[400px] relative"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
    >
      <motion.div className="details flex flex-col z-10 lg:w-7/12 w-full lg:group-hover:hidden lg:mt-0 mt-5">
        <h3
          className={cn(
            "glow-text mb-3 lg:text-start text-center",
            styles.workHeadText
          )}
        >
          {name}
        </h3>
        <p className="p-6 relative main-card text-sm bg-muted/50 border border-foreground/20 rounded-lg shadow-lg backdrop-blur-md">
          {description}
        </p>
      </motion.div>
      <DoubleOutlinedCard
        showHeader={false}
        className="lg:group-hover:w-full lg:group-hover:relative lg:absolute relative right-0 aspect-video w-full lg:w-8/12 h-auto transition-all duration-300 ease-in-out"
        contentClassName="p-0 flex items-center justify-center overflow-hidden"
      >
        <Image
          src={image}
          alt={name}
          className="w-full h-full object-cover dark:md:group-hover:faded"
        />
        <div className="absolute bottom-8 flex space-x-4 md:hidden group-hover:block">
          <Button onClick={() => window.open(source_code_link, '_blank')} className="mt-8 max-w-fit h-fit bg-shiny-header p-0 pt-[2px] rounded-lg shadow-sm">
            <div className="bg-muted/90 rounded-lg px-5 py-3 w-full h-full flex items-center space-x-2">
              <RocketIcon className="text-primary" />
              <div className="text-primary text-[15px] font-bold">Show More</div>
            </div>
          </Button>
          <Button onClick={() => window.open('https://jelth.com', '_blank')} className="mt-8 max-w-fit h-fit bg-shiny-header p-0 pt-[2px] rounded-lg shadow-sm">
            <div className="bg-muted/90 rounded-lg px-5 py-3 w-full h-full flex items-center space-x-2">
              <GlobeIcon className="text-primary" />
              <div className="text-primary text-[15px] font-bold">Website</div>
            </div>
          </Button>
        </div>
      </DoubleOutlinedCard>
    </motion.div>
  );
};

const Works: React.FC = () => {
  return (
    <>
      <motion.div variants={textVariant({delay: 0})}>
        <h3 className={styles.sectionSubText}>My Projects</h3>
        <h2 className={styles.sectionHeadText}>Works</h2>
      </motion.div>

      <div className="mt-8 xs:mt-10 flex flex-wrap gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "work");
