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
  const baseClass = `ao-glass-panel ${hoverable ? 'ao-glass-panel-interactive' : ''} ${className}`;
  
  const inlineStyle: React.CSSProperties = {
    padding: noPadding ? '0' : 'var(--ao-space-6)',
    ...props.style,
  };

  return (
    <motion.div 
      ref={ref}
      style={inlineStyle} 
      className={baseClass} 
      layout
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';
