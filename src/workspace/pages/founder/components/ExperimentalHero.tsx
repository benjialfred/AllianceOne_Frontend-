import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import portfolioImg from '../../../../assets/portfolio.jpeg';

// Complex SVG mask path for the portrait
const PORTRAIT_PATH = "M 50 10 C 150 5, 250 20, 280 100 C 300 150, 270 250, 280 350 C 290 450, 200 480, 150 490 C 50 500, 10 400, 20 250 C 30 100, -20 20, 50 10 Z";
// Geometric inner path
const GEOMETRIC_PATH = "M 50 20 L 260 30 L 280 200 L 250 450 L 100 480 L 30 300 Z";

interface ExperimentalHeroProps {
  setCursorState: (state: any) => void;
}

export const ExperimentalHero: React.FC<ExperimentalHeroProps> = ({ setCursorState }) => {
  const isReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, isReducedMotion ? 0 : 200]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={heroRef} style={{ minHeight: '95vh', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '4rem' }}>
      
      {/* Left: Dense Information & Title */}
      <motion.div 
        style={{ flex: 1, paddingRight: '2rem', y: yText, opacity: opacityText }}
      >
        <motion.div 
          initial={{ opacity: 0, letterSpacing: '0.15em' }}
          animate={{ opacity: 1, letterSpacing: '0.15em' }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 1 }}
          className="founder-micro"
          style={{ marginBottom: '4rem' }}
        >
          Fondateur / Alliance One
        </motion.div>
        
        {/* Typographic Masking Assembly */}
        <div style={{ overflow: 'hidden', paddingBottom: '0.2em', marginBottom: '1.5rem' }}>
          <motion.h1 
            className="founder-display-monumental"
            style={{ lineHeight: 1 }}
            initial={{ y: "110%", rotate: 2 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
          >
            ADZESSA
          </motion.h1>
        </div>
        <div style={{ overflow: 'hidden', paddingBottom: '0.2em', marginBottom: '1.5rem' }}>
          <motion.h1 
            className="founder-display-monumental"
            style={{ lineHeight: 1 }}
            initial={{ y: "110%", rotate: -1 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
          >
            BENJAMIN
          </motion.h1>
        </div>
        <div style={{ overflow: 'hidden', paddingBottom: '0.2em', marginBottom: '3.5rem' }}>
          <motion.h1 
            className="founder-display-monumental"
            style={{ lineHeight: 1 }}
            initial={{ y: "110%", rotate: 1 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 1.4 }}
          >
            FRAIDE
          </motion.h1>
        </div>

        {/* Data Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '400px' }}
        >
          <div>
            <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '0.5rem' }}>Domaine</div>
            <div className="founder-sub">Systèmes / Produit / IA</div>
          </div>
          <div>
            <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '0.5rem' }}>Localisation</div>
            <div className="founder-sub">Cameroun</div>
          </div>
          <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '0.5rem' }}>Construit Actuellement</div>
            <div className="founder-sub">Des systèmes digitaux pour les organisations modernes.</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right: SVG Portrait Wrapper (Signature Moment 1) */}
      <div style={{ flex: 1, position: 'relative', height: '600px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        
        <svg viewBox="0 0 350 550" style={{ width: '100%', height: '100%', maxWidth: '450px', overflow: 'visible' }}>
          
          <defs>
            <clipPath id="portrait-mask">
              <path d={PORTRAIT_PATH} />
            </clipPath>
          </defs>

          {/* Grid background drawing in */}
          <motion.rect 
            x="0" y="0" width="350" height="550" 
            fill="none" 
            stroke="var(--founder-border-light)" 
            strokeWidth="0.5" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 2 }}
          />

          {/* Geometric Outline drawing */}
          <motion.path 
            d={GEOMETRIC_PATH}
            fill="none"
            stroke="var(--founder-text-muted)"
            strokeWidth="0.5"
            strokeDasharray="10 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
          />

          {/* Smooth Organic Outline drawing */}
          <motion.path 
            d={PORTRAIT_PATH}
            fill="none"
            stroke="var(--founder-text-display)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 1 }}
          />

          {/* Orbiting / Connecting Nodes */}
          {[
            { cx: 50, cy: 10, delay: 1.5 },
            { cx: 280, cy: 100, delay: 1.7 },
            { cx: 150, cy: 490, delay: 1.9 },
            { cx: 20, cy: 250, delay: 2.1 },
          ].map((node, i) => (
            <motion.circle 
              key={i}
              cx={node.cx} 
              cy={node.cy} 
              r="3"
              fill="var(--founder-text-display)"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ delay: node.delay, duration: 1 }}
            />
          ))}

          {/* The Actual Image revealed through the mask */}
          <foreignObject x="0" y="0" width="350" height="550" clipPath="url(#portrait-mask)">
            <motion.div 
              style={{ width: '100%', height: '100%', backgroundColor: 'var(--founder-bg-surface)' }}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, duration: 2, ease: "easeOut" }}
            >
              <img src={portfolioImg} alt="Founder Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          </foreignObject>
          
        </svg>

        {/* Floating Labels around SVG */}
        <motion.div 
          style={{ position: 'absolute', top: '10%', right: '10%' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3, duration: 1 }}
        >
          <div className="founder-micro" style={{ fontSize: '8px' }}>NŒUD // 01</div>
        </motion.div>
      </div>

    </section>
  );
};
