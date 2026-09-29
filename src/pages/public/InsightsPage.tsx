import React from 'react';
import { motion } from 'framer-motion';
import { PublicHeader } from '../landing/components/PublicHeader';
import { PublicFooter } from '../landing/components/PublicFooter';
import { PublicAICopilot } from '../landing/components/PublicAICopilot';
import './ResourcesPages.css';

export const InsightsPage: React.FC = () => {
  const articles = [
    {
      title: "L'IA comme système nerveux central : Le futur du management",
      tag: "Vision",
      date: "Octobre 2026",
      desc: "Comment l'intelligence artificielle passe d'un simple outil conversationnel à une véritable infrastructure de pilotage autonome."
    },
    {
      title: "Briser les silos de données dans l'Enterprise",
      tag: "Data Strategy",
      date: "Septembre 2026",
      desc: "Analyse approfondie sur l'importance de centraliser la donnée opérationnelle pour accélérer la prise de décision."
    },
    {
      title: "Cybersécurité : L'approche Zero-Trust par défaut",
      tag: "Security",
      date: "Août 2026",
      desc: "Pourquoi l'architecture Zero-Trust est devenue indispensable pour les infrastructures logicielles critiques."
    }
  ];

  return (
    <div className="public-page-wrapper">
      <PublicHeader />
      <main className="resource-page-main">
        <section className="resource-hero">
          <div className="resource-hero-bg"></div>
          <motion.div className="resource-hero-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="resource-hero-badge">RECHERCHE & ANALYSE</span>
            <h1>Insights</h1>
            <p>Études, analyses et visions stratégiques sur le futur de l'ingénierie logicielle, de l'IA et de la gestion d'entreprise.</p>
          </motion.div>
        </section>

        <section className="resource-grid-section">
          <div className="resource-grid">
            {articles.map((art, i) => (
              <motion.div key={i} className="article-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * i }}>
                <div className="article-image"></div>
                <div className="article-content">
                  <div className="article-meta">
                    <span className="tag">{art.tag}</span>
                    <span>{art.date}</span>
                  </div>
                  <h3>{art.title}</h3>
                  <p>{art.desc}</p>
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
