import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlatformStore } from '../../../core/stores/platformStore';
import { useAuthStore } from '../../../core/stores/authStore';
import { 
  Users, Activity, Boxes, Settings, Clock, CheckCircle, 
  ChevronRight, Command, Search, Sparkles 
} from 'lucide-react';
import './OsHub.css'; // We'll create this

const apps = [
  { id: 'education', name: 'Éducation Pro', desc: 'Scolarité & Académique', icon: Users, color: '#4f46e5', route: '/app/education' },
  { id: 'finance', name: 'Finances', desc: 'Trésorerie & Facturation', icon: Activity, color: '#059669', route: '/app/finance' },
  { id: 'inventory', name: 'Logistique', desc: 'Stocks & Inventaires', icon: Boxes, color: '#0ea5e9', route: '/app/inventory' },
  { id: 'library', name: 'Ressources', desc: 'Bibliothèque & Prêts', icon: BookOpen, color: '#8b5cf6', route: '/app/library' },
  { id: 'tasks', name: 'Projets', desc: 'Tâches & Opérations', icon: CheckCircle, color: '#f59e0b', route: '/app/tasks' },
  { id: 'settings', name: 'Système', desc: 'Configuration', icon: Settings, color: '#64748b', route: '/app/settings' },
];

import { BookOpen } from 'lucide-react'; // Fix missing import

export const AllianceHub: React.FC = () => {
  const currentOrg = usePlatformStore((s) => s.currentOrganization);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="os-hub-root">
      
      {/* BACKGROUND EFFECTS */}
      <div className="os-hub-bg-gradient" />
      <div className="os-hub-mesh" />

      <div className="os-hub-container">
        
        {/* TOP: OMNIBAR (Like Apple Spotlight) */}
        <motion.div 
          className="os-omnibar-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className={`os-omnibar ${searchFocused ? 'focused' : ''}`}>
            <Search size={20} className="os-omnibar-icon" />
            <input 
              type="text" 
              placeholder="Que souhaitez-vous accomplir aujourd'hui ?" 
              className="os-omnibar-input"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <div className="os-omnibar-shortcut">
              <Command size={14} /> K
            </div>
          </div>
        </motion.div>

        {/* MIDDLE: WELCOME & INSIGHTS */}
        <motion.div 
          className="os-welcome-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="os-welcome-text">
            Bonjour, {user?.first_name || 'Directeur'}.
          </h1>
          <p className="os-welcome-subtext">
            {currentOrg?.name || 'Organisation Non Définie'} est en ligne et opérationnelle.
          </p>
        </motion.div>

        {/* CRITICAL INFOS (Pending approvals, active workflows) */}
        <motion.div 
          className="os-critical-cards"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="os-critical-card warning">
            <div className="os-critical-icon"><Clock size={18} /></div>
            <div className="os-critical-content">
              <h3>3 Approbations en attente</h3>
              <p>Factures et bons de commandes nécessitent votre signature.</p>
            </div>
            <ChevronRight size={16} className="os-critical-arrow" />
          </div>

          <div className="os-critical-card success">
            <div className="os-critical-icon"><Sparkles size={18} /></div>
            <div className="os-critical-content">
              <h3>Alliance AI Active</h3>
              <p>Le système a optimisé 4 flux logistiques cette nuit.</p>
            </div>
            <ChevronRight size={16} className="os-critical-arrow" />
          </div>
        </motion.div>

        {/* BOTTOM: LAUNCHPAD (App Grid) */}
        <motion.div 
          className="os-launchpad"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="os-launchpad-title">Vos Applications</h2>
          <div className="os-app-grid">
            {apps.map((app) => (
              <button 
                key={app.id} 
                className="os-app-card"
                onClick={() => navigate(app.route)}
              >
                <div className="os-app-icon-wrapper" style={{ background: `linear-gradient(135deg, ${app.color} 0%, ${app.color}dd 100%)` }}>
                  <app.icon size={28} color="#ffffff" strokeWidth={1.5} />
                </div>
                <div className="os-app-name">{app.name}</div>
                <div className="os-app-desc">{app.desc}</div>
              </button>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};
