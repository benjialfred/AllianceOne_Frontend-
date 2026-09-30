import React from 'react';
import { motion } from 'framer-motion';

export const WaveField: React.FC = () => {
  return (
    <svg className="lmb-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.15)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>
        <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(16, 185, 129, 0)" />
          <stop offset="50%" stopColor="rgba(16, 185, 129, 0.1)" />
          <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
        </linearGradient>
      </defs>

      {/* Wave 1: Blue, very slow */}
      <motion.path
        d="M-20,40 C 20,20 80,60 120,40"
        fill="none"
        stroke="url(#wave-grad-1)"
        strokeWidth="0.2"
        animate={{
          d: [
            "M-20,40 C 20,20 80,60 120,40",
            "M-20,50 C 40,70 60,30 120,50",
            "M-20,40 C 20,20 80,60 120,40"
          ],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Wave 2: Emerald, moving oppositely */}
      <motion.path
        d="M-20,60 C 30,80 70,30 120,50"
        fill="none"
        stroke="url(#wave-grad-2)"
        strokeWidth="0.15"
        animate={{
          d: [
            "M-20,60 C 30,80 70,30 120,50",
            "M-20,45 C 50,20 90,70 120,40",
            "M-20,60 C 30,80 70,30 120,50"
          ],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
};
