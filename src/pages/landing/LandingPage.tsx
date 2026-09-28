/**
 * ALLIANCE ONE — PUBLIC HOMEPAGE (Iteration 02)
 */
import React from 'react';
import { PublicHeader } from './components/PublicHeader';
import { HeroInfrastructure } from './components/HeroInfrastructure';
import { EcosystemExplorer } from './components/EcosystemExplorer';
import { AllianceAISection } from './components/AllianceAISection';
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

      {/* FOUNDER & FINAL CTA */}
      <section className="story-section bg-graphite text-white">
        <div className="section-inner split-layout">
          <div>
            <span className="micro-label text-champagne mb-4 block">LE FONDATEUR</span>
            <h2 className="section-title text-white">Adzessa Benjamin Fraide</h2>
            <p className="text-gray-400 mb-2 font-sans font-bold">Founder • Software Engineer • Product Builder</p>
            <p className="section-desc text-gray-400">
              Construire l'infrastructure technologique de demain, pensée depuis l'Afrique pour 
              les organisations du monde entier.
            </p>
            <button className="ao-btn-ghost text-white mt-8" style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '6px' }} onClick={() => navigate('/founder')}>
              Découvrir le profil complet
            </button>
          </div>

          <div className="bg-deep-navy p-12 rounded-xl text-center flex flex-col justify-center items-center">
            <h3 className="text-3xl font-bold mb-4 font-display">Prêt pour un nouveau standard ?</h3>
            <p className="text-gray-400 mb-8 font-sans">Entrez dans l'écosystème Alliance One.</p>
            <button className="ao-btn-primary flex items-center gap-2" onClick={() => navigate('/register')}>
              Découvrir Alliance One <ArrowRight size={16}/>
            </button>
          </div>
        </div>
      </section>
      
      {/* INSTITUTIONAL FOOTER */}
      <footer className="bg-ivory" style={{ padding: '80px 32px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="section-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="font-display font-bold text-lg mb-4">ALLIANCE ONE</div>
            <div className="text-sm text-gray-500 font-sans max-w-xs">
              Operating Infrastructure for Modern Organizations. Built in Africa. Designed for the world.
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '64px' }}>
            <div className="flex flex-col gap-4">
              <span className="micro-label">PLATFORM</span>
              <a className="text-sm text-gray-600 cursor-pointer hover:text-alliance-blue">Modules</a>
              <a className="text-sm text-gray-600 cursor-pointer hover:text-alliance-blue">Alliance AI</a>
              <a className="text-sm text-gray-600 cursor-pointer hover:text-alliance-blue">Tarifs</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="micro-label">COMPANY</span>
              <a className="text-sm text-gray-600 cursor-pointer hover:text-alliance-blue">À propos</a>
              <a className="text-sm text-gray-600 cursor-pointer hover:text-alliance-blue">Fondateur</a>
              <a className="text-sm text-gray-600 cursor-pointer hover:text-alliance-blue">Contact</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="micro-label">LEGAL</span>
              <a className="text-sm text-gray-600 cursor-pointer hover:text-alliance-blue">Confidentialité</a>
              <a className="text-sm text-gray-600 cursor-pointer hover:text-alliance-blue">Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
