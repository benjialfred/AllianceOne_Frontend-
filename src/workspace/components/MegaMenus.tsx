/**
 * MEGA-MENUS POUR LA NAVIGATION GLOBALE ALLIANCE ONE
 * Surfaces contextuelles légères, rapides, avec contenu hiérarchisé.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Package, 
  Landmark, 
  FolderKanban, 
  BookOpen, 
  Stethoscope, 
  Sparkles, 
  Code2, 
  Terminal, 
  Key, 
  Boxes, 
  Store, 
  Workflow, 
  Layers, 
  Briefcase, 
  Palette, 
  Globe, 
  Cpu, 
  MessageSquare, 
  Flame, 
  HelpCircle, 
  BookMarked, 
  LifeBuoy, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  Puzzle,
  TrendingUp,
  FileCode
} from 'lucide-react';
import { ModuleRegistry } from '../../core/modules/registry';

interface MegaMenuProps {
  onClose: () => void;
}

// 1. MENU MODULES ▾
export const ModulesMegaMenu: React.FC<MegaMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const installedModules = ModuleRegistry.getInstalled();
  const discoverModules = ModuleRegistry.getDiscoverable();

  const handleGo = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="mega-menu-content modules-mega-grid">
      {/* Col 1: Mes Modules Installés */}
      <div className="mega-menu-section">
        <div className="mega-section-header">
          <span className="mega-section-title">MES MODULES OPÉRATIONNELS</span>
          <span className="mega-badge">{installedModules.length} Actifs</span>
        </div>
        <div className="mega-items-list">
          {installedModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                className="mega-menu-item"
                onClick={() => handleGo(mod.routePath)}
              >
                <div className="mega-item-icon" style={{ backgroundColor: `${mod.accentColor}15`, color: mod.accentColor }}>
                  <Icon size={18} />
                </div>
                <div className="mega-item-text">
                  <div className="mega-item-headline">
                    <span className="mega-item-name">{mod.name}</span>
                    <span className="mega-item-tag">Installé</span>
                  </div>
                  <p className="mega-item-desc">{mod.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Col 2: Découvrir */}
      <div className="mega-menu-section">
        <div className="mega-section-header">
          <span className="mega-section-title">DÉCOUVRIR & EXTENSIONS</span>
        </div>
        <div className="mega-items-list">
          {discoverModules.slice(0, 2).map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                className="mega-menu-item subtle"
                onClick={() => handleGo('/marketplace')}
              >
                <div className="mega-item-icon" style={{ backgroundColor: `${mod.accentColor}15`, color: mod.accentColor }}>
                  <Icon size={18} />
                </div>
                <div className="mega-item-text">
                  <div className="mega-item-headline">
                    <span className="mega-item-name">{mod.name}</span>
                    <span className="mega-item-tag beta">{mod.status === 'coming_soon' ? 'Bientôt' : 'Bêta'}</span>
                  </div>
                  <p className="mega-item-desc">{mod.tagline}</p>
                </div>
              </button>
            );
          })}

          <div className="mega-quick-action-card" onClick={() => handleGo('/marketplace')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Store size={16} color="#d97706" />
              <strong style={{ fontSize: '12px', color: '#b45309' }}>Marketplace d'applications</strong>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0 }}>
              Explorez plus de 40 connecteurs, thèmes et automatisations métier.
            </p>
          </div>
        </div>
      </div>

      {/* Col 3: Gestion de la Plateforme */}
      <div className="mega-menu-section border-left">
        <div className="mega-section-header">
          <span className="mega-section-title">GESTION & LICENCES</span>
        </div>
        <div className="mega-links-vertical">
          <button className="mega-text-link" onClick={() => handleGo('/marketplace')}>
            <Boxes size={14} />
            <span>Gérer les modules installés</span>
          </button>
          <button className="mega-text-link" onClick={() => handleGo('/services')}>
            <ShieldCheck size={14} />
            <span>Licences d'entreprise & Quotas</span>
          </button>
          <button className="mega-text-link" onClick={() => handleGo('/developers')}>
            <Code2 size={14} />
            <span>Soumettre un module interne</span>
          </button>
        </div>

        <div className="mega-os-status-box">
          <div className="os-status-dot"></div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700 }}>Alliance Business OS 2.4</div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Tous les services sont synchronisés</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. MENU MARKETPLACE ▾
