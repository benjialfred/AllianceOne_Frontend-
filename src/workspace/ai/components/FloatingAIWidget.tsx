import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const FloatingAIWidget: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.button
      className="ao-ai-floating-widget"
      onClick={onClick}
      initial={{ y: 50, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      whileHover={{ scale: 1.05, background: 'rgba(30, 30, 30, 0.9)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      title="Ouvrir Alliance AI"
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 24px',
        borderRadius: '32px',
        background: 'rgba(15, 15, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        color: '#fff',
        cursor: 'pointer',
        zIndex: 50,
        fontFamily: 'var(--ao-font-sans)',
        fontWeight: 600,
        fontSize: '14px',
        letterSpacing: '0.02em',
        outline: 'none'
      }}
    >
      <Sparkles size={16} color="#34d399" />
      <span>Ask Alliance AI</span>
      
      {/* Subtle glow behind the button */}
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '32px',
          boxShadow: '0 0 20px rgba(52, 211, 153, 0.2)',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
    </motion.button>
  );
};
