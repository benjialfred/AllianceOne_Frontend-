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

      {/* FIRST TRANSITION (CONCEPTUAL) */}
      <section className="transition-section relative overflow-hidden">
        {/* Deep fade gradient from black to ivory */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-ivory -z-10"></div>
        
        <motion.div 
          className="section-inner text-center relative z-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          style={{ padding: '160px 24px 120px' }}
        >
          <span className="micro-label mb-6 block">THE NEW STANDARD</span>
          <h2 className="font-sans" style={{ fontSize: '48px', fontWeight: 800, color: 'var(--ao-graphite)', letterSpacing: '-0.04em', lineHeight: '1.1' }}>
            Organizations are becoming more connected.
          </h2>
          <p className="font-sans mx-auto mt-6" style={{ fontSize: '20px', color: 'var(--ao-text-secondary)', maxWidth: '640px', lineHeight: '1.6' }}>
            Yet, the software they use remains fragmented, isolated, and inefficient. 
            It is time for a unified approach.
          </p>
        </motion.div>
      </section>

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
