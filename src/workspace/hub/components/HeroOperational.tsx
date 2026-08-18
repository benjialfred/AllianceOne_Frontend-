/**
 * ALLIANCE OS — HERO OPERATIONAL
 * Left side: Strong typography. Right side: Living ecosystem visualization.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Box, Activity, GraduationCap, BarChart } from 'lucide-react';
import './OsComponents.css';

export const HeroOperational: React.FC = () => {
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
          <div className="os-eco-node node-edu">
            <GraduationCap size={16} />
            <span>Éducation</span>
          </div>
          <div className="os-eco-node node-fin">
            <BarChart size={16} />
            <span>Finance</span>
          </div>
          <div className="os-eco-node node-inv">
            <Box size={16} />
            <span>Stocks</span>
          </div>
          <div className="os-eco-node node-tsk">
            <Activity size={16} />
            <span>Tâches</span>
          </div>

          {/* SVG Connections */}
          <svg className="os-eco-lines" width="100%" height="100%">
            <line x1="50%" y1="50%" x2="20%" y2="20%" />
            <line x1="50%" y1="50%" x2="80%" y2="20%" />
            <line x1="50%" y1="50%" x2="20%" y2="80%" />
            <line x1="50%" y1="50%" x2="80%" y2="80%" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};
