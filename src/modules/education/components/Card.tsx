import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  noPadding?: boolean;
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className = '', 
  noPadding = false, 
  hoverable = false,
  ...props 
}, ref) => {
  const baseStyle: React.CSSProperties = {
    padding: noPadding ? '0' : 'var(--spacing-6)',
    backgroundColor: 'var(--color-surface-card)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--color-surface-border)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'box-shadow var(--transition-normal), border-color var(--transition-normal)',
    overflow: 'hidden',
    position: 'relative',
    ...props.style,
  };

  return (
    <motion.div 
      ref={ref}
      style={baseStyle} 
      className={className} 
      whileHover={hoverable ? { y: -2, boxShadow: 'var(--shadow-lg)' } : {}}
      layout
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';
