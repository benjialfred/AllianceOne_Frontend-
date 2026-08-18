/**
 * ALLIANCE OS — WELCOME HEADER
 * Extremely calm, contextual entry point.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { usePlatformStore } from '../../../core/stores/platformStore';
import './OsComponents.css';

export const WelcomeHeader: React.FC = () => {
  const currentOrg = usePlatformStore((s) => s.currentOrganization);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 18 ? 'Bonjour' : 'Bonsoir';
  };

  return (
    <motion.header 
      className="os-welcome-header"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="os-welcome-content">
        <h1>{getGreeting()}, <span>Benjamin</span>. Votre environnement Alliance One est prêt.</h1>
        <p className="os-welcome-context">
          {currentOrg?.name || 'Collège & Lycée Bilingue Émergence'} · Année académique 2026–2027
        </p>
      </div>

      <div className="os-system-status">
        <div className="os-status-dot pulse"></div>
        <span>SYSTEM OPERATIONAL</span>
      </div>
    </motion.header>
  );
};
