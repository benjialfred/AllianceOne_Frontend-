/**
 * ALLIANCE ONE — GLOBAL OS NAVBAR V2
 * Barre de navigation épurée, ergonomique, avec philosophie d'Operating System.
 */
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Bell, 
  ChevronDown, 
  Moon, 
  Sun, 
  Building2, 
  Menu, 
  X, 
  Home, 
  Boxes, 
  Compass, 
  User, 
  LogOut, 
  HelpCircle, 
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { Logo } from '../../design-system/components/Logo';
import { usePlatformStore } from '../../core/stores/platformStore';
import { ModulesMegaMenu, EcosystemMegaMenu } from './MegaMenus';
import './GlobalNavbar.css';

interface GlobalNavbarProps {
  onOpenSearch: () => void;
  onOpenCreate: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
}

type MenuKey = 'modules' | 'ecosystem' | null;

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  onOpenSearch,
  onOpenCreate,
  onOpenNotifications,
  unreadNotificationsCount = 3
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const theme = usePlatformStore((s) => s.theme);
  const toggleTheme = usePlatformStore((s) => s.toggleTheme);
  const currentOrg = usePlatformStore((s) => s.currentOrganization);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveMenu(null);
    setMobileDrawerOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleMenuToggle = (key: MenuKey) => {
    setActiveMenu((prev) => (prev === key ? null : key));
  };

  const isModuleActive = 
    location.pathname.startsWith('/app/education') || 
    location.pathname.startsWith('/app/inventory') || 
    location.pathname.startsWith('/app/finance') || 
    location.pathname.startsWith('/app/library') || 
    location.pathname.startsWith('/app/tasks');

  const isEcosystemActive = 
    location.pathname.startsWith('/app/marketplace') || 
    location.pathname.startsWith('/app/developers') || 
    location.pathname.startsWith('/app/services') || 
    location.pathname.startsWith('/app/community');

  return (
    <header className="global-navbar-root" ref={navRef}>
      <div className="global-navbar-container">
        {/* LEFT: Brand Logo & Operating System Label */}
        <div className="navbar-left">
          <button 
            className="navbar-brand-btn" 
            onClick={() => navigate('/app')}
            title="Alliance One Hub"
          >
            <Logo size={28} showText showMotto={false} />
            <span className="navbar-os-version-pill">OS 2.4</span>
          </button>
        </div>

        {/* CENTER: 3 Core Navigation Entries */}
        <nav className="navbar-center-nav">
          <NavLink
            to="/app"
            end
            className={({ isActive }) => `navbar-nav-item ${isActive ? 'active' : ''}`}
          >
            <span>Accueil</span>
          </NavLink>

          <button
            type="button"
            className={`navbar-nav-item with-dropdown ${activeMenu === 'modules' ? 'open' : ''} ${isModuleActive ? 'active-path' : ''}`}
            onClick={() => handleMenuToggle('modules')}
            onMouseEnter={() => activeMenu && setActiveMenu('modules')}
          >
            <span>Modules</span>
            <ChevronDown size={13} className={`chevron-icon ${activeMenu === 'modules' ? 'rotate' : ''}`} />
          </button>

          <button
            type="button"
            className={`navbar-nav-item with-dropdown ${activeMenu === 'ecosystem' ? 'open' : ''} ${isEcosystemActive ? 'active-path' : ''}`}
            onClick={() => handleMenuToggle('ecosystem')}
            onMouseEnter={() => activeMenu && setActiveMenu('ecosystem')}
          >
            <span>Écosystème</span>
            <ChevronDown size={13} className={`chevron-icon ${activeMenu === 'ecosystem' ? 'rotate' : ''}`} />
          </button>
        </nav>

        {/* RIGHT: OS Tools (Search, Create, Notifications, Help, Profile) */}
        <div className="navbar-right-tools">
          {/* Quick Search (⌘K) */}
          <button 
            className="navbar-tool-btn search-trigger-btn"
            onClick={onOpenSearch}
            title="Recherche universelle (⌘K)"
          >
            <Search size={14} />
            <span className="search-placeholder">Rechercher...</span>
            <kbd className="search-kbd">⌘K</kbd>
          </button>

          {/* Quick Create (+) */}
          <button 
            className="navbar-tool-btn create-btn"
            onClick={onOpenCreate}
            title="Créer un objet (+)"
          >
            <Plus size={15} />
            <span className="create-btn-label">Créer</span>
          </button>

          {/* Notifications Center */}
          <button 
            className="navbar-tool-btn icon-only notif-btn"
            onClick={onOpenNotifications}
            title="Notifications et alertes"
          >
            <Bell size={15} />
            {unreadNotificationsCount > 0 && (
              <span className="notif-badge">{unreadNotificationsCount}</span>
            )}
          </button>

          {/* Help Center Shortcut (?) */}
          <button 
            className="navbar-tool-btn icon-only help-trigger-btn"
            onClick={() => navigate('/app/help')}
            title="Centre d'aide & Documentation"
          >
            <HelpCircle size={15} />
          </button>

          {/* Theme Toggle */}
          <button 
            className="navbar-tool-btn icon-only theme-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <div className="navbar-divider"></div>

          {/* Organization & Profile Pill */}
          <div className="navbar-user-wrapper">
            <button 
              className="navbar-user-btn"
              onClick={() => setUserDropdownOpen((v) => !v)}
            >
              <div className="user-avatar-pill">
                <span>BA</span>
              </div>
              <div className="user-meta-text">
                <span className="user-name">Benjamin</span>
                <span className="user-org-label">{currentOrg?.name || 'Lycée Émergence'}</span>
              </div>
              <ChevronDown size={11} className="user-chevron" />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div 
                  className="user-dropdown-card"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="user-dropdown-header">
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>Benjamin Adzessa</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Super Administrateur</div>
                    <div className="user-role-badge">Établissement Principal</div>
                  </div>

                  <div className="user-dropdown-divider"></div>

                  <div className="user-dropdown-section">
                    <button className="user-dropdown-item" onClick={() => { setUserDropdownOpen(false); navigate('/'); }}>
                      <Home size={14} />
                      <span>Alliance Hub Cockpit</span>
                    </button>
                    <button className="user-dropdown-item" onClick={() => { setUserDropdownOpen(false); navigate('/app/developers'); }}>
                      <Zap size={14} />
                      <span>Console Développeur</span>
                    </button>
                    <button className="user-dropdown-item" onClick={() => { setUserDropdownOpen(false); navigate('/app/help'); }}>
                      <HelpCircle size={14} />
                      <span>Centre d'aide & Documentation</span>
                    </button>
                  </div>

                  <div className="user-dropdown-divider"></div>

                  <button className="user-dropdown-item logout" onClick={() => { setUserDropdownOpen(false); alert('Déconnexion'); }}>
                    <LogOut size={14} />
                    <span>Se déconnecter</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Drawer Toggle */}
          <button 
            className="navbar-mobile-toggle"
            onClick={() => setMobileDrawerOpen((v) => !v)}
            aria-label="Menu mobile"
          >
            {mobileDrawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MEGA-MENUS DROPDOWNS */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div 
            className="mega-menu-backdrop"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            <div className="mega-menu-card">
              {activeMenu === 'modules' && <ModulesMegaMenu onClose={() => setActiveMenu(null)} />}
              {activeMenu === 'ecosystem' && <EcosystemMegaMenu onClose={() => setActiveMenu(null)} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <motion.div 
            className="mobile-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="mobile-drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            >
              <div className="mobile-drawer-header">
                <Logo size={28} showText />
                <button className="mobile-drawer-close" onClick={() => setMobileDrawerOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="mobile-drawer-body">
                <div className="mobile-section-label">APPLICATIONS DU SYSTÈME</div>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/'); }}>
                  <Home size={18} />
                  <span>Alliance Hub</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/app/education'); }}>
                  <Boxes size={18} color="#4f46e5" />
                  <span>Éducation Pro</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/app/inventory'); }}>
                  <Boxes size={18} color="#0ea5e9" />
                  <span>Stocks & Logistique</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/app/finance'); }}>
                  <Boxes size={18} color="#059669" />
                  <span>Finances & Trésorerie</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/app/tasks'); }}>
                  <Boxes size={18} color="#8b5cf6" />
                  <span>Tâches & Projets</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/app/library'); }}>
                  <Boxes size={18} color="#3b82f6" />
                  <span>Bibliothèque & CDI</span>
                </button>

                <div className="mobile-section-label" style={{ marginTop: '1.5rem' }}>ÉCOSYSTÈME</div>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/app/marketplace'); }}>
                  <Compass size={18} />
                  <span>Marketplace</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/app/developers'); }}>
                  <Zap size={18} />
                  <span>Developer Platform</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/app/services'); }}>
                  <Building2 size={18} />
                  <span>Alliance Studio</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/app/help'); }}>
                  <HelpCircle size={18} />
                  <span>Centre d'Aide</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="mobile-bottom-nav">
        <button className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>
          <Home size={18} />
          <span>Hub</span>
        </button>
        <button className={`bottom-nav-item ${isModuleActive ? 'active' : ''}`} onClick={() => handleMenuToggle('modules')}>
          <Boxes size={18} />
          <span>Modules</span>
        </button>
        <button className="bottom-nav-item action-center" onClick={onOpenCreate}>
          <div className="center-plus-btn">
            <Plus size={20} />
          </div>
          <span>Créer</span>
        </button>
        <button className="bottom-nav-item" onClick={onOpenSearch}>
          <Search size={18} />
          <span>Recherche</span>
        </button>
        <button className="bottom-nav-item" onClick={onOpenNotifications}>
          <Bell size={18} />
          <span>Alertes</span>
        </button>
      </div>
    </header>
  );
};
