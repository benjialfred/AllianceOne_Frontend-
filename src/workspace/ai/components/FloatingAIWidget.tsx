import React from 'react';
import { motion } from 'framer-motion';

export const FloatingAIWidget: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.button
      className="ao-ai-floating-widget"
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      title="Ouvrir Alliance AI"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '64px',
        height: '64px',
        borderRadius: '32px',
        background: 'linear-gradient(135deg, #163a2a 0%, #2a6a4f 100%)',
        border: 'none',
        boxShadow: '0 12px 36px rgba(22, 58, 42, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40,
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        {/* Custom AI Hexagonal Node Logo */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="widget-ai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="widget-ai-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          
          {/* Outer Dynamic Hexagon */}
          <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" fill="url(#widget-ai-grad)" opacity="0.15" />
          <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="url(#widget-ai-grad)" strokeWidth="6" strokeLinejoin="round" />
          
          {/* Inner Neural Node (Spark) */}
          <motion.path 
            d="M50 25 Q 50 50 25 50 Q 50 50 50 75 Q 50 50 75 50 Q 50 50 50 25 Z" 
            fill="url(#widget-ai-glow)"
            animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "center" }}
          />
          
          {/* Connecting Dots */}
          <circle cx="50" cy="5" r="4" fill="#60a5fa" />
          <circle cx="90" cy="72.5" r="4" fill="#34d399" />
          <circle cx="10" cy="72.5" r="4" fill="#60a5fa" />
        </svg>

        {/* Orbiting particles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <div style={{ position: 'absolute', top: 4, right: 12, width: 4, height: 4, borderRadius: 2, background: '#60a5fa', boxShadow: '0 0 8px #60a5fa' }} />
          <div style={{ position: 'absolute', bottom: 8, left: 16, width: 3, height: 3, borderRadius: 1.5, background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
        </motion.div>
      </div>
      
      {/* Glow pulse */}
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, rgba(96,165,250,0.6) 0%, rgba(96,165,250,0) 70%)',
          zIndex: 1,
          opacity: 0.5
        }}
      />
    </motion.button>
  );
};
