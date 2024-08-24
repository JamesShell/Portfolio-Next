import React from 'react';
import { SectionWrapper } from '@/hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '@/utils/motion';
import { styles } from '@/styles/style';
import { testimonials } from '@/constants';
import { Tilt } from 'react-next-tilt';

const Feedback: React.FC = () => {
  return (
    <div>
      <motion.div variants={textVariant({})}>
        <h2 className={styles.sectionHeadText}>Feedback</h2>
        <h3 className={styles.sectionSubText}>What others are saying?</h3>
      </motion.div>
      <div className="mt-8 xs:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item: any, index: number) => (
          <Tilt key={index} className='max-h-fit' borderRadius='12px' perspective='1400px'>
            <motion.div
              variants={fadeIn({
                direction: 'up',
                type: 'spring',
                delay: index * 0.2,
                duration: 0.5
              })}
              className="relative bg-muted border border-foreground/20 rounded-lg shadow-lg p-6 main-card h-full"
            >
              <h3 className="text-primary text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-primary/80">{item.testimonial}</p>
            </motion.div>
          </Tilt>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Feedback, 'feedback');
