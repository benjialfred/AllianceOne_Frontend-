/**
 * ALLIANCE ONE — PUBLIC HOMEPAGE (Iteration 02)
 */
import React, { useState } from 'react';
import { PublicHeader } from './components/PublicHeader';
import { HeroInfrastructure } from './components/HeroInfrastructure';
import { EcosystemExplorer } from './components/EcosystemExplorer';
import { AllianceAISection } from './components/AllianceAISection';
import { WaveDivider } from './components/WaveDivider';
import { FounderAndFooter } from './components/FounderAndFooter';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingAIWidget } from '../../workspace/ai/components/FloatingAIWidget';
import { PublicAICopilot } from './components/PublicAICopilot';
import { useMarketingStore } from '../../core/stores/marketingStore';
import { SEO } from '../../core/components/SEO';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const showModal = useMarketingStore((s) => s.showModal);

  React.useEffect(() => {
    // Show marketing modal after 8 seconds
    const timer = setTimeout(() => {
      showModal({
        type: 'newsletter',
        title: 'Rejoignez la communauté',
        description: "Recevez nos dernières actualités, nos conseils d'intégration et un accès anticipé à nos nouvelles fonctionnalités.",
        primaryActionText: 'Rejoindre la liste VIP',
      });
    }, 8000);
    return () => clearTimeout(timer);
  }, [showModal]);

  return (
    <div className="landing-page">
      <SEO 
        title="L'OS de votre entreprise" 
        description="Alliance One est le système nerveux central des organisations de demain. Découvrez l'écosystème cloud intégré." 
      />
      {/* HEADER & MEGA MENUS */}
      <PublicHeader />

      {/* HERO INFRASTRUCTURE */}
      <HeroInfrastructure />



      {/* WAVE TRANSITION (Dark to Slightly Dark) */}
      <div className="relative">
        <WaveDivider position="bottom" color="#050505" />
      </div>

      {/* ECOSYSTEM EXPLORER (ITERATION 04) */}
      <EcosystemExplorer />

      {/* WAVE TRANSITION (Slightly Dark to Dark) */}
      <div className="relative bg-[#050505]">
        <WaveDivider position="bottom" color="#000000" />
      </div>

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
