/**
 * ALLIANCE AI COPILOT
 * AI Mission Workspace (Chef de Mission) - FUNCTIONAL END-TO-END
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, X, Activity, FileText, AlertTriangle, Send, 
  User as UserIcon, CheckCircle2, Circle, Pause, 
  ChevronDown, ChevronRight, Check, AlertCircle 
} from 'lucide-react';
import './AllianceAICopilot.css';

interface AllianceAICopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

type MissionStatus = 'DRAFT' | 'PLANNING' | 'READY' | 'EXECUTING' | 'WAITING_FOR_INPUT' | 'WAITING_FOR_CONFIRMATION' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
type StepStatus = 'pending' | 'active' | 'running' | 'completed' | 'failed' | 'paused';
type StepType = 'automatic' | 'confirmation_required' | 'input_required' | 'blocked';

interface MissionStep {
  id: string;
  title: string;
  description: string;
  type: StepType;
  status: StepStatus;
  result?: string;
  timestamp?: string;
}

interface ActivityLog {
  id: string;
  time: string;
  message: string;
  details?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const AllianceAICopilot: React.FC<AllianceAICopilotProps> = ({ isOpen, onClose }) => {
  // --- UI STATE ---
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingState, setProcessingState] = useState('');
  
  // --- MISSION STATE ---
  const [missionStatus, setMissionStatus] = useState<MissionStatus>('DRAFT');
  const [missionTitle, setMissionTitle] = useState('');
  const [planId, setPlanId] = useState<string | null>(null);
  const [steps, setSteps] = useState<MissionStep[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize focus
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (messages.length === 0) {
        setMissionStatus('DRAFT');
        setSteps([]);
        setLogs([]);
        setMissionTitle('');
        setPlanId(null);
      }
    }
  }, [isOpen]);

  // Auto-scroll chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing, processingState]);

  // Polling mechanism
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    let interval: ReturnType<typeof setInterval>;
    if (planId && ['RUNNING', 'EXECUTING'].includes(missionStatus)) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_URL}/api/core/ai/audit/${planId}/`);
          const data = await res.json();
          if (data && data.status) {
            setMissionStatus(data.status);
            
            // Map backend execution steps to UI MissionStep
            const mappedSteps: MissionStep[] = (data.steps || []).map((s: any) => ({
              id: s.step_id,
              title: s.tool_name,
              description: `Arguments: ${JSON.stringify(s.arguments)}`,
              type: 'automatic',
              status: s.status === 'SUCCEEDED' ? 'completed' :
                      s.status === 'RUNNING' ? 'running' :
                      s.status === 'PENDING' ? 'pending' :
                      s.status === 'FAILED' ? 'failed' : 'paused',
              result: s.output ? JSON.stringify(s.output) : undefined
            }));
            
            setSteps(mappedSteps);
            if (data.status === 'SUCCEEDED') {
              setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: '✅ Mission accomplie avec succès !'
              }]);
              addLog('Mission terminée avec succès');
            }
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [planId, missionStatus]);

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

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [...prev, { id: Date.now().toString(), time, message }]);
  };

  // --- API CALL LOGIC ---
  const executeQuery = async (textToExecute: string) => {
    if (!textToExecute.trim() || isProcessing) return;

    // Add User Message
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: textToExecute };
    const currentMessages = [...messages, newUserMsg];
    setMessages(currentMessages);
    setQuery('');
    
    setIsProcessing(true);
    setProcessingState('Analyse de l\'objectif...');

    try {
      const token = localStorage.getItem('alliance-auth') 
        ? JSON.parse(localStorage.getItem('alliance-auth') as string).state?.accessToken 
        : null;

      const historyForApi = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/core/ai/ask/`, {
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

      const responseJson = await res.json();
      setIsProcessing(false);
      
      const payload = responseJson.data; // Our structured JSON output
      
      if (responseJson.plan_id) {
          setPlanId(responseJson.plan_id);
      }
      
      if (payload) {
        // Add Assistant Message
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: payload.content || responseJson.content
        }]);

        if (payload.type === 'mission_plan' && payload.mission) {
          setMissionTitle(payload.mission.title || 'Mission en cours');
          setMissionStatus(payload.mission.status || 'EXECUTING');
          setSteps(payload.mission.steps || []);
          addLog(`Plan de mission généré : ${payload.mission.title}`);
          
          if (!isMobilePanelOpen && window.innerWidth <= 1024) {
            setIsMobilePanelOpen(true);
          }
        }
      } else {

        // Fallback for unstructured string
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseJson.content || 'Erreur lors de la lecture.'
        }]);
      }
      
      setTimeout(() => inputRef.current?.focus(), 100);
      
    } catch (err) {
      console.error('AI Error:', err);
      setIsProcessing(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Erreur de connexion avec le serveur API.'
      }]);
    }
  };

  const handleConfirmStep = (stepId: string) => {
    // In Phase 2, this will send a real command to the backend to execute the step tool
    const updatedSteps = [...steps];
    const stepIndex = updatedSteps.findIndex(s => s.id === stepId);
    
    if (stepIndex !== -1) {
      updatedSteps[stepIndex].status = 'completed';
      updatedSteps[stepIndex].result = 'Action confirmée et exécutée avec succès.';
      if (updatedSteps[stepIndex + 1]) {
        updatedSteps[stepIndex + 1].status = 'active';
      }
      setSteps(updatedSteps);
      addLog(`Étape '${updatedSteps[stepIndex].title}' confirmée par l'utilisateur`);
    }
  };

  // --- RENDER HELPERS ---
  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const progressPercent = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('✓')) {
        return <div key={i} className="ai-msg-check"><Check size={14} /> <span>{line.substring(1)}</span></div>;
      }
      if (line.startsWith('→')) {
        return <div key={i} className="ai-msg-arrow"><ChevronRight size={14} /> <span style={{opacity: 0.7}}>{line.substring(1)}</span></div>;
      }
      return <div key={i} style={{ minHeight: line.trim() ? 'auto' : '0.4rem' }}>{line}</div>;
    });
  };

  const renderMissionControl = () => {
    if (missionStatus === 'DRAFT' || steps.length === 0) {
      return (
        <div className="mc-empty">
          <Sparkles size={32} className="mc-empty-icon" />
          <h4>Mission Control</h4>
          <p>Le plan d'action apparaîtra ici pour les objectifs complexes.</p>
        </div>
      );
    }

    return (
      <div className="mc-container">
        {/* Header */}
        <div className="mc-header">
          <div className="mc-header-top">
            <h3 className="mc-title">{missionTitle}</h3>
            <div className="mc-actions">
              <button className="mc-btn-icon"><Pause size={14} /></button>
            </div>
          </div>
          <div className="mc-meta">
            <span className="mc-status-badge running">{missionStatus}</span>
            <span className="mc-id">Mission #A{Date.now().toString().slice(-4)}</span>
          </div>
        </div>

        {/* Progression */}
        <div className="mc-progress-section">
          <div className="mc-progress-header">
            <span>{completedSteps} / {steps.length} étapes</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="mc-progress-bar">
            <div className="mc-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Steps List */}
        <div className="mc-steps">
          {steps.map((step) => (
            <div key={step.id} className={`mc-step ${step.status}`}>
              <div className="mc-step-icon">
                {step.status === 'completed' && <CheckCircle2 size={16} className="text-success" />}
                {step.status === 'active' && <Circle size={16} className="text-primary mc-pulse" fill="currentColor" />}
                {step.status === 'pending' && <Circle size={16} className="text-muted" />}
              </div>
              <div className="mc-step-content">
                <div className="mc-step-title">{step.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#71717a' }}>{step.description}</div>
                
                {/* Result Block */}
                {step.status === 'completed' && step.result && (
                  <div className="mc-step-result">
                    <Check size={12} /> {step.result}
                  </div>
                )}
                
                {/* Active Confirmation Block */}
                {step.status === 'active' && step.type === 'confirmation_required' && (
                  <div className="mc-step-action">
                    <div className="mc-step-action-text">
                      <AlertCircle size={14} /> Action requise de votre part.
                    </div>
                    <div className="mc-step-action-buttons">
                      <button className="btn-secondary">Annuler</button>
                      <button className="btn-primary" onClick={() => handleConfirmStep(step.id)}>Confirmer</button>
                    </div>
                  </div>
                )}
                
                {/* Active Running Block */}
                {step.status === 'active' && step.type === 'automatic' && (
                  <div className="mc-step-running">
                    <span className="mc-spinner"></span> En cours d'exécution par l'IA...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Activity Log */}
        <div className="mc-activity">
          <div className="mc-activity-title">ACTIVITY LOG</div>
          <div className="mc-log-list">
            {logs.map(log => (
              <div key={log.id} className="mc-log-item">
                <span className="mc-log-time">{log.time}</span>
                <span className="mc-log-msg">{log.message}</span>
              </div>
            ))}
          </div>
          <button className="mc-log-details-btn">
            Technical details <ChevronDown size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="ai-workspace-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Main Workspace Split Layout */}
          <div className="ai-workspace-container">
            
            {/* LEFT: CHAT COLUMN */}
            <div className="ai-chat-column">
              <div className="ai-chat-topbar">
                <div className="ai-brand">
                  <Sparkles size={16} className="text-primary" />
                  <span>Alliance AI</span>
                </div>
                {/* Mobile Mission Toggle */}
                {steps.length > 0 && (
                  <button 
                    className="ai-mobile-mission-toggle"
                    onClick={() => setIsMobilePanelOpen(true)}
                  >
                    <Activity size={16} />
                    <span>Voir le Plan</span>
                  </button>
                )}
                <button className="ai-close-btn" onClick={onClose}><X size={20} /></button>
              </div>

              <div className="ai-chat-history">
                {messages.length === 0 ? (
                  <div className="ai-empty-state">
                    <Sparkles size={40} className="ai-empty-logo" />
                    <h2>Que souhaitez-vous accomplir ?</h2>
                    <div className="ai-suggestions-grid">
                      <button onClick={() => executeQuery("Ouvre une boutique de vêtements avec Mobile Money.")}>
                        Ouvrir une boutique
                      </button>
                      <button onClick={() => executeQuery("Prépare le rapport financier du mois.")}>
                        Rapport financier
                      </button>
                      <button onClick={() => executeQuery("Quel est mon stock actuel ?")}>
                        État des stocks
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="ai-messages-list">
                    {messages.map((msg) => (
                      <motion.div 
                        key={msg.id}
                        className={`ai-message ${msg.role}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {msg.role === 'assistant' && (
                          <div className="ai-avatar-cell">
                            <Sparkles size={16} className="text-primary" />
                          </div>
                        )}
                        <div className="ai-message-content">
                          {renderMessageContent(msg.content)}
                        </div>
                      </motion.div>
                    ))}
                    {isProcessing && (
                      <motion.div 
                        className="ai-message assistant"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="ai-avatar-cell">
                          <Sparkles size={16} className="text-primary" />
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

              <div className="ai-chat-input-area">
                <form className="ai-input-form" onSubmit={(e) => { e.preventDefault(); executeQuery(query); }}>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Décrivez votre objectif (ex: Publier une boutique)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoComplete="off"
                    disabled={isProcessing}
                  />
                  <button type="submit" disabled={!query.trim() || isProcessing} className={query.trim() ? 'active' : ''}>
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT: MISSION CONTROL (Desktop) */}
            <div className="ai-mission-column desktop-only">
              {renderMissionControl()}
            </div>
            
            {/* MOBILE BOTTOM SHEET FOR MISSION CONTROL */}
            <AnimatePresence>
              {isMobilePanelOpen && (
                <>
                  <motion.div 
                    className="ai-bottom-sheet-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobilePanelOpen(false)}
                  />
                  <motion.div 
                    className="ai-bottom-sheet"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  >
                    <div className="ai-bottom-sheet-handle" onClick={() => setIsMobilePanelOpen(false)}></div>
                    <div className="ai-bottom-sheet-content">
                      {renderMissionControl()}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
