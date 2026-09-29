import React from 'react';
import { motion } from 'framer-motion';
import { Code, Terminal, Webhook, Database, ArrowRight } from 'lucide-react';
import { PublicHeader } from '../landing/components/PublicHeader';
import { PublicFooter } from '../landing/components/PublicFooter';
import { PublicAICopilot } from '../landing/components/PublicAICopilot';
import './ResourcesPages.css';

export const DevelopersPage: React.FC = () => {
  const apis = [
    {
      title: "API REST & GraphQL",
      desc: "Interagissez avec le noyau d'Alliance One via nos APIs hautement performantes.",
      icon: <Code size={24} />
    },
    {
      title: "Webhooks en Temps Réel",
      desc: "Abonnez-vous aux événements du système pour synchroniser vos applications.",
      icon: <Webhook size={24} />
    },
    {
      title: "SDKs & Bibliothèques",
      desc: "Bibliothèques officielles pour Python, TypeScript, Go et Java.",
      icon: <Terminal size={24} />
    },
    {
      title: "Gestion des Données (Data Layer)",
      desc: "Documentation sur le modèle de données distribué d'Alliance One.",
      icon: <Database size={24} />
    }
  ];

  return (
    <div className="public-page-wrapper">
      <PublicHeader />
      <main className="resource-page-main">
        <section className="resource-hero">
          <div className="resource-hero-bg"></div>
          <motion.div className="resource-hero-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="resource-hero-badge">DEVELOPER CENTER</span>
            <h1>Construisez sur Alliance One</h1>
            <p>Accédez à notre documentation API, nos SDKs et nos outils de développement pour étendre l'infrastructure et intégrer vos propres systèmes.</p>
          </motion.div>
        </section>

        <section className="resource-grid-section">
          <div className="resource-grid">
            {apis.map((api, i) => (
              <motion.div key={i} className="resource-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * i }}>
                <div className="resource-card-icon">{api.icon}</div>
                <h3>{api.title}</h3>
                <p>{api.desc}</p>
                <div className="resource-card-link">
                  Voir la documentation <ArrowRight size={16} />
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
