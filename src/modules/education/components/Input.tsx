import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helpText?: string;
  type?: string;
  options?: {value: string | number, label: string}[]; 
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<any, InputProps>(({ 
  label, 
  error, 
  success,
  helpText,
  className = '', 
  style, 
  type = 'text', 
  options, 
  icon,
  onFocus, 
  onBlur, 
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
    marginBottom: 'var(--spacing-4)',
    width: '100%',
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-primary)',
    display: 'flex',
    justifyContent: 'space-between',
  };

  // Determine border and ring colors
  let borderColor = 'var(--color-surface-border)';
  let ringColor = 'transparent';

  if (error) {
    borderColor = 'var(--color-danger-border)';
    if (isFocused) ringColor = 'var(--color-danger-bg)';
  } else if (success) {
    borderColor = 'var(--color-success-text)';
    if (isFocused) ringColor = 'var(--color-success-bg)';
  } else if (isFocused) {
    borderColor = 'var(--color-accent-500)';
    ringColor = 'var(--color-accent-100)';
  }

  const inputBaseStyle: React.CSSProperties = {
    padding: `var(--spacing-2) var(--spacing-3)`,
    paddingLeft: icon ? 'var(--spacing-10)' : 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${borderColor}`,
    backgroundColor: 'var(--color-surface-card)',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-base)',
    outline: 'none',
    transition: 'all var(--transition-fast)',
    boxShadow: isFocused ? `0 0 0 3px ${ringColor}` : 'var(--shadow-xs)',
    width: '100%',
    appearance: type === 'select' ? 'none' : 'auto',
  };

  const commonProps = {
    ref,
    style: inputBaseStyle,
    onFocus: (e: any) => { setIsFocused(true); onFocus?.(e); },
    onBlur: (e: any) => { setIsFocused(false); onBlur?.(e); },
    className: `premium-input ${className}`,
    disabled: props.disabled,
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          <span>{label} {props.required && <span style={{color: 'var(--color-danger-text)'}}>*</span>}</span>
        </label>
      )}
      
      <div style={{ position: 'relative', width: '100%' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: 'var(--spacing-3)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: isFocused ? 'var(--color-accent-500)' : 'var(--color-text-muted)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            transition: 'color var(--transition-fast)'
          }}>
            {icon}
          </div>
        )}

        {type === 'select' ? (
          <div style={{ position: 'relative' }}>
            <select {...commonProps} {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}>
              <option value="" disabled hidden>Sélectionner...</option>
              {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <div style={{ position: 'absolute', right: 'var(--spacing-3)', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-text-muted)'}}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        ) : type === 'textarea' ? (
          <textarea {...commonProps} {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
        ) : (
          <input type={type} {...commonProps} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ position: 'absolute', right: 'var(--spacing-3)', top: '50%', translateY: '-50%', color: 'var(--color-danger-text)', pointerEvents: 'none' }}
            >
              <AlertCircle size={16} />
            </motion.div>
          )}
          {success && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ position: 'absolute', right: 'var(--spacing-3)', top: '50%', translateY: '-50%', color: 'var(--color-success-text)', pointerEvents: 'none' }}
            >
              <CheckCircle2 size={16} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {error ? (
          <motion.span 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger-text)', fontWeight: 'var(--font-weight-medium)' }}
          >
            {error}
          </motion.span>
        ) : helpText ? (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}
          >
            {helpText}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';
