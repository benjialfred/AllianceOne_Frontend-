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
  AlertCircle,
  Book,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ModulesApi } from '../../core/api/modules';
import type { ModuleManifest, ModuleInstallation, ModulePlan } from '../../core/api/modules';
import './EcosystemPages.css';
import '../hub/AllianceHub.css'; // Pour les modales marketing

// Simple icon mapper since we get string from backend
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    'GraduationCap': GraduationCap,
    'Package': Package,
    'Landmark': Landmark,
    'FolderKanban': FolderKanban,
    'Book': Book
  };
  return icons[iconName] || Layers;
};

const MARKETING_TIPS = [
  {
    title: "L'Alliance de vos services",
    subtitle: "Pourquoi s'éparpiller sur plusieurs logiciels isolés ? Connectez tous vos secteurs d'activités sur cette seule et unique plateforme pour une gestion globale.",
    icon: Layers,
    color: "#4f46e5",
    gradient: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
    features: [
      "Fin des silos : Chaque module interagit nativement avec les autres.",
      "Synchronisation absolue : Les données fusionnent en temps réel.",
      "Vue 360° : Un seul compte pour superviser votre écosystème."
    ]
  },
  {
    title: "L'Intelligence Artificielle à votre service",
    subtitle: "Vous ne savez pas quel module choisir ou comment le configurer ? Votre copilote Alliance AI s'occupe de tout.",
    icon: Zap,
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #064e3b 100%)",
    features: [
      "Installation guidée : Demandez à l'IA d'installer les modules.",
      "Configuration auto : L'IA pré-configure selon votre activité.",
      "Assistance 24/7 : Une question ? Votre copilote vous répond."
    ]
  },
  {
    title: "Une plateforme toujours à jour",
    subtitle: "En choisissant Alliance One, vous bénéficiez d'une évolution constante sans aucun effort de maintenance technique.",
    icon: ShieldCheck,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #78350f 100%)",
    features: [
      "Zéro maintenance : Nous gérons toute la technique et les serveurs.",
      "Mises à jour : Profitez des nouvelles fonctionnalités sans rien payer en plus.",
      "Sécurité maximale : Vos données sont chiffrées et sauvegardées."
    ]
  },
  {
    title: "La Puissance du Réseau",
    subtitle: "Vous n'êtes pas seul. Rejoignez le réseau Alliance One pour collaborer, partager et grandir avec d'autres organisations.",
    icon: Users,
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
    features: [
      "Partage : Découvrez les meilleures astuces des autres utilisateurs.",
      "Boîte à idées : Suggérez et votez pour les prochains modules.",
      "Partenariats : Connectez-vous avec des acteurs de votre secteur."
    ]
  }
];

