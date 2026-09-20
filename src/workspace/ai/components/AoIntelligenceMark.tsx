import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, AlertCircle, ShieldCheck } from 'lucide-react';
import type { SystemOperationalState } from '../types';
import logoImg from '../../../assets/logo.png';

interface AoIntelligenceMarkProps {
  state?: SystemOperationalState;
  size?: number;
  className?: string;
  showHalo?: boolean;
}

/**
 * AO INTELLIGENCE MARK — SIGNATURE EXPERIENCE
 * The living Intelligence Medallion of Alliance One.
 * Combines the official Alliance One corporate mark with stateful
 * kinetic coordination (ambient aura, operational orbit rail, status badges).
 */
export const AoIntelligenceMark: React.FC<AoIntelligenceMarkProps> = ({
  state = 'IDLE',
  size = 28,
  className = '',
  showHalo = false
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Coordinated state palette
  const getThemeColor = () => {
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
        return '#3b82f6'; // Alliance One Blue
    }
  };

  const accentColor = getThemeColor();
  const radius = size > 44 ? 16 : size > 26 ? 9 : 7;
  const badgeSize = Math.max(9, Math.round(size * 0.36));
  const orbitOffset = size > 36 ? 6 : 4;

  return (
    <div 
      className={`ao-intelligence-mark-wrapper ${className}`}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      {/* ─── 1. LIVING AMBIENT AURA ─── */}
      {(showHalo || state !== 'IDLE') && (
        <motion.div
          style={{
            position: 'absolute',
            inset: -size * 0.24,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accentColor}38 0%, ${accentColor}0a 55%, transparent 75%)`,
            pointerEvents: 'none',
            zIndex: 0
          }}
          animate={
            shouldReduceMotion
              ? { opacity: 0.8 }
              : state === 'ANALYZING' || state === 'PLANNING'
              ? { scale: [0.96, 1.2, 0.96], opacity: [0.35, 0.85, 0.35] }
              : state === 'EXECUTING'
              ? { scale: [1, 1.25, 1], opacity: [0.45, 0.95, 0.45] }
              : state === 'VERIFYING'
              ? { scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }
              : { scale: 1, opacity: 0.6 }
          }
          transition={{
            duration: state === 'EXECUTING' ? 1.6 : 2.2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}

      {/* ─── 2. KINETIC COORDINATION PERIMETER (SVG Orbit) ─── */}
      <svg
        style={{
          position: 'absolute',
          inset: -orbitOffset,
          width: size + orbitOffset * 2,
          height: size + orbitOffset * 2,
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'visible'
        }}
        viewBox="0 0 40 40"
      >
        {/* Static Perimeter Hairline */}
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx={radius + 2}
          fill="none"
          stroke={accentColor}
          strokeWidth="1.2"
          strokeOpacity={state === 'IDLE' ? 0.25 : 0.35}
        />

        {/* Dynamic Executing Orbit (Electric Blue kinetic sweep) */}
        {state === 'EXECUTING' && (
          <motion.rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx={radius + 2}
            fill="none"
            stroke={accentColor}
            strokeWidth="1.8"
            strokeDasharray="24 65"
            animate={shouldReduceMotion ? {} : { strokeDashoffset: [0, -89] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Dynamic Analyzing/Planning Orbit (Rhythmic breathing dash) */}
        {(state === 'ANALYZING' || state === 'PLANNING') && (
          <motion.rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx={radius + 2}
            fill="none"
            stroke={accentColor}
            strokeWidth="1.6"
            strokeDasharray="18 40"
            animate={shouldReduceMotion ? {} : { strokeDashoffset: [0, 58] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Dynamic Verifying Orbit (Golden seal luminescence) */}
        {state === 'VERIFYING' && (
          <motion.rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx={radius + 2}
            fill="none"
            stroke={accentColor}
            strokeWidth="2"
            animate={shouldReduceMotion ? {} : { opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </svg>

      {/* ─── 3. OFFICIAL ALLIANCE ONE LOGO MEDALLION ─── */}
      <motion.div
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: `${radius}px`,
          background: '#ffffff',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 2px 10px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.25) inset`,
          zIndex: 2,
          flexShrink: 0
        }}
        animate={
          shouldReduceMotion
            ? {}
            : state === 'ERROR'
            ? { x: [-1, 2, -2, 1, 0] }
            : state === 'COMPLETED'
            ? { scale: [1, 1.08, 1] }
            : {}
        }
        transition={{ duration: 0.35 }}
      >
        <img
          src={logoImg}
          alt="Alliance One"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            userSelect: 'none'
          }}
          draggable={false}
        />
      </motion.div>

      {/* ─── 4. STATUS COORDINATION MICRO-BADGE ─── */}
      {state === 'COMPLETED' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: badgeSize,
            height: badgeSize,
            borderRadius: '50%',
            background: '#10b981',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
            zIndex: 4
          }}
        >
          <Check size={badgeSize * 0.75} strokeWidth={3} />
        </motion.div>
      )}

      {state === 'ERROR' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: badgeSize,
            height: badgeSize,
            borderRadius: '50%',
            background: '#ef4444',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
            zIndex: 4
          }}
        >
          <AlertCircle size={badgeSize * 0.75} strokeWidth={3} />
        </motion.div>
      )}

      {state === 'VERIFYING' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: badgeSize,
            height: badgeSize,
            borderRadius: '50%',
            background: '#f59e0b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
            zIndex: 4
          }}
        >
          <ShieldCheck size={badgeSize * 0.75} strokeWidth={2.5} />
        </motion.div>
      )}
    </div>
  );
};
