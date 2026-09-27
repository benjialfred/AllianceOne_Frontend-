import React from 'react';
import { motion } from 'framer-motion';

export interface AllianceLoaderProps {
  text?: string;
  size?: number;
}

export const AllianceLoader: React.FC<AllianceLoaderProps> = ({ 
  text = "Chargement...",
  size = 64
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '250px',
      gap: '24px',
      fontFamily: "var(--ao-font-sans, 'Inter', sans-serif)",
    }}>
      <motion.div
        animate={{ scale: [0.98, 1.05, 0.98] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* A - Chevron (dessin animé) */}
          <motion.path 
            d="M 20 80 L 50 20 L 80 80" 
            stroke="#4f46e5" 
            strokeWidth="18" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            initial={{ pathLength: 0, opacity: 0.5 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0.5, 1, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* O - Cercle (dessin animé) */}
          <motion.circle 
            cx="50" 
            cy="60" 
            r="14" 
            stroke="#10b981" 
            strokeWidth="18" 
            initial={{ pathLength: 0, opacity: 0.5 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0.5, 1, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
        </svg>
      </motion.div>

      {text && (
        <motion.div 
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#64748b'
          }}
        >
          {text}
        </motion.div>
      )}
    </div>
  );
};
