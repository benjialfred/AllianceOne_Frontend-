import React from 'react';
import { WelcomeHeader } from './components/WelcomeHeader';
import { ModulesSpaces } from './components/ModulesSpaces';
import { IntelligentActions } from './components/IntelligentActions';
import { AllianceIntelligence } from './components/AllianceIntelligence';
import { UniversalTimeline } from './components/UniversalTimeline';
import './AllianceHub.css'; // New styles

interface AllianceHubProps {
  onOpenCreate: () => void;
  onOpenSearch: () => void;
}

export const AllianceHub: React.FC<AllianceHubProps> = () => {
  return (
    <div className="ao-hub-root">
      <div className="ao-hub-container">
        
        {/* Welcome Section */}
        <WelcomeHeader />

        {/* Main Hub Split Layout */}
        <div className="ao-hub-split">
          
          {/* Left Column: Operations & Modules */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ao-space-12)' }}>
            <ModulesSpaces />
            <IntelligentActions />
          </div>

          {/* Right Column: Intelligence & Activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ao-space-12)' }}>
            <AllianceIntelligence />
            <UniversalTimeline />
          </div>

        </div>
      </div>
    </div>
  );
};
