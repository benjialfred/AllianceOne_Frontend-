/**
 * ALLIANCE ONE — ECOSYSTEM DISCOVERY (SPATIAL FOOTPRINT)
 * 4 piliers de l'écosystème Alliance One (Marketplace, Développeurs, Services Studio, Communauté)
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  Code2, 
  Building2, 
  MessageSquare, 
  ArrowRight, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const EcosystemDiscoverySection: React.FC = () => {
  const navigate = useNavigate();

  const pillars = [
    {
      id: 'marketplace',
      title: 'Marketplace d’Applications',
      desc: 'Découvrez des connecteurs (Orange Money, MTN, WhatsApp) et des modèles de bulletins.',
      icon: Store,
      color: '#d97706',
      path: '/marketplace',
      actionText: 'Explorer le Store'
    },
    {
      id: 'developers',
      title: 'Developer Platform & SDK',
      desc: 'Créez vos propres modules avec le SDK TypeScript, la CLI `agy` et les Webhooks.',
      icon: Code2,
      color: '#4f46e5',
      path: '/developers',
      actionText: 'Console Développeur'
    },
    {
      id: 'services',
      title: 'Alliance Studio & Portfolio',
      desc: 'Développement sur mesure d’applications Web, Mobile, IA et infrastructure Cloud.',
      icon: Building2,
      color: '#059669',
      path: '/services',
      actionText: 'Voir les Réalisations'
    },
    {
      id: 'community',
      title: 'Communauté des Bâtisseurs',
      desc: 'Échangez avec les créateurs, découvrez des études de cas et partagez vos retours.',
      icon: MessageSquare,
      color: '#8b5cf6',
      path: '/community',
      actionText: 'Rejoindre le Fil'
    }
  ];

  return (
    <section className="hub-spatial-section" style={{ marginTop: '0.5rem' }}>
      <div className="hub-section-headline-row">
        <div>
          <span className="hub-section-kicker">ÉCOSYSTÈME & EXTENSIONS</span>
          <h2 className="hub-section-title-spatial">Construire & Étendre Alliance One</h2>
        </div>
      </div>

      <div className="ecosystem-pillars-grid">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className="ecosystem-pillar-card"
              onClick={() => navigate(pillar.path)}
            >
              <div 
                className="pillar-icon-box"
                style={{ backgroundColor: `${pillar.color}15`, color: pillar.color }}
              >
                <Icon size={20} />
              </div>

              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-desc">{pillar.desc}</p>

              <div className="pillar-action-link" style={{ color: pillar.color }}>
                <span>{pillar.actionText}</span>
                <ChevronRight size={13} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
