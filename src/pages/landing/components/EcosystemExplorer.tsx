import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Network, Database, BrainCircuit, Blocks, Lock, ArrowRight, Code2, Globe2, Users, Activity, BookOpen, Briefcase, FileText } from 'lucide-react';
import { AllianceLogo } from '../../../design-system/components/AllianceLogo';
import './EcosystemExplorer.css';

export const EcosystemExplorer: React.FC = () => {
  const navigate = useNavigate();

  // MODULES DATA
  const modules = [
    { id: 'education', name: 'Education', icon: <BookOpen size={24}/>, desc: 'Gérez votre établissement. De la scolarité à la diplomation.', metrics: 'Classes, Students, Attendance' },
    { id: 'finance', name: 'Finance', icon: <Briefcase size={24}/>, desc: 'Pilotez vos flux financiers. Trésorerie, factures et budgets.', metrics: 'Invoices, Accounts, Reporting' },
    { id: 'inventory', name: 'Inventory', icon: <Blocks size={24}/>, desc: 'Contrôlez vos stocks. Approvisionnements et logistique.', metrics: 'Warehouses, Items, Movements' },
    { id: 'hr', name: 'People (HR)', icon: <Users size={24}/>, desc: 'Structurez vos équipes. Paie, talents, congés et recrutements.', metrics: 'Employees, Payroll, Leaves' },
    { id: 'crm', name: 'CRM', icon: <Users size={24}/>, desc: 'Connectez avec vos clients. Pipelines, deals et support.', metrics: 'Leads, Deals, Contacts' },
    { id: 'projects', name: 'Projects', icon: <Activity size={24}/>, desc: 'Livrez vos projets. Tâches, jalons et gestion des ressources.', metrics: 'Tasks, Timelines, Resources' },
  ];

  // Animations
  const layerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="ecosystem-explorer bg-ivory relative z-10">
      
      {/* 01. SECTION INTRO */}
      <section className="eco-intro text-center pt-12 pb-24 relative z-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={layerVariants}>
          <h2 className="eco-headline font-display">
            Une architecture unifiée.
          </h2>
          <p className="eco-desc font-sans mx-auto mt-6">
            L'infrastructure Alliance One est conçue en couches parfaitement intégrées. 
            Une fondation solide de sécurité et de données qui propulse un écosystème d'applications sans limite.
          </p>
        </motion.div>
      </section>

      {/* 02. PLATFORM CORE & LAYERED ARCHITECTURE */}
      <section className="eco-architecture pb-32 relative z-10">
        <div className="eco-inner">
          <motion.div 
            className="arch-layers"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } }
            }}
          >
            <div className="arch-connecting-line"></div>

            {/* Layer: ORGANIZATION / PEOPLE */}
            <motion.div className="layer-block" variants={layerVariants}>
              <div className="layer-label">1. ORGANISATION & ACCÈS</div>
              <div className="layer-content">
                <span className="layer-pill"><Users size={16}/> Teams & Roles</span>
                <span className="layer-pill"><Globe2 size={16}/> Departments</span>
                <span className="layer-pill"><Network size={16}/> Multi-Branches</span>
                <span className="layer-pill"><Lock size={16}/> Enterprise SSO</span>
              </div>
            </motion.div>

            {/* Layer: DATA / IDENTITY / SECURITY */}
            <motion.div className="layer-block" variants={layerVariants}>
              <div className="layer-label">2. FONDATION DES DONNÉES</div>
              <div className="layer-content">
                <span className="layer-pill"><Database size={16}/> Unified Data Lake</span>
                <span className="layer-pill"><Activity size={16}/> Real-time Sync</span>
                <span className="layer-pill"><Lock size={16}/> E2E Encryption</span>
              </div>
            </motion.div>

            {/* Layer: ALLIANCE PLATFORM */}
            <motion.div className="layer-block layer-core" variants={layerVariants}>
              <div className="layer-label">3. NOYAU CENTRAL (OPERATING SYSTEM)</div>
              <div className="platform-core-visual">
                <div style={{ color: '#fff' }}><AllianceLogo size={56} /></div>
                <span className="platform-core-text">ALLIANCE ONE CORE</span>
              </div>
              <div className="core-orbit">
                <span>WORKFLOW ENGINE</span>
                <span>AI ORCHESTRATOR</span>
                <span>OPEN API</span>
                <span>EVENT BUS</span>
                <span>ACCESS CONTROL</span>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 03. APPLICATIONS / MODULES (BENTO GRID) */}
      <section className="eco-modules pb-40">
        <div className="eco-inner">
          <motion.div 
            className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={layerVariants}
          >
            <span className="micro-label mb-4 block" style={{ color: 'var(--ao-alliance-blue)' }}>4. LA SUITE APPLICATIVE</span>
            <h2 className="text-4xl font-display font-extrabold text-graphite mb-4">
              Des modules métiers natifs.
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Chaque application tire parti de l'infrastructure centrale. Zéro intégration requise. Zéro silo de données.
            </p>
          </motion.div>

          <motion.div 
            className="eco-modules-bento"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {modules.map(mod => (
              <motion.div 
                key={mod.id} 
                className="bento-card"
                variants={layerVariants}
                onClick={() => navigate(`/modules/${mod.id}`)}
              >
                <div className="bento-icon-wrapper">
                  {mod.icon}
                </div>
                <h3>{mod.name}</h3>
                <p>{mod.desc}</p>
                <div className="bento-metrics">
                  {mod.metrics}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};
