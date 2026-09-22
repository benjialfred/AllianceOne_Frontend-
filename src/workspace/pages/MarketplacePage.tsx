/**
 * ALLIANCE ONE — MARKETPLACE PAGE
 * Catalogue complet d'applications, connecteurs, extensions et automatisations.
 */
import React, { useState, useEffect } from 'react';
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
  Plus,
  Loader2,
  GraduationCap,
  Package,
  Landmark,
  FolderKanban,
  AlertCircle
} from 'lucide-react';
import { ModulesApi } from '../../core/api/modules';
import type { ModuleManifest, ModuleInstallation, ModulePlan } from '../../core/api/modules';
import './EcosystemPages.css';

// Simple icon mapper since we get string from backend
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    'GraduationCap': GraduationCap,
    'Package': Package,
    'Landmark': Landmark,
    'FolderKanban': FolderKanban
  };
  return icons[iconName] || Layers;
};

export const MarketplacePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [modules, setModules] = useState<ModuleManifest[]>([]);
  const [installations, setInstallations] = useState<ModuleInstallation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [installingSlug, setInstallingSlug] = useState<string | null>(null);
  
  // Modal states for plan selection
  const [selectedModule, setSelectedModule] = useState<ModuleManifest | null>(null);

  useEffect(() => {
    fetchMarketplaceData();
  }, []);

  const fetchMarketplaceData = async () => {
    try {
      setIsLoading(true);
      const [mods, insts] = await Promise.all([
        ModulesApi.getRegistry(),
        ModulesApi.getInstallations()
      ]);
      setModules(mods);
      setInstallations(insts);
    } catch (err: any) {
      console.error(err);
      setError("Impossible de charger le catalogue.");
    } finally {
      setIsLoading(false);
    }
  };

  const isModuleInstalled = (slug: string) => {
    return installations.some(i => i.module.slug === slug && i.status === 'ACTIVE');
  };

  const handleInstallClick = (mod: ModuleManifest) => {
    if (isModuleInstalled(mod.slug)) return;
    setSelectedModule(mod);
  };

  const confirmInstall = async (plan: ModulePlan) => {
    if (!selectedModule) return;
    
    try {
      setInstallingSlug(selectedModule.slug);
      const response = await ModulesApi.installModule(selectedModule.slug, plan.id);
      
      if (response.checkout_url) {
        // Redirection vers Nelsius
        window.location.href = response.checkout_url;
      } else {
        // Free plan, installed directly
        await fetchMarketplaceData();
        setSelectedModule(null);
      }
    } catch (err: any) {
      console.error("Install error:", err);
      alert("Erreur lors de l'installation. Veuillez réessayer.");
    } finally {
      setInstallingSlug(null);
    }
  };

  const filtered = modules.filter((m) => {
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
          Découvrez, testez et déployez des applications certifiées pour enrichir votre espace Alliance One.
        </p>

        {/* Search & Filter Bar */}
        <div className="marketplace-search-row">
          <div className="marketplace-search-box">
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Rechercher une application, un connecteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="marketplace-category-pills">
            {[
              { id: 'all', label: 'Toutes les applications' },
              { id: 'VERTICAL', label: 'Éducation & Santé' },
              { id: 'OPERATIONS', label: 'Stocks & Logistique' },
              { id: 'FINANCE', label: 'Finances & Comptabilité' },
              { id: 'PRODUCTIVITY', label: 'Productivité & CRM' },
              { id: 'CORE', label: 'Plateforme Core' }
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

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="spinning" size={32} color="var(--color-primary)" />
        </div>
      ) : error ? (
        <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>
          <AlertCircle style={{display: 'inline-block', marginBottom: '1rem'}} size={32} />
          <p>{error}</p>
        </div>
      ) : (
        <div className="marketplace-grid-container">
          {filtered.map((mod) => {
            const Icon = getIconComponent(mod.icon_name);
            const installed = isModuleInstalled(mod.slug);
            const installing = installingSlug === mod.slug;

            return (
              <div key={mod.slug} className="marketplace-app-card">
                <div className="app-card-top">
                  <div 
                    className="app-icon-box"
                    style={{ backgroundColor: `${mod.accent_color}18`, color: mod.accent_color }}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="app-top-meta">
                    <div className="app-rating">
                      <Star size={13} color="#f59e0b" fill="#f59e0b" />
                      <span>4.8</span>
                    </div>
                    <span className="app-version-tag">v{mod.version}</span>
                  </div>
                </div>

                <div className="app-card-body">
                  <div className="app-title-row">
                    <h3 className="app-name">{mod.name}</h3>
                    {mod.is_verified && (
                      <ShieldCheck size={16} color="#4f46e5" title="Développeur vérifié Core" />
                    )}
                  </div>
                  <div className="app-developer-name">Par {mod.developer_name}</div>
                  <p className="app-description">{mod.description}</p>

                  <div className="app-features-list">
                    {mod.features.slice(0, 2).map((feat, i) => (
                      <div key={i} className="app-feature-bullet">
                        <CheckCircle2 size={12} color="#10b981" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="app-card-footer">
                  <button
                    className={`app-install-btn ${installed ? 'installed' : ''}`}
                    onClick={() => handleInstallClick(mod)}
                    disabled={installed || installing}
                  >
                    {installing ? (
                      <><Loader2 size={14} className="spinning" /><span>Installation...</span></>
                    ) : installed ? (
                      <><CheckCircle2 size={14} /><span>Installé</span></>
                    ) : (
                      <><Download size={14} /><span>Installer</span></>
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
      )}

      {/* Plan Selection Modal */}
      {selectedModule && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{maxWidth: '600px'}}>
            <h2>Installer {selectedModule.name}</h2>
            <p style={{marginBottom: '1.5rem', color: 'var(--color-text-muted)'}}>
              Sélectionnez un plan pour continuer. La facturation est gérée de manière sécurisée via Nelsius.
            </p>
            
            <div style={{display: 'flex', gap: '1rem', flexDirection: 'column'}}>
              {selectedModule.plans.map(plan => (
                <div key={plan.id} style={{
                  border: '1px solid var(--color-border)', 
                  padding: '1rem', 
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{margin: 0, fontSize: '1rem'}}>{plan.name}</h4>
                    <p style={{margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem'}}>
                      {plan.is_free ? 'Gratuit pour toujours' : `${plan.price_monthly} ${plan.currency} / mois`}
                    </p>
                  </div>
                  <button 
                    style={{
                      background: 'var(--color-primary)', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px 16px', 
                      borderRadius: '8px', 
                      cursor: 'pointer'
                    }}
                    onClick={() => confirmInstall(plan)}
                  >
                    Choisir
                  </button>
                </div>
              ))}
              
              {selectedModule.plans.length === 0 && (
                <div style={{padding: '1rem', background: 'var(--color-surface-hover)', borderRadius: '8px'}}>
                  Aucun plan disponible pour ce module.
                </div>
              )}
            </div>
            
            <div style={{marginTop: '1.5rem', textAlign: 'right'}}>
              <button 
                onClick={() => setSelectedModule(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: 'var(--color-text)'
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
