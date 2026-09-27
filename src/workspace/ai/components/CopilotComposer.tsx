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
      className={`ao-composer-wrapper ${className}`}
    >
      {/* ─── QUICK COMMANDS PALETTE ─── */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            className="ao-composer-palette"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ao-palette-header">
              Commandes Opérationnelles Rapides
            </div>
            {QUICK_COMMANDS.map((item) => (
              <button
                key={item.cmd}
                type="button"
                className="ao-palette-item"
                onClick={() => selectCommand(item.cmd)}
              >
                <div className="ao-palette-item-content">
                  <span className="cmd-text">{item.cmd}</span>
                  <span className="cmd-label">{item.label}</span>
                </div>
                <ChevronRight size={13} className="cmd-icon" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CONTEXT SELECTION PALETTE ─── */}
      <AnimatePresence>
        {showContexts && (
          <motion.div
            className="ao-composer-palette"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ao-palette-header">
              Ajouter un contexte sectoriel
            </div>
            {CONTEXT_TAGS.map((tag) => (
              <button
                key={tag.id}
                type="button"
                className="ao-palette-item"
                onClick={() => selectContext(tag.id)}
              >
                <div>
                  <div className="ctx-label">{tag.label}</div>
                  <div className="ctx-desc">{tag.desc}</div>
                </div>
                <Plus size={13} className="ctx-icon" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MAIN ARCHITECTURAL INPUT DECK ─── */}
      <form
        onSubmit={handleSubmit}
        className={`ao-composer-form ${isFocused ? 'focused' : ''}`}
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
          className="ao-composer-input"
        />

        {/* Action Controls Toolbar */}
        <div className="ao-composer-toolbar">
          {/* Context & Command Badges */}
          <div className="ao-composer-badges">
            <button
              type="button"
              className={`ao-composer-badge ${showContexts ? 'active' : ''}`}
              onClick={() => {
                setShowContexts((prev) => !prev);
                setShowCommands(false);
              }}
            >
              <Plus size={11} />
              <span>contexte</span>
            </button>

            <button
              type="button"
              className={`ao-composer-badge ${showCommands ? 'active' : ''}`}
              onClick={() => {
                setShowCommands((prev) => !prev);
                setShowContexts(false);
                if (!showCommands) {
                  setText('/');
                  inputRef.current?.focus();
                }
              }}
            >
              <Command size={11} />
              <span>commandes</span>
            </button>

            {activeModule && (
              <span className="ao-composer-module-tag">
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
            className={`ao-composer-send-btn ${canSend ? 'active' : ''}`}
            title="Lancer l'opération (Entrée)"
          >
            <ArrowUp size={18} strokeWidth={2.4} />
          </motion.button>
        </div>
      </form>
    </div>
  );
};
export default CopilotComposer;
