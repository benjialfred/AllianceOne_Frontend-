import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Grid, Bell, Settings, LogOut, ArrowRight, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlatformStore } from '../../core/stores/platformStore';

export const GlobalMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const workspaces = usePlatformStore((s) => s.workspaces);
  const currentOrganization = usePlatformStore((s) => s.currentOrganization);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const logout = () => {
    setIsOpen(false);
    usePlatformStore.setState({ currentOrganization: null });
    navigate('/');
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-primary)',
          borderRadius: 'var(--radius-md)'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '0.5rem',
              width: '280px',
              backgroundColor: 'var(--color-surface-card)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-surface-border)',
              zIndex: 1000,
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>Alliance One OS</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Espace Actif : {currentOrganization?.name || 'Aucun'}</div>
            </div>

            <div style={{ padding: '0.5rem' }}>
              <MenuItem icon={Grid} label="Mon Espace (Modules)" onClick={() => handleNavigation('/')} />
              <MenuItem icon={Bell} label="Notifications" onClick={() => {}} badge="3" />
              <MenuItem icon={Settings} label="Paramètres du compte" onClick={() => handleNavigation('/settings')} />
            </div>

            {workspaces.length > 0 && (
              <>
                <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Écoles (Workspaces)
                </div>
                <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
                  {workspaces.map(ws => (
                    <MenuItem key={ws.id} icon={Building} label={ws.name} onClick={() => {}} isActive={ws.id === currentOrganization?.id} />
                  ))}
                </div>
              </>
            )}

            <div style={{ padding: '0.5rem', borderTop: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)' }}>
              <MenuItem icon={LogOut} label="Déconnexion" onClick={logout} variant="danger" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  badge?: string;
  isActive?: boolean;
  variant?: 'default' | 'danger';
}

const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, onClick, badge, isActive, variant = 'default' }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 0.75rem',
        border: 'none',
        background: isActive ? 'var(--color-primary-50)' : 'transparent',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        color: variant === 'danger' ? 'var(--color-error)' : (isActive ? 'var(--color-accent-600)' : 'var(--color-text-secondary)'),
        fontWeight: isActive ? 600 : 500,
        fontSize: '0.875rem',
        textAlign: 'left',
        transition: 'background 0.2s ease',
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = variant === 'danger' ? 'var(--color-error-bg)' : 'var(--color-surface-hover)'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = isActive ? 'var(--color-primary-50)' : 'transparent'}
    >
      <Icon size={16} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{ backgroundColor: 'var(--color-error)', color: 'white', padding: '2px 6px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
          {badge}
        </span>
      )}
    </button>
  );
};
