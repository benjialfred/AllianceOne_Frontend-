import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

export const AllianceIntelligence: React.FC = () => {
  return (
    <section>
      <div className="ao-section-title">
        <Sparkles size={14} color="var(--ao-color-alliance-blue)" />
        Alliance Intelligence
      </div>
      <div className="ao-ai-zone">
        
        <div className="ao-glass-panel ao-ai-card">
          <div className="ao-ai-header insight">
            <TrendingUp size={12} /> Insight Opérationnel
          </div>
          <div className="ao-ai-text">
            La fréquentation de la bibliothèque a augmenté de 14% ce mois-ci, principalement tirée par les élèves de 3ème.
          </div>
        </div>

        <div className="ao-glass-panel ao-ai-card">
          <div className="ao-ai-header warning">
            <AlertTriangle size={12} /> Anomalie Détectée
          </div>
          <div className="ao-ai-text">
            Un pic de décaissements inhabituels (12) a été détecté hier sur la Caisse Principale.
          </div>
        </div>

      </div>
    </section>
  );
};
