import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence as FramerAnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Search, Plus, Bell, 
  ChevronDown, LogOut, Settings, User, Zap,
  LifeBuoy, BookOpen, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/authStore';
import { AllianceLogo } from '../components/AllianceLogo';

const AnimatePresence = FramerAnimatePresence;

export interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  shortcut?: string;
}

export interface NavSection {
  section: string;
  items: NavItem[];
}

export interface ModuleSidebarProps {
  moduleName: string;
  moduleColor: string;
  navigation: NavSection[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  // Tools
  onOpenSearch: () => void;
  onOpenCreate: () => void;
  onOpenNotifications: () => void;
  onOpenAI: () => void;
  unreadCount: number;
  userName: string;
  isHyperAdmin: boolean;
}

export const ModuleSidebar: React.FC<ModuleSidebarProps> = ({
  moduleName,
  moduleColor,
  navigation,
  isCollapsed,
  onToggleCollapse,
  onOpenSearch,
  onOpenCreate,
  onOpenNotifications,
  onOpenAI,
  unreadCount,
  userName,
  isHyperAdmin
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    window.location.href = '/';
  };

  return (
    <motion.aside
      className="ao-sidebar"
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 1. BRANDING (Alliance One Logo) */}
      <div className="ao-sidebar-brand" onClick={() => navigate('/app')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AllianceLogo size={32} color="var(--ao-elegant-primary, #163a2a)" />
        </div>
        {!isCollapsed && (
          <span className="ao-brand-text" style={{ fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)", fontSize: '18px', fontWeight: 700, color: 'var(--ao-elegant-text-main)', letterSpacing: '-0.02em', margin: 0 }}>
            Alliance One
          </span>
        )}
      </div>

      {/* 2. MODULE CONTEXT */}
      <div className="ao-sidebar-header">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key="expanded-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="ao-module-identity"
              style={{ flex: 1 }}
            >
              <div className="ao-module-dot" style={{ backgroundColor: moduleColor }} />
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ao-elegant-text-main)', fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)" }}>
                {moduleName}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={onToggleCollapse}
          className="ao-sidebar-collapse-btn"
          style={{
            marginLeft: isCollapsed ? 'auto' : 0, marginRight: isCollapsed ? 'auto' : 0
          }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* 3. NAVIGATION */}
      <nav className="ao-sidebar-nav">
        {navigation.map((sec, idx) => (
          <div key={idx} className="ao-sidebar-section">
            {!isCollapsed && (
              <div className="ao-sidebar-section-title" style={{ fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)", letterSpacing: '0.08em', fontSize: '11px', fontWeight: 700, color: 'var(--ao-elegant-text-muted)', marginBottom: '8px' }}>
                {sec.section}
              </div>
            )}
            <div className="ao-sidebar-section-items">
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path.split('/').length === 3}
                    className={({ isActive }) => `ao-sidebar-link ${isActive ? 'active' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                    style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                  >
                    <Icon size={18} style={{ flexShrink: 0 }} />
                    {!isCollapsed && (
                      <>
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="ao-sidebar-badge">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

    <div className="ao-sidebar-footer" style={{ borderTop: '1px solid var(--ao-elegant-border)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0 }}>
        {!isCollapsed ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)", fontSize: '11px', fontWeight: 700, color: 'var(--ao-elegant-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 4px', marginBottom: '4px' }}>
                Assistance & Confiance
              </div>
              <NavLink to="/app/help" className="ao-sidebar-link" style={{ padding: '8px 12px', fontSize: '13px' }}>
                <LifeBuoy size={16} />
                <span>Centre d'assistance</span>
              </NavLink>
            </div>

            <NavLink to="/app/confiance" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', textDecoration: 'none' }}>
              <div style={{ color: '#10b981', background: '#d1fae5', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Plateforme Sécurisée</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Chiffrement 256-bit</span>
              </div>
            </NavLink>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 4px', marginTop: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)' }} />
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Tous les systèmes opérationnels</span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <NavLink to="/app/help" className="ao-sidebar-link" style={{ padding: '8px', justifyContent: 'center' }} title="Centre d'assistance">
              <LifeBuoy size={18} />
            </NavLink>
            <NavLink to="/app/confiance" style={{ color: '#10b981', background: '#d1fae5', padding: '8px', borderRadius: '8px', display: 'flex' }} title="Plateforme Sécurisée">
              <ShieldCheck size={18} />
            </NavLink>
          </div>
        )}
      </div>

    </motion.aside>
  );
};
