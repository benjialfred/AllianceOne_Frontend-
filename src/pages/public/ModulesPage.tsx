import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, LineChart, Users, LayoutList, Database, Briefcase, ArrowRight } from 'lucide-react';
import { PublicHeader } from '../landing/components/PublicHeader';
import { PublicFooter } from '../landing/components/PublicFooter';
import { PublicAICopilot } from '../landing/components/PublicAICopilot';
import './ResourcesPages.css';

export const ModulesPage: React.FC = () => {
  const modulesList = [
    { name: "Education", desc: "Gestion des écoles, universités, étudiants, professeurs et notes.", icon: <BookOpen size={24} /> },
    { name: "Finance", desc: "Comptabilité, facturation, trésorerie et intégration bancaire.", icon: <LineChart size={24} /> },
    { name: "Inventory", desc: "Gestion des stocks, fournisseurs, entrepôts et logistique.", icon: <Database size={24} /> },
    { name: "HR & People", desc: "Paie, congés, recrutement et gestion des talents.", icon: <Users size={24} /> },
    { name: "CRM", desc: "Gestion de la relation client, pipeline de ventes et support.", icon: <Briefcase size={24} /> },
    { name: "Projects & Tasks", desc: "Gestion de projets, kanban, sprints et suivi du temps.", icon: <LayoutList size={24} /> }
  ];

  return (
    <div className="public-page-wrapper">
      <PublicHeader />
      <main className="resource-page-main">
        <section className="resource-hero">
          <div className="resource-hero-bg"></div>
          <motion.div className="resource-hero-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="resource-hero-badge">APPLICATIONS MÉTIER</span>
            <h1>L'Écosystème des Modules</h1>
            <p>Une suite complète d'applications parfaitement intégrées, partageant la même base de données et la même couche d'intelligence artificielle.</p>
          </motion.div>
        </section>

        <section className="resource-grid-section">
          <div className="resource-grid">
            {modulesList.map((mod, i) => (
              <motion.div key={i} className="resource-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * i }}>
                <div className="resource-card-icon">{mod.icon}</div>
                <h3>{mod.name}</h3>
                <p>{mod.desc}</p>
                <div className="resource-card-link">
                  Découvrir le module <ArrowRight size={16} />
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
