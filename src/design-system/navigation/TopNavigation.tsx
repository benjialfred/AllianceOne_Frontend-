import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Plus, Bell, ChevronDown, Compass, Box, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  return (
    <header className="ao-top-nav">
      <div className="ao-nav-left">
        <button className="ao-brand-btn">
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

        <button className="ao-brand-btn" style={{ marginLeft: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: isHyperAdmin ? 'var(--ao-color-alliance-blue)' : 'var(--ao-color-bg-tertiary)',
            color: isHyperAdmin ? '#fff' : 'var(--ao-color-text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 600
          }}>
            {userName.charAt(0)}
          </div>
        </button>
      </div>
    </header>
  );
};
