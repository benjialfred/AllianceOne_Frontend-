import React from 'react';
import { motion } from 'framer-motion';

export const AbstractGeometry: React.FC = () => {
  return (
    <svg className="lmb-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
      {/* Huge subtle incomplete circle in the background */}
      <motion.circle
        cx="70"
        cy="30"
        r="40"
        fill="none"
        stroke="rgba(255, 255, 255, 0.02)"
        strokeWidth="0.2"
        strokeDasharray="40 120"
        animate={{
          rotate: [0, 360]
        }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "70px 30px" }}
      />
      
      <motion.circle
        cx="70"
        cy="30"
        r="38"
        fill="none"
        stroke="rgba(16, 185, 129, 0.03)"
        strokeWidth="0.1"
        strokeDasharray="20 180"
        animate={{
          rotate: [360, 0]
        }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "70px 30px" }}
      />

      {/* Crosshairs / Target marks */}
      <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.2">
        <line x1="20" y1="18" x2="20" y2="22" />
        <line x1="18" y1="20" x2="22" y2="20" />
      </g>

      <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.2">
        <line x1="80" y1="88" x2="80" y2="92" />
        <line x1="78" y1="90" x2="82" y2="90" />
      </g>

      {/* Floating subtle grid fragment */}
      <motion.g
        stroke="rgba(37, 99, 235, 0.03)"
        strokeWidth="0.1"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 20, delay: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <line x1="40" y1="60" x2="40" y2="65" />
        <line x1="42" y1="60" x2="42" y2="65" />
        <line x1="44" y1="60" x2="44" y2="65" />
        <line x1="38" y1="62" x2="46" y2="62" />
      </motion.g>
    </svg>
  );
};
