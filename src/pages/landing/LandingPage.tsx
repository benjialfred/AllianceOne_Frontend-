/**
 * ALLIANCE ONE — PUBLIC HOMEPAGE (Iteration 02)
 */
import React, { useState } from 'react';
import { PublicHeader } from './components/PublicHeader';
import { HeroInfrastructure } from './components/HeroInfrastructure';
import { EcosystemExplorer } from './components/EcosystemExplorer';
import { AllianceAISection } from './components/AllianceAISection';
import { FounderAndFooter } from './components/FounderAndFooter';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingAIWidget } from '../../workspace/ai/components/FloatingAIWidget';
import { PublicAICopilot } from './components/PublicAICopilot';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="landing-page">
      {/* HEADER & MEGA MENUS */}
      <PublicHeader />

      {/* HERO INFRASTRUCTURE */}
      <HeroInfrastructure />



      {/* ECOSYSTEM EXPLORER (ITERATION 04) */}
      <EcosystemExplorer />

      {/* STORYTELLING SECTIONS (AI) */}
      <AllianceAISection />

      {/* FOUNDER, FINAL CTA & FOOTER */}
      <FounderAndFooter />

      {/* AI ASSISTANT WIDGET */}
      {!isAIOpen && <FloatingAIWidget onClick={() => setIsAIOpen(true)} />}
      <PublicAICopilot isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};