export const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [modules, setModules] = useState<ModuleManifest[]>([]);
  const [installations, setInstallations] = useState<ModuleInstallation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [installingSlug, setInstallingSlug] = useState<string | null>(null);
  
  const [selectedModule, setSelectedModule] = useState<ModuleManifest | null>(null);
  const [detailsModule, setDetailsModule] = useState<ModuleManifest | null>(null);
  
  // Marketing auto-modal state
  const [showMarketingModal, setShowMarketingModal] = useState(false);
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [successModule, setSuccessModule] = useState<ModuleManifest | null>(null);

  useEffect(() => {
    fetchMarketplaceData();
    
    // Rotating tips logic
    const tipIndexStr = localStorage.getItem('ao_marketing_tip_index') || '0';
    const currentTipIndex = parseInt(tipIndexStr, 10) % MARKETING_TIPS.length;
    setActiveTipIndex(currentTipIndex);

    // Trigger marketing modal after a short delay on first visit per session
    const hasSeenModal = sessionStorage.getItem('ao_marketplace_marketing_seen');
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setShowMarketingModal(true);
        sessionStorage.setItem('ao_marketplace_marketing_seen', 'true');
        // Increment for next time
        localStorage.setItem('ao_marketing_tip_index', ((currentTipIndex + 1) % MARKETING_TIPS.length).toString());
      }, 1000);
      return () => clearTimeout(timer);
    }
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

  const handleInstallClick = async (mod: ModuleManifest) => {
    if (isModuleInstalled(mod.slug)) return;
    
    // Automatically find and install the free plan if it exists
    const freePlan = mod.plans.find(p => p.is_free);
    if (freePlan) {
      await confirmInstall(mod, freePlan);
    } else {
      // If no free plan (e.g. Education), show the modal to pay
      setSelectedModule(mod);
    }
  };

  const confirmInstall = async (module: ModuleManifest, plan: ModulePlan) => {
    try {
      setInstallingSlug(module.slug);
      const response = await ModulesApi.installModule(module.slug, plan.id);
      
      if (response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        await fetchMarketplaceData();
        setSelectedModule(null);
        setSuccessModule(module);
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
          <div className="marketplace-search-box" style={{ position: 'relative' }}>
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Rechercher une application, un connecteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <button 
              onClick={() => {
                setShowMarketingModal(true);
                // On increment local storage explicitly when manually triggered so they can cycle through them
                const currentTipIndex = parseInt(localStorage.getItem('ao_marketing_tip_index') || '0', 10);
                setActiveTipIndex(currentTipIndex % MARKETING_TIPS.length);
                localStorage.setItem('ao_marketing_tip_index', ((currentTipIndex + 1) % MARKETING_TIPS.length).toString());
              }}
              style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Zap size={14} /> Voir une Astuce Pro
            </button>
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

                <div className="app-card-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <button
                      className={`app-install-btn ${installed ? 'installed' : ''}`}
                      onClick={() => handleInstallClick(mod)}
                      disabled={installed || installing}
                      style={{ flex: 1, padding: '10px', borderRadius: '8px' }}
                    >
                      {installing ? (
                        <><Loader2 size={14} className="spinning" /><span>Installation...</span></>
                      ) : installed ? (
                        <><CheckCircle2 size={14} /><span>Installé</span></>
                      ) : (
                        <><Download size={14} /><span>Installer</span></>
                      )}
                    </button>
                    <button 
                      className="app-btn-details"
                      onClick={() => navigate(`/app/marketplace/module/${mod.slug}`)}
                      style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: 'var(--color-text)' }}
                    >
                      En savoir plus
                    </button>
                  </div>
                  
                  {!installed && (
                    <button 
                      onClick={() => navigate('/app/ai')}
                      style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}
                    >
                      <Zap size={14} /> Demander à l'IA d'installer
                    </button>
                  )}
                  
                  <div className="app-permissions-hint" title={`Permissions requises : ${mod.permissions.join(', ')}`} style={{ textAlign: 'center', marginTop: '4px' }}>
                    {mod.permissions.length} permissions requises
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
                    onClick={() => confirmInstall(selectedModule, plan)}
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



      {/* MARKETING AUTO-MODAL */}
      {showMarketingModal && (
        <div className="ao-marketing-modal-backdrop" style={{ zIndex: 10000 }}>
          <div className="ao-marketing-modal">
            <button className="ao-modal-close" onClick={() => setShowMarketingModal(false)}>✕</button>
            <div className="ao-modal-banner" style={{ background: MARKETING_TIPS[activeTipIndex].gradient }}>
              {React.createElement(MARKETING_TIPS[activeTipIndex].icon, { size: 48, color: "rgba(255,255,255,0.9)" })}
            </div>
            <div className="ao-modal-content">
              <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: MARKETING_TIPS[activeTipIndex].color, textTransform: 'uppercase' }}>
                Astuce #{activeTipIndex + 1}
              </span>
              <h2 style={{ marginTop: '8px' }}>{MARKETING_TIPS[activeTipIndex].title}</h2>
              <p className="ao-modal-subtitle">
                {MARKETING_TIPS[activeTipIndex].subtitle}
              </p>
              
              <ul className="ao-modal-features">
                {MARKETING_TIPS[activeTipIndex].features.map((feat, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={18} color={MARKETING_TIPS[activeTipIndex].color} style={{ flexShrink: 0 }} /> 
                    <span dangerouslySetInnerHTML={{ __html: feat.replace(/^(.*? :)/, '<strong>$1</strong>') }} />
                  </li>
                ))}
              </ul>
              
              <button className="ao-modal-cta-primary" onClick={() => setShowMarketingModal(false)} style={{ background: MARKETING_TIPS[activeTipIndex].color }}>
                J'ai compris, merci !
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {successModule && (
        <div className="ao-marketing-modal-backdrop" style={{ zIndex: 10000 }}>
          <div className="ao-marketing-modal" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ width: '80px', height: '80px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
              <CheckCircle2 size={40} color="#059669" />
            </div>
            
            <h2 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '16px' }}>Félicitations !</h2>
            <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
              Le module <strong>{successModule.name}</strong> a été installé avec succès dans votre espace de travail.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                onClick={() => setSuccessModule(null)}
                style={{
                  padding: '12px 24px',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Fermer
              </button>
              <button 
                onClick={() => {
                  setSuccessModule(null);
                  navigate('/app/my-modules');
                }}
                style={{
                  padding: '12px 24px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Voir mes modules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
