/**
 * ALLIANCE ONE — PUBLIC HOMEPAGE (INFRASTRUCTURE VERSION)
 * Full architectural direction.
 */
import React from 'react';
import { PublicHeader } from './components/PublicHeader';
import { HeroInfrastructure } from './components/HeroInfrastructure';
import { SectionProblem, SectionInfrastructure, SectionEcosystem, SectionOneData, SectionAllianceAI, SectionDevelopersOrigin } from './components/LandingSections';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* PHASE 4: Header & Mega Menus */}
      <PublicHeader />

      {/* PHASE 5: Hero Infrastructure */}
      <HeroInfrastructure />

      {/* PHASE 6: Storytelling Sections */}
      <SectionProblem />
      <SectionInfrastructure />
      <SectionEcosystem />
      <SectionOneData />
      <SectionAllianceAI />
      
      {/* Network / Solutions (Simplified for now, can be expanded) */}
      <SectionDevelopersOrigin />

      {/* PHASE 11 & 12: Founder & Final CTA */}
      <section className="story-section bg-graphite text-white">
        <div className="section-inner split-layout">
          <div>
            <span className="section-kicker text-champagne">LE FONDATEUR</span>
            <h2 className="section-title text-white">Adzessa Benjamin Fraide</h2>
            <p className="text-gray-400 mb-2">Founder • Software Engineer • Product Builder</p>
            <p className="section-desc text-gray-400">
              Construire l'infrastructure technologique de demain, pensée depuis l'Afrique pour 
              les organisations du monde entier.
            </p>
            <button className="btn-secondary mt-8 text-white border-gray-600 hover:bg-white hover:text-black" onClick={() => navigate('/founder')}>
              Découvrir le profil complet
            </button>
          </div>

          <div className="bg-deep-navy p-12 rounded-3xl text-center">
            <h3 className="text-3xl font-bold mb-4">Prêt pour un nouveau standard ?</h3>
            <p className="text-gray-400 mb-8">Entrez dans l'écosystème Alliance One.</p>
            <button className="btn-primary mx-auto" onClick={() => navigate('/register')}>
              Découvrir Alliance One <ArrowRight size={16}/>
            </button>
          </div>
        </div>
      </section>
      
      {/* FOOTER (Simple placeholder for now) */}
      <footer className="bg-ivory py-12 border-t border-gray-200">
        <div className="section-inner flex justify-between items-center">
          <div className="font-bold text-lg">ALLIANCE ONE</div>
          <div className="text-sm text-gray-500">Built in Africa. Designed for the world.</div>
        </div>
      </footer>
    </div>
  );
};
