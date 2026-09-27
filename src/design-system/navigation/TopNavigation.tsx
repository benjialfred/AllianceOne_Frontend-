import React, { useState } from 'react';
import { Search, Plus, ChevronDown, Settings, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../core/stores/authStore';

export interface TopNavigationProps {
  onOpenSearch: () => void;
  onOpenCreate: () => void;
  userName?: string;
  isHyperAdmin?: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onOpenSearch,
  onOpenCreate,
  isHyperAdmin = false
}) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const displayName = user?.first_name || 'Utilisateur';

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="ao-top-header">
      <div className="ao-top-center">
        <button className="ao-search-bar" onClick={onOpenSearch}>
          <Search size={14} color="#94a3b8" />
          <span>Rechercher une personne, un module, une pièce...</span>
          <kbd>⌘K</kbd>
        </button>
      </div>

      <div className="ao-top-right">
        <button className="ao-create-btn" onClick={onOpenCreate}>
          <Plus size={14} />
          <span>Créer</span>
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            className="ao-profile-dropdown" 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{ 
              background: isProfileOpen ? 'var(--ao-elegant-bg)' : 'transparent',
              borderColor: isProfileOpen ? 'var(--ao-elegant-border)' : 'transparent'
            }}
          >
            <div className="ao-profile-avatar" style={{ overflow: 'hidden' }}>
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="ao-profile-info">
              <span className="ao-profile-name">{displayName}</span>
              <span className="ao-profile-role">{isHyperAdmin ? 'Administrateur' : 'Directeur'}</span>
            </div>
            <ChevronDown 
              size={14} 
              color="#94a3b8" 
              style={{ 
                transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} 
            />
          </button>

          {/* DROPDOWN MENU */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '240px',
                  background: 'var(--ao-elegant-surface)',
                  border: '1px solid var(--ao-elegant-border)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                  zIndex: 50,
                  padding: '8px'
                }}
              >
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--ao-elegant-border)', marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ao-elegant-text-main)' }}>{user?.first_name} {user?.last_name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ao-elegant-text-muted)' }}>{user?.email}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button onClick={() => { setIsProfileOpen(false); navigate('/app/settings'); }} className="ao-dropdown-item">
                    <Settings size={16} />
                    <span>Paramètres du compte</span>
                  </button>
                  <button onClick={() => { setIsProfileOpen(false); /* notifications logic */ }} className="ao-dropdown-item">
                    <Bell size={16} />
                    <span>Notifications</span>
                  </button>
                </div>

                <div style={{ margin: '8px -8px', borderTop: '1px solid var(--ao-elegant-border)' }} />

                <button onClick={handleLogout} className="ao-dropdown-item ao-dropdown-item-danger">
                  <LogOut size={16} />
                  <span>Se déconnecter</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
