import React from 'react';
import { motion } from 'framer-motion';
import { styles } from '../styles/style';
import { staggerContainer } from '../utils/motion';

// Type definition for the HOC
type SectionWrapperProps = {
  idName: string;
};

export const SectionWrapper = <P extends object>(Component: React.ComponentType<P>, idName: string, fullScreen: boolean = false) => {
  // Function component with a generic type P
  return function HOC(props: P) {
    return (
      <motion.section 
        variants={staggerContainer({})}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className={`section ${!fullScreen && "container mx-auto"} ${styles.paddingY} px-0 relative`}
      >
        <span className='hash-span' id={idName}>
          &nbsp;
        </span>
        <Component {...props} />
      </motion.section>
    );
  };
};
