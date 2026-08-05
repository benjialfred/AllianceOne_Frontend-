import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface BadgeProps extends HTMLMotionProps<"span"> {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'gold';
  icon?: LucideIcon;
  size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ 
  label, 
  variant = 'default', 
  icon: Icon,
  size = 'md',
  style, 
  className = '',
  ...props 
}, ref) => {
  const getVariantColors = () => {
    switch (variant) {
      case 'success': return { bg: 'var(--color-success-bg)', color: 'var(--color-success-text)', border: 'var(--color-success-border)' };
      case 'warning': return { bg: 'var(--color-warning-bg)', color: 'var(--color-warning-text)', border: 'var(--color-warning-border)' };
      case 'danger': return { bg: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', border: 'var(--color-danger-border)' };
      case 'info': return { bg: 'var(--color-info-bg)', color: 'var(--color-info-text)', border: 'var(--color-info-border)' };
      case 'accent': return { bg: 'var(--color-accent-100)', color: 'var(--color-accent-600)', border: 'var(--color-accent-50)' };
      case 'gold': return { bg: 'var(--color-gold-bg)', color: 'var(--color-gold-text)', border: 'var(--color-gold-border)' };
      default: return { bg: 'var(--color-surface-hover)', color: 'var(--color-text-secondary)', border: 'var(--color-surface-border)' };
    }
  };

  const colors = getVariantColors();

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    padding: size === 'sm' ? '2px var(--spacing-2)' : 'var(--spacing-1) var(--spacing-3)',
    borderRadius: 'var(--radius-full)',
    fontSize: size === 'sm' ? '0.7rem' : 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    backgroundColor: colors.bg,
    color: colors.color,
    border: `1px solid ${colors.border}`,
    whiteSpace: 'nowrap',
    ...style,
  };

  return (
    <motion.span 
      ref={ref}
      style={baseStyle} 
      className={className}
      layout
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 10 : 12} />}
      {label}
    </motion.span>
  );
});

Badge.displayName = 'Badge';
