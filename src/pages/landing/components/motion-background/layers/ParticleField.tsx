import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const ParticleField: React.FC = () => {
  // Generate a stable set of random particles to avoid re-renders
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 40 + 20,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.5 + 0.1,
      offsetX: (Math.random() - 0.5) * 10,
      offsetY: (Math.random() - 0.5) * 10,
    }));
  }, []);

  return (
    <svg className="lmb-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
      {particles.map(p => (
        <motion.circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r={p.size}
          fill="rgba(255, 255, 255, 1)"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, p.opacity, p.opacity, 0],
            x: [0, p.offsetX],
            y: [0, p.offsetY],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </svg>
  );
};
