import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Landmark, 
  Package, 
  FolderKanban, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  Users, 
  Building2,
  Sparkles
} from 'lucide-react';

interface ShowcaseTab {
  id: string;
  name: string;
  badge: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  accentColor: string;
  summaryTitle: string;
  summaryDesc: string;
  metrics: { label: string; value: string; trend?: string }[];
  streamItems: { title: string; subtitle: string; time: string; status: string }[];
}

const SHOWCASE_TABS: ShowcaseTab[] = [
  {
    id: 'finance',
    name: 'Finances & Caisses',
    badge: 'Trésorerie Active',
    icon: Landmark,
    accentColor: '#10b981',
    summaryTitle: 'Contrôle absolu sur chaque flux financier',
    summaryDesc: 'Suivi des encaissements en temps réel, facturation automatisée, gestion multi-caisses et bilans analytiques sans jamais perdre une seule écriture.',
    metrics: [
      { label: 'Flux Mensuel Encaissé', value: '18 450 000 FCFA', trend: '+14.2%' },
      { label: 'Rapprochement Automatique', value: '99.8%', trend: 'Immédiat' },
      { label: 'Échéances en Attente', value: '12 Factures', trend: 'Sécurisé' }
    ],
    streamItems: [
      { title: 'Encaissement Scolarité T1', subtitle: 'Reçu N° AO-2026-089 — Reçu Mobile Money', time: 'Il y a 3 min', status: 'Validé' },
      { title: 'Clôture de Caisse Principale', subtitle: 'Audité & certifié sans écart de solde', time: 'Il y a 24 min', status: 'Conforme' },
      { title: 'Émission Facture Entreprise', subtitle: 'Client B2B — Partenaire Émergence', time: 'Il y a 1h', status: 'Envoyée' }
    ]
  },
  {
    id: 'education',
    name: 'Éducation Pro',
    badge: 'Gestion Scolaire',
    icon: GraduationCap,
    accentColor: '#6366f1',
    summaryTitle: 'Du premier contact au bulletin officiel',
    summaryDesc: 'Gestion complète du cycle académique : inscriptions sécurisées, suivi des absences, notes certifiées et génération automatique des bulletins scolaires.',
    metrics: [
      { label: 'Effectif Actif Total', value: '1 280 Élèves', trend: '100% à jour' },
      { label: 'Bulletins Générés', value: '38 Classes', trend: 'En 1 clic' },
      { label: 'Taux d’Assiduité Mensuel', value: '96.4%', trend: '+3.1%' }
    ],
    streamItems: [
      { title: 'Génération Bulletins Trimestre 2', subtitle: 'Classe Terminale S — Moyenne calculée', time: 'Il y a 12 min', status: 'Terminé' },
      { title: 'Nouvelle Inscription Enregistrée', subtitle: 'Filière Scientifique — Dossier complet', time: 'Il y a 45 min', status: 'Archivé' },
      { title: 'Notification Parents Diffusée', subtitle: 'Rappel réunion conseil de classe', time: 'Il y a 2h', status: 'Délivré' }
    ]
  },
  {
    id: 'inventory',
    name: 'Stocks & Logistique',
    badge: 'Traçabilité WMS',
    icon: Package,
    accentColor: '#38bdf8',
    summaryTitle: 'Visibilité intégrale sur vos entrepôts et magasins',
    summaryDesc: 'Valorisation rigoureuse en PMP, gestion multi-dépôts, alertes de rupture prédictives et traçabilité inviolable des entrées et sorties.',
    metrics: [
      { label: 'Articles Sous Gestion', value: '4 850 Réf.', trend: 'Multi-dépôts' },
      { label: 'Valeur Stock en Temps Réel', value: '42 100 000 FCFA', trend: 'PMP Certifié' },
      { label: 'Taux de Disponibilité', value: '99.1%', trend: 'Optimal' }
    ],
    streamItems: [
      { title: 'Réception Fournisseur Validée', subtitle: 'Bon d’Entrée BE-2026-14 — Dépôt Principal', time: 'Il y a 8 min', status: 'Conforme' },
      { title: 'Alerte Seuil de Réapprovisionnement', subtitle: 'Papier A4 & Consommables — Commande suggérée', time: 'Il y a 30 min', status: 'Traité' },
      { title: 'Transfert Inter-Dépôts', subtitle: 'Dépôt A vers Dépôt B — 150 unités', time: 'Il y a 3h', status: 'Réceptionné' }
    ]
  },
  {
    id: 'projects',
    name: 'Projets & Équipes',
    badge: 'Pilotage & Jalons',
    icon: FolderKanban,
    accentColor: '#a855f7',
    summaryTitle: 'Alignement stratégique et vélocité collective',
    summaryDesc: 'Planification par jalons, attribution claire des responsabilités, suivi de rentabilité et collaboration sans friction entre tous vos départements.',
    metrics: [
      { label: 'Jalons Atteints ce Mois', value: '28 / 30', trend: '93.3% succès' },
      { label: 'Temps Moyen de Résolution', value: '4.2 Heures', trend: '-28% délai' },
      { label: 'Équipes Synchronisées', value: '14 Départements', trend: 'Zéro silo' }
    ],
    streamItems: [
      { title: 'Lancement Phase Déploiement', subtitle: 'Jalon Stratégique Trimestre 3 — Prêt pour lancement', time: 'Il y a 15 min', status: 'En cours' },
      { title: 'Revue de Clôture Validée', subtitle: 'Rapport d’impact organisationnel approuvé', time: 'Il y a 1h', status: 'Signé' },
      { title: 'Attribution Tâches Prioritaires', subtitle: 'Distribution équilibrée de la charge d’équipe', time: 'Il y a 4h', status: 'Actif' }
    ]
  }
];

