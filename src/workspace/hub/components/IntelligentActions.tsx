/**
 * ALLIANCE OS — INTELLIGENT ACTIONS
 * Prioritized "À faire maintenant" list.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, FileText, UserPlus, Box } from 'lucide-react';
import './OsComponents.css';

export const IntelligentActions: React.FC = () => {
  const actions = [
    { id: 1, text: '12 dossiers nécessitent votre validation', icon: UserPlus, type: 'urgent', module: 'Éducation' },
    { id: 2, text: '3 factures arrivent à échéance', icon: FileText, type: 'today', module: 'Finance' },
    { id: 3, text: '2 produits sont sous le seuil minimal', icon: Box, type: 'watch', module: 'Stocks' }
  ];

  return (
    <section className="os-section">
      <h3 className="os-section-title">
        <AlertCircle size={14} /> À faire maintenant
      </h3>
      <div className="os-actions-list">
        {actions.map((act, i) => (
          <motion.button 
            key={act.id}
            className="os-action-item os-panel"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <div className={`os-act-indicator type-${act.type}`} />
            <div className="os-act-content">
              <span className="os-act-text">{act.text}</span>
              <span className="os-act-module">{act.module}</span>
            </div>
            <act.icon size={16} className="os-act-icon" />
          </motion.button>
        ))}
      </div>
    </section>
  );
};
