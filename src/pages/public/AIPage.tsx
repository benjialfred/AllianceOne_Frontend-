import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, MessageSquare, Workflow, BarChart3, ArrowRight } from 'lucide-react';
import { PublicHeader } from '../landing/components/PublicHeader';
import { PublicFooter } from '../landing/components/PublicFooter';
import { PublicAICopilot } from '../landing/components/PublicAICopilot';
import './ResourcesPages.css';

export const AIPage: React.FC = () => {
  const aiCapabilities = [
    { title: "Copilote Contextuel", desc: "Posez des questions sur vos données en langage naturel. L'IA comprend le contexte de votre module.", icon: <MessageSquare size={24} /> },
    { title: "Automatisation Intelligente", desc: "Déléguez des tâches répétitives (facturation, relances, tri de candidatures) à des agents autonomes.", icon: <Workflow size={24} /> },
    { title: "Analyse Prédictive", desc: "Anticipez les ruptures de stock ou les déficits de trésorerie avant qu'ils ne se produisent.", icon: <BarChart3 size={24} /> },
    { title: "Supervision Cognitive", desc: "Le système nerveux IA surveille l'ensemble de vos opérations et signale les anomalies.", icon: <BrainCircuit size={24} /> }
  ];

  return (
    <div className="public-page-wrapper">
      <PublicHeader />
      <main className="resource-page-main">
        <section className="resource-hero">
          <div className="resource-hero-bg"></div>
          <motion.div className="resource-hero-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="resource-hero-badge">INTELLIGENCE DISTRIBUÉE</span>
            <h1>Alliance AI</h1>
            <p>Ne vous contentez pas de stocker vos données. Faites-les réfléchir. Alliance AI est nativement intégrée à chaque module pour vous assister au quotidien.</p>
          </motion.div>
        </section>

        <section className="resource-grid-section">
          <div className="resource-grid">
            {aiCapabilities.map((item, i) => (
              <motion.div key={i} className="resource-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * i }}>
                <div className="resource-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="resource-card-link">
                  Voir en action <ArrowRight size={16} />
                </div>
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
