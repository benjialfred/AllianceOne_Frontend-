/**
 * ALLIANCE AI COPILOT — SIGNATURE EXPERIENCE
 * The Intelligence Layer of Alliance One.
 * Pure Architectural Precision, Event-Driven Observability & Dynamic Mission Control.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  X, Activity, ArrowDown, Maximize2, Minimize2, Check, AlertCircle, ChevronRight
} from 'lucide-react';
import { API_HOST_URL } from '../../core/api/client';
import { useAuthStore } from '../../core/stores/authStore';

import type { 
  InteractionMode, 
  SystemOperationalState, 
  ConversationMessage, 
  MissionPlan, 
  MissionStep, 
  MissionEvent 
} from './types';

import { AoIntelligenceMark } from './components/AoIntelligenceMark';
import { AllianceLine } from './components/AllianceLine';
import { IntelligencePulse } from './components/IntelligencePulse';
import { StructuredContentRenderer } from './components/StructuredContentRenderer';
import { MissionControlPanel } from './components/MissionControlPanel';
import { CopilotComposer } from './components/CopilotComposer';

import './AllianceAICopilot.css';

interface AllianceAICopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY_MISSION_ID = 'alliance_ai_active_mission_id';

export const AllianceAICopilot: React.FC<AllianceAICopilotProps> = ({ isOpen, onClose }) => {
  const shouldReduceMotion = useReducedMotion();

  // --- IDENTITY & CONVERSATION IDENTIFIERS ---
  const conversationIdRef = useRef<string>(`conv_${Date.now()}`);
  
  // --- UI STATES ---
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [operationalState, setOperationalState] = useState<SystemOperationalState>('IDLE');
  const [operationalDetail, setOperationalDetail] = useState<string>('');
  const [isMissionPanelOpen, setIsMissionPanelOpen] = useState<boolean>(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState<boolean>(false);
  const [hasScrolledUp, setHasScrolledUp] = useState<boolean>(false);
  const [newMessagesCount, setNewMessagesCount] = useState<number>(0);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // --- MISSION STATE (Source of Truth: Backend) ---
  const [activeMission, setActiveMission] = useState<MissionPlan | null>(null);
  const [missionEvents, setMissionEvents] = useState<MissionEvent[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- 1. RECONSTRUCT MISSION STATE FROM BACKEND ON OPEN/REFRESH ---
  const fetchMissionAuditFromBackend = useCallback(async (missionId: string) => {
    try {
      const authState = useAuthStore.getState();
      const authHeaders: Record<string, string> = {};
      if (authState.accessToken) {
        authHeaders['Authorization'] = `Bearer ${authState.accessToken}`;
      }
      if (authState.user?.email) {
        authHeaders['X-User-Email'] = authState.user.email;
      }

      let res: Response;
      const url = `${API_HOST_URL}/api/core/ai/audit/${missionId}/`;
      try {
        res = await fetch(url, { headers: authHeaders });
      } catch (_) {
        res = await fetch(`http://127.0.0.1:8000/api/core/ai/audit/${missionId}/`, { headers: authHeaders });
      }

      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn('Could not reconstruct mission from backend:', e);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Check if there is an active mission ID in session cache
    const savedMissionId = sessionStorage.getItem(STORAGE_KEY_MISSION_ID);
    if (savedMissionId && !activeMission) {
      fetchMissionAuditFromBackend(savedMissionId).then((auditData) => {
        if (auditData && auditData.steps) {
          const reconstructedMission: MissionPlan = {
            mission_id: auditData.plan_id,
            user_request: auditData.user_request,
            title: auditData.user_request || 'Mission active',
            status: auditData.status,
            created_at: auditData.created_at,
            final_result: auditData.final_result,
            steps: auditData.steps.map((s: any) => ({
              step_id: s.step_id,
              tool_name: s.tool_name,
              arguments: s.arguments || {},
              dependencies: s.dependencies || [],
              status: s.status,
              output: s.output,
              error: s.error,
              requires_confirmation: s.requires_confirmation,
              verification_status: s.verification_status || 'PENDING',
              execution_metadata: s.execution_metadata || {}
            }))
          };
          setActiveMission(reconstructedMission);
          setIsMissionPanelOpen(true);
        }
      });
    }
  }, [isOpen, activeMission, fetchMissionAuditFromBackend]);

  // --- 2. POLLING AUDIT WHILE MISSION IS EXECUTING ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeMission && ['PLANNING', 'EXECUTING', 'RUNNING'].includes(activeMission.status)) {
      setOperationalState('EXECUTING');
      interval = setInterval(async () => {
        const auditData = await fetchMissionAuditFromBackend(activeMission.mission_id);
        if (auditData && auditData.steps) {
          // Detect step state changes to emit timeline events
          const updatedSteps: MissionStep[] = auditData.steps.map((s: any) => ({
            step_id: s.step_id,
            tool_name: s.tool_name,
            arguments: s.arguments || {},
            dependencies: s.dependencies || [],
            status: s.status,
            output: s.output,
            error: s.error,
            requires_confirmation: s.requires_confirmation,
            verification_status: s.verification_status || 'PENDING',
            execution_metadata: s.execution_metadata || {}
          }));

          setActiveMission(prev => prev ? {
            ...prev,
            status: auditData.status,
            final_result: auditData.final_result,
            steps: updatedSteps
          } : null);

          // Add timeline entry
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const runningStep = updatedSteps.find(s => s.status === 'RUNNING');
          if (runningStep) {
            setOperationalDetail(`Exécution : ${runningStep.tool_name.replace(/_/g, ' ')}`);
          }

          if (auditData.status === 'SUCCEEDED' || auditData.status === 'COMPLETED') {
            setOperationalState('COMPLETED');
            setOperationalDetail('Mission validée');
            sessionStorage.removeItem(STORAGE_KEY_MISSION_ID);

            // Add final conclusion message if not already present
            setMessages(prev => [
              ...prev,
              {
                id: `msg_${Date.now()}_concl`,
                conversation_id: conversationIdRef.current,
                mission_id: activeMission.mission_id,
                role: 'assistant',
                content: `✓ Mission #${activeMission.mission_id.slice(-6).toUpperCase()} accomplie avec succès. Résultats certifiés et enregistrés dans le grand livre de l'organisation.`,
                timestamp: time
              }
            ]);
          }
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [activeMission?.mission_id, activeMission?.status, fetchMissionAuditFromBackend]);

  // --- 3. AUTO-SCROLL WITH USER-SCROLL DETECTION ---
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom > 120) {
      setHasScrolledUp(true);
    } else {
      setHasScrolledUp(false);
      setNewMessagesCount(0);
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setHasScrolledUp(false);
    setNewMessagesCount(0);
  };

  useEffect(() => {
    if (!hasScrolledUp) {
      scrollToBottom('smooth');
    } else {
      setNewMessagesCount(prev => prev + 1);
    }
  }, [messages, operationalState]);

  // --- 4. KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // --- 5. SEND INSTRUCTION TO ALLIANCE AI ---
  const handleSendMessage = async (promptText: string) => {
    if (!promptText.trim() || operationalState === 'ANALYZING' || operationalState === 'PLANNING') return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `msg_${Date.now()}_u`;

    // Add User Message
    const userMessage: ConversationMessage = {
      id: userMsgId,
      conversation_id: conversationIdRef.current,
      role: 'user',
      content: promptText,
      timestamp: time,
      mode: 'DIRECT'
    };

    setMessages(prev => [...prev, userMessage]);
    setOperationalState('ANALYZING');
    setOperationalDetail('Analyse de l\'objectif & résolution du contexte...');

    try {
      const authState = useAuthStore.getState();
      const token = authState.accessToken || 'dev-token-local';
      const userEmail = authState.user?.email || 'benjaminadzessa@gmail.com';

      const historyPayload = messages.slice(-8).map(m => ({
        role: m.role,
        content: m.content
      }));

      const activeMod = window.location.pathname.split('/')[2] || 'hub';

      const requestBody = JSON.stringify({
        prompt: promptText,
        history: historyPayload,
        context: {
          active_module: activeMod,
          active_route: window.location.pathname,
          academic_year: '2026-2027'
        }
      });

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-User-Email': userEmail
      };

      // Real network call with local fallback resilience
      let response: Response;
      try {
        response = await fetch(`${API_HOST_URL}/api/core/ai/ask/`, {
          method: 'POST',
          headers,
          body: requestBody
        });
      } catch (netErr) {
        console.warn('Remote ask failed, falling back to local backend...');
        response = await fetch('http://127.0.0.1:8000/api/core/ai/ask/', {
          method: 'POST',
          headers,
          body: requestBody
        });
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        throw new Error(errJson?.error || errJson?.detail || `API Error ${response.status}`);
      }

      const resData = await response.json();
      const payload = resData.data;

      // Check if it's a mission plan requiring tool execution
      if (payload && payload.type === 'mission_plan' && payload.mission && payload.mission.steps && payload.mission.steps.length > 0) {
        const newMission: MissionPlan = {
          mission_id: resData.plan_id || `plan_${Date.now()}`,
          user_request: promptText,
          title: payload.mission.title || promptText,
          status: payload.mission.status || 'EXECUTING',
          created_at: new Date().toISOString(),
          steps: payload.mission.steps.map((s: any) => ({
            step_id: s.step_id,
            tool_name: s.tool_name,
            arguments: s.arguments || {},
            dependencies: s.dependencies || [],
            status: s.status || 'PENDING',
            output: s.output,
            error: s.error,
            requires_confirmation: s.requires_confirmation || false,
            verification_status: s.verification_status || 'PENDING',
            execution_metadata: s.execution_metadata || {}
          }))
        };

        setActiveMission(newMission);
        sessionStorage.setItem(STORAGE_KEY_MISSION_ID, newMission.mission_id);
        setIsMissionPanelOpen(true);
        setOperationalState('EXECUTING');
        setOperationalDetail('Structuration du plan d\'action...');

        // Add assistant introductory message
        setMessages(prev => [
          ...prev,
          {
            id: `msg_${Date.now()}_a`,
            conversation_id: conversationIdRef.current,
            mission_id: newMission.mission_id,
            role: 'assistant',
            content: resData.content || `Objectif structuré en plan d'action (${newMission.steps.length} étapes). Déploiement de Mission Control en cours.`,
            timestamp: time,
            mode: 'MISSION'
          }
        ]);

        // Add to timeline events
        setMissionEvents(prev => [
          ...prev,
          {
            id: `evt_${Date.now()}_start`,
            mission_id: newMission.mission_id,
            type: 'PlanCreated',
            timestamp: time,
            label: `Plan initialisé avec ${newMission.steps.length} étapes.`
          }
        ]);

      } else {
        // Direct answer or informative analysis (No heavy mission tools)
        setOperationalState('IDLE');
        setOperationalDetail('');

        setMessages(prev => [
          ...prev,
          {
            id: `msg_${Date.now()}_a`,
            conversation_id: conversationIdRef.current,
            role: 'assistant',
            content: payload?.content || resData.content || 'Voici les informations demandées.',
            timestamp: time,
            mode: 'DIRECT'
          }
        ]);
      }

    } catch (err: any) {
      console.error('Alliance AI Error:', err);
      setOperationalState('ERROR');
      setOperationalDetail(err.message || 'Erreur de connexion');
      setMessages(prev => [
        ...prev,
        {
          id: `msg_${Date.now()}_err`,
          conversation_id: conversationIdRef.current,
          role: 'assistant',
          content: `⚠️ Erreur opérationnelle : ${err.message || 'Impossible de contacter le serveur.'}`,
          timestamp: time
        }
      ]);
    }
  };

  const handleConfirmStep = (stepId: string) => {
    if (!activeMission) return;
    setActiveMission(prev => {
      if (!prev) return null;
      return {
        ...prev,
        steps: prev.steps.map(s => s.step_id === stepId ? { ...s, requires_confirmation: false, status: 'RUNNING' } : s)
      };
    });
  };

  const isMissionActive = activeMission && activeMission.steps.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`ao-workspace-overlay ${isFocusMode ? 'focus-mode' : ''}`}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Main Architectural Shell */}
          <div className={`ao-workspace-container ${isMissionActive && isMissionPanelOpen ? 'has-mission-open' : ''}`}>
            
            {/* ─── LEFT COLUMN: CONVERSATION & INTELLIGENCE FLOW ─── */}
            <div className="ao-chat-deck">
              
              {/* Topbar */}
              <header className="ao-copilot-header">
                <div className="ao-brand-badge">
                  <AoIntelligenceMark state={operationalState} size={24} showHalo={operationalState !== 'IDLE'} />
                  <div className="ao-brand-text">
                    <span className="ao-brand-name">ALLIANCE AI</span>
                    <span className="ao-brand-context">Alliance One • Intelligence Opérationnelle</span>
                  </div>
                </div>

                <div className="ao-header-actions">
                  {/* Real System Telemetry Status */}
                  <div className="ao-status-indicator">
                    <IntelligencePulse state={operationalState} size="sm" />
                    <span className="ao-status-label">
                      {operationalState === 'IDLE' ? 'SYSTÈME PRÊT' : operationalDetail || operationalState}
                    </span>
                  </div>

                  {/* Toggle Mission Panel (Desktop) */}
                  {isMissionActive && (
                    <button
                      className={`ao-btn-deck-toggle ${isMissionPanelOpen ? 'active' : ''}`}
                      onClick={() => setIsMissionPanelOpen(prev => !prev)}
                      title="Afficher/masquer Mission Control"
                    >
                      <Activity size={14} />
                      <span>Mission #{activeMission.mission_id.slice(-4).toUpperCase()}</span>
                    </button>
                  )}

                  {/* Toggle Focus Mode */}
                  <button
                    className="ao-btn-icon"
                    onClick={() => setIsFocusMode(prev => !prev)}
                    title={isFocusMode ? 'Quitter le mode focus' : 'Mode Focus'}
                  >
                    {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>

                  {/* Close Workspace */}
                  <button className="ao-btn-icon close" onClick={onClose} title="Fermer (Échap)">
                    <X size={18} />
                  </button>
                </div>
              </header>

              {/* Chat Stream Area */}
              <div 
                className="ao-chat-stream"
                ref={chatContainerRef}
                onScroll={handleScroll}
              >
                {messages.length === 0 ? (
                  /* ─── SIGNATURE HERO EMPTY STATE ─── */
                  <div className="ao-hero-welcome">
                    <motion.div 
                      className="ao-hero-mark-container"
                      initial={shouldReduceMotion ? {} : { scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <AoIntelligenceMark state="IDLE" size={54} showHalo />
                    </motion.div>

                    <div className="ao-hero-line-rail">
                      <AllianceLine activeStage={1} showLabels compact />
                    </div>

                    <h2 className="ao-hero-title">ALLIANCE AI</h2>
                    <p className="ao-hero-subtitle">
                      Votre intelligence opérationnelle intégrée.
                      <br />
                      Décrivez simplement ce que vous souhaitez accomplir sur votre organisation.
                    </p>

                    <div className="ao-hero-suggestions-grid">
                      <button onClick={() => handleSendMessage("Analyser les présences et les anomalies de la semaine.")}>
                        <span className="ao-sug-domain">ÉDUCATION</span>
                        <span>Analyser les absences de la semaine</span>
                        <ChevronRight size={13} className="ao-sug-arr" />
                      </button>

                      <button onClick={() => handleSendMessage("Prépare un état complet des stocks et alertes d'inventaire.")}>
                        <span className="ao-sug-domain">INVENTAIRE</span>
                        <span>État des stocks et alertes de rupture</span>
                        <ChevronRight size={13} className="ao-sug-arr" />
                      </button>

                      <button onClick={() => handleSendMessage("Générer la synthèse financière du mois en cours.")}>
                        <span className="ao-sug-domain">FINANCES</span>
                        <span>Synthèse financière et factures en attente</span>
                        <ChevronRight size={13} className="ao-sug-arr" />
                      </button>

                      <button onClick={() => handleSendMessage("Quels sont les effectifs actuels de mon organisation ?")}>
                        <span className="ao-sug-domain">ORGANISATION</span>
                        <span>Effectifs globaux et répartition</span>
                        <ChevronRight size={13} className="ao-sug-arr" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ─── EDITORIAL CONVERSATION LIST ─── */
                  <div className="ao-messages-flow">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        className={`ao-message-entry ${msg.role}`}
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {/* Meta Label */}
                        <div className="ao-msg-meta-header">
                          <span className="ao-msg-author">
                            {msg.role === 'user' ? 'VOUS' : 'ALLIANCE AI'}
                          </span>
                          <span className="ao-msg-time">{msg.timestamp}</span>
                        </div>

                        {/* Content Area */}
                        <div className="ao-msg-body">
                          {msg.role === 'assistant' ? (
                            <StructuredContentRenderer
                              content={msg.content}
                              blocks={msg.blocks}
                              onActionClick={(actionId) => {
                                handleSendMessage(`Exécuter l'action recommandée : ${actionId}`);
                              }}
                            />
                          ) : (
                            <div className="ao-user-bubble-text">
                              {msg.content}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {/* Operational Processing Indicator */}
                    {(operationalState === 'ANALYZING' || operationalState === 'PLANNING') && (
                      <motion.div
                        className="ao-message-entry assistant analyzing"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="ao-msg-meta-header">
                          <span className="ao-msg-author">ALLIANCE AI</span>
                          <span className="ao-msg-time">En cours</span>
                        </div>
                        <div className="ao-processing-card">
                          <AoIntelligenceMark state={operationalState} size={20} />
                          <div className="ao-processing-text">
                            <span className="ao-proc-title">{operationalDetail || 'Analyse en cours...'}</span>
                            <IntelligencePulse state={operationalState} size="sm" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Floating "Scroll to Bottom" Badge */}
              <AnimatePresence>
                {hasScrolledUp && newMessagesCount > 0 && (
                  <motion.button
                    className="ao-scroll-badge"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={() => scrollToBottom('smooth')}
                  >
                    <ArrowDown size={13} />
                    <span>{newMessagesCount} nouveau{newMessagesCount > 1 ? 'x' : ''} élément{newMessagesCount > 1 ? 's' : ''}</span>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Composer Deck */}
              <footer className="ao-composer-deck">
                <CopilotComposer
                  onSend={handleSendMessage}
                  isProcessing={operationalState === 'ANALYZING' || operationalState === 'PLANNING'}
                />
              </footer>
            </div>

            {/* ─── RIGHT COLUMN: CONTEXTUAL MISSION CONTROL (Desktop) ─── */}
            <AnimatePresence>
              {isMissionActive && isMissionPanelOpen && (
                <div className="ao-mission-deck desktop-only">
                  <MissionControlPanel
                    mission={activeMission}
                    events={missionEvents}
                    onConfirmStep={handleConfirmStep}
                    onToggleCollapse={() => setIsMissionPanelOpen(false)}
                  />
                </div>
              )}
            </AnimatePresence>

            {/* ─── RESPONSIVE BOTTOM SHEET (Mobile / Tablet) ─── */}
            <AnimatePresence>
              {isMobileSheetOpen && isMissionActive && (
                <>
                  <motion.div
                    className="ao-sheet-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileSheetOpen(false)}
                  />
                  <motion.div
                    className="ao-sheet-drawer"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                  >
                    <div className="ao-sheet-handle" onClick={() => setIsMobileSheetOpen(false)} />
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                      <MissionControlPanel
                        mission={activeMission}
                        events={missionEvents}
                        onConfirmStep={handleConfirmStep}
                        onToggleCollapse={() => setIsMobileSheetOpen(false)}
                      />
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
export default AllianceAICopilot;
