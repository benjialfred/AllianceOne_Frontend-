/**
 * MEGA-MENUS SIMPLIFIÉS ET UNIFIÉS — ALLIANCE ONE OS
 * 2 Menus principaux : Modules (OS Apps) et Écosystème (Plateforme complète)
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Package, 
  Landmark, 
  FolderKanban, 
  BookOpen, 
  Store, 
  Code2, 
  Building2, 
  MessageSquare, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Boxes, 
  Terminal, 
  Layers, 
  Sparkles,
  ExternalLink,
  Zap,
  Globe,
  Cpu,
  Palette
} from 'lucide-react';
import { ModuleRegistry } from '../../core/modules/registry';

interface MegaMenuProps {
  onClose: () => void;
}

// 1. MENU MODULES ▾ (Applications Installées & Disponibles)
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
      {/* Col 1: Applications Installées */}
      <div className="mega-menu-section">
        <div className="mega-section-header">
          <span className="mega-section-title">VOTRE ENVIRONNEMENT ACTIF</span>
          <span className="mega-badge">{installedModules.length} Modules</span>
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
                <div className="mega-item-icon" style={{ backgroundColor: `${mod.accentColor}18`, color: mod.accentColor }}>
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

      {/* Col 2: Extensions & Bêta */}
      <div className="mega-menu-section border-left">
        <div className="mega-section-header">
          <span className="mega-section-title">EXTENSIONS & BÊTA</span>
        </div>
        <div className="mega-items-list">
          {discoverModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                className="mega-menu-item subtle"
                onClick={() => handleGo('/marketplace')}
              >
                <div className="mega-item-icon" style={{ backgroundColor: `${mod.accentColor}18`, color: mod.accentColor }}>
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

          <button className="mega-quick-action-card" onClick={() => handleGo('/marketplace')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <Store size={15} color="#d97706" />
              <strong style={{ fontSize: '12px', color: '#b45309' }}>Marketplace Alliance</strong>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0 }}>
              +40 connecteurs (Orange/MTN Money, WhatsApp, Bulletins).
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. MENU ÉCOSYSTÈME ▾ (Marketplace, Développeurs, Services Studio, Communauté)
export const EcosystemMegaMenu: React.FC<MegaMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const handleGo = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="mega-menu-content ecosystem-unified-grid">
      {/* Marketplace & Développeurs */}
      <div className="mega-menu-section">
        <div className="mega-section-header">
          <span className="mega-section-title">PLATEFORME & EXTENSIONS</span>
        </div>
        <div className="mega-links-vertical">
          <button className="mega-text-link highlight" onClick={() => handleGo('/marketplace')}>
            <Store size={16} color="#d97706" />
            <div>
              <div className="link-title">Marketplace d'Applications</div>
              <div className="link-sub">Découvrez, installez et configurez des connecteurs métier</div>
            </div>
          </button>

          <button className="mega-text-link highlight" onClick={() => handleGo('/developers')}>
            <Code2 size={16} color="#4f46e5" />
            <div>
              <div className="link-title">Developer Hub & SDK</div>
              <div className="link-sub">Clés API, CLI `agy`, Webhooks et documentation REST</div>
            </div>
          </button>
        </div>
      </div>

      {/* Services Studio & Communauté */}
      <div className="mega-menu-section border-left">
        <div className="mega-section-header">
          <span className="mega-section-title">SERVICES & CRÉATEURS</span>
        </div>
        <div className="mega-links-vertical">
          <button className="mega-text-link highlight" onClick={() => handleGo('/services')}>
            <Building2 size={16} color="#059669" />
            <div>
              <div className="link-title">Alliance Studio & Portfolio</div>
              <div className="link-sub">Développement sur mesure Web, Mobile, IA et Cloud</div>
            </div>
          </button>

          <button className="mega-text-link highlight" onClick={() => handleGo('/community')}>
            <MessageSquare size={16} color="#8b5cf6" />
            <div>
              <div className="link-title">Communauté & Showcase</div>
              <div className="link-sub">Retours d'expérience, tutoriels et discussions</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
