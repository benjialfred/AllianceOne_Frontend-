import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePlatformStore } from '../../core/stores/platformStore';
import { useAuthStore } from '../../core/stores/authStore';
import { TopNavigation } from './TopNavigation';
import { ModuleSidebar } from './ModuleSidebar';
import type { NavSection } from './ModuleSidebar';
import './AllianceShell.css';

export interface AllianceShellProps {
  children: React.ReactNode;
  
  // Modal triggers
  onOpenSearch: () => void;
  onOpenCreate: () => void;
  onOpenNotifications: () => void;
  onOpenAI: () => void;
  
  // Navigation config
  activeModuleNav?: NavSection[];
  activeModuleName?: string;
  activeModuleColor?: string;
}

export const AllianceShell: React.FC<AllianceShellProps> = ({
  children,
  onOpenSearch,
  onOpenCreate,
  onOpenNotifications,
  onOpenAI,
  activeModuleNav,
  activeModuleName,
  activeModuleColor
}) => {
  const sidebarCollapsed = usePlatformStore((s) => s.sidebarCollapsed);
  const toggleSidebar = usePlatformStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const isHyperAdmin = user?.is_hyperadmin || user?.roles?.includes('HYPERADMIN') || false;
  const userName = user ? `${user.first_name} ${user.last_name}` : 'A';
  
  const hasSidebar = !!activeModuleNav && activeModuleNav.length > 0;

  return (
    <div className="ao-shell">
      <TopNavigation 
        onOpenSearch={onOpenSearch}
        onOpenCreate={onOpenCreate}
        onOpenNotifications={onOpenNotifications}
        onOpenAI={onOpenAI}
        unreadCount={3} // Mocked for now
        userName={userName}
        isHyperAdmin={isHyperAdmin}
      />
      
      <div className="ao-workspace">
        {hasSidebar && (
          <ModuleSidebar 
            moduleName={activeModuleName || ''}
            moduleColor={activeModuleColor || '#4f46e5'}
            navigation={activeModuleNav}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        )}
        
        <main className="ao-viewport">
          {children}
        </main>
      </div>
    </div>
  );
};
