import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';

export type CursorState = 'default' | 'view' | 'open' | 'explore' | 'hide';

export interface ContextualCursorProps {
  cursorState: CursorState;
}

export const ContextualCursor: React.FC<ContextualCursorProps> = ({ cursorState }) => {
  const isReducedMotion = useReducedMotion();
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });

  // Spring physics for smooth trailing
  const springConfig = { stiffness: 600, damping: 35, mass: 0.5 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  useEffect(() => {
    if (isReducedMotion) return;
    
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [isReducedMotion, cursorX, cursorY]);

  if (isReducedMotion) return null;

  const variants = {
    default: { width: 12, height: 12, backgroundColor: '#ffffff', opacity: 1 },
    view: { width: 64, height: 64, backgroundColor: '#ffffff', opacity: 1 },
    open: { width: 64, height: 64, backgroundColor: '#ffffff', opacity: 1 },
    explore: { width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.5)', opacity: 1 },
    hide: { width: 0, height: 0, opacity: 0 }
  };

  const textVariants = {
    default: { opacity: 0 },
    view: { opacity: 1 },
    open: { opacity: 1 },
    explore: { opacity: 1, color: '#ffffff' },
    hide: { opacity: 0 }
  };

  let text = '';
  if (cursorState === 'view') text = 'VIEW';
  if (cursorState === 'open') text = 'OPEN';
  if (cursorState === 'explore') text = 'EXPLORE';

  return (
    <motion.div
      className="founder-cursor"
      style={{
        x: cursorX,
        y: cursorY,
        pointerEvents: 'none' // Ensure the cursor itself doesn't block clicks
      }}
      variants={variants}
      animate={cursorState}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    >
      <motion.span 
        className="founder-cursor-text"
        variants={textVariants}
        animate={cursorState}
        transition={{ duration: 0.2 }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};
