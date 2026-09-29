import React from 'react';
import { motion } from 'framer-motion';
import { Book, FileText, Settings, ShieldCheck, ArrowRight } from 'lucide-react';
import { PublicHeader } from '../landing/components/PublicHeader';
import { PublicFooter } from '../landing/components/PublicFooter';
import { PublicAICopilot } from '../landing/components/PublicAICopilot';
import './ResourcesPages.css';

export const GuidesPage: React.FC = () => {
  const guides = [
    {
      title: "Démarrage Rapide",
      desc: "Configurez votre espace de travail Alliance One en moins de 10 minutes.",
      icon: <Book size={24} />,
      link: "#"
    },
    {
      title: "Gestion des Accès (SSO)",
      desc: "Connectez votre fournisseur d'identité existant (Google, Microsoft, Okta).",
      icon: <ShieldCheck size={24} />,
      link: "#"
    },
    {
      title: "Automatisation & Workflows",
      desc: "Apprenez à utiliser Alliance AI pour automatiser vos processus métier.",
      icon: <Settings size={24} />,
      link: "#"
    },
    {
      title: "Migration de Données",
      desc: "Importez vos données depuis vos anciens systèmes vers l'infrastructure AO.",
      icon: <FileText size={24} />,
      link: "#"
    }
  ];

  return (
    <div className="public-page-wrapper">
      <PublicHeader />
      <main className="resource-page-main">
        <section className="resource-hero">
          <div className="resource-hero-bg"></div>
          <motion.div className="resource-hero-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="resource-hero-badge">CENTRE D'AIDE</span>
            <h1>Guides & Tutoriels</h1>
            <p>Maîtrisez toute la puissance de l'écosystème Alliance One grâce à nos guides pas-à-pas et nos documentations officielles.</p>
          </motion.div>
        </section>

        <section className="resource-grid-section">
          <div className="resource-grid">
            {guides.map((g, i) => (
              <motion.div key={i} className="resource-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * i }}>
                <div className="resource-card-icon">{g.icon}</div>
                <h3>{g.title}</h3>
                <p>{g.desc}</p>
                <div className="resource-card-link">
                  Lire le guide <ArrowRight size={16} />
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
