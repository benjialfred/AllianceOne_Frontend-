import React from 'react';
import { usePlatformStore } from '../../core/stores/platformStore';
import { useAuthStore } from '../../core/stores/authStore';
import { ModuleSidebar } from './ModuleSidebar';
import type { NavSection } from './ModuleSidebar';
import { TopNavigation } from './TopNavigation';
import { FloatingAIWidget } from '../../workspace/ai/components/FloatingAIWidget';
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
  const userName = user ? `${user.first_name} ${user.last_name}` : 'Benjamin Carter';
  
  const hasSidebar = !!activeModuleNav && activeModuleNav.length > 0;

  return (
    <div className="ao-shell">
      <div className="ao-workspace">
        {hasSidebar && (
          <ModuleSidebar 
            moduleName={activeModuleName || ''}
            moduleColor={activeModuleColor || '#4f46e5'}
            navigation={activeModuleNav}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
            // Passing down tools
            onOpenSearch={onOpenSearch}
            onOpenCreate={onOpenCreate}
            onOpenNotifications={onOpenNotifications}
            onOpenAI={onOpenAI}
            unreadCount={3}
            userName={userName}
            isHyperAdmin={isHyperAdmin}
          />
        )}
        
        <main className="ao-viewport">
          <TopNavigation 
            onOpenSearch={onOpenSearch}
            onOpenCreate={onOpenCreate}
            userName={userName}
            isHyperAdmin={isHyperAdmin}
          />
          {children}
        </main>

        <FloatingAIWidget onClick={onOpenAI} />
      </div>
    </div>
  );
};
