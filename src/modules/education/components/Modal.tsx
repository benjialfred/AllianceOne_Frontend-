import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md' 
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const getSizeWidth = () => {
    switch (size) {
      case 'sm': return '400px';
      case 'lg': return '800px';
      case 'xl': return '1100px';
      default: return '600px';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--spacing-4)',
            }}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e: any) => e.stopPropagation()} // Prevent clicks from closing when clicking inside
              style={{
                backgroundColor: 'var(--color-surface-card)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-xl)',
                width: '100%',
                maxWidth: getSizeWidth(),
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid var(--color-surface-border)',
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--spacing-4) var(--spacing-6)',
                borderBottom: '1px solid var(--color-surface-border)',
              }}>
                <h3 className="t-h3" style={{ margin: 0 }}>{title}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={X} 
                  onClick={onClose} 
                  style={{ padding: 'var(--spacing-1)', color: 'var(--color-text-muted)' }}
                  aria-label="Close modal"
                />
              </div>

              {/* Body */}
              <div style={{
                padding: 'var(--spacing-6)',
                overflowY: 'auto',
                flex: 1,
              }}>
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div style={{
                  padding: 'var(--spacing-4) var(--spacing-6)',
                  borderTop: '1px solid var(--color-surface-border)',
                  backgroundColor: 'var(--color-surface-bg)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 'var(--spacing-3)',
                }}>
                  {footer}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
