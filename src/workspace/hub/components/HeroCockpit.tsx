/**
 * ALLIANCE ONE — HERO & INTELLIGENT DECISION CENTER (V2)
 * Contexte opérationnel, état de santé réel et commandes prioritaires "À traiter maintenant".
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  GraduationCap, 
  Landmark, 
  Package, 
  FolderKanban, 
  Clock,
  Shield,
  Wifi,
  ChevronRight
} from 'lucide-react';
import { usePlatformStore } from '../../../core/stores/platformStore';

interface ActionItem {
  id: string;
  count: string;
  category: string;
  actionText: string;
  module: string;
  color: string;
  routePath: string;
  urgency: 'high' | 'medium' | 'low';
}

export const HeroCockpit: React.FC = () => {
  const navigate = useNavigate();
  const currentOrg = usePlatformStore((s) => s.currentOrganization);
  const [selectedRole, setSelectedRole] = useState<'director' | 'pedagogy' | 'stock' | 'developer'>('director');

  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  // Role-adaptive actionable commands
  const actionsByRole: Record<string, ActionItem[]> = {
    director: [
      { id: 'act-1', count: '02', category: 'Inscriptions', actionText: 'À valider', module: 'Éducation', color: '#4f46e5', routePath: '/education/students', urgency: 'high' },
      { id: 'act-2', count: '01', category: 'Facture / Paiement', actionText: 'En attente', module: 'Finance', color: '#059669', routePath: '/finance/transactions', urgency: 'medium' },
      { id: 'act-3', count: '03', category: 'Articles de Stock', actionText: 'Seuil critique', module: 'Stock', color: '#0ea5e9', routePath: '/inventory/products', urgency: 'high' },
      { id: 'act-4', count: '04', category: 'Jalons de Projet', actionText: 'À approuver', module: 'Tâches', color: '#8b5cf6', routePath: '/tasks/board', urgency: 'low' },
    ],
    pedagogy: [
      { id: 'act-p1', count: '02', category: 'Dossiers Inscription', actionText: 'À valider', module: 'Éducation', color: '#4f46e5', routePath: '/education/students', urgency: 'high' },
      { id: 'act-p2', count: '06', category: 'Notes non saisies', actionText: 'Relancer profs', module: 'Éducation', color: '#d97706', routePath: '/education/grades', urgency: 'high' },
      { id: 'act-p3', count: '03', category: 'Bulletins T1', actionText: 'Prêts à l’impression', module: 'Éducation', color: '#059669', routePath: '/education/reports', urgency: 'medium' },
    ],
    stock: [
      { id: 'act-s1', count: '03', category: 'Articles de Stock', actionText: 'Seuil critique', module: 'Stock', color: '#0ea5e9', routePath: '/inventory/products', urgency: 'high' },
      { id: 'act-s2', count: '01', category: 'Bon de Commande', actionText: 'En attente réception', module: 'Stock', color: '#d97706', routePath: '/inventory/purchase-orders', urgency: 'medium' },
      { id: 'act-s3', count: '02', category: 'Inventaires annuels', actionText: 'À planifier', module: 'Stock', color: '#8b5cf6', routePath: '/inventory/audits', urgency: 'low' },
    ],
    developer: [
      { id: 'act-d1', count: '02', category: 'Clés d’API Actives', actionText: 'Vérifier quotas', module: 'Devs', color: '#4f46e5', routePath: '/developers', urgency: 'medium' },
      { id: 'act-d2', count: '01', category: 'Webhook Event', actionText: 'Endpoint opérationnel', module: 'Devs', color: '#059669', routePath: '/developers', urgency: 'low' },
    ]
  };

  const currentActions = actionsByRole[selectedRole] || actionsByRole.director;

  return (
    <section className="hub-spatial-hero">
      <div className="hub-hero-inner">
        {/* Top Context & Status Row */}
        <div className="hub-context-header">
          <div className="hub-greeting-group">
            <h1 className="hub-spatial-title">
              {greetingTime()}, <span className="hub-name-accent">Benjamin</span>.
            </h1>
            <p className="hub-spatial-desc">
              Votre établissement <strong style={{ color: 'var(--color-text-primary)' }}>{currentOrg?.name || 'Collège & Lycée Bilingue Émergence'}</strong> fonctionne normalement.
            </p>
          </div>

          {/* Real-time System Status Pill */}
          <div className="hub-system-status-badge">
            <div className="status-ping-dot"></div>
            <div className="status-meta">
              <span className="status-headline">5 Modules Opérationnels</span>
              <span className="status-subline">
                <Wifi size={10} color="#10b981" /> Synchro il y a 14s · 14ms Cloud Live
              </span>
            </div>
          </div>
        </div>

        {/* Role Adaptive Switcher (Cockpit Perspectif) */}
        <div className="hub-role-selector-row">
          <span className="role-selector-label">Perspective :</span>
          <div className="role-pills-list">
            {[
              { id: 'director', label: 'Direction Générale' },
              { id: 'pedagogy', label: 'Responsable Pédagogique' },
              { id: 'stock', label: 'Gestionnaire Stocks' },
              { id: 'developer', label: 'Console Développeur' }
            ].map((r) => (
              <button
                key={r.id}
                className={`role-pill-btn ${selectedRole === r.id ? 'active' : ''}`}
                onClick={() => setSelectedRole(r.id as any)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* "À TRAITER MAINTENANT" — Action Command Center */}
        <div className="hub-actionable-center">
          <div className="actionable-header">
            <div className="actionable-title-row">
              <AlertCircle size={15} color="#d97706" />
              <span className="actionable-title">
                {currentActions.length} choses nécessitent votre attention aujourd'hui
              </span>
            </div>
            <span className="actionable-status-tag">Actions Prioritaires</span>
          </div>

          <div className="actionable-grid">
            {currentActions.map((action) => (
              <div
                key={action.id}
                className="actionable-card"
                onClick={() => navigate(action.routePath)}
              >
                <div className="actionable-count-box" style={{ color: action.color, backgroundColor: `${action.color}15` }}>
                  {action.count}
                </div>

                <div className="actionable-text-group">
                  <span className="actionable-category">{action.category}</span>
                  <strong className="actionable-action">{action.actionText}</strong>
                </div>

                <ChevronRight size={15} className="actionable-arrow" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
