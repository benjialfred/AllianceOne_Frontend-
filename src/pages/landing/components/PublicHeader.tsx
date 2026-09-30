import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ArrowRight, Layout, Cpu, ShieldCheck, Box, Code2, Users, 
  BookOpen, LineChart, Database, Briefcase, ShoppingBag, Menu, X, Home, Info, Mail
} from 'lucide-react';
import { AllianceLogo } from '../../../design-system/components/AllianceLogo';
import { useCartStore } from '../../../core/stores/cartStore';
import './PublicHeader.css';
import './PublicMobileNav.css'; // New CSS for mobile specific styling

export const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items, setIsOpen: setCartOpen } = useCartStore();

  useEffect(() => {
    setActiveMenu(null);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  const handleMouseEnter = (menu: string) => setActiveMenu(menu);
  const handleMouseLeave = () => setActiveMenu(null);

  const popoverVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: 5, scale: 0.98, filter: 'blur(4px)', transition: { duration: 0.15, ease: "easeIn" } }
  };

  return (
    <>
      <header className="ao-dark-header" onMouseLeave={handleMouseLeave}>
        <div className="ao-dark-header-inner">
          {/* BRAND */}
          <div className="ao-brand-link" onClick={() => navigate('/')}>
            <div style={{ color: '#fff' }}>
              <AllianceLogo size={22} />
            </div>
            <span className="ao-brand-text">Alliance One</span>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="ao-dark-nav hidden-on-mobile">
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
                        <h4>Éducation & Académies</h4>
                        <p>Gestion d'établissements, notes, présences.</p>
                      </div>
                    </div>
                    <div className="dark-menu-item" onClick={() => navigate('/modules/retail')}>
                      <div className="dark-menu-icon"><Box size={16}/></div>
                      <div className="dark-menu-text">
                        <h4>Retail & Stocks</h4>
                        <p>Chaîne d'approvisionnement et points de vente.</p>
                      </div>
                    </div>
                    <div className="dark-menu-item" onClick={() => navigate('/modules/finance')}>
                      <div className="dark-menu-icon"><LineChart size={16}/></div>
                      <div className="dark-menu-text">
                        <h4>Finance & Trésorerie</h4>
                        <p>Facturation, rapprochement et analytique.</p>
                      </div>
                    </div>
                    <div className="dark-menu-item" onClick={() => navigate('/modules/hr')}>
                      <div className="dark-menu-icon"><Users size={16}/></div>
                      <div className="dark-menu-text">
                        <h4>Ressources Humaines</h4>
                        <p>Paie, recrutements et évaluations.</p>
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
                    <div className="dark-menu-item" onClick={() => navigate('/developers')}>
                      <div className="dark-menu-icon"><Code2 size={16}/></div>
                      <div className="dark-menu-text">
                        <h4>Développeurs (API)</h4>
                        <p>Documentation, webhooks et clés API.</p>
                      </div>
                    </div>
                    <div className="dark-menu-item" onClick={() => navigate('/partners')}>
                      <div className="dark-menu-icon"><Briefcase size={16}/></div>
                      <div className="dark-menu-text">
                        <h4>Réseau de Partenaires</h4>
                        <p>Agences, intégrateurs et consultants.</p>
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
          <div className="ao-dark-actions flex items-center gap-4">
            <button 
              className="text-white hover:text-zinc-300 transition-colors relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={20} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {items.length}
                </span>
              )}
            </button>
            <button className="ao-dark-btn-text hidden-on-mobile" onClick={() => navigate('/login')}>Se connecter</button>
            <button className="ao-dark-btn-primary hidden-on-mobile" onClick={() => navigate('/register')}>Déployer</button>
            
            {/* Mobile Hamburger Toggle */}
            <button 
              className="ao-mobile-hamburger" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} color="#fff" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM TABS */}
      <div className="ao-public-bottom-nav">
        <button className="ao-mobile-tab" onClick={() => navigate('/')}>
          <Home size={22} />
          <span>Accueil</span>
        </button>
        <button className="ao-mobile-tab" onClick={() => navigate('/login')}>
          <Users size={22} />
          <span>Connexion</span>
        </button>
        <button className="ao-mobile-tab" onClick={() => navigate('/ai')}>
          <Cpu size={22} />
          <span>IA</span>
        </button>
        <button className="ao-mobile-tab" onClick={() => navigate('/about')}>
          <Info size={22} />
          <span>À Propos</span>
        </button>
        <button className="ao-mobile-tab" onClick={() => navigate('/contact')}>
          <Mail size={22} />
          <span>Contact</span>
        </button>
      </div>

      {/* MOBILE FULLSCREEN MENU (HAMBURGER) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="ao-public-mobile-sheet"
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mobile-sheet-header">
              <div className="ao-brand-link" onClick={() => navigate('/')}>
                <AllianceLogo size={24} color="#fff" />
                <span className="ao-brand-text">Alliance One</span>
              </div>
              <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} color="#fff" />
              </button>
            </div>
            
            <motion.div 
              className="mobile-sheet-content"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.1
                  }
                }
              }}
            >
              <motion.div className="mobile-nav-group" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}>
                <h3>Plateforme</h3>
                <a onClick={() => { setIsMobileMenuOpen(false); navigate('/platform'); }}>Infrastructure Core</a>
                <a onClick={() => { setIsMobileMenuOpen(false); navigate('/ai'); }}>Alliance AI</a>
                <a onClick={() => { setIsMobileMenuOpen(false); navigate('/security'); }}>Sécurité & Conformité</a>
              </motion.div>
              
              <motion.div className="mobile-nav-group" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}>
                <h3>Solutions Métiers</h3>
                <a onClick={() => { setIsMobileMenuOpen(false); navigate('/modules/education'); }}>Éducation & Académies</a>
                <a onClick={() => { setIsMobileMenuOpen(false); navigate('/modules/retail'); }}>Retail & Stocks</a>
                <a onClick={() => { setIsMobileMenuOpen(false); navigate('/modules/finance'); }}>Finance & Trésorerie</a>
                <a onClick={() => { setIsMobileMenuOpen(false); navigate('/modules/hr'); }}>Ressources Humaines</a>
              </motion.div>
              
              <motion.div className="mobile-nav-group" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}>
                <h3>Écosystème</h3>
                <a onClick={() => { setIsMobileMenuOpen(false); navigate('/developers'); }}>Développeurs (API)</a>
                <a onClick={() => { setIsMobileMenuOpen(false); navigate('/partners'); }}>Réseau de Partenaires</a>
                <a onClick={() => { setIsMobileMenuOpen(false); navigate('/pricing'); }}>Tarifs</a>
              </motion.div>
            </motion.div>
            
            <div className="mobile-sheet-footer">
              <button className="ao-dark-btn-primary w-full" onClick={() => navigate('/register')}>Déployer un espace</button>
              <button className="ao-dark-btn-text w-full mt-2" style={{ color: '#fff' }} onClick={() => navigate('/contact')}>Contacter les ventes</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
