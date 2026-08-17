/**
 * ALLIANCE ONE — MES APPLICATIONS (MODULE LAUNCHER)
 * Grille interactive des modules métier installés avec métriques temps réel et raccourcis.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  Sparkles, 
  Store, 
  ShieldCheck, 
  TrendingUp, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { ModuleRegistry } from '../../../core/modules/registry';
import type { ModuleManifest } from '../../../core/modules/registry';

export const MyApplicationsGrid: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'operations' | 'finance' | 'vertical'>('all');
  
  const installedModules = ModuleRegistry.getInstalled();

  const filtered = installedModules.filter((m) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'operations') return m.category === 'operations' || m.category === 'productivity';
    if (activeFilter === 'finance') return m.category === 'finance';
    if (activeFilter === 'vertical') return m.category === 'vertical';
    return true;
  });

  return (
    <section className="hub-section">
      <div className="hub-section-header">
        <div>
          <div className="hub-section-pretitle">ENVIRONNEMENT MÉTIER</div>
          <h2 className="hub-section-title">Mes Applications Installées</h2>
        </div>

        {/* Filter Pills */}
        <div className="hub-filter-tabs">
          <button 
            className={`hub-tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Toutes ({installedModules.length})
          </button>
          <button 
            className={`hub-tab-btn ${activeFilter === 'vertical' ? 'active' : ''}`}
            onClick={() => setActiveFilter('vertical')}
          >
            Éducation & Académique
          </button>
          <button 
            className={`hub-tab-btn ${activeFilter === 'operations' ? 'active' : ''}`}
            onClick={() => setActiveFilter('operations')}
          >
            Stocks & Projets
          </button>
          <button 
            className={`hub-tab-btn ${activeFilter === 'finance' ? 'active' : ''}`}
            onClick={() => setActiveFilter('finance')}
          >
            Finance & Trésorerie
          </button>
        </div>
      </div>

      {/* Grid of Applications */}
      <div className="hub-modules-grid">
        {filtered.map((mod) => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={mod.id}
              className="hub-module-card"
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              onClick={() => navigate(mod.routePath)}
            >
              {/* Top Row: Icon + Version + Status */}
              <div className="module-card-top">
                <div 
                  className="module-icon-bubble"
                  style={{ backgroundColor: `${mod.accentColor}18`, color: mod.accentColor }}
                >
                  <Icon size={22} />
                </div>

                <div className="module-meta-badges">
                  <span className="module-version-pill">v{mod.version}</span>
                  <span className="module-status-dot-active" title="Opérationnel"></span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="module-card-body">
                <h3 className="module-card-title">{mod.name}</h3>
                <p className="module-card-tagline">{mod.tagline}</p>
              </div>

              {/* Metrics preview */}
              {mod.metrics && mod.metrics.length > 0 && (
                <div className="module-card-metrics">
                  {mod.metrics.map((met, i) => (
                    <div key={i} className="module-metric-pill">
                      <span className="metric-pill-label">{met.label}</span>
                      <strong className="metric-pill-val">{met.value}</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Action Footer */}
              <div className="module-card-footer">
                <span className="module-launch-link">
                  Ouvrir l'application <ArrowUpRight size={14} />
                </span>
                <span className="module-verified-tag">Certifié Core</span>
              </div>
            </motion.div>
          );
        })}

        {/* Discover More Modules Card */}
        <div 
          className="hub-module-card discover-card"
          onClick={() => navigate('/marketplace')}
        >
          <div className="discover-icon-bubble">
            <Store size={22} color="#d97706" />
          </div>
          <h3 className="module-card-title" style={{ marginTop: '12px' }}>Explorer le Marketplace</h3>
          <p className="module-card-tagline">
            Découvrez des modules de santé, paie, CRM WhatsApp, connecteurs Mobile Money et thèmes.
          </p>
          <div className="discover-cta-row">
            <span>Parcourir le catalogue</span>
            <ChevronRight size={15} />
          </div>
        </div>
      </div>
    </section>
  );
};
