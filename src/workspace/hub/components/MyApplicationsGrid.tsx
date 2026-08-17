/**
 * ALLIANCE ONE — VOTRE ENVIRONNEMENT (OS APP TILES)
 * Tuiles d'applications vivantes avec profondeur spatiale et transition cinématique vers le module.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  GraduationCap, 
  Package, 
  Landmark, 
  FolderKanban, 
  BookOpen, 
  Sparkles, 
  Store,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ModuleRegistry } from '../../../core/modules/registry';
import type { ModuleManifest } from '../../../core/modules/registry';
import { ModuleLaunchTransition } from './ModuleLaunchTransition';
import { useHubStore } from '../../../core/stores/hubStore';

export const MyApplicationsGrid: React.FC = () => {
  const navigate = useNavigate();
  const installedModules = ModuleRegistry.getInstalled();
  const { metrics } = useHubStore();

  // Launch transition state
  const [launchingModule, setLaunchingModule] = useState<{
    name: string;
    color: string;
    icon?: React.ComponentType<{ size?: number; color?: string }>;
  } | null>(null);

  const handleLaunch = (mod: ModuleManifest) => {
    setLaunchingModule({
      name: mod.name,
      color: mod.accentColor,
      icon: mod.icon
    });

    setTimeout(() => {
      navigate(mod.routePath);
    }, 450);
  };

  return (
    <section className="hub-spatial-section">
      <div className="hub-section-headline-row">
        <div>
          <span className="hub-section-kicker">APPLICATIONS INSTALLÉES</span>
          <h2 className="hub-section-title-spatial">Votre Environnement Métier</h2>
        </div>
        <button className="hub-discover-link" onClick={() => navigate('/app/marketplace')}>
          <span>Marketplace</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Grid of OS App Tiles */}
      <div className="hub-app-tiles-grid">
        {installedModules.map((mod) => {
          const Icon = mod.icon;
          
          // Construct real API metrics
          let moduleMetrics: { label: string; value: string }[] | null = null;
          
          if (metrics) {
            if (mod.id === 'education') {
              moduleMetrics = [
                { label: 'élèves actifs', value: metrics.education.totalStudents.toString() },
                { label: 'en attente', value: metrics.education.pendingEnrollments.toString() }
              ];
            } else if (mod.id === 'finance') {
              moduleMetrics = [
                { label: 'trésorerie nette', value: metrics.finance.totalRevenue.toLocaleString() + ' FCFA' },
                { label: 'factures attente', value: metrics.finance.pendingInvoices.toString() }
              ];
            } else if (mod.id === 'inventory') {
              moduleMetrics = [
                { label: 'valeur stock', value: metrics.inventory.totalStockValue.toLocaleString() + ' FCFA' },
                { label: 'alertes stock', value: metrics.inventory.criticalAlerts.toString() }
              ];
            }
          }
          
          return (
            <div
              key={mod.id}
              className="os-app-tile"
              style={{ '--module-accent': mod.accentColor } as React.CSSProperties}
              onClick={() => handleLaunch(mod)}
            >
              {/* Tile Header: Module Icon + Status */}
              <div className="app-tile-header">
                <div 
                  className="app-tile-icon-frame"
                  style={{ backgroundColor: `${mod.accentColor}18`, color: mod.accentColor }}
                >
                  <Icon size={22} />
                </div>
                <div className="app-tile-badges">
                  <span className="app-tile-status-dot"></span>
                  <span className="app-tile-version">v{mod.version}</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="app-tile-content">
                <h3 className="app-tile-title">{mod.name}</h3>
                <p className="app-tile-tagline">{mod.tagline}</p>
              </div>

              {/* Live Metric Badges (or Skeletons if loading) */}
              <div className="app-tile-metrics-row">
                {moduleMetrics ? (
                  moduleMetrics.map((m, i) => (
                    <div key={i} className="app-tile-metric">
                      <span className="metric-tag">{m.label}</span>
                      <strong className="metric-num">{m.value}</strong>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="app-tile-metric skeleton-metric"></div>
                    <div className="app-tile-metric skeleton-metric"></div>
                  </>
                )}
              </div>

              {/* Hover Expansion Footer */}
              <div className="app-tile-footer">
                <span className="app-tile-open-btn">
                  <span>Ouvrir l'application</span>
                  <ArrowRight size={13} />
                </span>
                <span className="app-tile-core-badge">Certifié Core</span>
              </div>
            </div>
          );
        })}

        {/* Discover / Add Module Tile */}
        <div 
          className="os-app-tile discover-tile"
          onClick={() => navigate('/app/marketplace')}
        >
          <div className="discover-tile-icon">
            <Store size={22} color="#d97706" />
          </div>
          <div className="app-tile-content">
            <h3 className="app-tile-title" style={{ marginTop: '8px' }}>Explorer le Store</h3>
            <p className="app-tile-tagline">
              Ajoutez des extensions de santé, paie, CRM WhatsApp et connecteurs Mobile Money.
            </p>
          </div>
          <div className="discover-tile-action">
            <span>Parcourir le catalogue</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {/* Cinematic Fullscreen Transition Modal */}
      <ModuleLaunchTransition
        isLaunching={!!launchingModule}
        moduleName={launchingModule?.name || ''}
        moduleColor={launchingModule?.color || '#4f46e5'}
        moduleIcon={launchingModule?.icon}
      />
    </section>
  );
};
