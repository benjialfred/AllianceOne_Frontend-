import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Stethoscope, Package, Building2, Landmark, GraduationCap, FolderKanban } from 'lucide-react';
import { usePlatformStore } from '../core/stores/platformStore';
import type { Organization } from '../core/api/types';
import { useNavigate } from 'react-router-dom';
import './ModuleSelector.css';

const MODULES = [
  {
    id: 'education',
    name: 'Éducation',
    description: 'Gestion scolaire complète (inscriptions, notes, emplois du temps).',
    icon: <GraduationCap size={32} />,
    color: 'var(--color-primary-500)',
    active: true, // Seul ce module est cliquable pour l'instant
  },
  {
    id: 'healthcare',
    name: 'Santé',
    description: 'Dossiers patients, consultations, pharmacie et facturation.',
    icon: <Stethoscope size={32} />,
    color: '#10B981',
    active: false,
  },
  {
    id: 'inventory',
    name: 'Stocks & Logistique',
    description: 'Gestion multi-dépôts, valorisation PMP, flux, approvisionnements et inventaires.',
    icon: <Package size={32} />,
    color: '#0e121b',
    active: true,
  },
  {
    id: 'tasks',
    name: 'Tâches & Projets',
    description: 'Tableaux Kanban, gestion de projets, jalons, sous-tâches et suivi du temps.',
    icon: <FolderKanban size={32} />,
    color: '#4f46e5',
    active: true,
  },
  {
    id: 'library',
    name: 'Bibliothèque & CDI',
    description: 'Gestion du fonds documentaire, des prêts et des retards.',
    icon: <BookOpen size={32} />,
    color: '#3B82F6',
    active: true,
  },
  {
    id: 'finance',
    name: 'Finance & Trésorerie',
    description: 'Gestion multi-devises, trésorerie, budgets prévisionnels et facturation.',
    icon: <Landmark size={32} />,
    color: '#059669',
    active: true,
  }
];

export const ModuleSelector: React.FC = () => {
  const setCurrentModule = usePlatformStore((s) => s.setCurrentModule);
  const setOrganization = usePlatformStore((s) => s.setOrganization);
  const navigate = useNavigate();

  const handleSelect = (modId: string) => {
    // 1. Sélectionner le module
    setCurrentModule(modId);
    
    setOrganization({
      id: 'platform_admin',
      name: 'Alliance One Default',
    } as Organization);
    
    // 3. Naviguer vers le namespace correspondant si défini
    if (modId === 'education') {
      navigate('/education');
    } else if (modId === 'inventory') {
      navigate('/inventory');
    } else if (modId === 'tasks') {
      navigate('/tasks');
    } else if (modId === 'finance') {
      navigate('/finance');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="module-selector-backdrop">
      <motion.div 
        className="module-selector-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1>Bienvenue sur Alliance One</h1>
        <p>Sélectionnez le module d'exploitation pour démarrer votre session.</p>
      </motion.div>

      <motion.div 
        className="module-selector-grid"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
      >
        {MODULES.map((mod, i) => (
          <motion.button
            key={mod.id}
            className={`module-card ${!mod.active ? 'disabled' : ''}`}
            onClick={() => mod.active && handleSelect(mod.id)}
            whileHover={mod.active ? { y: -5, boxShadow: '0 12px 24px -10px rgba(0,0,0,0.15)' } : {}}
            whileTap={mod.active ? { scale: 0.98 } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (i * 0.05) }}
          >
            <div className="module-card-icon" style={{ color: mod.color, backgroundColor: `${mod.color}15` }}>
              {mod.icon}
            </div>
            <div className="module-card-content">
              <h3>{mod.name}</h3>
              <p>{mod.description}</p>
            </div>
            {!mod.active && (
              <div className="module-card-badge">Bientôt disponible</div>
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};
