import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Layout, Cpu, ShieldCheck, Box, Code2, Users, BookOpen, LineChart, Database, Briefcase } from 'lucide-react';
import { AllianceLogo } from '../../../design-system/components/AllianceLogo';
import './PublicHeader.css';

export const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    setActiveMenu(null);
  }, [location.pathname]);

  const handleMouseEnter = (menu: string) => setActiveMenu(menu);
  const handleMouseLeave = () => setActiveMenu(null);

  const popoverVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: 5, scale: 0.98, filter: 'blur(4px)', transition: { duration: 0.15, ease: "easeIn" } }
  };

  return (
    <header className="ao-dark-header" onMouseLeave={handleMouseLeave}>
      <div className="ao-dark-header-inner">
        {/* BRAND */}
        <div className="ao-brand-link" onClick={() => navigate('/')}>
          <div style={{ color: '#fff' }}>
            <AllianceLogo size={22} />
          </div>
          <span className="ao-brand-text">Alliance One</span>
        </div>

        {/* NAVIGATION */}
        <nav className="ao-dark-nav">
          <div 
            className={`ao-dark-nav-item ${activeMenu === 'plateforme' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('plateforme')}
          >
            Plateforme <ChevronDown size={12} className="nav-chevron-dark" />
            
            <AnimatePresence>
              {activeMenu === 'plateforme' && (
                <motion.div 
                  className="ao-dark-popover"
                  variants={popoverVariants}
                  initial="hidden" animate="visible" exit="exit"
                >
                  <div className="dark-menu-item" onClick={() => navigate('/platform')}>
                    <div className="dark-menu-icon"><Layout size={16}/></div>
                    <div className="dark-menu-text">
                      <h4>Infrastructure Core</h4>
                      <p>Architecture distribuée et sécurité Zero-Trust.</p>
                    </div>
                  </div>
                  <div className="dark-menu-item" onClick={() => navigate('/ai')}>
                    <div className="dark-menu-icon"><Cpu size={16}/></div>
                    <div className="dark-menu-text">
                      <h4>Alliance AI</h4>
                      <p>Système nerveux intelligent et automatisation.</p>
                    </div>
                  </div>
                  <div className="dark-menu-item" onClick={() => navigate('/security')}>
                    <div className="dark-menu-icon"><ShieldCheck size={16}/></div>
                    <div className="dark-menu-text">
                      <h4>Sécurité</h4>
                      <p>Chiffrement E2E et conformité de classe mondiale.</p>
                    </div>
                  </div>
                  <div className="dark-menu-divider"></div>
                  <div className="dark-menu-footer">
                    <span>Prêt à passer à l'échelle ?</span>
                    <a onClick={() => navigate('/contact')}>Contacter les ventes <ArrowRight size={12}/></a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div 
            className={`ao-dark-nav-item ${activeMenu === 'solutions' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('solutions')}
          >
            Solutions <ChevronDown size={12} className="nav-chevron-dark" />
            
            <AnimatePresence>
              {activeMenu === 'solutions' && (
                <motion.div 
                  className="ao-dark-popover wide"
                  variants={popoverVariants}
                  initial="hidden" animate="visible" exit="exit"
                >
                  <div className="dark-menu-item" onClick={() => navigate('/modules/education')}>
                    <div className="dark-menu-icon"><BookOpen size={16}/></div>
                    <div className="dark-menu-text">
                      <h4>Education</h4>
                      <p>Écoles, Universités, Formation</p>
                    </div>
                  </div>
                  <div className="dark-menu-item" onClick={() => navigate('/modules/finance')}>
                    <div className="dark-menu-icon"><LineChart size={16}/></div>
                    <div className="dark-menu-text">
                      <h4>Finance</h4>
                      <p>Trésorerie, Facturation, Comptabilité</p>
                    </div>
                  </div>
                  <div className="dark-menu-item" onClick={() => navigate('/modules/inventory')}>
                    <div className="dark-menu-icon"><Database size={16}/></div>
                    <div className="dark-menu-text">
                      <h4>Inventory</h4>
                      <p>Logistique, Stocks, Approvisionnement</p>
                    </div>
                  </div>
                  <div className="dark-menu-item" onClick={() => navigate('/modules/hr')}>
                    <div className="dark-menu-icon"><Users size={16}/></div>
                    <div className="dark-menu-text">
                      <h4>HR & People</h4>
                      <p>Paie, Talents, Gestion du personnel</p>
                    </div>
                  </div>
                  <div className="dark-menu-item" onClick={() => navigate('/modules/crm')}>
                    <div className="dark-menu-icon"><Briefcase size={16}/></div>
                    <div className="dark-menu-text">
                      <h4>CRM</h4>
                      <p>Ventes, Clients, Support</p>
                    </div>
                  </div>
                  <div className="dark-menu-item" onClick={() => navigate('/modules')}>
                    <div className="dark-menu-icon"><Layout size={16}/></div>
                    <div className="dark-menu-text">
                      <h4>Tous les modules</h4>
                      <p>Voir la suite complète intégrée</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div 
            className={`ao-dark-nav-item ${activeMenu === 'ecosysteme' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('ecosysteme')}
          >
            Écosystème <ChevronDown size={12} className="nav-chevron-dark" />

            <AnimatePresence>
              {activeMenu === 'ecosysteme' && (
                <motion.div 
                  className="ao-dark-popover"
                  variants={popoverVariants}
                  initial="hidden" animate="visible" exit="exit"
                >
                  <div className="dark-menu-item" onClick={() => navigate('/marketplace')}>
                    <div className="dark-menu-icon"><Box size={16}/></div>
                    <div className="dark-menu-text">
                      <h4>Marketplace</h4>
                      <p>Plugins et extensions de la communauté.</p>
                    </div>
                  </div>
                  <div className="dark-menu-item" onClick={() => navigate('/developer-center')}>
                    <div className="dark-menu-icon"><Code2 size={16}/></div>
                    <div className="dark-menu-text">
                      <h4>Developer Platform</h4>
                      <p>APIs, SDKs, Webhooks, et Documentation.</p>
                    </div>
                  </div>
                  <div className="dark-menu-item" onClick={() => navigate('/integrations')}>
                    <div className="dark-menu-icon"><ArrowRight size={16}/></div>
                    <div className="dark-menu-text">
                      <h4>Intégrations Natives</h4>
                      <p>Google Workspace, Microsoft 365, AWS.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div 
            className="ao-dark-nav-item" 
            onClick={() => navigate('/pricing')}
            onMouseEnter={() => handleMouseLeave()}
          >
            Tarifs
          </div>
        </nav>

        {/* ACTIONS */}
        <div className="ao-dark-actions">
          <button className="ao-dark-btn-text" onClick={() => navigate('/login')}>Se connecter</button>
          <button className="ao-dark-btn-primary" onClick={() => navigate('/register')}>Déployer maintenant</button>
        </div>
      </div>
    </header>
  );
};
