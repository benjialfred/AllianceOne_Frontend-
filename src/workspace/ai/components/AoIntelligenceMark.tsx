import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { SystemOperationalState } from '../types';

interface AoIntelligenceMarkProps {
  state?: SystemOperationalState;
  size?: number;
  className?: string;
  showHalo?: boolean;
}

/**
 * AO INTELLIGENCE MARK — SIGNATURE 2
 * Living architectural mark of Alliance One.
 * Pure geometric precision: SVG vector with stateful segment kinematics.
 */
export const AoIntelligenceMark: React.FC<AoIntelligenceMarkProps> = ({
  state = 'IDLE',
  size = 28,
  className = '',
  showHalo = false
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Color mapping according to Alliance Design System
  const getColor = () => {
    switch (state) {
      case 'ANALYZING':
      case 'PLANNING':
        return '#60a5fa'; // Modern Alliance Azure
      case 'EXECUTING':
        return '#3b82f6'; // Deep Electric Blue
      case 'VERIFYING':
        return '#f59e0b'; // Imperial Amber / Gold
      case 'COMPLETED':
        return '#10b981'; // Verified Emerald
      case 'ERROR':
        return '#ef4444'; // Clean Crimson
      case 'IDLE':
      default:
        return 'var(--color-obsidian-50, #f8fafc)';
    }
  };

  const primaryColor = getColor();

  // Motion variants for the outer triangular/structural glyph (A)
  const outerVariants = {
    IDLE: { scale: 1, rotate: 0, opacity: 0.95 },
    ANALYZING: {
      scale: shouldReduceMotion ? 1 : [1, 0.94, 1.02, 1],
      rotate: shouldReduceMotion ? 0 : [0, -3, 3, 0],
      transition: { duration: 1.8, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }
    },
    PLANNING: {
      scale: shouldReduceMotion ? 1 : [1, 1.05, 0.97, 1],
      transition: { duration: 1.4, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }
    },
    EXECUTING: {
      rotate: shouldReduceMotion ? 0 : 360,
      transition: { duration: 4, repeat: Infinity, ease: 'linear' }
    },
    VERIFYING: {
      scale: shouldReduceMotion ? 1 : [1, 1.06, 1],
      transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
    },
    COMPLETED: {
      scale: 1,
      rotate: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    },
    ERROR: {
      x: shouldReduceMotion ? 0 : [0, -2, 2, -1, 1, 0],
      transition: { duration: 0.4 }
    }
  };

  // Motion variants for inner nexus core (O)
  const innerVariants = {
    IDLE: { scale: 1, opacity: 0.8 },
    ANALYZING: {
      scale: shouldReduceMotion ? 1 : [0.8, 1.2, 0.8],
      opacity: [0.6, 1, 0.6],
      transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
    },
    PLANNING: {
      scale: shouldReduceMotion ? 1 : [1, 1.15, 1],
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
    },
    EXECUTING: {
      scale: [0.9, 1.1, 0.9],
      opacity: [0.7, 1, 0.7],
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
    },
    VERIFYING: {
      scale: [1, 1.25, 1],
      opacity: [0.8, 1, 0.8],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
    },
    COMPLETED: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    ERROR: { scale: 0.85, opacity: 1 }
  };

  return (
    <div 
      className={`ao-intelligence-mark-wrapper ${className}`}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Subtle Spatial Aura (No massive neon blur) */}
      {showHalo && (
        <div
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}22 0%, transparent 70%)`,
            pointerEvents: 'none',
            transition: 'background 0.4s ease'
          }}
        />
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* Outer Architectural Glyph — The "A" Framework */}
        <motion.path
          d="M16 3L27.5 24.5H4.5L16 3Z"
          stroke={primaryColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={outerVariants}
          animate={state}
          style={{ transformOrigin: '16px 16px' }}
        />

        {/* Central Dynamic Cross-Bar */}
        <motion.line
          x1="10"
          y1="18.5"
          x2="22"
          y2="18.5"
          stroke={primaryColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={{
            opacity: state === 'ANALYZING' || state === 'PLANNING' ? [0.4, 1, 0.4] : 0.85
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Inner Nexus Core — The "O" Operational Nucleus */}
        <motion.circle
          cx="16"
          cy="18.5"
          r="3.5"
          fill={primaryColor}
          variants={innerVariants}
          animate={state}
          style={{ transformOrigin: '16px 18.5px' }}
        />

        {/* Completed State Check Indicator */}
        {state === 'COMPLETED' && (
          <motion.path
            d="M13.5 18.5L15.5 20.5L19 16.5"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        )}
      </svg>
    </div>
  );
};
