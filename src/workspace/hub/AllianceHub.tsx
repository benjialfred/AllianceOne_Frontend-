import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlatformStore } from '../../../core/stores/platformStore';
import { useAuthStore } from '../../../core/stores/authStore';
import { 
  Users, Activity, Boxes, Settings, Clock, CheckCircle, 
  ChevronRight, Command, Search, Sparkles, TrendingUp, AlertTriangle, Shield, Wallet
} from 'lucide-react';
import './OsHub.css';

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
        
        {/* OMNIBAR */}
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

        {/* MAIN LAYOUT */}
        <div className="os-dashboard-split">
          
          {/* LEFT: COMMAND CENTER */}
          <div className="os-dashboard-main">
            
            {/* PLATFORM PURPOSE BANNER */}
            <motion.div 
              className="os-welcome-banner"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="os-banner-content">
                <h1 className="os-banner-title">
                  Bienvenue sur Alliance One.
                </h1>
                <p className="os-banner-desc">
                  Votre centre de commandement organisationnel unifié. Alliance One orchestre vos finances, centralise votre logistique et pilote vos opérations académiques en temps réel, grâce à l'intelligence artificielle.
                </p>
                <div className="os-banner-stats">
                  <div className="os-banner-stat">
                    <span className="obs-value">99.9%</span>
                    <span className="obs-label">Disponibilité Système</span>
                  </div>
                  <div className="os-banner-stat">
                    <span className="obs-value">4</span>
                    <span className="obs-label">Modules Actifs</span>
                  </div>
                  <div className="os-banner-stat">
                    <span className="obs-value">Chiffré</span>
                    <span className="obs-label">Sécurité de bout en bout</span>
                  </div>
                </div>
              </div>
              <div className="os-banner-visual">
                <Shield size={120} color="rgba(255,255,255,0.05)" strokeWidth={1} />
              </div>
            </motion.div>

            {/* CRITICAL MODULES OVERVIEW */}
            <motion.div 
              className="os-modules-overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="os-section-title">État de l'Organisation</h2>
              <div className="os-modules-grid">
                
                {/* FINANCE */}
                <div className="os-module-card" onClick={() => navigate('/app/finance')}>
                  <div className="omc-header">
                    <div className="omc-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                      <Wallet size={20} />
                    </div>
                    <div className="omc-name">Finances</div>
                  </div>
                  <div className="omc-body">
                    <div className="omc-kpi">
                      <span className="omc-kpi-val">124.5M FCFA</span>
                      <span className="omc-kpi-lab">Trésorerie globale</span>
                    </div>
                    <div className="omc-status positive">
                      <TrendingUp size={14} /> +12% ce mois
                    </div>
                  </div>
                </div>

                {/* INVENTORY */}
                <div className="os-module-card" onClick={() => navigate('/app/inventory')}>
                  <div className="omc-header">
                    <div className="omc-icon" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                      <Boxes size={20} />
                    </div>
                    <div className="omc-name">Logistique</div>
                  </div>
                  <div className="omc-body">
                    <div className="omc-kpi">
                      <span className="omc-kpi-val">8,402</span>
                      <span className="omc-kpi-lab">Articles en stock</span>
                    </div>
                    <div className="omc-status warning">
                      <AlertTriangle size={14} /> 12 ruptures imminentes
                    </div>
                  </div>
                </div>

                {/* EDUCATION */}
                <div className="os-module-card" onClick={() => navigate('/app/education')}>
                  <div className="omc-header">
                    <div className="omc-icon" style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
                      <Users size={20} />
                    </div>
                    <div className="omc-name">Éducation Pro</div>
                  </div>
                  <div className="omc-body">
                    <div className="omc-kpi">
                      <span className="omc-kpi-val">1,250</span>
                      <span className="omc-kpi-lab">Élèves inscrits</span>
                    </div>
                    <div className="omc-status positive">
                      <CheckCircle size={14} /> 98% de présence
                    </div>
                  </div>
                </div>

                {/* TASKS */}
                <div className="os-module-card" onClick={() => navigate('/app/tasks')}>
                  <div className="omc-header">
                    <div className="omc-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                      <Activity size={20} />
                    </div>
                    <div className="omc-name">Opérations</div>
                  </div>
                  <div className="omc-body">
                    <div className="omc-kpi">
                      <span className="omc-kpi-val">24</span>
                      <span className="omc-kpi-lab">Tâches actives</span>
                    </div>
                    <div className="omc-status warning">
                      <Clock size={14} /> 3 échéances aujourd'hui
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

          {/* RIGHT: INTELLIGENCE & ACTION */}
          <div className="os-dashboard-side">
            
            <motion.div 
              className="os-side-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="os-panel-header ai">
                <Sparkles size={16} /> Alliance Intelligence
              </div>
              <div className="os-panel-body">
                <p className="os-ai-insight">
                  J'ai analysé vos flux de trésorerie récents. Vous pourriez optimiser vos achats de matériel scolaire en consolidant vos commandes auprès du fournisseur <strong>Bata</strong>.
                </p>
                <button className="os-ai-action">Voir l'analyse détaillée</button>
              </div>
            </motion.div>

            <motion.div 
              className="os-side-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="os-panel-header">
                Requiert votre attention
              </div>
              <div className="os-action-list">
                <div className="os-action-item">
                  <div className="oai-dot urgent" />
                  <div className="oai-content">
                    <h4>Validation de Bon de Commande #PO-102</h4>
                    <span>12,000,000 FCFA - Équipement IT</span>
                  </div>
                </div>
                <div className="os-action-item">
                  <div className="oai-dot warning" />
                  <div className="oai-content">
                    <h4>Clôture comptable T3</h4>
                    <span>Échéance dans 4 jours</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};
