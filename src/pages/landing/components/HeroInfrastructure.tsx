import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { ArrowRight, Database, Users, Briefcase, Layout, BrainCircuit } from 'lucide-react';
import { AllianceLogo } from '../../../design-system/components/AllianceLogo';
import './HeroInfrastructure.css';

export const HeroInfrastructure: React.FC = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Séquence d'animation
    const sequence = async () => {
      // Step 1: Symbole AO apparait (automatique via initial/animate sur le composant)
      await new Promise(r => setTimeout(r, 600));
      // Step 2 & 3: Lignes et éléments
      await controls.start("step2");
      // Step 4: Connexion
      await controls.start("step3");
      // Step 5: Formation
      await controls.start("step4");
    };
    sequence();
  }, [controls]);

  // Mouse parallax interaction (subtle)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 10; // Max 5px movement
    const y = (clientY / window.innerHeight - 0.5) * 10;
    setMousePosition({ x, y });
  };

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    step2: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
    step3: { opacity: 1, scale: 1 },
    step4: { opacity: 1, scale: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    step2: { opacity: 1 },
    step3: { pathLength: 1, transition: { duration: 1, ease: "easeInOut" } },
    step4: { pathLength: 1, opacity: 0.4 } // fade out slightly when stable
  };

  return (
    <section className="ao-hero" onMouseMove={handleMouseMove}>
      <div className="ao-hero-inner">
        
        {/* TEXT CONTENT */}
        <div className="ao-hero-text">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <span className="micro-label mb-4 block">ALLIANCE ONE / OPERATING INFRASTRUCTURE</span>
            <h1 className="ao-hero-title">
              Une plateforme.<br />
              Tous vos métiers.<br />
              Un seul écosystème.
            </h1>
          </motion.div>
          
          <motion.p 
            className="ao-hero-desc"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          >
            Alliance One connecte les applications, les données, les équipes, les opérations et l'intelligence de votre organisation dans une même infrastructure.
          </motion.p>
          
          <motion.div 
            className="ao-hero-actions"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button className="ao-btn-primary ao-btn-large" onClick={() => navigate('/register')}>
              Découvrir Alliance One
            </button>
            <button className="ao-btn-ghost text-graphite" onClick={() => navigate('/solutions')}>
              Explorer les solutions
            </button>
          </motion.div>

          <motion.div 
            className="ao-hero-signals"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}
          >
            <span className="signal-badge">MODULAR</span>
            <span className="signal-badge">AI-NATIVE</span>
            <span className="signal-badge">MULTI-ORGANIZATION</span>
            <span className="signal-badge">API READY</span>
          </motion.div>

          <motion.div 
            className="trust-banner"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }}
          >
            <span className="trust-banner-text">Plus de 15 organisations opèrent déjà sur l'infrastructure.</span>
            <div className="trust-banner-logos">
              <div className="trust-logo-circle">AO</div>
              <div className="trust-logo-circle" style={{ color: '#0f766e' }}>EI</div>
              <div className="trust-logo-circle" style={{ color: '#854d0e' }}>FZ</div>
              <div className="trust-logo-circle" style={{ color: '#6d28d9' }}>MK</div>
              <div className="trust-logo-more">+11</div>
            </div>
          </motion.div>
        </div>

        {/* VISUAL ARCHITECTURE */}
        <div className="ao-hero-visual">
          <motion.div 
            className="architecture-container"
            animate={{ x: mousePosition.x, y: mousePosition.y }}
            transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
          >
            {/* CENTRAL CORE */}
            <motion.div 
              className="arch-core"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <AllianceLogo size={48} color="white" />
            </motion.div>

            {/* SVG CONNECTIONS */}
            {!isMobile && (
              <svg className="arch-svg" viewBox="0 0 600 600">
                {/* Lines converging to center (300,300) */}
                <motion.line x1="150" y1="150" x2="280" y2="280" className="arch-line" variants={lineVariants} initial="hidden" animate={controls} />
                <motion.line x1="450" y1="150" x2="320" y2="280" className="arch-line" variants={lineVariants} initial="hidden" animate={controls} />
                <motion.line x1="100" y1="300" x2="270" y2="300" className="arch-line" variants={lineVariants} initial="hidden" animate={controls} />
                <motion.line x1="500" y1="300" x2="330" y2="300" className="arch-line" variants={lineVariants} initial="hidden" animate={controls} />
                <motion.line x1="300" y1="450" x2="300" y2="330" className="arch-line" variants={lineVariants} initial="hidden" animate={controls} />
              </svg>
            )}

            {/* NODES */}
            <motion.div className="arch-node node-1" variants={nodeVariants} initial="hidden" animate={controls}>
              <Database size={20} className="mb-2 text-alliance-blue" />
              <span>DATA</span>
            </motion.div>

            <motion.div className="arch-node node-2" variants={nodeVariants} initial="hidden" animate={controls}>
              <Users size={20} className="mb-2 text-alliance-blue" />
              <span>PEOPLE</span>
            </motion.div>

            <motion.div className="arch-node node-3" variants={nodeVariants} initial="hidden" animate={controls}>
              <Briefcase size={20} className="mb-2 text-alliance-blue" />
              <span>OPERATIONS</span>
            </motion.div>

            <motion.div className="arch-node node-4" variants={nodeVariants} initial="hidden" animate={controls}>
              <Layout size={20} className="mb-2 text-alliance-blue" />
              <span>APPLICATIONS</span>
            </motion.div>

            <motion.div className="arch-node node-5" variants={nodeVariants} initial="hidden" animate={controls}>
              <BrainCircuit size={20} className="mb-2 text-alliance-blue" />
              <span>INTELLIGENCE</span>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};
