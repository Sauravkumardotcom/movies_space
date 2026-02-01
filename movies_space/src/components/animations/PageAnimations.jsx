import React from 'react';
import { motion } from 'framer-motion';

/**
 * Page Transition Wrapper - Adds smooth transitions between pages
 * Uses Framer Motion for animations
 */
export const PageTransition = ({ children, direction = 'right' }) => {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'right' ? 100 : -100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      x: direction === 'right' ? -100 : 100,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

/**
 * Stagger Container - Container for staggered animations of children
 */
export const StaggerContainer = ({ children, delay = 0.1 }) => {
  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      {children}
    </motion.div>
  );
};

/**
 * Stagger Item - Individual item for staggered animation
 */
export const StaggerItem = ({ children }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div variants={variants}>
      {children}
    </motion.div>
  );
};

/**
 * Hover Scale Animation
 */
export const HoverScale = ({ children, scale = 1.05 }) => {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: scale * 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Fade In Animation
 */
export const FadeIn = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Slide In Animation - Slides in from specified direction
 */
export const SlideIn = ({ children, direction = 'bottom', delay = 0 }) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -100, opacity: 0 };
      case 'right': return { x: 100, opacity: 0 };
      case 'top': return { y: -100, opacity: 0 };
      case 'bottom': return { y: 100, opacity: 0 };
      default: return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Pulse Animation - Continuous pulse effect
 */
export const Pulse = ({ children }) => {
  return (
    <motion.div
      animate={{ opacity: [1, 0.5, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Rotate Animation - Rotates on hover
 */
export const RotateOnHover = ({ children, rotation = 360 }) => {
  return (
    <motion.div
      whileHover={{ rotate: rotation }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Video Card Animation - Optimized for video cards with hover effects
 */
export const VideoCardAnimation = ({ children, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
};
