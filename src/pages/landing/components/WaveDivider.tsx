import React from 'react';
import { motion } from 'framer-motion';

interface WaveDividerProps {
  position: 'top' | 'bottom';
  color?: string;
  flip?: boolean;
}

export const WaveDivider: React.FC<WaveDividerProps> = ({ 
  position, 
  color = '#050505', 
  flip = false 
}) => {
  const transform = [
    position === 'top' ? 'rotate(180deg)' : '',
    flip ? 'scaleX(-1)' : ''
  ].filter(Boolean).join(' ');

  // A perfectly tileable wave path
  const wavePath = "M0,60 C300,120 600,0 900,60 C1200,120 1500,0 1800,60 C2100,120 2400,0 2700,60 L2700,120 L0,120 Z";

  return (
    <div className={`absolute left-0 right-0 w-full overflow-hidden leading-[0] ${position === 'top' ? 'top-0' : 'bottom-0'}`} style={{ transform: transform || 'none', zIndex: 10, height: '60px' }}>
      {/* We use a container that is wider than the screen to animate translation */}
      <motion.svg
        className="relative block"
        style={{ width: '2700px', height: '100%', minHeight: '60px' }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2700 120"
        preserveAspectRatio="none"
        animate={{
          x: [0, -900]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <defs>
          <linearGradient id="divider-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="33%" stopColor="#8b5cf6" />
            <stop offset="66%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
            <animate attributeName="x1" values="0%;-100%" dur="10s" repeatCount="indefinite" />
            <animate attributeName="x2" values="100%;0%" dur="10s" repeatCount="indefinite" />
          </linearGradient>
        </defs>
        {/* Solid background fill for seamless section transition */}
        <path d={wavePath} style={{ fill: color }}></path>
        {/* Animated glowing border on top */}
        <path d={wavePath} style={{ fill: 'none', stroke: 'url(#divider-grad)', strokeWidth: 2, filter: 'drop-shadow(0px -4px 12px rgba(59,130,246,0.5))' }}></path>
      </motion.svg>
    </div>
  );
};
