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
      <section className="transition-section relative overflow-hidden bg-black text-white">
        {/* Subtle grid in background */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}></div>
        
        <motion.div 
          className="section-inner text-center relative z-20 mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          style={{ padding: '160px 24px 120px', maxWidth: '800px' }}
        >
          <span className="micro-label mb-6 block text-alliance-blue">THE NEW STANDARD</span>
          <h2 className="font-sans" style={{ fontSize: '56px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.04em', lineHeight: '1.1' }}>
            Organizations are becoming <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.3)', backgroundImage: 'linear-gradient(90deg, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>more connected.</span>
          </h2>
          <p className="font-sans mx-auto mt-6" style={{ fontSize: '20px', color: '#a1a1aa', maxWidth: '640px', lineHeight: '1.6' }}>
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
