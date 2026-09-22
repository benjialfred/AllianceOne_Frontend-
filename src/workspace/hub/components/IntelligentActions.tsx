import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Inbox } from 'lucide-react';
import { usePlatformStore } from '../../../core/stores/platformStore';

export const IntelligentActions: React.FC = () => {
  const navigate = useNavigate();
  const currentOrg = usePlatformStore(s => s.currentOrganization);
  const activeModuleIds = currentOrg?.active_modules || [];

  return (
    <section>
      <div className="ao-section-title">
        <div style={{ width: 4, height: 4, background: 'var(--ao-color-text-tertiary)', borderRadius: '50%' }} />
        Actions Prioritaires
      </div>
      
      {activeModuleIds.length === 0 ? (
        <div className="ao-glass-panel" style={{ padding: 'var(--ao-space-6)', display: 'flex', alignItems: 'center', gap: 'var(--ao-space-4)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ao-color-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Inbox size={16} color="var(--ao-color-text-tertiary)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Aucune action requise</div>
            <div style={{ fontSize: 12, color: 'var(--ao-color-text-secondary)' }}>Installez des modules pour générer des alertes.</div>
          </div>
        </div>
      ) : (
        <div className="ao-actions-list">
          {activeModuleIds.includes('finance') && (
            <div className="ao-action-item" onClick={() => navigate('/app/finance/invoices')}>
              <div className="ao-action-indicator ao-indicator-urgent"></div>
              <div className="ao-action-body">
                <div className="ao-action-title">2 Factures en retard de paiement</div>
                <div className="ao-action-context">Finances & Trésorerie</div>
              </div>
              <ArrowRight size={14} className="ao-color-text-tertiary" />
            </div>
          )}

          {activeModuleIds.includes('inventory') && (
            <div className="ao-action-item" onClick={() => navigate('/app/inventory/products')}>
              <div className="ao-action-indicator ao-indicator-watch"></div>
              <div className="ao-action-body">
                <div className="ao-action-title">3 Articles sous le seuil d'alerte</div>
                <div className="ao-action-context">Stocks & Logistique</div>
              </div>
              <ArrowRight size={14} className="ao-color-text-tertiary" />
            </div>
          )}

          {activeModuleIds.includes('education') && (
            <div className="ao-action-item" onClick={() => navigate('/app/education/presences')}>
              <div className="ao-action-indicator ao-indicator-today"></div>
              <div className="ao-action-body">
                <div className="ao-action-title">Saisir les présences du jour</div>
                <div className="ao-action-context">Éducation Pro</div>
              </div>
              <ArrowRight size={14} className="ao-color-text-tertiary" />
            </div>
          )}

          {activeModuleIds.includes('tasks') && (
            <div className="ao-action-item" onClick={() => navigate('/app/tasks')}>
              <div className="ao-action-indicator ao-indicator-urgent"></div>
              <div className="ao-action-body">
                <div className="ao-action-title">Projet Alpha - Échéance dépassée</div>
                <div className="ao-action-context">Tâches & Projets</div>
              </div>
              <ArrowRight size={14} className="ao-color-text-tertiary" />
            </div>
          )}
        </div>
      )}
    </section>
  );
};
