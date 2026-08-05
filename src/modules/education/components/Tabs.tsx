import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTabId, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0].id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (onChange) onChange(id);
  };

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Tab Headers */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid var(--border-subtle)',
        overflowX: 'auto',
        gap: 'var(--space-6)'
      }}>
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) 0',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${isActive ? 'var(--color-accent)' : 'transparent'}`,
                color: isActive ? 'var(--color-accent)' : 'var(--text-secondary)',
                fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-medium)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e: any) => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseOut={(e: any) => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {Icon && <Icon size={16} />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div style={{ paddingTop: 'var(--space-6)' }}>
        {currentTab.content}
      </div>
    </div>
  );
};
