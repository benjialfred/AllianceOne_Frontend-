/**
 * ALLIANCE ONE — HERO COCKPIT
 * En-tête principal du Business Operating System avec salutation intelligente et télémétrie.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Activity, 
  Building2, 
  CheckCircle2,
  Zap,
  TrendingUp
} from 'lucide-react';
import { usePlatformStore } from '../../../core/stores/platformStore';

interface HeroCockpitProps {
  onOpenCreate: () => void;
  lastActiveModulePath?: string;
}

export const HeroCockpit: React.FC<HeroCockpitProps> = ({ 
  onOpenCreate,
  lastActiveModulePath = '/education' 
}) => {
  const navigate = useNavigate();
  const currentOrg = usePlatformStore((s) => s.currentOrganization);

  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <section className="hub-hero-section">
      <div className="hub-hero-card">
        {/* Ambient Gradient Glow */}
        <div className="hub-hero-glow"></div>

        <div className="hub-hero-content">
          {/* Status Badge */}
          <div className="hub-status-pill">
            <span className="hub-status-dot"></span>
            <span className="hub-status-text">Alliance Business OS v2.4 · Espace Opérationnel</span>
          </div>

          {/* Main Greeting & Title */}
          <h1 className="hub-hero-title">
            {greetingTime()}, <span className="hub-hero-name">Benjamin</span>.
          </h1>
          <p className="hub-hero-subtitle">
            Votre environnement pour <strong style={{ color: 'var(--color-text-primary)' }}>{currentOrg?.name || 'Collège & Lycée Bilingue Émergence'}</strong> est synchronisé et prêt.
          </p>

          {/* Primary Action Row */}
          <div className="hub-hero-actions">
            <button 
              className="hub-primary-btn"
              onClick={() => navigate(lastActiveModulePath)}
            >
              <span>Ouvrir mon Espace Travail</span>
              <ArrowRight size={15} />
            </button>

            <button 
              className="hub-secondary-btn"
              onClick={() => navigate('/marketplace')}
            >
              <Compass size={15} />
              <span>Explorer les Applications</span>
            </button>
          </div>
        </div>

        {/* Live Telemetry Panel */}
        <div className="hub-hero-telemetry">
          <div className="telemetry-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="#10b981" />
              <span className="telemetry-title">Télémétrie en Direct</span>
            </div>
            <span className="telemetry-ping">14 ms · Cloud Live</span>
          </div>

          <div className="telemetry-metrics-grid">
            <div className="telemetry-metric-item">
              <span className="metric-label">Modules Actifs</span>
              <span className="metric-value">5 / 5</span>
              <span className="metric-sub">Éducation, Stock, Finance...</span>
            </div>
            <div className="telemetry-metric-item">
              <span className="metric-label">Recouvrement Global</span>
              <span className="metric-value" style={{ color: '#059669' }}>88.4%</span>
              <span className="metric-sub">+4.1% vs mois dernier</span>
            </div>
            <div className="telemetry-metric-item">
              <span className="metric-label">Valorisation Stocks</span>
              <span className="metric-value">42.8M</span>
              <span className="metric-sub">3 alertes réassort</span>
            </div>
            <div className="telemetry-metric-item">
              <span className="metric-label">Sécurité & Sauvegarde</span>
              <span className="metric-value" style={{ color: '#4f46e5' }}>100%</span>
              <span className="metric-sub">Dernière synchro à 06:10</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
