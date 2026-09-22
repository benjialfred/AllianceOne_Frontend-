import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export const AllianceOneClimax: React.FC<{ setCursorState: (state: any) => void }> = ({ setCursorState }) => {
  const isReducedMotion = useReducedMotion();
  const climaxRef = useRef<HTMLDivElement>(null);
  
  // Parallax tracking
  const { scrollYProgress } = useScroll({ target: climaxRef, offset: ["start end", "end start"] });
  
  // Background inversion: zinc-950 -> zinc-900 -> zinc-950
  const climaxBg = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], ["var(--founder-bg)", "var(--founder-bg-subtle)", "var(--founder-bg-subtle)", "var(--founder-bg)"]);
  
  // Converging Network logic
  const networkScale = useTransform(scrollYProgress, [0.2, 0.5], [1.5, 1]);
  const networkOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.7, 0.9], [0, 1, 1, 0]);

  // Title Parallax
  const titleY = useTransform(scrollYProgress, [0, 1], [0, isReducedMotion ? 0 : -300]);

  return (
    <motion.section 
      ref={climaxRef}
      className="climax-wrapper"
      style={{ backgroundColor: climaxBg as any }}
      onMouseEnter={() => setCursorState('explore')}
      onMouseLeave={() => setCursorState('default')}
    >
      {/* SVG Node Network (Converging ecosystem) */}
      <motion.svg 
        className="climax-network"
        viewBox="0 0 1000 1000"
        style={{ scale: networkScale, opacity: networkOpacity, width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--founder-text-display)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--founder-text-display)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Edges converging to center (500,500) */}
        {[
          { x: 100, y: 200 }, { x: 800, y: 150 }, { x: 900, y: 800 }, { x: 200, y: 850 },
          { x: 300, y: 100 }, { x: 700, y: 900 }, { x: 50, y: 500 }, { x: 950, y: 500 }
        ].map((node, i) => (
          <motion.path 
            key={`edge-${i}`}
            d={`M ${node.x} ${node.y} Q 500 ${node.y} 500 500`}
            fill="none"
            stroke="var(--founder-border)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: false, margin: "-20% 0px" }}
            transition={{ duration: 2, ease: "easeInOut", delay: i * 0.1 }}
          />
        ))}

        {/* Orbiting / Abstract Data Streams */}
        <motion.circle 
          cx="500" cy="500" r="300"
          fill="none"
          stroke="var(--founder-border-light)"
          strokeWidth="1"
          strokeDasharray="4 10"
        />

        <motion.circle 
          cx="500" cy="500" r="150"
          fill="none"
          stroke="var(--founder-border-light)"
          strokeWidth="1"
        />

        {/* Peripheral Nodes */}
        {[
          { x: 100, y: 200, label: 'CŒUR' }, { x: 800, y: 150, label: 'UTILISATEURS' }, 
          { x: 900, y: 800, label: 'DONNÉES' }, { x: 200, y: 850, label: 'ORGS' }
        ].map((node, i) => (
          <motion.g key={`node-${i}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1 + (i * 0.2) }}>
            <circle cx={node.x} cy={node.y} r="4" fill="var(--founder-text-display)" />
            <text x={node.x + 10} y={node.y + 4} fill="var(--founder-text-muted)" fontSize="10" letterSpacing="0.15em" fontFamily="Inter">{node.label}</text>
          </motion.g>
        ))}

        {/* Central Core */}
        <motion.circle 
          cx="500" cy="500" r="8"
          fill="var(--founder-text-display)"
          initial={{ scale: 0 }}
          whileInView={{ scale: [0, 2, 1] }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <circle cx="500" cy="500" r="40" fill="url(#node-glow)" />

      </motion.svg>

      {/* Foreground Content */}
      <div className="founder-container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', pointerEvents: 'none' }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="founder-micro" 
          style={{ marginBottom: '2rem' }}
        >
          04 — Activation du Système
        </motion.div>
        
        <div style={{ overflow: 'hidden', margin: '0 auto', paddingBottom: '2rem' }}>
          <motion.h2 
            className="founder-display-monumental"
            style={{ y: titleY }}
            initial={{ y: "100%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            ALLIANCE ONE
          </motion.h2>
        </div>

        <motion.p 
          className="founder-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 1 }}
          style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--founder-text-secondary)' }}
        >
          L'infrastructure opérationnelle des organisations de demain. Un écosystème unifié où chaque flux de données, chaque module et chaque interaction alimentent un réseau intelligent.
        </motion.p>
      </div>
      
    </motion.section>
  );
};
