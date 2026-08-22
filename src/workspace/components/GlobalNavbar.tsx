/**
 * ALLIANCE ONE — ENTERPRISE NAVBAR
 * Clean, professional, and elegant navigation bar inspired by top-tier SaaS.
 */
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Bell, ChevronDown, Moon, Sun, 
  Building2, Menu, X, Home, Boxes, Compass, 
  LogOut, HelpCircle, Zap, Activity
} from 'lucide-react';
import { Logo } from '../../design-system/components/Logo';
import { usePlatformStore } from '../../core/stores/platformStore';
import { useAuthStore } from '../../core/stores/authStore';
import './GlobalNavbar.css';

interface GlobalNavbarProps {
  onOpenSearch: () => void;
  onOpenCreate: () => void;
  onOpenNotifications: () => void;
  onOpenAI?: () => void;
  unreadNotificationsCount?: number;
}

type MenuKey = 'applications' | 'ecosystem' | 'resources' | null;

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  onOpenSearch,
  onOpenCreate,
  onOpenNotifications,
  onOpenAI,
  unreadNotificationsCount = 0
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
  const logout = useAuthStore((s) => s.logout);

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

  const toggleMenu = (key: MenuKey) => {
    setActiveMenu((prev) => (prev === key ? null : key));
  };

  const isAppActive = location.pathname.match(/^\/app\/(education|inventory|finance|library|tasks)/);
  const isEcoActive = location.pathname.match(/^\/app\/(marketplace|developers|services|community)/);

  return (
    <header className="ent-navbar" ref={navRef}>
      <div className="ent-navbar-container">
        
        {/* === LEFT: BRANDING === */}
        <div className="ent-navbar-brand">
          <button className="ent-brand-btn" onClick={() => navigate('/app')}>
            <Logo size={24} showText={false} />
            <span className="ent-brand-text">Alliance One</span>
          </button>
        </div>

        {/* === CENTER: NAVIGATION === */}
        <nav className="ent-navbar-links">
          <NavLink to="/app" end className={({ isActive }) => `ent-nav-item ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>

          {/* Applications Dropdown */}
          <div className="ent-dropdown-wrapper">
            <button 
              className={`ent-nav-item ${activeMenu === 'applications' ? 'active' : ''} ${isAppActive ? 'current-path' : ''}`}
              onClick={() => toggleMenu('applications')}
            >
              Applications
              <ChevronDown size={14} className={`ent-chevron ${activeMenu === 'applications' ? 'open' : ''}`} />
            </button>
            <AnimatePresence>
              {activeMenu === 'applications' && (
                <motion.div 
                  className="ent-dropdown-menu apps-dropdown"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="ent-dropdown-grid">
                    <button className="ent-menu-card" onClick={() => navigate('/app/education')}>
                      <div className="ent-menu-icon" style={{ color: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.1)' }}>
                        <Boxes size={18} />
                      </div>
                      <div className="ent-menu-text">
                        <h4>Éducation Pro</h4>
                        <p>Gestion scolaire, emplois du temps et notes.</p>
                      </div>
                    </button>
                    <button className="ent-menu-card" onClick={() => navigate('/app/finance')}>
                      <div className="ent-menu-icon" style={{ color: '#059669', backgroundColor: 'rgba(5,150,105,0.1)' }}>
                        <Activity size={18} />
                      </div>
                      <div className="ent-menu-text">
                        <h4>Finances & Trésorerie</h4>
                        <p>Comptabilité, paie et facturation simplifiées.</p>
                      </div>
                    </button>
                    <button className="ent-menu-card" onClick={() => navigate('/app/inventory')}>
                      <div className="ent-menu-icon" style={{ color: '#0ea5e9', backgroundColor: 'rgba(14,165,233,0.1)' }}>
                        <Boxes size={18} />
                      </div>
                      <div className="ent-menu-text">
                        <h4>Stocks & Logistique</h4>
                        <p>Suivi des stocks, actifs et approvisionnement.</p>
                      </div>
                    </button>
                    <button className="ent-menu-card" onClick={() => navigate('/app/library')}>
                      <div className="ent-menu-icon" style={{ color: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)' }}>
                        <Boxes size={18} />
                      </div>
                      <div className="ent-menu-text">
                        <h4>Bibliothèque & CDI</h4>
                        <p>Gestion des ouvrages et emprunts.</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ecosystem Dropdown */}
          <div className="ent-dropdown-wrapper">
            <button 
              className={`ent-nav-item ${activeMenu === 'ecosystem' ? 'active' : ''} ${isEcoActive ? 'current-path' : ''}`}
              onClick={() => toggleMenu('ecosystem')}
            >
              Écosystème
              <ChevronDown size={14} className={`ent-chevron ${activeMenu === 'ecosystem' ? 'open' : ''}`} />
            </button>
            <AnimatePresence>
              {activeMenu === 'ecosystem' && (
                <motion.div 
                  className="ent-dropdown-menu list-dropdown"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  <button className="ent-list-item" onClick={() => navigate('/app/marketplace')}>
                    <Compass size={16} />
                    <span>Marketplace d'Extensions</span>
                  </button>
                  <button className="ent-list-item" onClick={() => navigate('/app/developers')}>
                    <Zap size={16} />
                    <span>Plateforme Développeurs</span>
                  </button>
                  <button className="ent-list-item" onClick={() => navigate('/app/services')}>
                    <Building2 size={16} />
                    <span>Alliance Studio</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* === RIGHT: TOOLS & PROFILE === */}
        <div className="ent-navbar-tools">
          <button className="ent-search-bar" onClick={onOpenSearch}>
            <Search size={14} />
            <span className="placeholder">Rechercher...</span>
            <kbd>/</kbd>
          </button>
          
          <button className="ent-search-bar" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }} onClick={onOpenAI}>
            <Sparkles size={14} />
            <span className="placeholder" style={{ color: '#3b82f6' }}>Ask Alliance AI</span>
            <kbd style={{ background: 'transparent', color: '#3b82f6', border: 'none' }}>⌘K</kbd>
          </button>

          <div className="ent-divider" />

          <button className="ent-icon-btn" onClick={onOpenNotifications}>
            <Bell size={18} />
            {unreadNotificationsCount > 0 && <span className="ent-badge" />}
          </button>

          <button className="ent-icon-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Profile */}
          <div className="ent-user-wrapper">
            <button className="ent-profile-btn" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
              <div className="ent-avatar">BA</div>
            </button>
            
            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div 
                  className="ent-dropdown-menu profile-dropdown"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="ent-profile-header">
                    <strong>Benjamin Adzessa</strong>
                    <span>{currentOrg?.name || 'Lycée Émergence'}</span>
                  </div>
                  <div className="ent-dropdown-divider" />
                  <button className="ent-list-item" onClick={() => navigate('/app/settings')}>
                    <Home size={16} />
                    <span>Paramètres du compte</span>
                  </button>
                  <button className="ent-list-item" onClick={() => navigate('/app/help')}>
                    <HelpCircle size={16} />
                    <span>Centre d'aide</span>
                  </button>
                  <div className="ent-dropdown-divider" />
                  <button className="ent-list-item danger" onClick={() => { logout(); navigate('/'); }}>
                    <LogOut size={16} />
                    <span>Se déconnecter</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
