/**
 * ALLIANCE OS — INTELLIGENCE
 * Transverse AI layer for analysis, warnings, and suggestions.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import './OsComponents.css';

export const AllianceIntelligence: React.FC = () => {
  return (
    <section className="os-section">
      <h3 className="os-section-title">
        <Sparkles size={14} /> Alliance Intelligence
      </h3>
      
      <div className="os-ai-grid">
        {/* Analyse */}
        <motion.div className="os-ai-card os-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="os-ai-header type-analysis">
            <TrendingUp size={14} /> Analyse
          </div>
          <p>Les inscriptions ont augmenté de 14 % cette semaine par rapport à la même période l'an dernier.</p>
          <button className="os-ai-btn">Voir l'analyse &rarr;</button>
        </motion.div>

        {/* Attention */}
        <motion.div className="os-ai-card os-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="os-ai-header type-warning">
            <AlertTriangle size={14} /> Attention
          </div>
          <p>3 références de stock (Fournitures) atteindront probablement leur seuil critique d'ici vendredi.</p>
          <button className="os-ai-btn">Gérer les stocks &rarr;</button>
        </motion.div>

        {/* Suggestion */}
        <motion.div className="os-ai-card os-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="os-ai-header type-suggestion">
            <Lightbulb size={14} /> Suggestion
          </div>
          <p>Vous pourriez automatiser la relance des 12 factures impayées depuis plus de 30 jours.</p>
          <button className="os-ai-btn">Configurer l'automatisation &rarr;</button>
        </motion.div>
      </div>
    </section>
  );
};
