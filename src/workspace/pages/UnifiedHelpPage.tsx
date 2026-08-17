/**
 * ALLIANCE ONE — UNIFIED HELP CENTER & KNOWLEDGE BASE
 * Documentation interactive, guides par module, diagnostic système et assistance.
 */
import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  BookMarked, 
  LifeBuoy, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  GraduationCap,
  Package,
  Landmark,
  FolderKanban,
  BookOpen
} from 'lucide-react';
import './EcosystemPages.css';

export const UnifiedHelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGuide, setActiveGuide] = useState<string>('edu');

  const moduleGuides = [
    {
      id: 'edu',
      name: 'Éducation Pro',
      icon: GraduationCap,
      color: '#4f46e5',
      title: 'Première fois dans Éducation ? Voici les 4 étapes :',
      steps: [
        'Créer vos classes académiques (ex: 6e A, 1ère S1, Terminale D)',
        'Inscrire les élèves ou importer votre liste par fichier Excel',
        'Saisir les coefficients et les matières par niveau d’enseignement',
        'Générer vos premiers relevés et cartes scolaires officielles avec photo'
      ]
    },
    {
      id: 'inv',
      name: 'Stocks & Logistique',
      icon: Package,
      color: '#0ea5e9',
      title: 'Démarrer avec la gestion de stocks WMS :',
      steps: [
        'Définir vos entrepôts et zones de stockage physique',
        'Créer votre catalogue d’articles avec prix d’achat initial et seuil d’alerte',
        'Enregistrer vos réceptions de marchandises via les Bons d’Entrée',
        'Suivre la valorisation PMP calculée automatiquement en temps réel'
      ]
    },
    {
      id: 'fin',
      name: 'Finances & Trésorerie',
      icon: Landmark,
      color: '#059669',
      title: 'Maîtriser vos flux de trésorerie :',
      steps: [
        'Configurer vos caisses physiques et comptes bancaires',
        'Associer les paiements de scolarités aux comptes de recettes',
        'Émettre des factures certifiées et suivre les échéances de paiement',
        'Analyser le compte d’exploitation mensuel et le taux de recouvrement'
      ]
    }
  ];

  const currentGuide = moduleGuides.find((g) => g.id === activeGuide) || moduleGuides[0];

  return (
    <div className="ecosystem-page-root">
      {/* Header Banner */}
      <div className="ecosystem-header-banner">
        <div className="ecosystem-badge">
          <HelpCircle size={14} />
          <span>CENTRE DE CONNAISSANCE</span>
        </div>
        <h1 className="ecosystem-title">Centre d'Aide & Documentation</h1>
        <p className="ecosystem-subtitle">
          Trouvez des guides pas à pas, des réponses à vos questions et vérifiez l'état opérationnel de vos services.
        </p>

        {/* Search Input */}
        <div className="marketplace-search-box" style={{ maxWidth: '560px', margin: '1.25rem auto 0' }}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Comment inscrire un élève, émettre une facture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="help-body-container">
        {/* Module Interactive Guide Tabs */}
        <section className="services-section">
          <div className="section-title-row">
            <h2 className="section-title">Guides Contextuels de Démarrage</h2>
          </div>

          <div className="help-guide-card">
            {/* Guide Tabs */}
            <div className="help-guide-tabs">
              {moduleGuides.map((g) => {
                const Icon = g.icon;
                return (
                  <button
                    key={g.id}
                    className={`guide-tab-btn ${activeGuide === g.id ? 'active' : ''}`}
                    onClick={() => setActiveGuide(g.id)}
                  >
                    <Icon size={16} color={g.color} />
                    <span>{g.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Guide Content */}
            <div className="guide-content-panel">
              <h3 className="guide-panel-title">{currentGuide.title}</h3>
              <div className="guide-steps-list">
                {currentGuide.steps.map((step, idx) => (
                  <div key={idx} className="guide-step-item">
                    <span className="guide-step-number">{idx + 1}</span>
                    <span className="guide-step-text">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* System Health Status */}
        <section className="services-section" style={{ marginTop: '2rem' }}>
          <div className="help-status-card">
            <div className="status-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="#10b981" />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Statut des Services Alliance One</h3>
              </div>
              <span className="telemetry-ping">Tous les systèmes opérationnels</span>
            </div>

            <div className="status-services-list">
              {[
                { name: 'API REST Core & Identity', status: 'Opérationnel', uptime: '99.98%' },
                { name: 'Base de Données PostgreSQL', status: 'Opérationnel', uptime: '100%' },
                { name: 'Générateur de Documents PDF', status: 'Opérationnel', uptime: '99.95%' },
                { name: 'Passerelles de Paiement', status: 'Opérationnel', uptime: '99.90%' }
              ].map((srv, i) => (
                <div key={i} className="status-service-row">
                  <span className="service-name">{srv.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="service-uptime">{srv.uptime}</span>
                    <span className="service-status-pill">
                      <span className="hub-status-dot"></span>
                      <span>{srv.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
