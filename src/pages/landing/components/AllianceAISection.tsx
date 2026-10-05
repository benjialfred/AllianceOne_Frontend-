import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, Shield, Zap, Sparkles, ArrowRight, BrainCircuit, Code2, Layers, FileText, Users, CheckCircle2 } from 'lucide-react';
import './AllianceAISection.css';
import { useNavigate } from 'react-router-dom';
import { AllianceLogo } from '../../../design-system/components/AllianceLogo';

export const AllianceAISection: React.FC = () => {
  const navigate = useNavigate();

  const layerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="alliance-ai-section">
      {/* 01. INTRO: WHAT IS ALLIANCE AI */}
      <section className="ai-intro-container">
        <div className="eco-inner">
          <motion.div 
            className="ai-intro-grid"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.div className="ai-intro-text" variants={layerVariants}>
              <span className="micro-label mb-6 block" style={{ color: '#10B981' }}>BUILT-IN INTELLIGENCE</span>
              <h2 className="font-sans ai-headline">
                L'intelligence artificielle <br/>
                <span className="ai-headline-gradient">nativement intégrée.</span>
              </h2>
              <p className="font-sans ai-desc">
                Alliance AI n'est pas un simple chatbot ajouté en surcouche. 
                C'est le véritable système nerveux de votre infrastructure, doté d'un accès sécurisé 
                et contextuel à l'ensemble de vos modules métiers.
              </p>
            </motion.div>

            <motion.div className="ai-capabilities" variants={layerVariants}>
              <div className="ai-capability-item floating-card-effect">
                <div className="ai-cap-icon"><CheckCircle2 size={24} /></div>
                <div>
                  <h4>Privacy-First & Sovereign</h4>
                  <p>Vos données de l'entreprise ne sont jamais utilisées pour entraîner des modèles publics externes.</p>
                </div>
              </div>
              <div className="ai-capability-item floating-card-effect">
                <div className="ai-cap-icon"><CheckCircle2 size={24} /></div>
                <div>
                  <h4>Cross-Module Analytics</h4>
                  <p>Croise instantanément les informations RH, Finance et Supply Chain pour des insights précis.</p>
                </div>
              </div>
              <div className="ai-capability-item floating-card-effect">
                <div className="ai-cap-icon"><CheckCircle2 size={24} /></div>
                <div>
                  <h4>Action-Oriented</h4>
                  <p>Alliance AI peut configurer des rapports, envoyer des alertes et automatiser des workflows complexes.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 02. INTERACTIVE TERMINAL / UI PREVIEW */}
      <section className="ai-demo-container py-32">
        <div className="eco-inner">
          <motion.div 
            className="ai-window-mockup"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={layerVariants}
          >
            <div className="window-header">
              <div className="window-dots"><span></span><span></span><span></span></div>
              <div className="window-title">Alliance AI — Operation Terminal</div>
            </div>
            
            <div className="window-body">
              <div className="chat-sequence">
                <motion.div 
                  className="chat-prompt"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Sparkles size={20} className="text-emerald-500 mt-1" />
                  <p>Analyse les dépenses du module Finance sur le Q3, croise-les avec les recrutements du module RH, et génère un rapport d'optimisation budgétaire.</p>
                </motion.div>

                <motion.div 
                  className="chat-processing"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="processing-step">
                    <Database size={14} /> Accès sécurisé au module Finance...
                  </div>
                  <div className="processing-step">
                    <Users size={14} /> Croisement avec les données RH...
                  </div>
                  <div className="processing-step active">
                    <div className="spinner"></div> Génération des insights prédictifs...
                  </div>
                </motion.div>

                <motion.div 
                  className="chat-response"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                    <AllianceLogo size={20} />
                  </div>
                  <div className="response-card">
                    <h4>Rapport Q3 : Finance vs HR généré.</h4>
                    <p className="text-sm text-gray-400 mb-6">J'ai identifié une corrélation forte entre l'augmentation des coûts logiciels et les nouveaux recrutements IT.</p>
                    
                    <div className="rc-metrics">
                      <div className="rc-stat">
                        <span className="label">OPEX Q3</span>
                        <span className="value">+14.2%</span>
                      </div>
                      <div className="rc-stat">
                        <span className="label">Headcount</span>
                        <span className="value">+22</span>
                      </div>
                      <div className="rc-stat">
                        <span className="label">Optimization Potential</span>
                        <span className="value">45K €</span>
                      </div>
                    </div>

                    <div className="rc-actions">
                      <button className="rc-btn primary">Voir le rapport complet</button>
                      <button className="rc-btn">Planifier une réunion</button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
