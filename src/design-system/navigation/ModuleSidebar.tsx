import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
}

export const ModuleSidebar: React.FC<ModuleSidebarProps> = ({
  moduleName,
  moduleColor,
  navigation,
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <motion.aside
      className="ao-sidebar"
      initial={false}
      animate={{ width: isCollapsed ? 64 : 260 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
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
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ao-color-text-primary)' }}>
                {moduleName}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={onToggleCollapse}
          style={{ 
            background: 'transparent', border: 'none', cursor: 'pointer', 
            color: 'var(--ao-color-text-tertiary)', padding: 4, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', borderRadius: 4,
            marginLeft: isCollapsed ? 'auto' : 0, marginRight: isCollapsed ? 'auto' : 0
          }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="ao-sidebar-nav">
        {navigation.map((sec, idx) => (
          <div key={idx} className="ao-sidebar-section">
            {!isCollapsed && (
              <div className="ao-t-micro" style={{ padding: '4px 8px' }}>
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
                    end={item.path.split('/').length === 3} // Exact match for root module paths
                    className={({ isActive }) => `ao-sidebar-link ${isActive ? 'active' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                    style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '8px' : '6px 8px' }}
                  >
                    <Icon size={16} style={{ flexShrink: 0 }} />
                    {!isCollapsed && (
                      <>
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <span style={{ 
                            fontSize: '10px', fontWeight: 600, 
                            background: 'var(--ao-color-bg-tertiary)', color: 'var(--ao-color-text-secondary)', 
                            padding: '1px 6px', borderRadius: '10px' 
                          }}>
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
    </motion.aside>
  );
};

// Simple AnimatePresence import fix
import { AnimatePresence as FramerAnimatePresence } from 'framer-motion';
const AnimatePresence = FramerAnimatePresence;
