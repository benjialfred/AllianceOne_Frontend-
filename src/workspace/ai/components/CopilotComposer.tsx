import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, Plus, Command, Sparkles } from 'lucide-react';

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

/**
 * COPILOT COMPOSER — ARCHITECTURAL SIGNATURE
 * Architectural input deck with cycling contextual placeholders and kinetic send trigger.
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
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Cycling placeholder
  useEffect(() => {
    if (isFocused || text.trim()) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % CONTEXTUAL_PLACEHOLDERS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isFocused, text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isProcessing) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend = text.trim().length > 0 && !isProcessing;

  return (
    <div className={`ao-copilot-composer-container ${className}`} style={{ width: '100%', maxWidth: '820px', margin: '0 auto' }}>
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
                setText((prev) => (prev ? `${prev} +contexte:` : '+contexte:'));
                inputRef.current?.focus();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.74rem',
                fontWeight: 500,
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <Plus size={11} />
              <span>contexte</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setText('/');
                inputRef.current?.focus();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.74rem',
                fontWeight: 500,
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
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
            whileHover={canSend && !shouldReduceMotion ? { scale: 1.05 } : {}}
            whileTap={canSend && !shouldReduceMotion ? { scale: 0.95 } : {}}
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
          >
            <ArrowUp size={16} strokeWidth={2.4} />
          </motion.button>
        </div>
      </form>
    </div>
  );
};
