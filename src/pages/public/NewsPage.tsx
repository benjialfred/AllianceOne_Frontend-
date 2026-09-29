import React from 'react';
import { motion } from 'framer-motion';
import { PublicHeader } from '../landing/components/PublicHeader';
import { PublicFooter } from '../landing/components/PublicFooter';
import { PublicAICopilot } from '../landing/components/PublicAICopilot';
import './ResourcesPages.css';

export const NewsPage: React.FC = () => {
  const news = [
    {
      title: "Lancement officiel d'Alliance One Version 2.0",
      tag: "Product Release",
      date: "Mise à jour majeure",
      desc: "Déploiement global de la nouvelle architecture et intégration poussée du Copilot IA pour tous les modules."
    },
    {
      title: "Alliance One passe la barre des 15 grandes organisations",
      tag: "Milestone",
      date: "Croissance",
      desc: "Nous sommes fiers d'annoncer que de nouveaux leaders de l'industrie ont choisi notre infrastructure pour piloter leurs opérations."
    },
    {
      title: "Ouverture du Developer Center et API Publique",
      tag: "Ecosystem",
      date: "Nouveauté",
      desc: "Les développeurs tiers peuvent désormais créer des intégrations natives grâce à notre nouvelle plateforme."
    }
  ];

  return (
    <div className="public-page-wrapper">
      <PublicHeader />
      <main className="resource-page-main">
        <section className="resource-hero">
          <div className="resource-hero-bg"></div>
          <motion.div className="resource-hero-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="resource-hero-badge">PRESS ROOM</span>
            <h1>Actualités</h1>
            <p>Découvrez les dernières mises à jour produits, nos nouveaux partenariats et les jalons majeurs de l'écosystème Alliance One.</p>
          </motion.div>
        </section>

        <section className="resource-grid-section">
          <div className="resource-grid">
            {news.map((item, i) => (
              <motion.div key={i} className="article-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * i }}>
                <div className="article-image" style={{ background: 'var(--ao-deep-navy)' }}></div>
                <div className="article-content">
                  <div className="article-meta">
                    <span className="tag" style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)' }}>{item.tag}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
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
