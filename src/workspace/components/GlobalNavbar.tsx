/**
 * ALLIANCE ONE — GLOBAL OS NAVBAR
 * Barre de navigation principale légère, responsive, avec mega-menus contextuels.
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
  Shield, 
  Zap, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Logo } from '../../design-system/components/Logo';
import { usePlatformStore } from '../../core/stores/platformStore';
import { 
  ModulesMegaMenu, 
  MarketplaceMegaMenu, 
  DevelopersMegaMenu, 
  ServicesMegaMenu, 
  CommunityMegaMenu, 
  HelpMegaMenu 
} from './MegaMenus';
import './GlobalNavbar.css';

interface GlobalNavbarProps {
  onOpenSearch: () => void;
  onOpenCreate: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
}

type MenuKey = 'modules' | 'marketplace' | 'developers' | 'services' | 'community' | 'help' | null;

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
  const setOrganization = usePlatformStore((s) => s.setOrganization);

  // Close mega-menu when clicking outside
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

  // Close menus on route change
  useEffect(() => {
    setActiveMenu(null);
    setMobileDrawerOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleMenuToggle = (key: MenuKey) => {
    setActiveMenu((prev) => (prev === key ? null : key));
  };

  const navItems = [
    { key: null, label: 'Accueil', path: '/', isLink: true },
    { key: 'modules' as MenuKey, label: 'Modules', path: '/modules', isLink: false },
    { key: 'marketplace' as MenuKey, label: 'Marketplace', path: '/marketplace', isLink: false },
    { key: 'developers' as MenuKey, label: 'Développeurs', path: '/developers', isLink: false },
    { key: 'services' as MenuKey, label: 'Services', path: '/services', isLink: false },
    { key: 'community' as MenuKey, label: 'Communauté', path: '/community', isLink: false },
    { key: 'help' as MenuKey, label: 'Aide', path: '/help', isLink: false },
  ];

  return (
    <header className="global-navbar-root" ref={navRef}>
      <div className="global-navbar-container">
        {/* LEFT: Brand Emblem & Home trigger */}
        <div className="navbar-left">
          <button 
            className="navbar-brand-btn" 
            onClick={() => navigate('/')}
            title="Alliance One Hub"
          >
            <Logo size={32} showText showMotto />
          </button>
        </div>

        {/* CENTER: 7 Main Navigation Entries (Desktop) */}
        <nav className="navbar-center-nav">
          {navItems.map((item) => {
            if (item.isLink) {
              const isExact = location.pathname === item.path;
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) => `navbar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <span>{item.label}</span>
                </NavLink>
              );
            }

            const isOpen = activeMenu === item.key;
            const isCurrentModuleSubpath = 
              (item.key === 'modules' && (location.pathname.startsWith('/education') || location.pathname.startsWith('/inventory') || location.pathname.startsWith('/finance') || location.pathname.startsWith('/library') || location.pathname.startsWith('/tasks'))) ||
              (item.key && location.pathname.startsWith(`/${item.key}`));

            return (
              <button
                key={item.label}
                type="button"
                className={`navbar-nav-item with-dropdown ${isOpen ? 'open' : ''} ${isCurrentModuleSubpath ? 'active-path' : ''}`}
                onClick={() => handleMenuToggle(item.key)}
                onMouseEnter={() => activeMenu && setActiveMenu(item.key)}
              >
                <span>{item.label}</span>
                <ChevronDown size={13} className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Quick Tools (Search, Create, Notifications, Profile) */}
        <div className="navbar-right-tools">
          {/* Quick Search trigger (⌘K) */}
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
            <Plus size={16} />
            <span className="create-btn-label">Créer</span>
          </button>

          {/* Notifications Center */}
          <button 
            className="navbar-tool-btn icon-only notif-btn"
            onClick={onOpenNotifications}
            title="Notifications et alertes"
          >
            <Bell size={16} />
            {unreadNotificationsCount > 0 && (
              <span className="notif-badge">{unreadNotificationsCount}</span>
            )}
          </button>

          {/* Theme Toggle */}
          <button 
            className="navbar-tool-btn icon-only theme-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="navbar-divider"></div>

          {/* Organization & User Profile Menu */}
          <div className="navbar-user-wrapper">
            <button 
              className="navbar-user-btn"
              onClick={() => setUserDropdownOpen((v) => !v)}
            >
              <div className="user-avatar-pill">
                <span className="user-avatar-initials">BA</span>
              </div>
              <div className="user-meta-text">
                <span className="user-name">Benjamin</span>
                <span className="user-org-label">{currentOrg?.name || 'Alliance One'}</span>
              </div>
              <ChevronDown size={12} className="user-chevron" />
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
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>benjaminadzessa@gmail.com</div>
                    <div className="user-role-badge">Super Administrateur</div>
                  </div>

                  <div className="user-dropdown-divider"></div>

                  <div className="user-dropdown-section">
                    <div className="dropdown-section-title">ESPACE DE TRAVAIL</div>
                    <button className="user-dropdown-item" onClick={() => { setUserDropdownOpen(false); navigate('/'); }}>
                      <Building2 size={14} />
                      <span>Changer d'organisation</span>
                    </button>
                    <button className="user-dropdown-item" onClick={() => { setUserDropdownOpen(false); navigate('/developers'); }}>
                      <Zap size={14} />
                      <span>Console Développeur</span>
                    </button>
                  </div>

                  <div className="user-dropdown-divider"></div>

                  <button className="user-dropdown-item logout" onClick={() => { setUserDropdownOpen(false); alert('Déconnexion effectuée'); }}>
                    <LogOut size={14} />
                    <span>Se déconnecter</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="navbar-mobile-toggle"
            onClick={() => setMobileDrawerOpen((v) => !v)}
            aria-label="Menu mobile"
          >
            {mobileDrawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MEGA-MENUS DROPDOWN SURFACE (DESKTOP) */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div 
            className="mega-menu-backdrop"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div className="mega-menu-card">
              {activeMenu === 'modules' && <ModulesMegaMenu onClose={() => setActiveMenu(null)} />}
              {activeMenu === 'marketplace' && <MarketplaceMegaMenu onClose={() => setActiveMenu(null)} />}
              {activeMenu === 'developers' && <DevelopersMegaMenu onClose={() => setActiveMenu(null)} />}
              {activeMenu === 'services' && <ServicesMegaMenu onClose={() => setActiveMenu(null)} />}
              {activeMenu === 'community' && <CommunityMegaMenu onClose={() => setActiveMenu(null)} />}
              {activeMenu === 'help' && <HelpMegaMenu onClose={() => setActiveMenu(null)} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE ECOSYSTEM SLIDE-OVER DRAWER */}
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
                <Logo size={32} showText />
                <button className="mobile-drawer-close" onClick={() => setMobileDrawerOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="mobile-drawer-body">
                <div className="mobile-section-label">NAVIGATION ÉCOSYSTÈME</div>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/'); }}>
                  <Home size={18} />
                  <span>Accueil (Alliance Hub)</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/education'); }}>
                  <Boxes size={18} color="#4f46e5" />
                  <span>Éducation Pro</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/inventory'); }}>
                  <Boxes size={18} color="#0ea5e9" />
                  <span>Stocks & Logistique</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/finance'); }}>
                  <Boxes size={18} color="#059669" />
                  <span>Finances & Trésorerie</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/tasks'); }}>
                  <Boxes size={18} color="#8b5cf6" />
                  <span>Tâches & Projets</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/library'); }}>
                  <Boxes size={18} color="#3b82f6" />
                  <span>Bibliothèque & CDI</span>
                </button>

                <div className="mobile-section-label" style={{ marginTop: '1.5rem' }}>PLATEFORME & SERVICES</div>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/marketplace'); }}>
                  <Compass size={18} />
                  <span>Marketplace d'applications</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/developers'); }}>
                  <Zap size={18} />
                  <span>Developer Hub & SDK</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/services'); }}>
                  <Building2 size={18} />
                  <span>Services & Portfolio Studio</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setMobileDrawerOpen(false); navigate('/help'); }}>
                  <HelpCircle size={18} />
                  <span>Centre d'Aide & Tutoriels</span>
                </button>
              </div>

              <div className="mobile-drawer-footer">
                <button className="mobile-action-btn" onClick={onOpenCreate}>
                  <Plus size={16} /> Créer un nouvel élément
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="mobile-bottom-nav">
        <button className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>
          <Home size={18} />
          <span>Hub</span>
        </button>
        <button className={`bottom-nav-item ${location.pathname.startsWith('/education') || location.pathname.startsWith('/inventory') || location.pathname.startsWith('/finance') ? 'active' : ''}`} onClick={() => handleMenuToggle('modules')}>
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
