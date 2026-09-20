import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { SystemOperationalState } from '../types';

interface IntelligencePulseProps {
  state: SystemOperationalState;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

/**
 * INTELLIGENCE PULSE — SIGNATURE 3
 * Subtle kinematic telemetry pulse.
 * Replaces generic spinners with stateful architectural motion.
 */
export const IntelligencePulse: React.FC<IntelligencePulseProps> = ({
  state,
  size = 'md',
  label,
  className = ''
}) => {
  const shouldReduceMotion = useReducedMotion();

  const getThemeColor = () => {
    switch (state) {
      case 'ANALYZING':
      case 'PLANNING':
        return '#60a5fa'; // Blue Accent
      case 'EXECUTING':
        return '#3b82f6'; // Action Blue
      case 'VERIFYING':
        return '#d4af37'; // Imperial Gold
      case 'COMPLETED':
        return '#10b981'; // Emerald
      case 'ERROR':
        return '#ef4444'; // Red
      case 'IDLE':
      default:
        return '#94a3b8'; // Slate
    }
  };

  const color = getThemeColor();

  const dotSize = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;
  const barWidth = size === 'sm' ? 24 : size === 'lg' ? 42 : 32;

  return (
    <div 
      className={`intelligence-pulse-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        userSelect: 'none'
      }}
    >
      <div 
        style={{
          position: 'relative',
          width: barWidth,
          height: dotSize + 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Central Core Pulse */}
        <motion.div
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: color,
            zIndex: 2
          }}
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : state === 'IDLE'
              ? { scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }
              : state === 'ANALYZING' || state === 'PLANNING'
              ? { scale: [0.9, 1.3, 0.9], opacity: [0.6, 1, 0.6] }
              : state === 'EXECUTING'
              ? { x: [-8, 8, -8], scale: [1, 1.1, 1] }
              : state === 'VERIFYING'
              ? { scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }
              : { scale: 1, opacity: 1 }
          }
          transition={{
            duration: state === 'EXECUTING' ? 1.2 : 1.5,
            repeat: state === 'COMPLETED' || state === 'ERROR' ? 0 : Infinity,
            ease: [0.16, 1, 0.3, 1]
          }}
        />

        {/* Dynamic Expanding Rail */}
        {(state === 'ANALYZING' || state === 'PLANNING' || state === 'EXECUTING' || state === 'VERIFYING') && !shouldReduceMotion && (
          <motion.div
            style={{
              position: 'absolute',
              height: '2px',
              borderRadius: '1px',
              backgroundColor: color,
              opacity: 0.35,
              zIndex: 1
            }}
            initial={{ width: 0 }}
            animate={{
              width: [dotSize, barWidth, dotSize],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </div>

      {label && (
        <span 
          style={{
            fontSize: size === 'sm' ? '0.75rem' : '0.82rem',
            fontWeight: 500,
            letterSpacing: '0.01em',
            color: 'var(--color-text-secondary, #94a3b8)',
            textTransform: 'uppercase'
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};
