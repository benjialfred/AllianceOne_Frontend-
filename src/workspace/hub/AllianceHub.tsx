/**
 * ALLIANCE HUB V2 — LE COCKPIT DU BUSINESS OPERATING SYSTEM
 * Architecture Spatiale : Contexte → Intelligence & Alertes → Applications OS → Activité & Story → Écosystème.
 */
import React from 'react';
import { HeroCockpit } from './components/HeroCockpit';
import { MyApplicationsGrid } from './components/MyApplicationsGrid';
import { SpatialActivityAndStory } from './components/SpatialActivityAndStory';
import { EcosystemDiscoverySection } from './components/EcosystemDiscoverySection';
import './AllianceHub.css';

interface AllianceHubProps {
  onOpenCreate: () => void;
  onOpenSearch: () => void;
}

export const AllianceHub: React.FC<AllianceHubProps> = ({ onOpenCreate, onOpenSearch }) => {
  return (
    <div className="alliance-spatial-hub-root">
      {/* 1. Contexte, État de Santé et Commandes "À traiter maintenant" */}
      <HeroCockpit />

      <div className="alliance-spatial-container">
        {/* 2. Applications Métier Installées (OS App Tiles avec transition cinématique) */}
        <MyApplicationsGrid />

        {/* 3. Flux d'Activité Universel + Product Story Cinématique en double colonne */}
        <SpatialActivityAndStory />

        {/* 4. Écosystème & Extensions de la Plateforme */}
        <EcosystemDiscoverySection />
      </div>
    </div>
  );
};
