import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AllianceLineProps {
  activeStage?: 0 | 1 | 2 | 3; // 0: Données, 1: Intelligence, 2: Action, 3: Vérification
  animated?: boolean;
  className?: string;
  labels?: [string, string, string, string];
  showLabels?: boolean;
  compact?: boolean;
}

const DEFAULT_LABELS: [string, string, string, string] = [
  'Données',
  'Intelligence',
  'Action',
  'Vérification'
];

/**
 * ALLIANCE LINE — SIGNATURE 1
 * Structural connective line motif: ●────────●────────●────────●
 * Visualizing the operational pipeline of Alliance One.
 */
export const AllianceLine: React.FC<AllianceLineProps> = ({
  activeStage = 1,
  animated = true,
  className = '',
  labels = DEFAULT_LABELS,
  showLabels = false,
  compact = false
}) => {
  const shouldReduceMotion = useReducedMotion();

  const stages = [0, 1, 2, 3];

  return (
    <div className={`alliance-line-container ${className}`} style={{ width: '100%', padding: compact ? '4px 0' : '10px 0' }}>
      <div 
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        {/* Background Connecting Rail */}
        <div
          style={{
            position: 'absolute',
            left: '6px',
            right: '6px',
            top: '50%',
            height: '1px',
            background: 'var(--color-surface-border, rgba(255, 255, 255, 0.08))',
            transform: 'translateY(-50%)',
            zIndex: 1
          }}
        />

        {/* Dynamic Progress Rail */}
        <motion.div
          style={{
            position: 'absolute',
            left: '6px',
            top: '50%',
            height: '1.5px',
            background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 70%, #d4af37 100%)',
            transform: 'translateY(-50%)',
            zIndex: 2,
            transformOrigin: 'left center'
          }}
          initial={{ width: '0%' }}
          animate={{
            width: `${Math.min(100, (activeStage / 3) * 100)}%`
          }}
          transition={{
            duration: shouldReduceMotion ? 0.1 : 0.6,
            ease: [0.16, 1, 0.3, 1]
          }}
        />

        {/* Waypoint Nodes */}
        {stages.map((idx) => {
          const isCompleted = idx < activeStage;
          const isActive = idx === activeStage;

          let dotColor = 'var(--color-obsidian-600, #475569)';
          let dotBorder = 'var(--color-surface-border, rgba(255, 255, 255, 0.15))';
          let scale = 1;

          if (isCompleted) {
            dotColor = '#3b82f6';
            dotBorder = '#60a5fa';
          } else if (isActive) {
            dotColor = idx === 3 ? '#d4af37' : '#60a5fa';
            dotBorder = idx === 3 ? '#fef3c7' : '#93c5fd';
            scale = 1.25;
          }

          return (
            <div
              key={idx}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 3
              }}
            >
              <motion.div
                style={{
                  width: compact ? 6 : 8,
                  height: compact ? 6 : 8,
                  borderRadius: '50%',
                  background: dotColor,
                  border: `1.5px solid ${dotBorder}`,
                  boxShadow: isActive ? `0 0 8px ${dotColor}66` : 'none'
                }}
                animate={{
                  scale: shouldReduceMotion ? 1 : scale
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />

              {showLabels && (
                <span
                  style={{
                    position: 'absolute',
                    top: '14px',
                    fontSize: '0.68rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--color-text-primary, #f8fafc)' : 'var(--color-text-muted, #64748b)',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.02em',
                    transition: 'color 0.2s'
                  }}
                >
                  {labels[idx]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
