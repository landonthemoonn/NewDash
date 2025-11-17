import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  whileHover?: any;
  whileTap?: any;
  initial?: any;
  animate?: any;
  transition?: any;
}

export function AnimatedButton({ 
  children, 
  className = '',
  whileHover = { scale: 1.05, y: -2 },
  whileTap = { scale: 0.95 },
  initial,
  animate,
  transition
}: AnimatedButtonProps) {
  return (
    <motion.div
      className={className}
      whileHover={whileHover}
      whileTap={whileTap}
      initial={initial}
      animate={animate}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
