/**
 * ALLIANCE HUB — HERO COCKPIT
 * Clean, enterprise greeting and top-level metrics.
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Receipt, AlertTriangle, TrendingUp } from 'lucide-react';
import { usePlatformStore } from '../../../core/stores/platformStore';
import { useHubStore } from '../../../core/stores/hubStore';
import './HubComponents.css';

interface HeroCockpitProps {
  onOpenCreate: () => void;
}

export const HeroCockpit: React.FC<HeroCockpitProps> = ({ onOpenCreate }) => {
  const currentOrg = usePlatformStore((s) => s.currentOrganization);
  const { metrics, fetchMetrics } = useHubStore();

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const currentDate = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <section className="ent-hero-cockpit">
      <div className="ent-hero-header">
        <div className="ent-hero-titles">
          <h1 className="ent-greeting">
            {greetingTime()}, <span>Benjamin</span>
          </h1>
          <p className="ent-date">{currentDate.charAt(0).toUpperCase() + currentDate.slice(1)}</p>
        </div>
        
        <div className="ent-hero-actions">
          <button className="ent-btn-primary" onClick={onOpenCreate}>
            <Plus size={16} />
            <span>Nouvelle action</span>
          </button>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="ent-metrics-grid">
        <div className="ent-metric-card">
          <div className="metric-icon blue"><Users size={20} /></div>
          <div className="metric-content">
            <span className="metric-label">Inscriptions en attente</span>
            <div className="metric-value-row">
              <span className="metric-value">{metrics?.education.pendingEnrollments || 0}</span>
              <span className="metric-trend positive"><TrendingUp size={12} /> +12%</span>
            </div>
          </div>
        </div>

        <div className="ent-metric-card">
          <div className="metric-icon green"><Receipt size={20} /></div>
          <div className="metric-content">
            <span className="metric-label">Factures impayées</span>
            <div className="metric-value-row">
              <span className="metric-value">{metrics?.finance.pendingInvoices || 0}</span>
              <span className="metric-trend positive"><TrendingUp size={12} /> +5%</span>
            </div>
          </div>
        </div>

        <div className="ent-metric-card">
          <div className="metric-icon amber"><AlertTriangle size={20} /></div>
          <div className="metric-content">
            <span className="metric-label">Alertes de stock critiques</span>
            <div className="metric-value-row">
              <span className="metric-value">{metrics?.inventory.criticalAlerts || 0}</span>
              <span className="metric-trend negative"><TrendingUp size={12} style={{ transform: 'scaleY(-1)' }} /> +2</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
