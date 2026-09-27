import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../core/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Crown, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  X,
  Package,
  Landmark,
  Stethoscope,
  GraduationCap,
  FolderKanban,
  Book,
  CreditCard,
  Eye,
  EyeOff,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlatformStore } from '../../core/stores/platformStore';
import './AllianceHub.css';

import { PremiumUpgradeModal } from '../components/PremiumUpgradeModal';

export const AllianceHub: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const currentOrg = usePlatformStore(s => s.currentOrganization);
  const navigate = useNavigate();
  const [activeModalData, setActiveModalData] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradePrice, setUpgradePrice] = useState(45000);
  const [isUltra, setIsUltra] = useState(false);

  const openAICopilot = () => {
    setActiveModalData(null);
    navigate('/app/ai');
  };

  const MODULES = [
    { id: 'education', name: 'Éducation', icon: GraduationCap, color: '#4f46e5', desc: 'Gestion scolaire, notes et présences.' },
    { id: 'finance', name: 'Finance & Trésorerie', icon: Landmark, color: '#059669', desc: 'Comptabilité, factures et budgets.' },
    { id: 'inventory', name: 'Stocks & Logistique', icon: Package, color: '#0e121b', desc: 'Inventaire, flux et réapprovisionnement.' },
    { id: 'healthcare', name: 'Santé', icon: Stethoscope, color: '#10B981', desc: 'Dossiers patients, consultations.' },
    { id: 'tasks', name: 'Tâches & Projets', icon: FolderKanban, color: '#8b5cf6', desc: 'Gestion de projets, Kanban et suivi.' },
    { id: 'library', name: 'Bibliothèque & CDI', icon: Book, color: '#3b82f6', desc: 'Gestion documentaire et prêts.' }
  ];

  // Marketing Upsell Modals Data
  const MARKETING_MODALS = [
    {
      id: 'ai-welcome',
      icon: Sparkles,
      iconColor: '#ffffff',
      title: `Bienvenue dans l'ère de l'intelligence, ${user?.first_name || 'Leader'}.`,
      subtitle: "Votre espace est prêt. Mais il est encore vide. Confiez la création de votre empire à Alliance AI.",
      features: [
        "Installation automatique de vos modules",
        "Génération de données de démonstration",
        "Personnalisation de vos processus métier"
      ],
      primaryBtn: "Laisser l'IA configurer mon espace",
      primaryIcon: Sparkles,
      onPrimary: openAICopilot
    },
    {
      id: 'premium-upsell',
      icon: Crown,
      iconColor: '#f59e0b',
      title: "Passez à Alliance Premium",
      subtitle: "Ne vous limitez plus. Débloquez la puissance absolue de l'écosystème Alliance One.",
      features: [
        "Accès illimité à tous les modules métiers",
        "Assistance IA avancée H24",
        "Intégrations réseau et partenaires exclusifs"
      ],
      primaryBtn: "Découvrir l'offre Premium",
      primaryIcon: Crown,
      onPrimary: () => { setActiveModalData(null); navigate('/marketplace'); }
    },
    {
      id: 'network-trust',
      icon: CheckCircle2,
      iconColor: '#10b981',
      title: "Rejoignez le Réseau de Confiance",
      subtitle: "Connectez-vous avec nos partenaires, investisseurs et autres leaders de l'écosystème.",
      features: [
        "Accès aux flux Telegram d'investissements",
        "Webinaires et événements exclusifs",
        "Vote sur les prochaines fonctionnalités"
      ],
      primaryBtn: "Explorer le Réseau",
      primaryIcon: ArrowRight,
      onPrimary: () => { setActiveModalData(null); navigate('/app/confiance'); }
    }
  ];

  // Auto-open rotating modal on visit
  useEffect(() => {
    // Only show once per session to avoid spamming the user
    const hasSeenModal = sessionStorage.getItem('ao_hub_marketing_seen');
    if (hasSeenModal) return;

    // Determine which modal to show (rotate based on localStorage)
    const nextIndexStr = localStorage.getItem('ao_hub_marketing_index');
    const nextIndex = nextIndexStr ? parseInt(nextIndexStr, 10) : 0;
    const safeIndex = nextIndex % MARKETING_MODALS.length;

    const timer = setTimeout(() => {
      setActiveModalData(MARKETING_MODALS[safeIndex]);
      
      // Update state for next time
      sessionStorage.setItem('ao_hub_marketing_seen', 'true');
      localStorage.setItem('ao_hub_marketing_index', (safeIndex + 1).toString());
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Wallet states for Hub Widget
  const walletPin = localStorage.getItem('ao_wallet_pin');
  const [showBalance, setShowBalance] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [isPromptingPin, setIsPromptingPin] = useState(false);

  const toggleBalance = () => {
    if (showBalance) {
      setShowBalance(false);
      setIsPromptingPin(false);
    } else {
      if (walletPin) {
        setIsPromptingPin(true);
      } else {
        // Redirect to wallet page to create pin
        navigate('/app/wallet');
      }
    }
  };

  const handlePinSubmit = () => {
    if (pinInput === walletPin) {
      setShowBalance(true);
      setIsPromptingPin(false);
      setPinInput('');
    } else {
      alert("Code PIN incorrect");
    }
  };

  return (
    <div className="ao-dashboard-root ao-empty-state-root">
      
      {/* 0. ORG & WALLET HEADER WIDGET */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e2e8f0', marginBottom: '24px', flexWrap: 'wrap', gap: '24px' }}>
        
        {/* Left: Organization Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {currentOrg?.logo_url ? (
            <img src={currentOrg.logo_url} alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={32} color="#64748b" />
            </div>
          )}
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontFamily: 'var(--ao-font-serif)', color: '#0f172a' }}>
              {currentOrg?.name || "Espace Organisation"}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>
                {currentOrg?.tenant_type === 'school' ? 'Établissement' : 'Entreprise'}
              </span>
              {currentOrg?.country && (
                <span style={{ fontSize: '13px', color: '#64748b' }}>• {currentOrg.country}</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ width: '1px', height: '64px', background: '#e2e8f0', display: 'none' }} className="desktop-only-divider" />

        {/* Right: Wallet Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={24} color="#4f46e5" />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Solde de l'entreprise</div>
              {showBalance ? (
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>1 500 000 <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 400 }}>XAF</span></div>
              ) : (
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#94a3b8', letterSpacing: '2px' }}>*** ***</div>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isPromptingPin ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="password" 
                  maxLength={4} 
                  value={pinInput} 
                  onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))} 
                  placeholder="PIN" 
                  style={{ width: '60px', padding: '6px', textAlign: 'center', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <button onClick={handlePinSubmit} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>OK</button>
                <button onClick={() => setIsPromptingPin(false)} style={{ background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
              </div>
            ) : (
              <button onClick={toggleBalance} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
                {showBalance ? 'Masquer' : 'Afficher'}
              </button>
            )}
            <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
            <button onClick={() => navigate('/app/wallet')} style={{ background: '#f1f5f9', color: '#0f172a', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Gérer</button>
          </div>
        </div>
      </div>

      {/* 1. HERO MARKETING BANNER */}
      <div className="ao-hero-marketing">
        <div className="ao-hero-marketing-content">
          <div className="ao-premium-badge">
            <Crown size={14} /> OFFRE DE LANCEMENT
          </div>
          <h1 style={{ fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)"}}>
            Débloquez la puissance absolue avec Alliance Premium
          </h1>
          <p>
            Vous n'avez aucun module installé. Propulsez votre organisation dans une nouvelle dimension en accédant à tous nos modules métier et à l'intelligence artificielle intégrée, en illimité.
          </p>
          <div className="ao-hero-actions">
            <button className="ao-btn-premium-large" onClick={() => { sessionStorage.removeItem('ao_hub_marketing_seen'); setActiveModalData(MARKETING_MODALS[1]); }}>
              Passer à Premium maintenant <ArrowRight size={18} />
            </button>
            <button className="ao-btn-secondary-large" onClick={openAICopilot}>
              <Sparkles size={18} color="#4f46e5" /> Demander conseil à l'IA
            </button>
          </div>
        </div>
        <div className="ao-hero-marketing-bg"></div>
      </div>

      {/* 2. ALLIANCE AI UPSELL */}
      <div className="ao-ai-upsell-panel">
        <div className="ao-ai-upsell-icon">
          <Sparkles size={32} color="#ffffff" />
        </div>
        <div className="ao-ai-upsell-text">
          <h2 style={{ fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)"}}>Alliance AI est prête à vous assister</h2>
          <p>
            Vous ne savez pas par où commencer ? Demandez simplement à Alliance AI de configurer votre entreprise, de générer vos premiers rapports ou d'installer les modules dont vous avez besoin.
          </p>
        </div>
        <button className="ao-btn-ai-launch" onClick={openAICopilot}>
          Lancer le copilote <Zap size={16} />
        </button>
      </div>

      {/* 3. BUNDLES PRO & ULTRA */}
      <div className="ao-bundles-section" style={{ marginTop: '48px', marginBottom: '48px' }}>
        <div className="ao-discovery-header" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)", fontSize: '24px', color: '#0f172a' }}>
            Nos Abonnements
          </h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {/* Bundle PRO */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '32px', 
            border: '1px solid #e2e8f0',
            position: 'relative',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
          }}>
            <h4 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '8px' }}>Alliance PRO</h4>
            <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px', lineHeight: '1.5' }}>
              Passez à pro et sélectionnez les modules que vous voulez (jusqu'à 5 modules au choix).
            </p>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>
              45 000 <span style={{ fontSize: '16px', fontWeight: 400, color: '#64748b' }}>XAF/mois</span>
            </div>
            
            <button 
              onClick={() => {
                setUpgradePrice(45000);
                setIsUltra(false);
                setShowUpgradeModal(true);
              }}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4f46e5', color: '#4f46e5',
                background: 'transparent', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.color = 'white'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4f46e5'; }}
            >
              Choisir le forfait PRO
            </button>
          </div>
          
          {/* Bundle ULTRA */}
          <div style={{ 
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', 
            borderRadius: '16px', 
            padding: '32px', 
            border: 'none',
            color: 'white',
            position: 'relative',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
          }}>
            <div style={{ position: 'absolute', top: '-12px', right: '24px', background: '#f59e0b', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
              RECOMMANDÉ
            </div>
            <h4 style={{ fontSize: '20px', color: 'white', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Crown size={20} color="#f59e0b" /> Alliance ULTRA
            </h4>
            <p style={{ color: '#c7d2fe', marginBottom: '24px', fontSize: '14px', lineHeight: '1.5' }}>
              Donne accès à TOUS les modules sans restriction. Pour un service ou développement spécifique, contactez directement le dev.
            </p>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '24px' }}>
              150 000 <span style={{ fontSize: '16px', fontWeight: 400, color: '#c7d2fe' }}>XAF/mois</span>
            </div>
            
            <button 
              onClick={() => {
                setUpgradePrice(150000);
                setIsUltra(true);
                setShowUpgradeModal(true);
              }}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: 'none', color: '#1e1b4b',
                background: 'white', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
              }}
            >
              <Zap size={16} /> Choisir le forfait ULTRA
            </button>
          </div>
        </div>
      </div>

      {/* 4. MODULES DISCOVERY (LOCKED) */}
      <div className="ao-modules-discovery">
        <div className="ao-discovery-header">
          <h3 style={{ fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)", fontSize: '24px', color: '#0f172a' }}>
            Catalogue des modules
          </h3>
          <button className="ao-btn-link" onClick={() => navigate('/marketplace')}>Voir tout le catalogue &rarr;</button>
        </div>

        <div className="ao-discovery-grid">
          {MODULES.map((mod) => (
            <div className="ao-discovery-card" key={mod.id}>
              <div className="ao-discovery-card-top">
                <div className="ao-mod-icon" style={{ backgroundColor: `${mod.color}15`, color: mod.color }}>
                  <mod.icon size={24} />
                </div>
                <div className="ao-mod-lock">
                  <Crown size={14} color="#f59e0b" />
                </div>
              </div>
              <h4>{mod.name}</h4>
              <p>{mod.desc}</p>
              <button className="ao-btn-unlock" onClick={() => navigate('/marketplace')}>Tester gratuitement</button>
            </div>
          ))}
        </div>
      </div>

      {/* AUTO OPEN ROTATING MARKETING MODAL */}
      <AnimatePresence>
        {activeModalData && (
          <div className="ao-marketing-modal-backdrop">
            <motion.div 
              className="ao-marketing-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button className="ao-modal-close" onClick={() => setActiveModalData(null)}>
                <X size={20} />
              </button>
              
              <div className="ao-modal-banner" style={activeModalData.iconColor ? { color: activeModalData.iconColor } : {}}>
                <activeModalData.icon size={48} />
              </div>
              
              <div className="ao-modal-content">
                <h2 style={{ fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)"}}>
                  {activeModalData.title}
                </h2>
                <p className="ao-modal-subtitle">
                  {activeModalData.subtitle}
                </p>
                
                <ul className="ao-modal-features">
                  {activeModalData.features.map((feat: string, idx: number) => (
                    <li key={idx}>
                      <CheckCircle2 size={18} color="#10b981" /> 
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button className="ao-modal-cta-primary" onClick={activeModalData.onPrimary}>
                  <activeModalData.primaryIcon size={18} /> {activeModalData.primaryBtn}
                </button>
                <button className="ao-modal-cta-secondary" onClick={() => setActiveModalData(null)}>
                  Plus tard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <PremiumUpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        price={upgradePrice}
        isUltra={isUltra}
      />
    </div>
  );
};
