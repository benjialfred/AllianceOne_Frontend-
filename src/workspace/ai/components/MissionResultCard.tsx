import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Sparkles, Activity } from 'lucide-react';
import { VerificationSeal } from './VerificationSeal';

interface MissionResultCardProps {
  title: string;
  summary: string;
  metrics?: Array<{ label: string; value: string; trend?: string }>;
  highlights?: string[];
  nextActions?: Array<{ id: string; label: string; actionType: string }>;
  onActionClick?: (actionId: string) => void;
  className?: string;
}

/**
 * MISSION RESULT CARD — ARCHITECTURAL CONCLUSION
 * Comprehensive synthesis of an accomplished operational mission.
 */
export const MissionResultCard: React.FC<MissionResultCardProps> = ({
  title,
  summary,
  metrics = [],
  highlights = [],
  nextActions = [],
  onActionClick,
  className = ''
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`mission-result-card ${className}`}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'var(--color-surface-card, #0b0f19)',
        border: '1px solid var(--color-surface-border, rgba(255, 255, 255, 0.08))',
        borderTop: '2px solid #10b981',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        marginTop: '8px'
      }}
    >
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '3px 8px',
              borderRadius: '4px'
            }}
          >
            MISSION TERMINÉE
          </span>
        </div>
        <VerificationSeal status="VERIFIED" label="RÉSULTATS VÉRIFIÉS" size="sm" />
      </div>

      {/* Title & Summary */}
      <div>
        <h4 
          style={{
            fontSize: '1.12rem',
            fontWeight: 600,
            color: 'var(--color-text-primary, #f8fafc)',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em'
          }}
        >
          {title}
        </h4>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary, #94a3b8)', lineHeight: 1.5, margin: 0 }}>
          {summary}
        </p>
      </div>

      {/* Metrics Row */}
      {metrics.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
          {metrics.map((m, idx) => (
            <div 
              key={idx} 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '8px',
                padding: '10px 12px'
              }}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', fontVariantNumeric: 'tabular-nums' }}>
                {m.value}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '2px' }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Highlights */}
      {highlights.length > 0 && (
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          {highlights.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#cbd5e1' }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {/* Next Actions */}
      {nextActions.length > 0 && (
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Actions recommandées :
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {nextActions.map((act) => (
              <button
                key={act.id}
                onClick={() => onActionClick && onActionClick(act.id)}
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  color: '#60a5fa',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                  e.currentTarget.style.borderColor = '#60a5fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.25)';
                }}
              >
                <span>{act.label}</span>
                <ArrowRight size={13} />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
