/**
 * ALLIANCE ONE — UNIVERSAL ACTIVITY STREAM
 * Flux d'activité unifié temps réel consolidant les événements métier à travers tous les modules.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Landmark, 
  Package, 
  FolderKanban, 
  BookOpen, 
  Clock, 
  ArrowUpRight, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  Receipt,
  UserCheck
} from 'lucide-react';

interface ActivityEvent {
  id: string;
  module: 'Éducation' | 'Finance' | 'Stock' | 'Tâches' | 'Bibliothèque';
  action: string;
  subject: string;
  detail: string;
  timestamp: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  accentColor: string;
  routePath: string;
  badge?: string;
}

export const UniversalActivityStream: React.FC = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const events: ActivityEvent[] = [
    {
      id: 'act-1',
      module: 'Éducation',
      action: 'Nouvelle Inscription',
      subject: 'Ndomo Marc Aurèle',
      detail: 'Dossier validé pour la classe de Première Scientifique (S1). Reçu de préinscription émis.',
      timestamp: 'Il y a 14 min',
      icon: GraduationCap,
      accentColor: '#4f46e5',
      routePath: '/education/students',
      badge: 'Inscrit'
    },
    {
      id: 'act-2',
      module: 'Finance',
      action: 'Paiement Encaissé',
      subject: '120 000 FCFA — Tranche 2',
      detail: 'Règlement de scolarité via Caisse Principale pour l’élève Biya Christian (Terminale D).',
      timestamp: 'Il y a 32 min',
      icon: Receipt,
      accentColor: '#059669',
      routePath: '/finance/transactions',
      badge: 'Validé'
    },
    {
      id: 'act-3',
      module: 'Stock',
      action: 'Mouvement d’Entrée',
      subject: 'Réception Bon #BC-2026-084',
      detail: 'Entrée de 500 exemplaires de Manuels de Mathématiques 3e au Dépôt Central.',
      timestamp: 'Il y a 1h 10m',
      icon: Package,
      accentColor: '#0ea5e9',
      routePath: '/inventory/stock-movements',
      badge: '+500 Unités'
    },
    {
      id: 'act-4',
      module: 'Tâches',
      action: 'Jalon Complété',
      subject: 'Clôture Bulletins Trimestre 1',
      detail: 'Validation des moyennes et signatures par le Directeur des Études.',
      timestamp: 'Il y a 2h 45m',
      icon: FolderKanban,
      accentColor: '#8b5cf6',
      routePath: '/tasks/board',
      badge: 'Terminé'
    },
    {
      id: 'act-5',
      module: 'Bibliothèque',
      action: 'Emprunt Enregistré',
      subject: 'Les Soleils des Indépendances (A. Kourouma)',
      detail: 'Prêté à l’élève Talla Sophie (Classe de 3e A). Retour attendu le 24 Août 2026.',
      timestamp: 'Il y a 4h',
      icon: BookOpen,
      accentColor: '#3b82f6',
      routePath: '/library',
      badge: 'Prêt 7j'
    }
  ];

  const filteredEvents = events.filter((e) => {
    if (selectedModule === 'all') return true;
    return e.module === selectedModule;
  });

  return (
    <section className="hub-section">
      <div className="hub-section-header">
        <div>
          <div className="hub-section-pretitle">FLUX D'OPÉRATIONS EN DIRECT</div>
          <h2 className="hub-section-title">Universal Activity Stream</h2>
        </div>

        {/* Filter Badges */}
        <div className="hub-filter-tabs">
          {['all', 'Éducation', 'Finance', 'Stock', 'Tâches'].map((mod) => (
            <button
              key={mod}
              className={`hub-tab-btn ${selectedModule === mod ? 'active' : ''}`}
              onClick={() => setSelectedModule(mod)}
            >
              {mod === 'all' ? 'Toute l’activité' : mod}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="activity-timeline-card">
        <div className="timeline-items-list">
          {filteredEvents.map((evt) => {
            const Icon = evt.icon;
            return (
              <div 
                key={evt.id} 
                className="timeline-item-row"
                onClick={() => navigate(evt.routePath)}
              >
                {/* Module Icon Bubble */}
                <div 
                  className="timeline-icon-box"
                  style={{ backgroundColor: `${evt.accentColor}15`, color: evt.accentColor }}
                >
                  <Icon size={16} />
                </div>

                {/* Event Content */}
                <div className="timeline-content-box">
                  <div className="timeline-top-meta">
                    <span className="timeline-module-tag" style={{ color: evt.accentColor }}>
                      {evt.module} · {evt.action}
                    </span>
                    <span className="timeline-timestamp">
                      <Clock size={11} /> {evt.timestamp}
                    </span>
                  </div>

                  <div className="timeline-subject">{evt.subject}</div>
                  <div className="timeline-detail">{evt.detail}</div>
                </div>

                {/* Right Badge & Jump Arrow */}
                <div className="timeline-right-actions">
                  {evt.badge && (
                    <span className="timeline-status-badge">{evt.badge}</span>
                  )}
                  <ArrowUpRight size={15} className="timeline-jump-arrow" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
