import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlatformStore } from '../../core/stores/platformStore';
import { useAuthStore } from '../../core/stores/authStore';
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

              {/* CENTRAL GRAPH */}
              <div style={{ marginTop: '2rem' }}>
                <h2 className="os-section-title">Performances & Croissance</h2>
                <div className="os-chart-container" style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '16px', 
                  padding: '1.5rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f8fafc' }}>Volume Transactionnel Global</div>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Sur les 30 derniers jours</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} /> Revenus
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Opérations
                      </div>
                    </div>
                  </div>
                  
                  {/* BEAUTIFUL SVG CHART */}
                  <div style={{ width: '100%', height: '220px', position: 'relative' }}>
                    <svg viewBox="0 0 800 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="chart-grad-blue" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                          <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                        </linearGradient>
                        <linearGradient id="chart-grad-green" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(16, 185, 129, 0.3)" />
                          <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      {[0, 50, 100, 150].map((y, i) => (
                        <g key={`grid-${i}`}>
                          <line x1="0" y1={y} x2="800" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                          <text x="0" y={y - 5} fill="#475569" fontSize="10" fontFamily="sans-serif">
                            {((150 - y) / 1.5)}k
                          </text>
                        </g>
                      ))}

                      {/* Green Line (Operations) */}
                      <path 
                        d="M 50 160 C 150 150, 250 180, 350 120 C 450 60, 550 140, 650 90 C 750 40, 800 20, 800 20 L 800 200 L 50 200 Z" 
                        fill="url(#chart-grad-green)" 
                      />
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                        d="M 50 160 C 150 150, 250 180, 350 120 C 450 60, 550 140, 650 90 C 750 40, 800 20, 800 20" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                      />

                      {/* Blue Line (Revenue) */}
                      <path 
                        d="M 50 180 C 200 160, 300 90, 450 100 C 600 110, 650 50, 800 30 L 800 200 L 50 200 Z" 
                        fill="url(#chart-grad-blue)" 
                      />
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.4 }}
                        d="M 50 180 C 200 160, 300 90, 450 100 C 600 110, 650 50, 800 30" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                      />
                      
                      {/* Interactive / Hover Dots (simulated) */}
                      <circle cx="800" cy="30" r="5" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="800" cy="20" r="5" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    </svg>
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
