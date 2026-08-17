/**
 * ALLIANCE ONE — CINEMATIC MODULE LAUNCH TRANSITION
 * Animation spatiale fluide de 350ms accompagnant le passage du Hub vers le module métier.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModuleLaunchTransitionProps {
  isLaunching: boolean;
  moduleName: string;
  moduleColor: string;
  moduleIcon?: React.ComponentType<{ size?: number; color?: string }>;
}

export const ModuleLaunchTransition: React.FC<ModuleLaunchTransitionProps> = ({
  isLaunching,
  moduleName,
  moduleColor,
  moduleIcon: Icon
}) => {
  if (!isLaunching) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="module-launch-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(7, 10, 18, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 1.05, opacity: 0, y: -10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: `${moduleColor}25`,
              border: `2px solid ${moduleColor}60`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 32px ${moduleColor}30`
            }}
          >
            {Icon && <Icon size={32} color={moduleColor} />}
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Chargement de l'environnement
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: '2px 0 0', letterSpacing: '-0.03em' }}>
              {moduleName}
            </h2>
          </div>

          <div
            style={{
              width: '120px',
              height: '3px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '9999px',
              overflow: 'hidden',
              marginTop: '8px'
            }}
          >
            <motion.div
              style={{
                width: '100%',
                height: '100%',
                background: moduleColor,
                borderRadius: '9999px'
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
