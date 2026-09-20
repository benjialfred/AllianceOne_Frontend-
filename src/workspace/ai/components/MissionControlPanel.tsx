import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, AlertCircle, ChevronDown, Clock, ShieldCheck, Minimize2, ExternalLink, XCircle } from 'lucide-react';
import type { MissionPlan, MissionStep, MissionEvent } from '../types';
import { VerificationSeal } from './VerificationSeal';

interface MissionControlPanelProps {
  mission: MissionPlan;
  events?: MissionEvent[];
  onConfirmStep?: (stepId: string) => void;
  onCancelMission?: () => void;
  onToggleCollapse?: () => void;
  className?: string;
}

/**
 * MISSION CONTROL PANEL — SIGNATURE EXPERIENCE
 * Contextual operational command deck.
 * Displays real-time plan construction, Mission Path steps, and Verification timeline.
 */
export const MissionControlPanel: React.FC<MissionControlPanelProps> = ({
  mission,
  events = [],
  onConfirmStep,
  onCancelMission,
  onToggleCollapse,
  className = ''
}) => {
  const shouldReduceMotion = useReducedMotion();

  const completedSteps = mission.steps.filter(s => s.status === 'SUCCEEDED').length;
  const totalSteps = mission.steps.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Active step is the first RUNNING or PENDING or BLOCKED step
  const activeStepIndex = mission.steps.findIndex(s => s.status === 'RUNNING' || s.status === 'BLOCKED' || s.status === 'PENDING');

  return (
    <motion.div
      className={`mission-control-panel ${className}`}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-surface-card, #0b0f19)',
        borderLeft: '1px solid var(--color-surface-border, rgba(255, 255, 255, 0.07))',
        padding: '24px 20px',
        overflowY: 'auto',
        gap: '24px'
      }}
    >
      {/* ─── HEADER: MISSION IDENTIFIER & OBJECTIVE ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#60a5fa',
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}
            >
              MISSION #{mission.mission_id.slice(-6).toUpperCase()}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              {new Date(mission.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {onCancelMission && mission.status !== 'SUCCEEDED' && mission.status !== 'CANCELLED' && (
              <button
                onClick={onCancelMission}
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  cursor: 'pointer',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
                title="Interrompre et annuler cette mission"
              >
                <XCircle size={13} />
                <span>Annuler</span>
              </button>
            )}

            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Réduire Mission Control"
              >
                <Minimize2 size={15} />
              </button>
            )}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>
            OBJECTIF
          </span>
          <h3 
            style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              color: 'var(--color-text-primary, #f8fafc)',
              margin: '2px 0 0 0',
              lineHeight: 1.4,
              letterSpacing: '-0.02em'
            }}
          >
            {mission.title || mission.user_request}
          </h3>
        </div>

        {/* Progress Rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 500 }}>
            <span>{completedSteps} / {totalSteps} étapes terminées</span>
            <span>{progressPercent}%</span>
          </div>
          <div 
            style={{
              width: '100%',
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(255, 255, 255, 0.05)',
              overflow: 'hidden'
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
                borderRadius: '2px'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--color-surface-border, rgba(255, 255, 255, 0.06))' }} />

      {/* ─── PLAN: MISSION PATH STEPS ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>
          PLAN D'ACTION
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* Vertical Connecting Rail */}
          <div 
            style={{
              position: 'absolute',
              left: '11px',
              top: '16px',
              bottom: '24px',
              width: '1px',
              background: 'rgba(255, 255, 255, 0.08)',
              zIndex: 1
            }}
          />

          {mission.steps.map((step, idx) => {
            const isCompleted = step.status === 'SUCCEEDED';
            const isRunning = step.status === 'RUNNING';
            const isBlocked = step.status === 'BLOCKED' || (step.requires_confirmation && step.status !== 'SUCCEEDED');
            const isPending = step.status === 'PENDING';
            const isFailed = step.status === 'FAILED';

            return (
              <motion.div
                key={step.step_id}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.06 }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  gap: '14px',
                  paddingBottom: idx === mission.steps.length - 1 ? 0 : '18px',
                  zIndex: 2
                }}
              >
                {/* Step Node Marker */}
                <div 
                  style={{
                    width: '23px',
                    height: '23px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: isCompleted ? '#10b981' : isRunning ? '#3b82f6' : isBlocked ? '#f59e0b' : '#1e293b',
                    color: isCompleted ? '#064e3b' : isRunning ? '#ffffff' : isBlocked ? '#451a03' : '#94a3b8',
                    border: isRunning ? '2px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                    flexShrink: 0,
                    boxShadow: isRunning ? '0 0 10px rgba(59, 130, 246, 0.3)' : 'none'
                  }}
                >
                  {isCompleted ? (
                    <Check size={13} strokeWidth={3} />
                  ) : (
                    <span>0{idx + 1}</span>
                  )}
                </div>

                {/* Step Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span 
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: isRunning || isCompleted ? 600 : 500,
                        color: isCompleted ? '#f8fafc' : isRunning ? '#60a5fa' : isBlocked ? '#fbbf24' : '#94a3b8'
                      }}
                    >
                      {step.tool_name.replace(/_/g, ' ')}
                    </span>

                    {step.verification_status && (
                      <VerificationSeal status={step.verification_status} size="sm" />
                    )}
                  </div>

                  {/* Arguments or description */}
                  {step.arguments && Object.keys(step.arguments).length > 0 && (
                    <div style={{ fontSize: '0.76rem', color: '#64748b', fontFamily: 'monospace' }}>
                      {Object.entries(step.arguments).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                    </div>
                  )}

                  {/* Confirmation required prompt */}
                  {isBlocked && (
                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        borderRadius: '6px',
                        padding: '10px 12px',
                        marginTop: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#fbbf24' }}>
                        <AlertCircle size={14} />
                        <span>Confirmation explicite requise pour cette action.</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => onConfirmStep && onConfirmStep(step.step_id)}
                          style={{
                            background: '#f59e0b',
                            border: 'none',
                            color: '#451a03',
                            fontWeight: 600,
                            fontSize: '0.78rem',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Confirmer l'opération
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Running feedback */}
                  {isRunning && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#60a5fa', marginTop: '2px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa', display: 'inline-block' }} />
                      <span>Exécution sécurisée en cours...</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--color-surface-border, rgba(255, 255, 255, 0.06))' }} />

      {/* ─── ACTIVITY LOG & TIMELINE ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>
            ACTIVITÉ & AUDIT
          </span>
          <span style={{ fontSize: '0.7rem', color: '#475569' }}>
            {events.length} événements
          </span>
        </div>

        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            maxHeight: '160px',
            overflowY: 'auto'
          }}
        >
          {events.length === 0 ? (
            <div style={{ fontSize: '0.78rem', color: '#475569', fontStyle: 'italic' }}>
              En attente d'événements...
            </div>
          ) : (
            events.slice(-5).map((evt) => (
              <div 
                key={evt.id} 
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '10px',
                  fontSize: '0.78rem',
                  fontFamily: 'monospace'
                }}
              >
                <span style={{ color: '#475569', flexShrink: 0 }}>{evt.timestamp}</span>
                <span style={{ color: '#cbd5e1' }}>{evt.label}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};
