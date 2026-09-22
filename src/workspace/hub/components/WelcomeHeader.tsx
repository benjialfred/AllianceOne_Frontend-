import React from 'react';
import { motion } from 'framer-motion';
import { usePlatformStore } from '../../../core/stores/platformStore';
import { useAuthStore } from '../../../core/stores/authStore';

export const WelcomeHeader: React.FC = () => {
  const currentOrg = usePlatformStore((s) => s.currentOrganization);
  const user = useAuthStore((s) => s.user);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 18 ? 'Bonjour' : 'Bonsoir';
  };

  const name = user?.first_name || '';

  return (
    <motion.header 
      className="ao-welcome-header"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="ao-welcome-title">{getGreeting()}{name ? `, ${name}` : ''}. Bienvenue sur Alliance One.</h1>
        <p className="ao-welcome-subtitle">
          {currentOrg?.name || 'Collège & Lycée Bilingue Émergence'} · Espace Opérationnel
        </p>
      </div>

      <div className="ao-system-status">
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ao-color-success-text)' }} />
        Système En Ligne
      </div>
    </motion.header>
  );
};
