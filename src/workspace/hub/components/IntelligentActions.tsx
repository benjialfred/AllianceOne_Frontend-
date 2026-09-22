import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Box } from 'lucide-react';

export const IntelligentActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section>
      <div className="ao-section-title">
        <div style={{ width: 4, height: 4, background: 'var(--ao-color-text-tertiary)', borderRadius: '50%' }} />
        Actions Prioritaires
      </div>
      <div className="ao-actions-list">
        
        <div className="ao-action-item" onClick={() => navigate('/app/finance/invoices')}>
          <div className="ao-action-indicator ao-indicator-urgent"></div>
          <div className="ao-action-body">
            <div className="ao-action-title">2 Factures en retard de paiement</div>
            <div className="ao-action-context">Finances & Trésorerie</div>
          </div>
          <ArrowRight size={14} className="ao-color-text-tertiary" />
        </div>

        <div className="ao-action-item" onClick={() => navigate('/app/inventory/products')}>
          <div className="ao-action-indicator ao-indicator-watch"></div>
          <div className="ao-action-body">
            <div className="ao-action-title">3 Articles sous le seuil d'alerte</div>
            <div className="ao-action-context">Stocks & Logistique</div>
          </div>
          <ArrowRight size={14} className="ao-color-text-tertiary" />
        </div>

        <div className="ao-action-item" onClick={() => navigate('/app/education/presences')}>
          <div className="ao-action-indicator ao-indicator-today"></div>
          <div className="ao-action-body">
            <div className="ao-action-title">Saisir les présences du jour</div>
            <div className="ao-action-context">Éducation Pro</div>
          </div>
          <ArrowRight size={14} className="ao-color-text-tertiary" />
        </div>

      </div>
    </section>
  );
};
