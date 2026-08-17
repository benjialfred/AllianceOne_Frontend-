import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { identityApi } from '../core/api/identity';
import type { Organization } from '../core/api/types';
import { usePlatformStore } from '../core/stores/platformStore';
import { Logo } from '../design-system/components/Logo';
import './OrgSelector.css';

/**
 * Écran de sélection d'organisation.
 * Affiché au démarrage avant d'accéder au Workspace Shell.
 */
export const OrgSelector: React.FC = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setOrganization = usePlatformStore((s) => s.setOrganization);
  const navigate = useNavigate();

  useEffect(() => {
    identityApi
      .getOrganizations()
      .then((data) => {
        setOrgs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSelect = (org: Organization) => {
    setOrganization(org);
    navigate('/dashboard'); // Redirection vers le dashboard
  };

  return (
    <div className="org-selector-backdrop">
      <motion.div
        className="org-selector-card glass-panel"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="org-selector-header">
          <div className="org-selector-logo" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Logo size={52} showText showMotto />
          </div>
          <h1>Sélectionnez votre espace</h1>
          <p>Choisissez l'organisation dans laquelle vous souhaitez travailler aujourd'hui.</p>
        </div>

        <div className="org-selector-list">
          {loading && (
            <div className="org-selector-empty">
              <Loader2 className="org-selector-spinner" size={24} />
              <span>Chargement des organisations...</span>
            </div>
          )}

          {error && (
            <div className="org-selector-error">
              <p>Erreur de connexion au serveur.</p>
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && orgs.length === 0 && (
            <div className="org-selector-empty">
              <Building2 size={32} />
              <span>Aucune organisation trouvée.</span>
            </div>
          )}

          <AnimatePresence>
            {orgs.map((org, i) => (
              <motion.button
                key={org.id}
                className="org-selector-item"
                onClick={() => handleSelect(org)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="org-selector-item-icon">
                  <Building2 size={20} />
                </div>
                <div className="org-selector-item-info">
                  <span className="org-selector-item-name">{org.name}</span>
                  {org.legal_name && (
                   <span className="org-selector-item-legal">{org.legal_name}</span>
                  )}
                </div>
                <ChevronRight size={18} className="org-selector-item-arrow" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            Vous êtes administrateur de la plateforme ?
          </p>
          <button 
            onClick={() => handleSelect({ id: 'platform_admin', name: 'Administration Alliance One' } as Organization)}
            style={{ 
              background: 'var(--color-surface-hover)', 
              border: '1px solid var(--color-border)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              color: 'var(--color-text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            Accéder au Dashboard Principal
          </button>
        </div>
      </motion.div>
    </div>
  );
};
