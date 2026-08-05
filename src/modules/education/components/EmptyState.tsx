import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import type { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  image?: string; // Optional URL for a premium illustration
  video?: string; // Optional URL for an ambient loop video
  title: string;
  description: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  primaryActionIcon?: LucideIcon;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  image,
  video,
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionIcon,
  secondaryActionLabel,
  onSecondaryAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--spacing-12) var(--spacing-6)',
        backgroundColor: 'var(--color-surface-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px dashed var(--color-surface-border)',
        minHeight: '400px',
        width: '100%',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Visual Element */}
      <div style={{ marginBottom: 'var(--spacing-6)', position: 'relative' }}>
        {video ? (
          <div style={{ width: 240, height: 180, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <video src={video} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : image ? (
          <img src={image} alt="Empty state" style={{ width: 240, height: 'auto' }} />
        ) : Icon ? (
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-accent-500)',
            boxShadow: '0 0 0 8px var(--color-surface-bg)'
          }}>
            <Icon size={40} strokeWidth={1.5} />
          </div>
        ) : null}
      </div>

      {/* Typography */}
      <h3 className="t-h2" style={{ marginBottom: 'var(--spacing-2)' }}>{title}</h3>
      <p className="t-body" style={{ maxWidth: '400px', marginBottom: 'var(--spacing-8)' }}>
        {description}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        {primaryActionLabel && onPrimaryAction && (
          <Button variant="primary" size="lg" onClick={onPrimaryAction} icon={primaryActionIcon}>
            {primaryActionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="secondary" size="lg" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};