export const InteractiveShowcase: React.FC<{ onExploreClick: () => void }> = ({ onExploreClick }) => {
  const [activeTabId, setActiveTabId] = useState('finance');
  const currentTab = SHOWCASE_TABS.find(t => t.id === activeTabId) || SHOWCASE_TABS[0];

  return (
    <div className="interactive-showcase-wrapper">
      {/* Top Selector Navigation */}
      <div className="showcase-nav-bar">
        {SHOWCASE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              className={`showcase-nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <div 
                className="showcase-nav-icon"
                style={{ 
                  color: isActive ? tab.accentColor : 'inherit',
                  background: isActive ? `${tab.accentColor}18` : 'transparent'
                }}
              >
                <Icon size={16} />
              </div>
              <div className="showcase-nav-labels">
                <span className="tab-name">{tab.name}</span>
                <span className="tab-badge">{tab.badge}</span>
              </div>
              {isActive && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="showcase-tab-active-indicator"
                  style={{ backgroundColor: tab.accentColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Showcase Stage Display */}
      <div className="showcase-stage-window">
        <div className="showcase-window-header">
          <div className="window-dots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
          <div className="window-center-title">
            <span>Alliance One Suite · {currentTab.name}</span>
          </div>
          <div className="window-live-badge">
            <span className="live-pulse" style={{ backgroundColor: currentTab.accentColor }} />
            <span>En direct</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab.id}
            className="showcase-window-body"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header Description */}
            <div className="showcase-content-header">
              <div>
                <h3 className="showcase-title">{currentTab.summaryTitle}</h3>
                <p className="showcase-desc">{currentTab.summaryDesc}</p>
              </div>
              <button 
                className="showcase-action-btn"
                onClick={onExploreClick}
                style={{ borderColor: `${currentTab.accentColor}40`, color: '#fff' }}
              >
                <span>Accéder à l'espace</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            {/* Live Metrics Row */}
            <div className="showcase-metrics-grid">
              {currentTab.metrics.map((metric, i) => (
                <div key={i} className="showcase-metric-card">
                  <span className="metric-label">{metric.label}</span>
                  <div className="metric-value-row">
                    <span className="metric-value">{metric.value}</span>
                    {metric.trend && (
                      <span className="metric-trend" style={{ color: currentTab.accentColor }}>
                        {metric.trend}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Realtime Stream Items */}
            <div className="showcase-stream-card">
              <div className="stream-header">
                <div className="stream-title-group">
                  <Clock size={14} className="stream-icon" />
                  <span>Journal des opérations récentes en temps réel</span>
                </div>
                <span className="stream-status-pill">100% Synchronisé</span>
              </div>

              <div className="stream-list">
                {currentTab.streamItems.map((item, idx) => (
                  <div key={idx} className="stream-row">
                    <div className="stream-indicator">
                      <CheckCircle2 size={15} style={{ color: currentTab.accentColor }} />
                    </div>
                    <div className="stream-info">
                      <strong className="stream-item-title">{item.title}</strong>
                      <span className="stream-item-sub">{item.subtitle}</span>
                    </div>
                    <div className="stream-meta">
                      <span className="stream-time">{item.time}</span>
                      <span className="stream-tag" style={{ color: currentTab.accentColor, borderColor: `${currentTab.accentColor}33` }}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
