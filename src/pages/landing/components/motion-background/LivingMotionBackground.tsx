import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './LivingMotionBackground.css';

interface LivingMotionBackgroundProps {
  disableParallax?: boolean;
}

export const LivingMotionBackground: React.FC<LivingMotionBackgroundProps> = ({ disableParallax }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (disableParallax) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Very subtle parallax
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [disableParallax]);

  return (
    <div className="living-motion-container">
      {/* Deep ambient glow in the background */}
      <div className="living-glow glow-1"></div>
      <div className="living-glow glow-2"></div>
      <div className="living-glow glow-3"></div>

      <motion.div 
        className="living-layer parallax-far"
        style={{ x: mousePos.x * 0.2, y: mousePos.y * 0.2 }}
      >
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="living-svg">
          {/* Organic Slow Waves */}
          <motion.path
            d="M -100 500 C 200 400 400 600 1100 500"
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M -100 300 C 300 500 600 200 1100 400"
            fill="none"
            stroke="rgba(255,255,255,0.02)"
            strokeWidth="2"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.path
            d="M -100 700 C 400 600 700 800 1100 650"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </svg>
      </motion.div>

      <motion.div 
        className="living-layer parallax-mid"
        style={{ x: mousePos.x * 0.5, y: mousePos.y * 0.5 }}
      >
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="living-svg">
          {/* Trajectories and moving arrows */}
          
          <defs>
            <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="rgba(255,255,255,0.6)" />
            </marker>
          </defs>

          {/* Path 1 with Arrow */}
          <path id="trajectory1" d="M -100 200 Q 400 800 1100 100" fill="none" stroke="url(#lineGrad1)" strokeWidth="0.5" strokeDasharray="4 8" />
          <motion.circle r="3" fill="none">
            <animateMotion dur="12s" repeatCount="indefinite" path="M -100 200 Q 400 800 1100 100">
              <mpath href="#trajectory1" />
            </animateMotion>
          </motion.circle>
          
          {/* We simulate the arrow moving by animating pathLength/Offset of a short segment with an arrowhead */}
          <motion.path
            d="M -100 200 Q 400 800 1100 100"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
            initial={{ pathLength: 0, pathOffset: 1 }}
            animate={{ pathLength: [0, 0.05, 0], pathOffset: [1, 0, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {/* Path 2 */}
          <path id="trajectory2" d="M -100 800 Q 500 200 1100 900" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          <motion.path
            d="M -100 800 Q 500 200 1100 900"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{ pathLength: [0, 0.03, 0], pathOffset: [0, 1, 1] }}
            transition={{ duration: 20, delay: 5, repeat: Infinity, ease: "linear" }}
          />

          {/* Grid lines (very subtle) */}
          <line x1="200" y1="0" x2="200" y2="1000" stroke="rgba(255,255,255,0.01)" strokeWidth="1" />
          <line x1="800" y1="0" x2="800" y2="1000" stroke="rgba(255,255,255,0.01)" strokeWidth="1" />
          <line x1="0" y1="400" x2="1000" y2="400" stroke="rgba(255,255,255,0.01)" strokeWidth="1" />
        </svg>
      </motion.div>
    </div>
  );
};