export const MarketplaceMegaMenu: React.FC<MegaMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const handleGo = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="mega-menu-content marketplace-mega-grid">
      <div className="mega-menu-section">
        <div className="mega-section-header">
          <span className="mega-section-title">CATÉGORIES D'EXTENSIONS</span>
        </div>
        <div className="mega-links-vertical">
          <button className="mega-text-link highlight" onClick={() => handleGo('/marketplace')}>
            <Boxes size={15} color="#4f46e5" />
            <div>
              <div className="link-title">Applications Métier</div>
              <div className="link-sub">Éducation, Gestion Hospitalière, Restauration</div>
            </div>
          </button>
          <button className="mega-text-link highlight" onClick={() => handleGo('/marketplace')}>
            <Workflow size={15} color="#059669" />
            <div>
              <div className="link-title">Connecteurs & Passerelles</div>
              <div className="link-sub">Orange Money, MTN MoMo, Stripe, WhatsApp</div>
            </div>
          </button>
          <button className="mega-text-link highlight" onClick={() => handleGo('/marketplace')}>
            <Sparkles size={15} color="#d97706" />
            <div>
              <div className="link-title">Modèles & Automatisations</div>
              <div className="link-sub">Templates de bulletins, factures et exports</div>
            </div>
          </button>
        </div>
      </div>

      <div className="mega-menu-section border-left">
        <div className="mega-section-header">
          <span className="mega-section-title">PROGRAMME DÉVELOPPEUR</span>
        </div>
        <div className="mega-featured-card">
          <h4 style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 700 }}>Publiez votre application</h4>
          <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '0 0 12px', lineHeight: 1.4 }}>
            Distribuez vos modules à des milliers d'organisations africaines et internationales avec le SDK Alliance.
          </p>
          <button className="mega-cta-btn" onClick={() => handleGo('/developers')}>
            Accéder au Developer Hub <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. MENU DÉVELOPPEURS ▾
export const DevelopersMegaMenu: React.FC<MegaMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const handleGo = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="mega-menu-content devs-mega-grid">
      <div className="mega-menu-section">
        <div className="mega-section-header">
          <span className="mega-section-title">PLATEFORME & OUTILS</span>
        </div>
        <div className="mega-links-vertical">
          <button className="mega-text-link highlight" onClick={() => handleGo('/developers')}>
            <Code2 size={15} color="#4f46e5" />
            <div>
              <div className="link-title">Developer Hub</div>
              <div className="link-sub">Vue d'ensemble et guides de démarrage</div>
            </div>
          </button>
          <button className="mega-text-link highlight" onClick={() => handleGo('/developers')}>
            <FileCode size={15} color="#0ea5e9" />
            <div>
              <div className="link-title">Alliance SDK & EventBus</div>
              <div className="link-sub">Kit TypeScript & Python pour intégrations</div>
            </div>
          </button>
          <button className="mega-text-link highlight" onClick={() => handleGo('/developers')}>
            <Terminal size={15} color="#059669" />
            <div>
              <div className="link-title">Alliance CLI (`agy`)</div>
              <div className="link-sub">Outil en ligne de commande pour build & deploy</div>
            </div>
          </button>
        </div>
      </div>

      <div className="mega-menu-section border-left">
        <div className="mega-section-header">
          <span className="mega-section-title">MON ESPACE DÉVELOPPEUR</span>
        </div>
        <div className="mega-links-vertical">
          <button className="mega-text-link" onClick={() => handleGo('/developers')}>
            <Key size={14} />
            <span>Clés d'API & Authentification (JWT)</span>
          </button>
          <button className="mega-text-link" onClick={() => handleGo('/developers')}>
            <Layers size={14} />
            <span>Webhooks & Événements en direct</span>
          </button>
          <button className="mega-text-link" onClick={() => handleGo('/developers')}>
            <Puzzle size={14} />
            <span>Sandbox & Bac à sable REST</span>
          </button>
          <button className="mega-text-link" onClick={() => handleGo('/developers')}>
            <PlusCircle size={14} />
            <span>Soumettre une application au Store</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. MENU SERVICES ▾ (Alliance Studio & Portfolio)
