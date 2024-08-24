// Type definitions for the animation variant functions
type Direction = 'left' | 'right' | 'up' | 'down';
type TransitionType = 'spring' | 'tween' | 'keyframes';

interface TextVariantProps {
  delay?: number;
}

interface FadeInProps {
  direction?: Direction;
  type?: TransitionType;
  delay?: number;
  duration?: number;
}

interface ZoomInProps {
  delay?: number;
  duration?: number;
}

interface SlideInProps {
  direction?: Direction;
  type?: TransitionType;
  delay?: number;
  duration?: number;
}

interface StaggerContainerProps {
  staggerChildren?: number;
  delayChildren?: number;
}

export const textVariant = ({ delay=0 }: TextVariantProps) => {
  return {
    hidden: {
      y: -50,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        duration: 1.25,
        delay: delay,
      },
    },
  };
};

export const fadeIn = ({ direction, type, delay, duration }: FadeInProps) => {
  return {
    hidden: {
      x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: 'easeOut',
      },
    },
  };
};

export const zoomIn = ({ delay, duration }: ZoomInProps) => {
  return {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'tween',
        delay: delay,
        duration: duration,
        ease: 'easeOut',
      },
    },
  };
};

export const slideIn = ({ direction, type, delay, duration }: SlideInProps) => {
  return {
    hidden: {
      x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
      y: direction === 'up' ? '100%' : direction === 'down' ? '100%' : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: 'easeOut',
      },
    },
  };
};

export const staggerContainer = ({ staggerChildren, delayChildren }: StaggerContainerProps) => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: delayChildren || 0,
      },
    },
  };
};
