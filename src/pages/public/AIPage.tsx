import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, MessageSquare, Workflow, BarChart3, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader } from '../landing/components/PublicHeader';
import { PublicFooter } from '../landing/components/PublicFooter';
import { PublicAICopilot } from '../landing/components/PublicAICopilot';
import './AIPage.css';

export const AIPage: React.FC = () => {
  const navigate = useNavigate();

  const aiCapabilities = [
    { 
      title: "Copilote Contextuel", 
      desc: "Posez des questions sur vos données en langage naturel. L'IA comprend le contexte de votre module.", 
      icon: <MessageSquare size={32} /> 
    },
    { 
      title: "Automatisation Intelligente", 
      desc: "Déléguez des tâches répétitives (facturation, relances, tri de candidatures) à des agents autonomes.", 
      icon: <Workflow size={32} /> 
    },
    { 
      title: "Analyse Prédictive", 
      desc: "Anticipez les ruptures de stock ou les déficits de trésorerie avant qu'ils ne se produisent.", 
      icon: <BarChart3 size={32} /> 
    },
    { 
      title: "Supervision Cognitive", 
      desc: "Le système nerveux IA surveille l'ensemble de vos opérations et signale les anomalies en temps réel.", 
      icon: <BrainCircuit size={32} /> 
    }
  ];

  return (
    <div className="ai-page-wrapper">
      <PublicHeader />
      
      <main>
        <section className="ai-hero">
          <div className="ai-hero-bg"></div>
          <motion.div 
            className="ai-hero-content" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <div className="ai-hero-badge">
              <Sparkles size={16} /> INTELLIGENCE DISTRIBUÉE
            </div>
            <h1>Le cerveau de votre<br/>organisation</h1>
            <p>Ne vous contentez pas de stocker vos données. Faites-les réfléchir. Alliance AI est nativement intégrée à chaque module pour vous assister au quotidien avec précision et sécurité.</p>
            
            <div className="ai-hero-actions">
              <button className="ai-btn-primary" onClick={() => navigate('/register')}>
                Déployer Alliance IA <ArrowRight size={18} />
              </button>
              <button className="ai-btn-secondary" onClick={() => navigate('/contact')}>
                Demander une démo
              </button>
            </div>
          </motion.div>
        </section>

        <section className="ai-grid-section">
          <div className="ai-grid">
            {aiCapabilities.map((item, i) => (
              <motion.div 
                key={i} 
                className="ai-card" 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
              >
                <div className="ai-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <a className="ai-card-link" onClick={() => navigate('/register')}>
                  Essayer gratuitement <ArrowRight size={16} />
                </a>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <PublicAICopilot />
      <PublicFooter />
    </div>
  );
};
