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
    gap: 'var(--ao-space-1)',
    marginBottom: 'var(--ao-space-4)',
    width: '100%',
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--ao-font-sans)',
    fontSize: '12px',
    fontWeight: 'var(--ao-weight-medium)',
    color: 'var(--ao-color-text-primary)',
    display: 'flex',
    justifyContent: 'space-between',
  };

  // Determine border and ring colors
  let borderColor = 'var(--ao-color-border-default)';
  let ringColor = 'transparent';

  if (error) {
    borderColor = 'var(--ao-color-danger-text)';
    if (isFocused) ringColor = 'var(--ao-color-danger-bg)';
  } else if (success) {
    borderColor = 'var(--ao-color-success-text)';
    if (isFocused) ringColor = 'var(--ao-color-success-bg)';
  } else if (isFocused) {
    borderColor = 'var(--ao-color-alliance-blue)';
    ringColor = 'rgba(11, 61, 145, 0.1)';
  }

  const inputBaseStyle: React.CSSProperties = {
    padding: `var(--ao-space-2) var(--ao-space-3)`,
    paddingLeft: icon ? 'var(--ao-space-10)' : 'var(--ao-space-3)',
    borderRadius: 'var(--ao-radius-md)',
    border: `1px solid ${borderColor}`,
    backgroundColor: 'var(--ao-color-bg-surface)',
    color: 'var(--ao-color-text-primary)',
    fontSize: '13px',
    height: 'clamp(36px, 5vw, 40px)',
    outline: 'none',
    transition: 'all var(--ao-duration-fast)',
    boxShadow: isFocused ? `0 0 0 3px ${ringColor}` : 'var(--ao-shadow-sm)',
    width: '100%',
    appearance: type === 'select' ? 'none' : 'auto',
  };

  const commonProps = {
    ref,
    style: inputBaseStyle,
    onFocus: (e: any) => { setIsFocused(true); onFocus?.(e); },
    onBlur: (e: any) => { setIsFocused(false); onBlur?.(e); },
    className: `ao-input ${className}`,
    disabled: props.disabled,
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          <span>{label} {props.required && <span style={{color: 'var(--ao-color-danger-text)'}}>*</span>}</span>
        </label>
      )}
      
      <div style={{ position: 'relative', width: '100%' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: 'var(--ao-space-3)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: isFocused ? 'var(--ao-color-alliance-blue)' : 'var(--ao-color-text-tertiary)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            transition: 'color var(--ao-duration-fast)'
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
            <div style={{ position: 'absolute', right: 'var(--ao-space-3)', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--ao-color-text-tertiary)'}}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        ) : type === 'textarea' ? (
          <textarea {...commonProps} style={{ ...inputBaseStyle, height: 'auto', minHeight: '80px' }} {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
        ) : (
          <input type={type} {...commonProps} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ position: 'absolute', right: 'var(--ao-space-3)', top: '50%', translateY: '-50%', color: 'var(--ao-color-danger-text)', pointerEvents: 'none' }}
            >
              <AlertCircle size={16} />
            </motion.div>
          )}
          {success && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ position: 'absolute', right: 'var(--ao-space-3)', top: '50%', translateY: '-50%', color: 'var(--ao-color-success-text)', pointerEvents: 'none' }}
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
            style={{ fontSize: '11px', color: 'var(--ao-color-danger-text)', fontWeight: 'var(--ao-weight-medium)' }}
          >
            {error}
          </motion.span>
        ) : helpText ? (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontSize: '11px', color: 'var(--ao-color-text-secondary)' }}
          >
            {helpText}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';
