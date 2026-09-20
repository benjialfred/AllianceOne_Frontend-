import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUp, Plus, Command, Sparkles, Layers, ChevronRight } from 'lucide-react';

interface CopilotComposerProps {
  onSend: (text: string) => void;
  isProcessing: boolean;
  activeModule?: string;
  className?: string;
}

const CONTEXTUAL_PLACEHOLDERS = [
  "Décrivez ce que vous souhaitez accomplir...",
  "Demandez à Alliance AI d'agir sur votre organisation...",
  "Analysez les données, présences ou finances...",
  "Créez une tâche opérationnelle ou un rapport..."
];

const QUICK_COMMANDS = [
  { cmd: '/analyser', label: 'Analyser les données et anomalies opérationnelles' },
  { cmd: '/rapport', label: 'Générer un rapport de situation exécutif' },
  { cmd: '/absences', label: 'Analyser les absences et anomalies de la semaine' },
  { cmd: '/stocks', label: 'État des stocks et alertes de rupture' },
  { cmd: '/finances', label: 'Synthèse financière et factures en attente' }
];

const CONTEXT_TAGS = [
  { id: 'education', label: 'Éducation', desc: 'Élèves, classes, présences' },
  { id: 'finances', label: 'Finances', desc: 'Trésorerie, factures' },
  { id: 'inventaire', label: 'Inventaire', desc: 'Stocks, fournisseurs' },
  { id: 'organisation', label: 'Organisation', desc: 'Effectifs & gouvernance' }
];

/**
 * COPILOT COMPOSER — ARCHITECTURAL SIGNATURE
 * Interactive input deck with dynamic contextual command palettes,
 * rotating placeholders, and kinetic send triggers.
 */
export const CopilotComposer: React.FC<CopilotComposerProps> = ({
  onSend,
  isProcessing,
  activeModule = 'hub',
  className = ''
}) => {
  const [text, setText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [showContexts, setShowContexts] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Cycling placeholder
  useEffect(() => {
    if (isFocused || text.trim()) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % CONTEXTUAL_PLACEHOLDERS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isFocused, text]);

  // Detect slash typing
  useEffect(() => {
    if (text.startsWith('/') && text.length < 10) {
      setShowCommands(true);
      setShowContexts(false);
    } else if (!text.startsWith('/')) {
      setShowCommands(false);
    }
  }, [text]);

  // Click outside to close palettes
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowCommands(false);
        setShowContexts(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isProcessing) return;
    onSend(text.trim());
    setText('');
    setShowCommands(false);
    setShowContexts(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      setShowCommands(false);
      setShowContexts(false);
    }
  };

  const selectCommand = (cmd: string) => {
    setText(`${cmd} `);
    setShowCommands(false);
    inputRef.current?.focus();
  };

  const selectContext = (ctxId: string) => {
    setText((prev) => (prev ? `${prev} +contexte:${ctxId} ` : `+contexte:${ctxId} `));
    setShowContexts(false);
    inputRef.current?.focus();
  };

  const canSend = text.trim().length > 0 && !isProcessing;

  return (
    <div 
      ref={containerRef}
      className={`ao-copilot-composer-container ${className}`} 
      style={{ position: 'relative', width: '100%', maxWidth: '820px', margin: '0 auto' }}
    >
      {/* ─── QUICK COMMANDS PALETTE ─── */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: 'var(--color-surface-card, #0e1422)',
              border: '1px solid var(--color-surface-border, rgba(255, 255, 255, 0.12))',
              borderRadius: '12px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.45)',
              zIndex: 50,
              backdropFilter: 'blur(16px)'
            }}
          >
            <div style={{ padding: '6px 10px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              Commandes Opérationnelles Rapides
            </div>
            {QUICK_COMMANDS.map((item) => (
              <button
                key={item.cmd}
                type="button"
                onClick={() => selectCommand(item.cmd)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.84rem', color: '#60a5fa' }}>
                    {item.cmd}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                    {item.label}
                  </span>
                </div>
                <ChevronRight size={13} style={{ color: '#64748b' }} />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CONTEXT SELECTION PALETTE ─── */}
      <AnimatePresence>
        {showContexts && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: 0,
              maxWidth: '340px',
              background: 'var(--color-surface-card, #0e1422)',
              border: '1px solid var(--color-surface-border, rgba(255, 255, 255, 0.12))',
              borderRadius: '12px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.45)',
              zIndex: 50,
              backdropFilter: 'blur(16px)'
            }}
          >
            <div style={{ padding: '6px 10px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              Ajouter un contexte sectoriel
            </div>
            {CONTEXT_TAGS.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => selectContext(tag.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>{tag.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{tag.desc}</div>
                </div>
                <Plus size={13} style={{ color: '#60a5fa' }} />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MAIN ARCHITECTURAL INPUT DECK ─── */}
      <form
        onSubmit={handleSubmit}
        style={{
          position: 'relative',
          background: isFocused ? 'var(--color-surface-card, #0e1422)' : 'var(--color-surface-card, #0b0f19)',
          border: isFocused ? '1px solid #3b82f6' : '1px solid var(--color-surface-border, rgba(255, 255, 255, 0.1))',
          borderRadius: '12px',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.15), 0 8px 24px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.2)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={CONTEXTUAL_PLACEHOLDERS[placeholderIndex]}
          disabled={isProcessing}
          autoComplete="off"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '0.98rem',
            color: 'var(--color-text-primary, #f8fafc)',
            lineHeight: 1.5,
            width: '100%'
          }}
        />

        {/* Action Controls Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
          {/* Context & Command Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => {
                setShowContexts((prev) => !prev);
                setShowCommands(false);
              }}
              style={{
                background: showContexts ? 'rgba(59, 130, 246, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: showContexts ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.74rem',
                fontWeight: 500,
                color: showContexts ? '#60a5fa' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={11} />
              <span>contexte</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowCommands((prev) => !prev);
                setShowContexts(false);
                if (!showCommands) {
                  setText('/');
                  inputRef.current?.focus();
                }
              }}
              style={{
                background: showCommands ? 'rgba(59, 130, 246, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: showCommands ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.74rem',
                fontWeight: 500,
                color: showCommands ? '#60a5fa' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Command size={11} />
              <span>commandes</span>
            </button>

            {activeModule && (
              <span 
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginLeft: '4px'
                }}
              >
                [{activeModule}]
              </span>
            )}
          </div>

          {/* Kinetic Send Trigger */}
          <motion.button
            type="submit"
            disabled={!canSend}
            whileHover={canSend && !shouldReduceMotion ? { scale: 1.06 } : {}}
            whileTap={canSend && !shouldReduceMotion ? { scale: 0.94 } : {}}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: canSend ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
              color: canSend ? '#ffffff' : '#475569',
              cursor: canSend ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s, color 0.2s'
            }}
            title="Lancer l'opération (Entrée)"
          >
            <ArrowUp size={16} strokeWidth={2.4} />
          </motion.button>
        </div>
      </form>
    </div>
  );
};
export default CopilotComposer;
