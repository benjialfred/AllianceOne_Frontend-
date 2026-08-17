/**
 * ALLIANCE HUB — COCKPIT CENTRAL DU BUSINESS OPERATING SYSTEM
 * La porte d'entrée unifiée d'Alliance One.
 */
import React from 'react';
import { HeroCockpit } from './components/HeroCockpit';
import { SmartOnboarding } from './components/SmartOnboarding';
import { MyApplicationsGrid } from './components/MyApplicationsGrid';
import { UniversalActivityStream } from './components/UniversalActivityStream';
import { ProductStories } from './components/ProductStories';
import { DeveloperShowcase } from './components/DeveloperShowcase';
import { StudioServicesShowcase } from './components/StudioServicesShowcase';
import './AllianceHub.css';

interface AllianceHubProps {
  onOpenCreate: () => void;
  onOpenSearch: () => void;
}

export const AllianceHub: React.FC<AllianceHubProps> = ({ onOpenCreate, onOpenSearch }) => {
  return (
    <div className="alliance-hub-root">
      {/* 1. Hero Cockpit & Telemetry */}
      <HeroCockpit onOpenCreate={onOpenCreate} />

      <div className="alliance-hub-body-container">
        {/* 2. Smart Onboarding & Interactive Tips */}
        <SmartOnboarding />

        {/* 3. My Installed Business Modules */}
        <MyApplicationsGrid />

        {/* 4. Universal Activity Stream */}
        <UniversalActivityStream />

        {/* 5. Cinematic Product Stories */}
        <ProductStories />

        {/* 6. Developer Platform Spotlight */}
        <DeveloperShowcase />

        {/* 7. Alliance Studio & Services Portfolio */}
        <StudioServicesShowcase />
      </div>
    </div>
  );
};
