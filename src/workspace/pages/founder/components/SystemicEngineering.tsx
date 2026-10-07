import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutTemplate, Database, Cpu, Box, Layers, Code2, ShieldCheck, Zap, Network } from 'lucide-react';

const DOMAINS = [
  {
    id: 'frontend',
    title: '01 FRONTEND',
    icon: <LayoutTemplate size={18} className="mr-2 inline-block" />,
    core: ['React', 'Next.js', 'TypeScript', 'Vite'],
    capabilities: ['Architecture', 'UI Systems', 'State Management'],
    approach: ['Performance', 'Scalability', 'UX'],
    related: ['Product', 'Systems']
  },
  {
    id: 'backend',
    title: '02 BACKEND',
    icon: <Database size={18} className="mr-2 inline-block" />,
    core: ['Django', 'Python', 'PostgreSQL', 'Redis'],
    capabilities: ['API Architecture', 'Data Modeling', 'Auth Systems'],
    approach: ['Security', 'Reliability', 'ACID Compliance'],
    related: ['Systems', 'AI']
  },
  {
    id: 'ai',
    title: '03 IA APPLIQUÉE',
    icon: <Cpu size={18} className="mr-2 inline-block" />,
    core: ['LLMs', 'Agentic Workflows', 'Vector DBs'],
    capabilities: ['Context Parsing', 'Decision Automation', 'NLP'],
    approach: ['Ethical AI', 'Deterministic Fallbacks'],
    related: ['Backend', 'Product']
  },
  {
    id: 'systems',
    title: '04 SYSTÈMES',
    icon: <Box size={18} className="mr-2 inline-block" />,
    core: ['Docker', 'Cloud Run', 'Terraform', 'CI/CD'],
    capabilities: ['Multi-tenancy', 'RBAC Permissions', 'Monitoring'],
    approach: ['Zero-trust', 'High Availability'],
    related: ['Backend', 'Frontend']
  },
  {
    id: 'product',
    title: '05 PRODUIT',
    icon: <Layers size={18} className="mr-2 inline-block" />,
    core: ['Figma', 'Linear', 'Analytics'],
    capabilities: ['User Research', 'Workflow Optimization'],
    approach: ['Iterative Delivery', 'User-centric Design'],
    related: ['Frontend', 'AI']
  }
];

export const SystemicEngineering: React.FC<{ setCursorState: (state: any) => void }> = ({ setCursorState }) => {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  return (
    <section style={{ position: 'relative' }}>
      
      <div className="founder-micro" style={{ marginBottom: '4rem' }}>03 — Matrice d'Ingénierie Systémique</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {DOMAINS.map((domain) => {
          const isActive = activeDomain === domain.id;
          const isDimmed = activeDomain !== null && !isActive;

          return (
            <motion.div
              key={domain.id}
              className="founder-eng-domain"
              onMouseEnter={() => { setActiveDomain(domain.id); setCursorState('explore'); }}
              onMouseLeave={() => { setActiveDomain(null); setCursorState('default'); }}
              animate={{ opacity: isDimmed ? 0.3 : 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="founder-sys-header">
                
                {/* Domain Title */}
                <div>
                  <motion.h3 
                    className="founder-subtitle"
                    animate={{ color: isActive ? 'var(--founder-text-display)' : 'var(--founder-text-primary)' }}
                  >
                    {domain.title}
                  </motion.h3>
                </div>

                {/* Progressive Disclosure Content */}
                <div style={{ overflow: 'hidden' }}>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="founder-sys-grid"
                      >
                        <div>
                          <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                            <Code2 size={14} style={{ marginRight: '6px' }} /> Stack Technique
                          </div>
                          {domain.core.map((item, i) => (
                            <motion.div key={i} className="founder-sub" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 + 0.2 }}>{item}</motion.div>
                          ))}
                        </div>
                        <div>
                          <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                            <Zap size={14} style={{ marginRight: '6px' }} /> Capacités
                          </div>
                          {domain.capabilities.map((item, i) => (
                            <motion.div key={i} className="founder-sub" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 + 0.25 }}>{item}</motion.div>
                          ))}
                        </div>
                        <div>
                          <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                            <ShieldCheck size={14} style={{ marginRight: '6px' }} /> Approche
                          </div>
                          {domain.approach.map((item, i) => (
                            <motion.div key={i} className="founder-sub" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 + 0.3 }}>{item}</motion.div>
                          ))}
                        </div>
                        <div>
                          <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                            <Network size={14} style={{ marginRight: '6px' }} /> Nœuds Associés
                          </div>
                          {domain.related.map((item, i) => (
                            <motion.div key={i} className="founder-sub" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 + 0.35 }}>{item}</motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
              
              {/* Animated bottom line connecting the matrix */}
              <motion.div 
                style={{ height: '1px', backgroundColor: 'var(--founder-border-light)', width: '100%', marginTop: '2rem', originX: 0 }}
                animate={{ scaleX: isActive ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "circOut" }}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
