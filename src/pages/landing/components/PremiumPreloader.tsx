import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PremiumPreloader.css';

export const PremiumPreloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the preloader after a set duration (e.g., 3.2s)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="premium-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="preloader-scene">
            <svg className="preloader-svg" viewBox="0 0 100 100">
              {/* Outer Glowing Ring */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(37, 99, 235, 0.2)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0, rotate: -90 }}
                animate={{ pathLength: 1, opacity: 1, rotate: 270 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              
              {/* Central Core - 3D drawing simulation */}
              <motion.path
                d="M50 20 L80 40 L80 70 L50 90 L20 70 L20 40 Z"
                fill="none"
                stroke="url(#ao-preloader-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }}
              />
              
              {/* Inner connecting lines (the "A" / "O" structure) */}
              <motion.path
                d="M50 20 L50 50 M20 40 L50 50 M80 40 L50 50 M20 70 L50 90 M80 70 L50 90"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              />
              
              {/* Glowing Center */}
              <motion.circle
                cx="50"
                cy="50"
                r="6"
                fill="#ffffff"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
                transition={{ duration: 0.8, delay: 1.5, ease: "backOut" }}
                style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.8))' }}
              />

              <defs>
                <linearGradient id="ao-preloader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
            
            <motion.div 
              className="preloader-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              INITIALIZING ALLIANCE ONE
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
