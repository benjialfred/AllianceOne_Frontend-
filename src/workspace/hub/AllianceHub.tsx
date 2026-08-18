/**
 * ALLIANCE OS — HUB ROOT
 * The entry point of the Business Operating System.
 */
import React from 'react';
import { WelcomeHeader } from './components/WelcomeHeader';
import { HeroOperational } from './components/HeroOperational';
import { ModulesSpaces } from './components/ModulesSpaces';
import { IntelligentActions } from './components/IntelligentActions';
import { AllianceIntelligence } from './components/AllianceIntelligence';
import { UniversalTimeline } from './components/UniversalTimeline';
import './OsHub.css';

interface AllianceHubProps {
  onOpenCreate: () => void;
  onOpenSearch: () => void;
}

export const AllianceHub: React.FC<AllianceHubProps> = () => {
  return (
    <div className="os-hub-root">
      <div className="os-hub-container">
        
        {/* Top: Welcome & Hero */}
        <div>
          <WelcomeHeader />
          <HeroOperational />
        </div>

        {/* Main OS Layout Split */}
        <div className="os-split-layout">
          
          {/* LEFT COLUMN: Operations & Modules */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <ModulesSpaces />
            <IntelligentActions />
          </div>

          {/* RIGHT COLUMN: Intelligence & Activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <AllianceIntelligence />
            <UniversalTimeline />
          </div>

        </div>
        
      </div>
    </div>
  );
};
