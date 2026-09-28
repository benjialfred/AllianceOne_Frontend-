import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Network, Database, BrainCircuit, Blocks, Lock, ArrowRight, Code2, Globe2, Users, Activity, BookOpen, Briefcase, FileText } from 'lucide-react';
import { AllianceLogo } from '../../../design-system/components/AllianceLogo';
import './EcosystemExplorer.css';

export const EcosystemExplorer: React.FC = () => {
  const navigate = useNavigate();

  // MODULES DATA
  const modules = [
    { id: 'education', name: 'Education', icon: <BookOpen size={20}/>, desc: 'Gérez votre établissement.', metrics: 'Classes, Students, Attendance' },
    { id: 'finance', name: 'Finance', icon: <Briefcase size={20}/>, desc: 'Pilotez vos flux financiers.', metrics: 'Invoices, Accounts, Reporting' },
    { id: 'inventory', name: 'Inventory', icon: <Blocks size={20}/>, desc: 'Contrôlez vos stocks.', metrics: 'Warehouses, Items, Movements' },
    { id: 'hr', name: 'People (HR)', icon: <Users size={20}/>, desc: 'Structurez vos équipes.', metrics: 'Employees, Payroll, Leaves' },
    { id: 'crm', name: 'CRM', icon: <Users size={20}/>, desc: 'Connectez avec vos clients.', metrics: 'Leads, Deals, Contacts' },
    { id: 'projects', name: 'Projects', icon: <Activity size={20}/>, desc: 'Livrez vos projets.', metrics: 'Tasks, Timelines, Resources' },
  ];

  const [activeModule, setActiveModule] = useState<string | null>(null);

  // Animations
  const layerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="ecosystem-explorer bg-ivory" style={{ position: 'relative', zIndex: 1 }}>
      
      {/* 01. SECTION INTRO */}
      <section className="eco-intro text-center py-24" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={layerVariants}>
          <span className="micro-label mb-6 block">THE ALLIANCE ONE ECOSYSTEM</span>
          <h2 className="eco-headline font-display">
            Une infrastructure.<br />
            Plusieurs façons de travailler.
          </h2>
          <p className="eco-desc font-sans mx-auto mt-6">
            Alliance One rassemble les applications, les données, les équipes, les opérations et l'intelligence de votre organisation dans une infrastructure commune.
          </p>
        </motion.div>
      </section>

      {/* 02. PLATFORM CORE & LAYERED ARCHITECTURE */}
      <section className="eco-architecture py-24" style={{ position: 'relative', zIndex: 3, overflow: 'hidden' }}>
        <div className="eco-inner">
          <motion.div 
            className="arch-layers"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-200px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.3 } }
            }}
          >
            {/* Layer: ORGANIZATION / PEOPLE */}
            <motion.div className="layer-block" variants={layerVariants}>
              <div className="layer-label">ORGANIZATION / PEOPLE</div>
              <div className="layer-content flex gap-8 justify-center">
                <span className="layer-pill"><Users size={14}/> Teams</span>
                <span className="layer-pill"><Globe2 size={14}/> Departments</span>
                <span className="layer-pill"><Network size={14}/> Branches</span>
              </div>
            </motion.div>

            <div className="layer-connector">↓</div>

            {/* Layer: DATA / IDENTITY / SECURITY */}
            <motion.div className="layer-block" variants={layerVariants}>
              <div className="layer-label">DATA / IDENTITY / SECURITY</div>
              <div className="layer-content flex gap-8 justify-center">
                <span className="layer-pill"><Database size={14}/> Unified DB</span>
                <span className="layer-pill"><Lock size={14}/> RBAC</span>
                <span className="layer-pill"><Lock size={14}/> SSO</span>
              </div>
            </motion.div>

            <div className="layer-connector">↓</div>

            {/* Layer: ALLIANCE PLATFORM */}
            <motion.div className="layer-block layer-core" variants={layerVariants}>
              <div className="layer-label text-alliance-blue">CORE INFRASTRUCTURE</div>
              <div className="platform-core-visual">
                <AllianceLogo size={40} color="white" />
                <span className="platform-core-text">ALLIANCE ONE</span>
              </div>
              <div className="core-orbit">
                <span>IDENTITY</span>
                <span>WORKFLOWS</span>
                <span>INTEGRATIONS</span>
                <span>DATA</span>
                <span>PERMISSIONS</span>
              </div>
            </motion.div>

            <div className="layer-connector">↓</div>

            {/* Layer: APPLICATIONS / MODULES */}
            <motion.div className="layer-block" variants={layerVariants}>
              <div className="layer-label">APPLICATIONS / MODULES</div>
              <div className="layer-content flex gap-4 justify-center flex-wrap max-w-2xl mx-auto">
                {modules.map(m => (
                  <span key={m.id} className="layer-pill module-pill bg-white text-graphite border-graphite-10">
                    {m.icon} {m.name}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 03. MODULES EXPLORER */}
      <section className="eco-modules py-32 bg-white" style={{ position: 'relative', zIndex: 4, clear: 'both' }}>
        <div className="eco-inner">
          <div className="mb-16 text-center">
            <span className="micro-label mb-4 block">APPLICATIONS MÉTIER</span>
            <h3 className="font-display text-4xl font-bold text-graphite">Les Modules Alliance One</h3>
          </div>

          <div className="module-explorer-grid" style={{ alignItems: 'start' }}>
            <div className="module-list">
              {modules.map((m) => (
                <div 
                  key={m.id} 
                  className={`module-item ${activeModule === m.id ? 'active' : ''}`}
                  onMouseEnter={() => setActiveModule(m.id)}
                  onClick={() => setActiveModule(m.id)} // For mobile
                >
                  <div className="module-item-header">
                    {m.icon}
                    <span className="module-item-name">{m.name}</span>
                  </div>
                  {activeModule === m.id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      className="module-item-details"
                    >
                      <p>{m.desc}</p>
                      <div className="module-metrics">{m.metrics}</div>
                      <div className="alliance-line-draw"></div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <div className="module-visualizer">
              <div className="visualizer-core">
                <AllianceLogo size={60} color="var(--ao-graphite)" />
                <span className="font-sans font-bold text-sm mt-4 tracking-widest text-graphite">ALLIANCE ONE</span>
              </div>
              
              {/* Connection lines from modules to core based on active state */}
              {activeModule && (
                <motion.svg className="visualizer-connection" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.path 
                    d="M 0,150 C 100,150 100,150 200,150" 
                    className="alliance-line-svg"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.circle 
                    cx="100" cy="150" r="4" 
                    fill="var(--ao-alliance-blue)"
                    initial={{ x: -100 }}
                    animate={{ x: 100 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </motion.svg>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 04. MARKETPLACE & DEVELOPER PLATFORM (ECOSYSTEM EXPANSION) */}
      <section className="eco-expansion py-32 bg-graphite text-white">
        <div className="eco-inner grid-expansion">
          <motion.div className="expansion-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={layerVariants}>
            <Blocks size={32} className="text-alliance-blue mb-6" />
            <span className="micro-label text-gray-400 mb-2 block">EXTENSIONS</span>
            <h3 className="font-display text-2xl font-bold mb-4">Alliance Marketplace</h3>
            <p className="text-gray-400 mb-8 font-sans">
              Connectez Alliance One à vos outils existants. Installez des applications, des extensions et des intégrations pour étendre les capacités de votre infrastructure.
            </p>
            <button className="ao-btn-ghost text-white border border-gray-700 rounded-md px-6 py-2" onClick={() => navigate('/marketplace')}>
              Explore Marketplace
            </button>
          </motion.div>

          <motion.div className="expansion-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={layerVariants}>
            <Code2 size={32} className="text-alliance-blue mb-6" />
            <span className="micro-label text-gray-400 mb-2 block">BUILD ON ALLIANCE ONE</span>
            <h3 className="font-display text-2xl font-bold mb-4">Developer Platform</h3>
            <p className="text-gray-400 mb-8 font-sans">
              Utilisez nos API, SDK et Webhooks pour construire des applications internes sur mesure qui profitent nativement de la donnée et de la sécurité Alliance One.
            </p>
            <button className="ao-btn-ghost text-white border border-gray-700 rounded-md px-6 py-2" onClick={() => navigate('/developers')}>
              Developer Platform
            </button>
          </motion.div>
        </div>
      </section>

      {/* 05. AI TRANSITION (HANDOFF) */}
      <section className="eco-ai-handoff bg-deep-navy py-40 text-center relative overflow-hidden">
        <div className="eco-inner relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.5 } }
            }}
          >
            <div className="ai-data-flow flex justify-center gap-12 mb-16 opacity-50">
              <motion.span variants={layerVariants} className="text-alliance-blue text-sm font-bold tracking-widest">DATA</motion.span>
              <motion.span variants={layerVariants} className="text-alliance-blue text-sm font-bold tracking-widest">↓</motion.span>
              <motion.span variants={layerVariants} className="text-alliance-blue text-sm font-bold tracking-widest">CONTEXT</motion.span>
              <motion.span variants={layerVariants} className="text-alliance-blue text-sm font-bold tracking-widest">↓</motion.span>
              <motion.span variants={layerVariants} className="text-alliance-blue text-sm font-bold tracking-widest">INTELLIGENCE</motion.span>
            </div>

            <motion.div variants={layerVariants}>
              <BrainCircuit size={48} className="text-alliance-blue mx-auto mb-8" />
              <span className="micro-label text-gray-400 mb-4 block">ALLIANCE AI</span>
              <h2 className="font-display text-5xl font-bold text-white mb-6">
                Your organization, understood.
              </h2>
              <div className="h-16 w-px bg-alliance-blue mx-auto mt-12 opacity-50 line-flow-down"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};
