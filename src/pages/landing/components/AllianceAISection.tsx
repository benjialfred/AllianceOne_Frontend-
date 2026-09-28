import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, Shield, Zap, Sparkles, ArrowRight, BrainCircuit, Code2, Layers } from 'lucide-react';
import './AllianceAISection.css';
import { useNavigate } from 'react-router-dom';

export const AllianceAISection: React.FC = () => {
  const navigate = useNavigate();

  const layerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="alliance-ai-section bg-deep-navy text-white">
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
              <h2 className="font-display ai-headline">
                L'intelligence intégrée <br/>
                <span className="text-alliance-blue">à la racine</span> du système.
              </h2>
              <p className="font-sans ai-desc">
                Alliance AI n'est pas une surcouche cosmétique ou un assistant déconnecté. 
                C'est un agent d'intelligence opérationnelle qui possède un accès natif, 
                sécurisé et contextuel à l'ensemble des modules de votre infrastructure.
              </p>
            </motion.div>

            <motion.div className="ai-capabilities" variants={layerVariants}>
              <div className="ai-capability-item">
                <Shield size={20} className="text-alliance-blue" />
                <div>
                  <h4>Privacy-First</h4>
                  <p>Vos données ne sont jamais utilisées pour entraîner des modèles publics.</p>
                </div>
              </div>
              <div className="ai-capability-item">
                <Database size={20} className="text-alliance-blue" />
                <div>
                  <h4>Cross-Module</h4>
                  <p>Croise nativement les données RH, Finance et Opérations.</p>
                </div>
              </div>
              <div className="ai-capability-item">
                <Zap size={20} className="text-alliance-blue" />
                <div>
                  <h4>Action-Oriented</h4>
                  <p>Ne se contente pas de répondre. Planifie et exécute des workflows.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 02. INTERACTIVE TERMINAL / UI PREVIEW */}
      <section className="ai-demo-container py-24">
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
                  <Sparkles size={16} className="text-alliance-blue mt-1" />
                  <p>Analyse les performances du département Finance par rapport aux objectifs fixés le mois dernier, et prépare un brouillon de rapport.</p>
                </motion.div>

                <motion.div 
                  className="chat-processing"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="processing-step">
                    <div className="spinner"></div>
                    <span>Querying Finance Module...</span>
                  </div>
                  <div className="processing-step delayed">
                    <div className="spinner"></div>
                    <span>Correlating with HR (Department objectives)...</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="chat-response"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="response-card">
                    <div className="response-header">
                      <FileText size={16} className="text-gray-400" />
                      <span>Rapport_Performance_Finance.md</span>
                    </div>
                    <div className="response-body">
                      Le département Finance a dépassé ses objectifs de réduction des coûts de 12% ce mois-ci. Cependant, le délai moyen de recouvrement (DSO) a augmenté de 4 jours. Le brouillon complet est prêt pour votre révision.
                    </div>
                    <div className="response-actions">
                      <button className="btn-micro">Ouvrir</button>
                      <button className="btn-micro primary">Générer PDF</button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 03. ARCHITECTURE DEPLOYMENT & ORIGINS (Replacement for SectionDevelopersOrigin) */}
      <section className="global-origins-container bg-graphite pt-32 pb-48">
        <div className="eco-inner text-center">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={layerVariants}
          >
            <span className="micro-label text-champagne mb-6 block">INFRASTRUCTURE MONDIALE</span>
            <h2 className="font-display text-4xl font-bold mb-8">
              Built in Africa.<br/>Designed for the world.
            </h2>
            <p className="font-sans text-gray-400 max-w-2xl mx-auto mb-16 text-lg">
              Une ingénierie de pointe et une architecture capable de soutenir les opérations des organisations du monde entier, sans compromis sur la sécurité et la souveraineté des données.
            </p>

            <div className="origin-metrics flex justify-center gap-16">
              <div>
                <div className="metric-value font-display text-white text-3xl font-bold">API-First</div>
                <div className="metric-label text-gray-500 font-sans text-sm mt-2 uppercase tracking-widest">Architecture</div>
              </div>
              <div>
                <div className="metric-value font-display text-white text-3xl font-bold">End-to-End</div>
                <div className="metric-label text-gray-500 font-sans text-sm mt-2 uppercase tracking-widest">Encryption</div>
              </div>
              <div>
                <div className="metric-value font-display text-white text-3xl font-bold">Zero</div>
                <div className="metric-label text-gray-500 font-sans text-sm mt-2 uppercase tracking-widest">Data Lock-in</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};
