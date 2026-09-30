import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Search, 
  Plus, 
  Bell, 
  Menu, 
  X, 
  BrainCircuit,
  LogOut,
  Settings
} from 'lucide-react';
import type { NavSection } from './ModuleSidebar';
import { useAuthStore } from '../../core/stores/authStore';
import './MobileNavigation.css';

interface MobileNavigationProps {
  navigation?: NavSection[];
  onOpenSearch: () => void;
  onOpenCreate: () => void;
  onOpenNotifications: () => void;
  onOpenAI: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  navigation,
  onOpenSearch,
  onOpenCreate,
  onOpenNotifications,
  onOpenAI
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Bottom Tab Bar */}
      <div className="ao-mobile-bottom-nav">
        <button className="ao-mobile-tab" onClick={() => navigate('/app')}>
          <Home size={22} />
          <span>Hub</span>
        </button>
        <button className="ao-mobile-tab" onClick={onOpenSearch}>
          <Search size={22} />
          <span>Recherche</span>
        </button>
        
        {/* Floating Action Button (Center) */}
        <div className="ao-mobile-fab-container">
          <button className="ao-mobile-fab" onClick={onOpenCreate}>
            <Plus size={24} color="#fff" />
          </button>
        </div>

        <button className="ao-mobile-tab" onClick={onOpenAI}>
          <BrainCircuit size={22} />
          <span>IA</span>
        </button>
        <button className="ao-mobile-tab" onClick={() => setIsMenuOpen(true)}>
          <Menu size={22} />
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Menu Bottom Sheet */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              className="ao-mobile-sheet-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              className="ao-mobile-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="ao-mobile-sheet-header">
                <div className="ao-mobile-sheet-drag"></div>
                <div className="ao-mobile-sheet-title">Menu de navigation</div>
                <button className="ao-mobile-sheet-close" onClick={() => setIsMenuOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="ao-mobile-sheet-content">
                {/* User Profile Summary */}
                <div className="ao-mobile-profile">
                  <div className="ao-mobile-avatar">
                    {user?.first_name?.charAt(0) || 'U'}
                  </div>
                  <div className="ao-mobile-profile-info">
                    <span className="ao-mobile-name">{user?.first_name} {user?.last_name}</span>
                    <span className="ao-mobile-email">{user?.email}</span>
                  </div>
                </div>

                {/* Dynamic Module Navigation */}
                {navigation && navigation.map((section, idx) => (
                  <div key={idx} className="ao-mobile-nav-section">
                    <h3 className="ao-mobile-nav-section-title">{section.section}</h3>
                    <div className="ao-mobile-nav-items">
                      {section.items.map((item, itemIdx) => {
                        const Icon = item.icon;
                        return (
                          <NavLink 
                            key={itemIdx} 
                            to={item.path} 
                            className={({ isActive }) => `ao-mobile-nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Icon size={18} />
                            <span>{item.label}</span>
                            {item.badge && <span className="ao-mobile-badge">{item.badge}</span>}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* System Actions */}
                <div className="ao-mobile-nav-section">
                  <h3 className="ao-mobile-nav-section-title">SYSTÈME</h3>
                  <div className="ao-mobile-nav-items">
                    <button className="ao-mobile-nav-item" onClick={onOpenNotifications}>
                      <Bell size={18} />
                      <span>Notifications</span>
                    </button>
                    <button className="ao-mobile-nav-item" onClick={() => navigate('/app/settings')}>
                      <Settings size={18} />
                      <span>Paramètres</span>
                    </button>
                    <button className="ao-mobile-nav-item text-red-500" onClick={handleLogout}>
                      <LogOut size={18} />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
                
                {/* Extra padding for scrolling past fab */}
                <div style={{ height: '40px' }}></div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
