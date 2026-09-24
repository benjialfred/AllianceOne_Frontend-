import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Plus, Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../core/stores/authStore';

export interface TopNavigationProps {
  onOpenSearch: () => void;
  onOpenCreate: () => void;
  onOpenNotifications: () => void;
  onOpenAI: () => void;
  unreadCount?: number;
  userName?: string;
  isHyperAdmin?: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onOpenSearch,
  onOpenCreate,
  onOpenNotifications,
  onOpenAI,
  unreadCount = 0,
  userName = 'User',
  isHyperAdmin = false
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  // Close dropdown when clicking outside
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
    navigate('/login');
  };

  return (
    <header className="ao-top-nav">
      <div className="ao-nav-left">
        <button className="ao-brand-btn" onClick={() => navigate('/app')}>
          <div style={{ width: 16, height: 16, background: 'var(--ao-color-alliance-blue)', borderRadius: 2 }} />
          <span className="ao-brand-text">Alliance One</span>
        </button>

        {/* Global Nav Links (Very subtle) */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <NavLink to="/app" end className={({ isActive }) => `ao-sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '4px 8px', fontSize: '12px' }}>
            Hub
          </NavLink>
          <NavLink to="/app/marketplace" className={({ isActive }) => `ao-sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '4px 8px', fontSize: '12px' }}>
            Marketplace
          </NavLink>
        </div>
      </div>

      <div className="ao-nav-center">
        <button className="ao-nav-tool-btn" onClick={onOpenSearch}>
          <Search size={14} />
          <span>Recherche globale...</span>
          <kbd>⌘K</kbd>
        </button>
      </div>

      <div className="ao-nav-right">
        <button className="ao-nav-tool-btn ao-ai-trigger" onClick={onOpenAI}>
          <Zap size={14} fill="currentColor" />
          <span>Alliance AI</span>
          <kbd style={{ background: 'transparent', color: 'inherit' }}>⌘J</kbd>
        </button>

        <button className="ao-universal-create" onClick={onOpenCreate} title="Universal Create">
          <Plus size={16} />
        </button>

        <div style={{ width: 1, height: 16, background: 'var(--ao-color-border-default)', margin: '0 8px' }} />

        <button className="ao-brand-btn" onClick={onOpenNotifications} style={{ position: 'relative' }}>
          <Bell size={16} color="var(--ao-color-text-secondary)" />
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute', top: -2, right: -2,
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--ao-color-danger-text)',
              border: '2px solid var(--ao-color-bg-surface)'
            }} />
          )}
        </button>

        <div style={{ position: 'relative', marginLeft: 8 }} ref={dropdownRef}>
          <button 
            className="ao-brand-btn" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ 
              background: isHyperAdmin ? 'rgba(11, 43, 92, 0.1)' : 'transparent',
              padding: '4px 8px', borderRadius: '20px', gap: '8px'
            }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: isHyperAdmin ? 'var(--ao-color-alliance-blue)' : 'var(--ao-color-bg-tertiary)',
              color: isHyperAdmin ? '#fff' : 'var(--ao-color-text-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 600
            }}>
              {userName.charAt(0)}
            </div>
            <ChevronDown size={14} color="var(--ao-color-text-secondary)" />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 200, background: '#fff', borderRadius: 8,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
                  padding: 8, zIndex: 1000
                }}
              >
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--ao-color-border-subtle)', marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ao-color-text-primary)' }}>{userName}</div>
                  <div style={{ fontSize: 11, color: 'var(--ao-color-text-secondary)' }}>{isHyperAdmin ? 'Administrateur Système' : 'Utilisateur'}</div>
                </div>

                <button 
                  onClick={() => { setDropdownOpen(false); navigate('/app/settings'); }}
                  style={{ 
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10, 
                    padding: '8px 12px', background: 'transparent', border: 'none', 
                    cursor: 'pointer', fontSize: 13, color: 'var(--ao-color-text-primary)',
                    borderRadius: 4, textAlign: 'left'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'var(--ao-color-bg-secondary)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Settings size={16} /> Mon Profil
                </button>
                
                <button 
                  onClick={handleLogout}
                  style={{ 
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10, 
                    padding: '8px 12px', background: 'transparent', border: 'none', 
                    cursor: 'pointer', fontSize: 13, color: 'var(--ao-color-danger-text)',
                    borderRadius: 4, textAlign: 'left'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'var(--ao-color-bg-secondary)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={16} /> Se déconnecter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
