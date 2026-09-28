/**
 * ALLIANCE ONE — PUBLIC HOMEPAGE (Iteration 02)
 */
import React from 'react';
import { PublicHeader } from './components/PublicHeader';
import { HeroInfrastructure } from './components/HeroInfrastructure';
import { EcosystemExplorer } from './components/EcosystemExplorer';
import { AllianceAISection } from './components/AllianceAISection';
import { FounderAndFooter } from './components/FounderAndFooter';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* HEADER & MEGA MENUS */}
      <PublicHeader />

      {/* HERO INFRASTRUCTURE */}
      <HeroInfrastructure />

      {/* FIRST TRANSITION (CONCEPTUAL) */}
      <section className="transition-section bg-ivory">
        <motion.div 
          className="section-inner text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          style={{ padding: '120px 0' }}
        >
          <span className="micro-label mb-6 block">THE NEW STANDARD</span>
          <h2 className="font-display" style={{ fontSize: '40px', fontWeight: 800, color: 'var(--ao-graphite)' }}>
            Organizations are becoming more connected.
          </h2>
          <p className="font-sans" style={{ fontSize: '18px', color: 'var(--ao-text-secondary)', maxWidth: '600px', margin: '24px auto 0' }}>
            Yet, the software they use remains fragmented, isolated, and inefficient. 
            It is time for a unified approach.
          </p>
        </motion.div>
      </section>

      {/* ECOSYSTEM EXPLORER (ITERATION 03) */}
      <EcosystemExplorer />

      {/* STORYTELLING SECTIONS (AI) */}
      <AllianceAISection />

      {/* FOUNDER, FINAL CTA & FOOTER */}
      <FounderAndFooter />
    </div>
  );
};
