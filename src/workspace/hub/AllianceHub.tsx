/**
 * ALLIANCE HUB — ENTERPRISE DASHBOARD
 * Clean, professional, and elegant starting point for the user.
 */
import React from 'react';
import { HeroCockpit } from './components/HeroCockpit';
import { MyApplicationsGrid } from './components/MyApplicationsGrid';
import { ActivityStream } from './components/ActivityStream';
import './AllianceHub.css';

interface AllianceHubProps {
  onOpenCreate: () => void;
  onOpenSearch: () => void;
}

export const AllianceHub: React.FC<AllianceHubProps> = ({ onOpenCreate, onOpenSearch }) => {
  return (
    <div className="ent-hub-root">
      {/* Top Section: Greeting and High-Level Metrics */}
      <HeroCockpit onOpenCreate={onOpenCreate} />

      <div className="ent-hub-container">
        <div className="ent-hub-grid">
          {/* Main Column: Applications */}
          <div className="ent-hub-main">
            <MyApplicationsGrid />
          </div>

          {/* Side Column: Recent Activity */}
          <div className="ent-hub-sidebar">
            <ActivityStream />
          </div>
        </div>
      </div>
    </div>
  );
};
