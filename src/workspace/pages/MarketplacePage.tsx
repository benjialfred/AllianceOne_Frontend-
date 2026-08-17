/**
 * ALLIANCE ONE — MARKETPLACE PAGE
 * Catalogue complet d'applications, connecteurs, extensions et automatisations.
 */
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Store, 
  Zap, 
  Layers, 
  ArrowRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { ModuleRegistry } from '../../core/modules/registry';
import type { ModuleManifest } from '../../core/modules/registry';
import './EcosystemPages.css';

export const MarketplacePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [installedIds, setInstalledIds] = useState<string[]>(
    ModuleRegistry.getInstalled().map((m) => m.id)
  );

  const allModules = ModuleRegistry.getAll();

  const handleInstallToggle = (id: string) => {
    setInstalledIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filtered = allModules.filter((m) => {
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="ecosystem-page-root">
      {/* Header Banner */}
      <div className="ecosystem-header-banner">
        <div className="ecosystem-badge">
          <Store size={14} />
          <span>ALLIANCE MARKETPLACE</span>
        </div>
        <h1 className="ecosystem-title">Applications & Extensions d'Entreprise</h1>
        <p className="ecosystem-subtitle">
          Découvrez, testez et déployez des modules certifiés pour enrichir votre Business Operating System.
        </p>

        {/* Search & Filter Bar */}
        <div className="marketplace-search-row">
          <div className="marketplace-search-box">
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Rechercher une application, un connecteur, une intégration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="marketplace-category-pills">
            {[
              { id: 'all', label: 'Toutes les applications' },
              { id: 'vertical', label: 'Éducation & Santé' },
              { id: 'operations', label: 'Stocks & Logistique' },
              { id: 'finance', label: 'Finances & Comptabilité' },
              { id: 'productivity', label: 'Productivité & CRM' },
              { id: 'ai', label: 'Intelligence Artificielle' }
            ].map((cat) => (
              <button
                key={cat.id}
                className={`category-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* App Cards Grid */}
      <div className="marketplace-grid-container">
        {filtered.map((mod) => {
          const Icon = mod.icon;
          const isInstalled = installedIds.includes(mod.id);
          return (
            <div key={mod.id} className="marketplace-app-card">
              {/* Card Top */}
              <div className="app-card-top">
                <div 
                  className="app-icon-box"
                  style={{ backgroundColor: `${mod.accentColor}18`, color: mod.accentColor }}
                >
                  <Icon size={24} />
                </div>
                <div className="app-top-meta">
                  <div className="app-rating">
                    <Star size={13} color="#f59e0b" fill="#f59e0b" />
                    <span>{mod.rating}</span>
                    <span className="app-installs">({mod.installCount})</span>
                  </div>
                  <span className="app-version-tag">v{mod.version}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="app-card-body">
                <div className="app-title-row">
                  <h3 className="app-name">{mod.name}</h3>
                  {mod.developer.verified && (
                    <ShieldCheck size={16} color="#4f46e5" title="Développeur vérifié Core" />
                  )}
                </div>
                <div className="app-developer-name">Par {mod.developer.name}</div>
                <p className="app-description">{mod.description}</p>

                {/* Features List */}
                <div className="app-features-list">
                  {mod.features.slice(0, 2).map((feat, i) => (
                    <div key={i} className="app-feature-bullet">
                      <CheckCircle2 size={12} color="#10b981" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="app-card-footer">
                <button
                  className={`app-install-btn ${isInstalled ? 'installed' : ''}`}
                  onClick={() => handleInstallToggle(mod.id)}
                >
                  {isInstalled ? (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Installé</span>
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      <span>Installer</span>
                    </>
                  )}
                </button>

                <div className="app-permissions-hint" title={`Permissions requises : ${mod.permissions.join(', ')}`}>
                  {mod.permissions.length} permissions
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
