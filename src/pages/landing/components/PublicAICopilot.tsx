import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Sparkles } from 'lucide-react';
import { AllianceLogo } from '../../../design-system/components/AllianceLogo';
import { API_HOST_URL } from '../../../core/api/client';
import './PublicAICopilot.css';

interface PublicAICopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublicAICopilot: React.FC<PublicAICopilotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "Bonjour ! Je suis l'assistant IA d'Alliance One. Je peux vous aider à découvrir notre écosystème, comprendre notre architecture ou vous orienter vers les bonnes ressources. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [input, setInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages as any);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_HOST_URL}/api/ai/public-ask/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: userMsg,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'SUCCESS') {
        setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: "Désolé, une erreur est survenue lors de la communication avec l'intelligence artificielle." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Désolé, le réseau semble instable. Veuillez réessayer." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="public-ai-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="public-ai-panel"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="public-ai-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AllianceLogo size={16} color="var(--ao-alliance-blue)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: 'white', fontSize: '16px', fontFamily: 'var(--ao-font-display)' }}>Alliance AI</h3>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Assistant Public</p>
                </div>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="public-ai-messages">
              {messages.map((m, i) => (
                <div key={i} className={`ai-msg-row ${m.role}`}>
                  <div className="ai-msg-avatar">
                    {m.role === 'ai' ? <Sparkles size={14} /> : <User size={14} />}
                  </div>
                  <div className="ai-msg-bubble">
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="ai-msg-row ai">
                  <div className="ai-msg-avatar">
                    <Sparkles size={14} />
                  </div>
                  <div className="ai-msg-bubble" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <div className="ai-dot-flashing"></div>
                    <div className="ai-dot-flashing" style={{ animationDelay: '0.2s' }}></div>
                    <div className="ai-dot-flashing" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="public-ai-input-area">
              <input 
                type="text" 
                placeholder="Posez votre question sur Alliance One..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} disabled={!input.trim()}>
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
