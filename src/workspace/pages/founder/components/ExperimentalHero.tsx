import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Compass, MapPin, Sparkles } from 'lucide-react';
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
            <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={12} color="var(--founder-accent)" /> Domaine
            </div>
            <div className="founder-sub">Systèmes / Produit / IA</div>
          </div>
          <div>
            <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={12} color="var(--founder-accent)" /> Localisation
            </div>
            <div className="founder-sub">Cameroun</div>
          </div>
          <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={12} color="var(--founder-accent)" /> Construit Actuellement
            </div>
            <div className="founder-sub">Des systèmes digitaux pour les organisations modernes.</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right: Massive Portfolio Image Wrapper */}
      <div style={{ flex: 1, position: 'relative', height: '90vh', display: 'flex', justifyContent: 'flex-end', alignItems: 'stretch' }}>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 1 }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '24px 0 0 24px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}
        >
          {/* Parallax Image */}
          <motion.div
            style={{
              width: '100%',
              height: '120%',
              y: useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])
            }}
          >
            <img 
              src={portfolioImg} 
              alt="Founder Portrait" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                objectPosition: 'center top'
              }} 
            />
          </motion.div>

          {/* Suble overlay gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(28, 25, 23, 0.8) 0%, transparent 40%)'
          }} />
        </motion.div>

        {/* Floating Labels */}
        <motion.div 
          style={{ position: 'absolute', bottom: '2rem', right: '2rem' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <div className="founder-micro" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>
            NŒUD OPÉRATIONNEL // 01
          </div>
        </motion.div>
      </div>

    </section>
  );
};
