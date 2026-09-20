import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import type { StepVerificationStatus } from '../types';

interface VerificationSealProps {
  status?: StepVerificationStatus;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * VERIFICATION SEAL — SIGNATURE 3
 * Visual seal of mathematical verification by VerificationEngine.
 * Distinguishes EXECUTING -> EXECUTED -> VERIFYING -> VERIFIED / FAILED.
 */
export const VerificationSeal: React.FC<VerificationSealProps> = ({
  status = 'VERIFIED',
  label,
  className = '',
  size = 'md'
}) => {
  const shouldReduceMotion = useReducedMotion();

  const isVerified = status === 'VERIFIED';
  const isVerifying = status === 'VERIFYING';
  const isFailed = status === 'VERIFICATION_FAILED';
  const isPartial = status === 'VERIFICATION_PARTIAL';

  // Sizing
  const iconSize = size === 'sm' ? 12 : 14;

  if (isVerifying) {
    return (
      <div
        className={`verification-seal verifying ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(212, 175, 55, 0.08)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          color: '#f59e0b',
          borderRadius: '6px',
          padding: size === 'sm' ? '2px 6px' : '4px 8px',
          fontSize: size === 'sm' ? '0.72rem' : '0.78rem',
          fontWeight: 600,
          letterSpacing: '0.02em'
        }}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Clock size={iconSize} />
        </motion.div>
        <span>{label || 'Vérification en cours...'}</span>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div
        className={`verification-seal failed ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          color: '#f87171',
          borderRadius: '6px',
          padding: size === 'sm' ? '2px 6px' : '4px 8px',
          fontSize: size === 'sm' ? '0.72rem' : '0.78rem',
          fontWeight: 600
        }}
      >
        <AlertTriangle size={iconSize} />
        <span>{label || 'Échec de vérification'}</span>
      </div>
    );
  }

  if (isPartial) {
    return (
      <div
        className={`verification-seal partial ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          color: '#fbbf24',
          borderRadius: '6px',
          padding: size === 'sm' ? '2px 6px' : '4px 8px',
          fontSize: size === 'sm' ? '0.72rem' : '0.78rem',
          fontWeight: 600
        }}
      >
        <ShieldCheck size={iconSize} />
        <span>{label || 'Vérifié partiellement'}</span>
      </div>
    );
  }

  // Default: VERIFIED (Sceau géométrique certifié)
  return (
    <motion.div
      className={`verification-seal verified ${className}`}
      initial={shouldReduceMotion ? {} : { scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        color: '#34d399',
        borderRadius: '6px',
        padding: size === 'sm' ? '2px 6px' : '4px 8px',
        fontSize: size === 'sm' ? '0.72rem' : '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.02em'
      }}
    >
      <div
        style={{
          width: iconSize + 2,
          height: iconSize + 2,
          borderRadius: '50%',
          background: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#064e3b'
        }}
      >
        <Check size={iconSize - 2} strokeWidth={3} />
      </div>
      <span>{label || 'VÉRIFIÉ PAR ALLIANCE ONE'}</span>
    </motion.div>
  );
};
