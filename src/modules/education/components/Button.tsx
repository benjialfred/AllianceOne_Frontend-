import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  icon?: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  iconOnly?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon: Icon,
  fullWidth = false,
  isLoading = false,
  iconOnly = false,
  className = '', 
  disabled,
  ...props 
}, ref) => {

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-primary-600)',
          color: '#ffffff',
          border: '1px solid transparent',
          boxShadow: 'var(--shadow-sm)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--color-surface-bg)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-surface-border)',
          boxShadow: 'var(--shadow-xs)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-surface-border)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text-secondary)',
          border: '1px solid transparent',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-danger-bg)',
          color: 'var(--color-danger-text)',
          border: '1px solid var(--color-danger-border)',
        };
      case 'gold':
        return {
          backgroundColor: 'var(--color-gold-bg)',
          color: 'var(--color-gold-text)',
          border: '1px solid var(--color-gold-border)',
          boxShadow: 'var(--shadow-xs)',
        };
    }
  };

  const getHoverStyles = () => {
    switch(variant) {
        case 'primary': return { backgroundColor: 'var(--color-primary-500)', y: -1, boxShadow: 'var(--shadow-md)' };
        case 'secondary': return { backgroundColor: 'var(--color-surface-hover)', y: -1, boxShadow: 'var(--shadow-sm)' };
        case 'outline': return { backgroundColor: 'var(--color-surface-hover)' };
        case 'ghost': return { backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text-primary)' };
        case 'danger': return { backgroundColor: '#fee2e2' };
        case 'gold': return { backgroundColor: '#fef3c7', y: -1, boxShadow: 'var(--shadow-sm)' };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    if (iconOnly) {
      switch (size) {
        case 'sm': return { padding: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', borderRadius: 'var(--radius-md)' };
        case 'lg': return { padding: 'var(--spacing-4)', fontSize: 'var(--font-size-lg)', borderRadius: 'var(--radius-lg)' };
        default: return { padding: 'var(--spacing-3)', fontSize: 'var(--font-size-base)', borderRadius: 'var(--radius-md)' };
      }
    }
    switch (size) {
      case 'sm': return { padding: 'var(--spacing-1) var(--spacing-3)', fontSize: 'var(--font-size-sm)' };
      case 'lg': return { padding: 'var(--spacing-3) var(--spacing-6)', fontSize: 'var(--font-size-lg)' };
      default: return { padding: 'var(--spacing-2) var(--spacing-4)', fontSize: 'var(--font-size-base)' };
    }
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    borderRadius: 'var(--radius-md)',
    fontWeight: 'var(--font-weight-medium)',
    cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    opacity: (disabled || isLoading) ? 0.6 : 1,
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...(props.style || {}),
  };

  return (
    <motion.button 
      ref={ref}
      style={baseStyle} 
      className={`focus-ring ${className}`} 
      whileHover={!(disabled || isLoading) ? getHoverStyles() : {}}
      whileTap={!(disabled || isLoading) ? { scale: 0.98, y: 0 } : {}}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }}
        />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : (size === 'lg' ? 20 : 16)} strokeWidth={2.5} />
      ) : null}
      
      {children && <span>{children}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';
