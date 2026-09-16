/**
 * ALLIANCE OS — HERO OPERATIONAL
 * Left side: Strong typography. Right side: Living ecosystem visualization.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Box } from 'lucide-react';
import { usePlatformStore } from '../../../core/stores/platformStore';
import { ALLIANCE_MODULES } from '../../../core/modules/registry';
import './OsComponents.css';

export const HeroOperational: React.FC = () => {
  const currentOrg = usePlatformStore(s => s.currentOrganization);
  const activeModuleIds = currentOrg?.active_modules && currentOrg.active_modules.length > 0
    ? currentOrg.active_modules
    : ['education', 'finance', 'inventory', 'tasks'];

  const ecosystemNodes = ALLIANCE_MODULES.filter(m => activeModuleIds.includes(m.id)).slice(0, 4);

  return (
    <section className="os-hero-operational">
      <div className="os-hero-left">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="os-hero-title">
            Tout votre environnement.<br />
            Un seul espace.
          </h2>
          <p className="os-hero-desc">
            Retrouvez vos applications, vos équipes, vos données et vos activités depuis un environnement unifié.
          </p>
          <div className="os-hero-actions">
            <button className="os-btn-primary">
              Ouvrir mon espace de travail <ArrowRight size={14} />
            </button>
            <button className="os-btn-secondary">
              Explorer mes modules
            </button>
          </div>
        </motion.div>
      </div>

      <div className="os-hero-right">
        {/* Living Ecosystem Visualization */}
        <motion.div 
          className="os-ecosystem-viz"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          <div className="os-eco-center">
            <div className="os-eco-core-glow" />
            <Box size={24} className="os-eco-core-icon" />
          </div>

          {/* Nodes (Animated via CSS for breathing effect) */}
          {ecosystemNodes.map((node, i) => (
            <div key={node.id} className={`os-eco-node node-pos-${i + 1}`}>
              <node.icon size={16} color={node.accentColor} />
              <span>{node.name}</span>
            </div>
          ))}

          {/* SVG Connections */}
          <svg className="os-eco-lines" width="100%" height="100%">
            {ecosystemNodes.length > 0 && <line x1="50%" y1="50%" x2="20%" y2="20%" />}
            {ecosystemNodes.length > 1 && <line x1="50%" y1="50%" x2="80%" y2="20%" />}
            {ecosystemNodes.length > 2 && <line x1="50%" y1="50%" x2="20%" y2="80%" />}
            {ecosystemNodes.length > 3 && <line x1="50%" y1="50%" x2="80%" y2="80%" />}
          </svg>
        </motion.div>
      </div>
    </section>
  );
};
