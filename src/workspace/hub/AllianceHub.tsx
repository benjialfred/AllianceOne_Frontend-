import React from 'react';
import { motion } from 'framer-motion';
import { usePlatformStore } from '../../../core/stores/platformStore';
import { useAuthStore } from '../../../core/stores/authStore';
import { Users, CreditCard, LayoutDashboard, TrendingUp, Activity, Bell, FileText, CheckCircle } from 'lucide-react';
import './AllianceHub.css';

export const AllianceHub: React.FC = () => {
  const currentOrg = usePlatformStore((s) => s.currentOrganization);
  const user = useAuthStore((s) => s.user);

  return (
    <div className="ao-dashboard-root">
      <div className="ao-dashboard-header">
        <div>
          <h1 className="ao-dashboard-title">Tableau de Bord Général</h1>
          <p className="ao-dashboard-subtitle">
            {currentOrg?.name || 'Organisation Non Définie'} · Synthèse en temps réel
          </p>
        </div>
        <div className="ao-dashboard-actions">
          <button className="ao-btn-primary">Générer un rapport</button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="ao-kpi-grid">
        <div className="ao-kpi-card">
          <div className="ao-kpi-header">
            <span className="ao-kpi-label">Utilisateurs Actifs</span>
            <Users size={16} className="ao-kpi-icon" />
          </div>
          <div className="ao-kpi-value">1,248</div>
          <div className="ao-kpi-trend positive"><TrendingUp size={12} /> +12% ce mois</div>
        </div>
        
        <div className="ao-kpi-card">
          <div className="ao-kpi-header">
            <span className="ao-kpi-label">Revenus (Mensuel)</span>
            <CreditCard size={16} className="ao-kpi-icon" />
          </div>
          <div className="ao-kpi-value">45,200 €</div>
          <div className="ao-kpi-trend positive"><TrendingUp size={12} /> +5.4% ce mois</div>
        </div>

        <div className="ao-kpi-card">
          <div className="ao-kpi-header">
            <span className="ao-kpi-label">Tâches Ouvertes</span>
            <CheckCircle size={16} className="ao-kpi-icon" />
          </div>
          <div className="ao-kpi-value">34</div>
          <div className="ao-kpi-trend neutral"><Activity size={12} /> Stable</div>
        </div>

        <div className="ao-kpi-card">
          <div className="ao-kpi-header">
            <span className="ao-kpi-label">Alertes Système</span>
            <Bell size={16} className="ao-kpi-icon" />
          </div>
          <div className="ao-kpi-value" style={{ color: 'var(--ao-color-danger-text)' }}>2</div>
          <div className="ao-kpi-trend negative">Action requise</div>
        </div>
      </div>

      {/* MAIN DASHBOARD CONTENT */}
      <div className="ao-dashboard-layout">
        {/* Main Chart / Activity Area */}
        <div className="ao-dashboard-main">
          <div className="ao-panel">
            <div className="ao-panel-header">
              <h2 className="ao-panel-title">Activité Récente</h2>
            </div>
            <div className="ao-panel-body">
              <div className="ao-activity-list">
                {[
                  { title: 'Facture #INV-2024-001 payée', time: 'Il y a 10 min', icon: CreditCard },
                  { title: 'Nouveau collaborateur ajouté (Sarah Connor)', time: 'Il y a 1 heure', icon: Users },
                  { title: 'Rapport mensuel généré', time: 'Hier', icon: FileText },
                  { title: 'Mise à jour système terminée', time: 'Hier', icon: Activity },
                ].map((item, idx) => (
                  <div key={idx} className="ao-activity-item">
                    <div className="ao-activity-icon"><item.icon size={14} /></div>
                    <div className="ao-activity-content">
                      <span className="ao-activity-text">{item.title}</span>
                      <span className="ao-activity-time">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Quick Actions within Dashboard */}
        <div className="ao-dashboard-sidebar">
          <div className="ao-panel">
            <div className="ao-panel-header">
              <h2 className="ao-panel-title">Accès Rapides</h2>
            </div>
            <div className="ao-panel-body">
              <div className="ao-quick-actions">
                <button className="ao-quick-action-btn">Créer une facture</button>
                <button className="ao-quick-action-btn">Ajouter un utilisateur</button>
                <button className="ao-quick-action-btn">Nouvelle Tâche</button>
              </div>
            </div>
          </div>

          <div className="ao-panel" style={{ background: 'var(--ao-color-alliance-blue)', color: 'white', border: 'none' }}>
            <div className="ao-panel-body" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Alliance AI</h2>
              <p style={{ fontSize: '12px', opacity: 0.9, lineHeight: 1.5, marginBottom: '16px' }}>
                L'intelligence artificielle a détecté 2 optimisations financières possibles ce mois-ci.
              </p>
              <button style={{ 
                background: 'white', color: 'var(--ao-color-alliance-blue)', 
                border: 'none', padding: '8px 16px', borderRadius: '4px', 
                fontSize: '12px', fontWeight: 600, cursor: 'pointer', width: '100%' 
              }}>
                Voir les recommandations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
