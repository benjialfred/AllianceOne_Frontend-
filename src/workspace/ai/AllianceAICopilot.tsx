/**
 * ALLIANCE AI COPILOT
 * Premium Right-Side Chat Drawer
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Activity, FileText, AlertTriangle, Send, User as UserIcon } from 'lucide-react';
import './AllianceAICopilot.css';

interface AllianceAICopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  { id: 1, text: 'Analyser les absences de cette semaine', icon: Activity },
  { id: 2, text: 'Résumer mon établissement', icon: FileText },
  { id: 3, text: 'Voir les alertes de stock', icon: AlertTriangle }
];

export const AllianceAICopilot: React.FC<AllianceAICopilotProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingState, setProcessingState] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing, processingState]);

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
    if (!textToExecute.trim() || isProcessing) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToExecute.trim()
    };
    
    // Add user message to UI
    const currentMessages = [...messages, newUserMessage];
    setMessages(currentMessages);
    setQuery('');
    setIsProcessing(true);
    setProcessingState('Analyse du contexte...');
    
    // Simulate backend processing states for UI feedback
    const steps = ['Recherche des données...', 'Consultation des outils...', 'Préparation de la réponse...'];
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setProcessingState(steps[stepIndex]);
        stepIndex++;
      }
    }, 1500);

    try {
      const token = localStorage.getItem('alliance-auth') 
        ? JSON.parse(localStorage.getItem('alliance-auth') as string).state?.accessToken 
        : null;

      // Extract history for API (excluding the current message we just added)
      const historyForApi = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await fetch('http://localhost:8000/api/core/ai/ask/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ 
          prompt: textToExecute,
          history: historyForApi,
          context: {
            active_module: window.location.pathname.split('/')[2] || 'hub',
            active_route: window.location.pathname,
            academic_year: "2026-2027"
          }
        })
      });

      const data = await res.json();
      clearInterval(interval);
      setProcessingState('');
      setIsProcessing(false);
      
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || JSON.stringify(data)
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
      setTimeout(() => inputRef.current?.focus(), 100);
      
    } catch (err) {
      console.error('AI Error:', err);
      clearInterval(interval);
      setProcessingState('');
      setIsProcessing(false);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Erreur de connexion avec le serveur API.'
      }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    executeQuery(query);
  };

  const renderMessageContent = (content: string) => {
    // Basic Markdown handling for line breaks and bold
    return content.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} style={{ color: 'var(--color-text)' }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return <div key={i} style={{ minHeight: line.trim() ? 'auto' : '0.8rem' }}>{parts}</div>;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay that dims the background slightly */}
          <motion.div 
            className="ai-copilot-overlay-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          
          {/* Right Side Drawer */}
          <motion.div 
            className="ai-copilot-drawer"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* HEADER */}
            <div className="ai-copilot-header">
              <div className="ai-copilot-brand">
                <div className="ai-copilot-logo-glow">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="ai-copilot-title">Alliance AI</div>
                  <div className="ai-copilot-subtitle">Copilote & Analyse</div>
                </div>
              </div>
              <button className="ai-copilot-close" onClick={onClose} title="Fermer (Échap)">
                <X size={20} />
              </button>
            </div>

            {/* BODY / CHAT HISTORY */}
            <div className="ai-copilot-body">
              {messages.length === 0 ? (
                <div className="ai-copilot-empty-state">
                  <div className="ai-empty-icon">
                    <Sparkles size={32} />
                  </div>
                  <h3>Bonjour ! Je suis votre copilote.</h3>
                  <p>Comment puis-je vous aider aujourd'hui sur Alliance One ?</p>
                  
                  <div className="ai-suggestions-list">
                    {SUGGESTIONS.map((suggestion) => (
                      <button 
                        key={suggestion.id}
                        className="ai-suggestion-item"
                        onClick={() => executeQuery(suggestion.text)}
                      >
                        <suggestion.icon size={16} className="ai-suggestion-icon" />
                        <span>{suggestion.text}</span>
                        <ChevronRight size={14} className="ai-suggestion-arrow" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="ai-chat-history">
                  {messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      className={`ai-message-row ${msg.role}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {msg.role === 'assistant' && (
                        <div className="ai-avatar assistant">
                          <Sparkles size={14} />
                        </div>
                      )}
                      <div className={`ai-message-bubble ${msg.role}`}>
                        {renderMessageContent(msg.content)}
                      </div>
                      {msg.role === 'user' && (
                        <div className="ai-avatar user">
                          <UserIcon size={14} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isProcessing && (
                    <motion.div 
                      className="ai-message-row assistant"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="ai-avatar assistant">
                        <Sparkles size={14} />
                      </div>
                      <div className="ai-state-indicator">
                        <div className="ai-typing-dots">
                          <span></span><span></span><span></span>
                        </div>
                        <span className="ai-state-text">{processingState}</span>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* FOOTER / INPUT */}
            <div className="ai-copilot-footer">
              <form className="ai-copilot-input-wrapper" onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  className="ai-copilot-input"
                  placeholder="Posez votre question à l'IA..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isProcessing}
                  autoComplete="off"
                />
                <button 
                  type="submit" 
                  className={`ai-copilot-send ${query.trim() ? 'active' : ''}`}
                  disabled={!query.trim() || isProcessing}
                >
                  <Send size={16} />
                </button>
              </form>
              <div className="ai-footer-disclaimer">
                L'IA peut générer des informations inexactes. Vérifiez les données critiques.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
