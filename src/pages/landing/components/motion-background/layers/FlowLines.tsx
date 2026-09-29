import React from 'react';
import { motion } from 'framer-motion';

export const FlowLines: React.FC = () => {
  return (
    <svg className="lmb-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.4)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Background static tracks */}
      <path d="M 10,0 L 10,100" stroke="rgba(255,255,255,0.02)" strokeWidth="0.1" fill="none" />
      <path d="M 30,0 L 30,100" stroke="rgba(255,255,255,0.02)" strokeWidth="0.1" fill="none" />
      <path d="M 70,0 L 70,100" stroke="rgba(255,255,255,0.02)" strokeWidth="0.1" fill="none" />
      <path d="M 90,0 L 90,100" stroke="rgba(255,255,255,0.02)" strokeWidth="0.1" fill="none" />
      
      <path d="M 0,30 L 100,30" stroke="rgba(255,255,255,0.02)" strokeWidth="0.1" fill="none" />
      <path d="M 0,70 L 100,70" stroke="rgba(255,255,255,0.02)" strokeWidth="0.1" fill="none" />

      {/* Animated Flow 1 */}
      <motion.path
        d="M 10,0 L 10,100"
        stroke="url(#flow-grad)"
        strokeWidth="0.2"
        fill="none"
        initial={{ pathLength: 0, pathOffset: 1 }}
        animate={{ pathLength: [0, 0.5, 0], pathOffset: [1, 0.5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Animated Flow 2 */}
      <motion.path
        d="M 0,70 L 100,70"
        stroke="url(#flow-grad)"
        strokeWidth="0.2"
        fill="none"
        initial={{ pathLength: 0, pathOffset: 0 }}
        animate={{ pathLength: [0, 0.3, 0], pathOffset: [0, 0.5, 1] }}
        transition={{ duration: 12, delay: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Animated Flow 3 (diagonal) */}
      <motion.path
        d="M 10,30 L 70,70"
        stroke="url(#flow-grad)"
        strokeWidth="0.2"
        fill="none"
        initial={{ pathLength: 0, pathOffset: 0 }}
        animate={{ pathLength: [0, 0.4, 0], pathOffset: [0, 0.5, 1] }}
        transition={{ duration: 15, delay: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
};