export const ServicesMegaMenu: React.FC<MegaMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const handleGo = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="mega-menu-content services-mega-grid">
      <div className="mega-menu-section">
        <div className="mega-section-header">
          <span className="mega-section-title">SERVICES & EXPERTISES</span>
        </div>
        <div className="mega-links-vertical">
          <button className="mega-text-link highlight" onClick={() => handleGo('/services')}>
            <Globe size={15} color="#4f46e5" />
            <div>
              <div className="link-title">Applications Web & Mobiles sur mesure</div>
              <div className="link-sub">Architectures scalables, React, Vite, Django, Cloud</div>
            </div>
          </button>
          <button className="mega-text-link highlight" onClick={() => handleGo('/services')}>
            <Cpu size={15} color="#d97706" />
            <div>
              <div className="link-title">Intelligence Artificielle & Automatisation</div>
              <div className="link-sub">LLMs, classification automatique, OCR de documents</div>
            </div>
          </button>
          <button className="mega-text-link highlight" onClick={() => handleGo('/services')}>
            <Palette size={15} color="#ec4899" />
            <div>
              <div className="link-title">UI/UX Design Systems d'Entreprise</div>
              <div className="link-sub">Expériences logicielles haute précision</div>
            </div>
          </button>
        </div>
      </div>

      <div className="mega-menu-section border-left">
        <div className="mega-section-header">
          <span className="mega-section-title">ALLIANCE STUDIO / PORTFOLIO</span>
        </div>
        <div className="mega-featured-card studio">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Briefcase size={15} color="#f59e0b" />
            <strong style={{ fontSize: '13px' }}>Projets & Réalisations</strong>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '0 0 12px', lineHeight: 1.4 }}>
            Découvrez nos études de cas, technologies et solutions déployées pour des entreprises et institutions.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="mega-cta-btn" onClick={() => handleGo('/services')}>
              Voir le Portfolio <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. MENU COMMUNAUTÉ ▾
export const CommunityMegaMenu: React.FC<MegaMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const handleGo = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="mega-menu-content community-mega-grid">
      <div className="mega-menu-section">
        <div className="mega-section-header">
          <span className="mega-section-title">ÉCOSYSTÈME DE CRÉATEURS</span>
        </div>
        <div className="mega-links-vertical">
          <button className="mega-text-link highlight" onClick={() => handleGo('/community')}>
            <MessageSquare size={15} color="#4f46e5" />
            <div>
              <div className="link-title">Fil d'actualité (Feed)</div>
              <div className="link-sub">Posts, mises à jour et discussions des concepteurs</div>
            </div>
          </button>
          <button className="mega-text-link highlight" onClick={() => handleGo('/community')}>
            <Flame size={15} color="#ea580c" />
            <div>
              <div className="link-title">Showcase de Projets</div>
              <div className="link-sub">Présentation d'applications construites sur Alliance</div>
            </div>
          </button>
        </div>
      </div>

      <div className="mega-menu-section border-left">
        <div className="mega-section-header">
          <span className="mega-section-title">PARTICIPER</span>
        </div>
        <div className="mega-links-vertical">
          <button className="mega-text-link" onClick={() => handleGo('/community')}>
            <PlusCircle size={14} />
            <span>Présenter mon projet ou mon module</span>
          </button>
          <button className="mega-text-link" onClick={() => handleGo('/community')}>
            <Sparkles size={14} />
            <span>Partager une astuce ou un tutoriel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 6. MENU AIDE ▾
export const HelpMegaMenu: React.FC<MegaMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const handleGo = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="mega-menu-content help-mega-grid">
      <div className="mega-menu-section">
        <div className="mega-section-header">
          <span className="mega-section-title">CENTRE DE CONNAISSANCE</span>
        </div>
        <div className="mega-links-vertical">
          <button className="mega-text-link highlight" onClick={() => handleGo('/help')}>
            <BookMarked size={15} color="#4f46e5" />
            <div>
              <div className="link-title">Documentation & Guides</div>
              <div className="link-sub">Tutoriels pas à pas pour chaque module métier</div>
            </div>
          </button>
          <button className="mega-text-link highlight" onClick={() => handleGo('/help')}>
            <LifeBuoy size={15} color="#0ea5e9" />
            <div>
              <div className="link-title">Dépannage & Diagnostic</div>
              <div className="link-sub">Vérification de connectivité et statut des services</div>
            </div>
          </button>
        </div>
      </div>

      <div className="mega-menu-section border-left">
        <div className="mega-section-header">
          <span className="mega-section-title">GUIDES DE PRISE EN MAIN</span>
        </div>
        <div className="mega-links-vertical">
          <button className="mega-text-link" onClick={() => handleGo('/help')}>
            <CheckCircle2 size={14} color="#059669" />
            <span>Premiers pas sur le Workspace</span>
          </button>
          <button className="mega-text-link" onClick={() => handleGo('/help')}>
            <ShieldCheck size={14} color="#4f46e5" />
            <span>Guide de l'Administrateur</span>
          </button>
          <button className="mega-text-link" onClick={() => handleGo('/help')}>
            <Code2 size={14} color="#d97706" />
            <span>Guide du Développeur d'extension</span>
          </button>
        </div>
      </div>
    </div>
  );
};
