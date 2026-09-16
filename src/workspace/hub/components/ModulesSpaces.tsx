/**
 * ALLIANCE OS — MODULE SPACES
 * Semantic module panels. Not just links, but living application states.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, BarChart, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlatformStore } from '../../../core/stores/platformStore';
import { ALLIANCE_MODULES } from '../../../core/modules/registry';
import './OsComponents.css';

const getModuleStats = (moduleId: string) => {
  switch (moduleId) {
    case 'education': return { primary: '1 248', label: 'élèves inscrits', secondary: '36 classes actives' };
    case 'finance': return { primary: '25,6 M', label: 'FCFA · Trésorerie', secondary: '12 opérations ce jour' };
    case 'inventory': return { primary: '1 580', label: 'références', secondary: '3 alertes niveau bas' };
    case 'tasks': return { primary: '24', label: 'projets actifs', secondary: '12 tâches urgentes' };
    case 'library': return { primary: '4 500', label: 'ouvrages', secondary: '14 retards signalés' };
    case 'crm': return { primary: '142', label: 'prospects', secondary: '4 deals en cours' };
    case 'ai-assistant': return { primary: '99%', label: 'précision', secondary: '12 insights générés' };
    case 'healthcare': return { primary: '42', label: 'patients', secondary: '3 urgences' };
    default: return { primary: 'Actif', label: 'module', secondary: 'En ligne' };
  }
};

export const ModulesSpaces: React.FC = () => {
  const navigate = useNavigate();
  const currentOrg = usePlatformStore(s => s.currentOrganization);
  
  const activeModuleIds = currentOrg?.active_modules && currentOrg.active_modules.length > 0
    ? currentOrg.active_modules
    : ['education', 'finance', 'inventory'];

  const activeSpaces = ALLIANCE_MODULES.filter(m => activeModuleIds.includes(m.id));

  return (
    <section className="os-section">
      <h3 className="os-section-title">Mes Espaces</h3>
      <div className="os-spaces-grid">
        {activeSpaces.map((space, index) => {
          const stats = getModuleStats(space.id);
          return (
            <motion.div 
              key={space.id}
              className="os-space-card os-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
              onClick={() => navigate(space.routePath)}
            >
              <div className="os-space-icon" style={{ color: space.accentColor, backgroundColor: `${space.accentColor}20` }}>
                <space.icon size={20} />
              </div>
              <div className="os-space-content">
                <h4>{space.name}</h4>
                <div className="os-space-stat">
                  <span className="os-stat-val">{stats.primary}</span>
                  <span className="os-stat-lbl">{stats.label}</span>
                </div>
                {stats.secondary && (
                  <span className="os-space-substat">{stats.secondary}</span>
                )}
              </div>
              <div className="os-space-action">
                <span>Ouvrir</span>
                <ArrowRight size={14} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
