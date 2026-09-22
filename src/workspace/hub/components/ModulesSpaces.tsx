import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Package, Landmark, FolderKanban, BookOpen, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlatformStore } from '../../../core/stores/platformStore';

const getModuleData = (moduleId: string) => {
  switch (moduleId) {
    case 'education': return { name: 'Éducation Pro', icon: GraduationCap, color: 'var(--ao-color-alliance-blue)', primary: '1 248', label: 'élèves', secondary: '36 classes actives', path: '/app/education' };
    case 'finance': return { name: 'Finances & Trésorerie', icon: Landmark, color: 'var(--ao-color-success-text)', primary: '25,6 M', label: 'FCFA', secondary: '12 opérations ce jour', path: '/app/finance' };
    case 'inventory': return { name: 'Stocks & Logistique', icon: Package, color: '#0ea5e9', primary: '1 580', label: 'références', secondary: '3 alertes niveau bas', path: '/app/inventory' };
    case 'tasks': return { name: 'Tâches & Projets', icon: FolderKanban, color: '#8b5cf6', primary: '24', label: 'projets', secondary: '12 tâches urgentes', path: '/app/tasks' };
    case 'library': return { name: 'Bibliothèque & CDI', icon: BookOpen, color: '#3b82f6', primary: '4 500', label: 'ouvrages', secondary: '14 retards', path: '/app/library' };
    default: return { name: 'Module', icon: Box, color: '#64748b', primary: 'Actif', label: '', secondary: 'En ligne', path: '/app' };
  }
};

export const ModulesSpaces: React.FC = () => {
  const navigate = useNavigate();
  const currentOrg = usePlatformStore(s => s.currentOrganization);
  
  const activeModuleIds = currentOrg?.active_modules && currentOrg.active_modules.length > 0
    ? currentOrg.active_modules
    : ['education', 'finance', 'inventory'];

  return (
    <section>
      <div className="ao-section-title">
        <div style={{ width: 4, height: 4, background: 'var(--ao-color-text-tertiary)', borderRadius: '50%' }} />
        Espaces Opérationnels
      </div>
      <div className="ao-spaces-grid">
        {activeModuleIds.map((id, index) => {
          const mod = getModuleData(id);
          const Icon = mod.icon;
          return (
            <motion.div 
              key={id}
              className="ao-glass-panel ao-space-card ao-glass-panel-interactive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => navigate(mod.path)}
            >
              <div className="ao-space-icon-wrapper" style={{ color: mod.color, backgroundColor: `${mod.color}15` }}>
                <Icon size={20} />
              </div>
              <div className="ao-space-title">{mod.name}</div>
              <div className="ao-space-stats">
                <span className="ao-stat-value">{mod.primary}</span>
                <span className="ao-stat-label">{mod.label}</span>
              </div>
              <div className="ao-space-secondary-stat">{mod.secondary}</div>
              
              <div className="ao-space-footer">
                <span>Accéder à l'espace</span>
                <ArrowRight size={14} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
