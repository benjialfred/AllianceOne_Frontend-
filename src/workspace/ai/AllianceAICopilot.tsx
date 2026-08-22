/**
 * ALLIANCE AI COPILOT
 * Spotlight-style universal intelligence interface.
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronRight, FileText, Activity, AlertTriangle } from 'lucide-react';
import './AllianceAICopilot.css';

interface AllianceAICopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  { id: 1, text: 'Analyser les absences de cette semaine', icon: Activity },
  { id: 2, text: 'Résumer mon établissement', icon: FileText },
  { id: 3, text: 'Voir les alertes de stock', icon: AlertTriangle }
];

export const AllianceAICopilot: React.FC<AllianceAICopilotProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingState, setProcessingState] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResponse(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Handle global shortcut (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const executeQuery = async (textToExecute: string) => {
    if (!textToExecute.trim()) return;

    // Simulate backend processing states for UI feedback
    setIsProcessing(true);
    setProcessingState('Analyse du contexte...');
    setResponse(null);
    
    // Simulate streaming UI while waiting for fetch
    const steps = ['Recherche des données...', 'Vérification des permissions...', 'Préparation de la réponse...'];
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setProcessingState(steps[stepIndex]);
        stepIndex++;
      }
    }, 1000);

    try {
      const token = localStorage.getItem('alliance-auth') 
        ? JSON.parse(localStorage.getItem('alliance-auth') as string).state?.accessToken 
        : null;

      const res = await fetch('http://localhost:8000/api/core/ai/ask/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ 
          prompt: textToExecute,
          context: {
            active_module: window.location.pathname.split('/')[2] || 'hub',
            active_route: window.location.pathname,
            academic_year: "2026-2027"
          }
        })
      });

      const data = await res.json();
      console.log('AI Response:', data);
      
      clearInterval(interval);
      setProcessingState('');
      setIsProcessing(false);
      setResponse(data.content || JSON.stringify(data));
      // Don't clear query if we want to show what was asked, but UI looks cleaner cleared or kept.
      // Let's keep the query so the user sees their prompt!
    } catch (err) {
      console.error('AI Error:', err);
      clearInterval(interval);
      setProcessingState('');
      setIsProcessing(false);
      setResponse('Erreur de connexion avec le serveur.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    executeQuery(query);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="ai-copilot-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div 
            className="ai-copilot-modal"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* HEADER */}
            <div className="ai-copilot-header">
              <div className="ai-copilot-title-row">
                <div className="ai-copilot-brand">
                  <Sparkles size={16} /> Alliance AI
                </div>
                <button className="ai-copilot-close" onClick={onClose}>
                  <X size={16} />
                </button>
              </div>

              <form className="ai-copilot-input-wrapper" onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  className="ai-copilot-input"
                  placeholder="Que souhaitez-vous accomplir ?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isProcessing}
                />
              </form>
            </div>

            {/* BODY */}
            <div className="ai-copilot-body">
              {isProcessing ? (
                <div className="ai-state-indicator">
                  <div className="ai-spinner" />
                  <span>{processingState}</span>
                </div>
              ) : response ? (
                <div className="ai-response-container" style={{ color: '#f4f4f5', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#3b82f6' }}>
                    <Sparkles size={16} />
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Réponse</span>
                  </div>
                  <div>{response}</div>
                </div>
              ) : (
                <>
                  <div className="ai-section-title">Suggestions</div>
                  <div className="ai-suggestions-list">
                    {SUGGESTIONS.map((suggestion, index) => (
                        <button 
                        key={suggestion.id}
                        className="ai-suggestion-item"
                        onClick={() => {
                          setQuery(suggestion.text);
                          executeQuery(suggestion.text);
                        }}
                      >
                        <suggestion.icon size={16} className="ai-suggestion-icon" />
                        <span>{suggestion.text}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* FOOTER */}
            <div className="ai-copilot-footer">
              <div className="ai-hint">
                <span className="ai-kbd">↵</span> Enter pour valider
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
