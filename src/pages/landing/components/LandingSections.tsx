/**
 * ALLIANCE ONE — STORYTELLING SECTIONS
 * Grouped sections for the public landing page narration.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Network, Database, BrainCircuit, Blocks, Lock, ArrowRight, Code2, Globe2, Users, Activity } from 'lucide-react';
import './LandingSections.css';

/* ======================================================================
   01 - THE PROBLEM (FRAGMENTATION)
   ====================================================================== */
export const SectionProblem: React.FC = () => {
  return (
    <section className="story-section section-problem">
      <div className="section-inner">
        <motion.div 
          className="problem-content text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-kicker">LE PROBLÈME ACTUEL</span>
          <h2 className="section-title">
            Vos outils se multiplient.<br />
            <span className="text-graphite-muted">Vos données se dispersent.</span>
          </h2>
          <p className="section-desc mx-auto">
            Aujourd'hui, les organisations utilisent un outil pour la finance, un autre pour les ressources humaines, 
            des fichiers pour les stocks et un CRM distinct. Cette fragmentation détruit la productivité et masque la vérité opérationnelle.
          </p>

          <div className="fragmentation-visual">
            <div className="frag-box">Finance App</div>
            <div className="frag-box">HR System</div>
            <div className="frag-box">Spreadsheets</div>
            <div className="frag-box">CRM</div>
            <div className="frag-box">Emails</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ======================================================================
   02 - THE INFRASTRUCTURE (RESOLUTION)
   ====================================================================== */
export const SectionInfrastructure: React.FC = () => {
  return (
    <section className="story-section section-infra-reveal bg-deep-navy">
      <div className="section-inner text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-kicker text-alliance-blue">LA RÉSOLUTION</span>
          <h2 className="section-title text-white">
            Alliance One n'est pas un logiciel.<br />
            C'est une infrastructure.
          </h2>
          <p className="section-desc mx-auto text-gray-400">
            Une plateforme unique où chaque donnée est partagée, chaque module est interconnecté 
            et où l'intelligence circule de bout en bout.
          </p>
          
          <div className="infra-fusion-visual mt-16">
            <div className="fusion-core">
              <span className="text-xl font-bold">ALLIANCE ONE</span>
              <div className="fusion-ring"></div>
              <div className="fusion-ring delay"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ======================================================================
   03 - THE ECOSYSTEM
   ====================================================================== */
export const SectionEcosystem: React.FC = () => {
  return (
    <section className="story-section section-ecosystem bg-ivory">
      <div className="section-inner">
        <div className="eco-header text-center mb-16">
          <h2 className="section-title">Tout ce dont votre organisation a besoin.</h2>
        </div>

        <div className="eco-architecture">
          <div className="eco-core">
            <div className="eco-core-inner">AO CORE</div>
          </div>
          
          <div className="eco-orbit">
            <div className="eco-module" style={{ top: '0%', left: '50%', transform: 'translate(-50%, -50%)' }}><Database size={20}/> Finance</div>
            <div className="eco-module" style={{ top: '50%', right: '0%', transform: 'translate(50%, -50%)' }}><Users size={20}/> RH</div>
            <div className="eco-module" style={{ bottom: '0%', left: '50%', transform: 'translate(-50%, 50%)' }}><Blocks size={20}/> Stock</div>
            <div className="eco-module" style={{ top: '50%', left: '0%', transform: 'translate(-50%, -50%)' }}><Network size={20}/> CRM</div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ======================================================================
   04 - ONE DATA
   ====================================================================== */
export const SectionOneData: React.FC = () => {
  return (
    <section className="story-section section-onedata">
      <div className="section-inner split-layout">
        <div className="split-content">
          <span className="section-kicker">L'INTÉGRITÉ ABSOLUE</span>
          <h2 className="section-title">Une donnée saisie.<br />Une vérité universelle.</h2>
          <p className="section-desc">
            Lorsqu'une vente est enregistrée, le stock est décrémenté, la comptabilité est mise à jour 
            et les tableaux de bord sont recalculés instantanément. Aucune passerelle. Aucune double saisie.
          </p>
          <ul className="feature-list mt-8">
            <li><Lock size={16}/> Chiffrement de bout en bout</li>
            <li><Database size={16}/> Base de données unifiée</li>
            <li><Activity size={16}/> Temps réel garanti</li>
          </ul>
        </div>
        <div className="split-visual">
          <div className="data-flow-diagram">
            <div className="flow-source">Saisie Utilisateur</div>
            <div className="flow-lines">
              <div className="f-line"></div>
              <div className="f-line"></div>
              <div className="f-line"></div>
            </div>
            <div className="flow-targets">
              <div className="f-target">Finance</div>
              <div className="f-target">Inventaire</div>
              <div className="f-target">Rapports</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ======================================================================
   05 - ALLIANCE AI (THE INTELLIGENCE LAYER)
   ====================================================================== */
export const SectionAllianceAI: React.FC = () => {
  return (
    <section className="story-section section-ai bg-graphite text-white">
      <div className="section-inner">
        <div className="ai-header text-center">
          <span className="section-kicker text-alliance-blue">ALLIANCE AI</span>
          <h2 className="section-title text-white">The Intelligence Layer.</h2>
          <p className="section-desc mx-auto text-gray-400">
            Alliance AI n'est pas un simple chatbot. C'est une couche d'intelligence native 
            qui comprend le contexte de votre entreprise, planifie des missions et agit sur vos données.
          </p>
        </div>

        <div className="ai-mission-flow mt-16">
          <div className="ai-step">
            <div className="step-icon"><BrainCircuit size={24}/></div>
            <h4>Contexte</h4>
            <p>Compréhension de la requête</p>
          </div>
          <div className="ai-connector"></div>
          <div className="ai-step">
            <div className="step-icon"><Database size={24}/></div>
            <h4>Collecte</h4>
            <p>Extraction des données</p>
          </div>
          <div className="ai-connector"></div>
          <div className="ai-step">
            <div className="step-icon"><Activity size={24}/></div>
            <h4>Analyse</h4>
            <p>Traitement algorithmique</p>
          </div>
          <div className="ai-connector"></div>
          <div className="ai-step">
            <div className="step-icon"><Blocks size={24}/></div>
            <h4>Action</h4>
            <p>Rapport & Exécution</p>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ======================================================================
   06 - DEVELOPERS & AFRICA (Combined for brevity)
   ====================================================================== */
export const SectionDevelopersOrigin: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="story-section section-dev-origin">
      <div className="section-inner grid-2">
        <div className="dev-card bg-ivory">
          <Code2 size={32} className="text-alliance-blue mb-6" />
          <h3 className="text-2xl font-bold mb-4">Build on Alliance One</h3>
          <p className="text-gray-600 mb-8">
            API GraphQL, Webhooks temps réel, SDKs et environnement de développement complet. 
            Construisez vos propres intégrations sur notre infrastructure.
          </p>
          <button className="text-alliance-blue font-bold flex items-center gap-2 hover:gap-4 transition-all">
            Explorer Developer Platform <ArrowRight size={16}/>
          </button>
        </div>
        
        <div className="origin-card bg-deep-navy text-white">
          <Globe2 size={32} className="text-champagne mb-6" />
          <h3 className="text-2xl font-bold mb-4">Built in Africa.<br/>Designed for the world.</h3>
          <p className="text-gray-400 mb-8">
            Une ingénierie de pointe, une ambition globale, une infrastructure capable de 
            soutenir les organisations du monde entier, peu importe leur échelle.
          </p>
        </div>
      </div>
    </section>
  );
};
