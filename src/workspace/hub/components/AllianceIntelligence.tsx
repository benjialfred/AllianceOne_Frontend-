import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { usePlatformStore } from '../../../core/stores/platformStore';

export const AllianceIntelligence: React.FC = () => {
  const currentOrg = usePlatformStore(s => s.currentOrganization);
  const activeModuleIds = currentOrg?.active_modules || [];

  return (
    <section>
      <div className="ao-section-title">
        <Sparkles size={14} color="var(--ao-color-alliance-blue)" />
        Alliance Intelligence
      </div>
      
      {activeModuleIds.length === 0 ? (
        <div className="ao-glass-panel" style={{ padding: 'var(--ao-space-6)', textAlign: 'center' }}>
          <Activity size={24} color="var(--ao-color-text-tertiary)" style={{ margin: '0 auto var(--ao-space-3)' }} />
          <div style={{ fontSize: 13, color: 'var(--ao-color-text-secondary)' }}>
            En attente de flux de données...<br/>
            L'intelligence artificielle s'activera automatiquement.
          </div>
        </div>
      ) : (
        <div className="ao-ai-zone">
          {activeModuleIds.includes('education') ? (
            <div className="ao-glass-panel ao-ai-card">
              <div className="ao-ai-header insight">
                <TrendingUp size={12} /> Insight Opérationnel
              </div>
              <div className="ao-ai-text">
                La fréquentation de la bibliothèque a augmenté de 14% ce mois-ci, principalement tirée par les élèves de 3ème.
              </div>
            </div>
          ) : activeModuleIds.includes('tasks') ? (
            <div className="ao-glass-panel ao-ai-card">
              <div className="ao-ai-header insight">
                <TrendingUp size={12} /> Insight Opérationnel
              </div>
              <div className="ao-ai-text">
                La vélocité de l'équipe sur les projets a augmenté de 14% ce mois-ci. Continuez sur cette lancée.
              </div>
            </div>
          ) : null}

          {(activeModuleIds.includes('finance') || activeModuleIds.includes('inventory')) && (
            <div className="ao-glass-panel ao-ai-card">
              <div className="ao-ai-header warning">
                <AlertTriangle size={12} /> Anomalie Détectée
              </div>
              <div className="ao-ai-text">
                Un pic de décaissements inhabituels (12) a été détecté hier sur le compte principal. Une revue est conseillée.
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
