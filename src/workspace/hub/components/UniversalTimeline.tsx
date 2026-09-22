import React from 'react';

export const UniversalTimeline: React.FC = () => {
  return (
    <section>
      <div className="ao-section-title">
        <div style={{ width: 4, height: 4, background: 'var(--ao-color-text-tertiary)', borderRadius: '50%' }} />
        Flux d'Activité
      </div>
      <div className="ao-glass-panel ao-timeline-panel">
        <div className="ao-timeline">
          
          <div className="ao-timeline-item">
            <div className="ao-tl-time">10:42</div>
            <div className="ao-tl-track">
              <div className="ao-tl-dot"></div>
              <div className="ao-tl-line"></div>
            </div>
            <div className="ao-tl-content">
              <div className="ao-tl-title">Nouveau paiement reçu</div>
              <div className="ao-tl-desc">Reçu n° 1024 généré pour M. Dupont (Finances)</div>
            </div>
          </div>

          <div className="ao-timeline-item">
            <div className="ao-tl-time">09:15</div>
            <div className="ao-tl-track">
              <div className="ao-tl-dot"></div>
              <div className="ao-tl-line"></div>
            </div>
            <div className="ao-tl-content">
              <div className="ao-tl-title">Inventaire validé</div>
              <div className="ao-tl-desc">Magasin Principal A (Stocks)</div>
            </div>
          </div>

          <div className="ao-timeline-item">
            <div className="ao-tl-time">Hier</div>
            <div className="ao-tl-track">
              <div className="ao-tl-dot"></div>
            </div>
            <div className="ao-tl-content">
              <div className="ao-tl-title">Connexion HyperAdmin</div>
              <div className="ao-tl-desc">Mise à jour des règles de sécurité (Système)</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
