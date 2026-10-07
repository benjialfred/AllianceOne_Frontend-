import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ArrowRight, Layout, Cpu, ShieldCheck, Box, Code2, Users, 
  BookOpen, LineChart, Database, Briefcase, ShoppingBag, Menu, X, Home, Info, Mail,
  Server, Zap, CreditCard, Search, Settings, LayoutDashboard
} from 'lucide-react';
import { AllianceLogo } from '../../../design-system/components/AllianceLogo';
import { useCartStore } from '../../../core/stores/cartStore';
import { useAuthStore } from '../../../core/stores/authStore';
import './PublicHeader.css';
import './PublicMobileNav.css'; // New CSS for mobile specific styling

export const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { items, setIsOpen: setCartOpen } = useCartStore();
  const { isAuthenticated } = useAuthStore();

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
          {location.pathname !== '/contact' && location.pathname !== '/settings' ? (
            <nav className="ao-dark-nav hidden-on-mobile">
              <div className="ao-dark-nav-item" onClick={() => navigate('/services')}>
                <Box size={16} />
                <span>Modules</span>
              </div>
              <div className="ao-dark-nav-item" onClick={() => navigate('/ai')}>
                <Cpu size={16} />
                <span>Alliance IA</span>
              </div>
              <div className="ao-dark-nav-item" onClick={() => navigate('/boost')}>
                <Zap size={16} />
                <span>Alliance Boost</span>
              </div>
              <div className="ao-dark-nav-item" onClick={() => navigate('/pricing')}>
                <CreditCard size={16} />
                <span>Tarifs</span>
              </div>
              <div className="ao-dark-nav-item" onClick={() => navigate('/contact')}>
                <Mail size={16} />
                <span>Contact</span>
              </div>
            </nav>
          ) : (
            <div className="hidden-on-mobile" style={{ flex: 1 }}></div>
          )}

          {/* ACTIONS */}
          <div className="ao-dark-actions">
            <div className="ao-dark-search-container hidden-on-mobile" style={{ display: 'flex', alignItems: 'center' }}>
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    type="text"
                    placeholder="Recherche..."
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      color: '#fff',
                      marginRight: '8px',
                      outline: 'none',
                      fontSize: '14px'
                    }}
                  />
                )}
              </AnimatePresence>
              <button 
                className="ao-dark-search-btn"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search size={20} />
              </button>
            </div>
            <button 
              className="ao-cart-btn"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={20} />
              {items.length > 0 && (
                <span className="ao-cart-badge">
                  {items.length}
                </span>
              )}
            </button>
            {isAuthenticated ? (
              location.pathname === '/' ? (
                <button className="ao-dark-btn-primary" onClick={() => navigate('/app')} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <LayoutDashboard size={18} /> Tableau de bord
                </button>
              ) : (
                <button className="ao-dark-btn-primary" onClick={() => navigate('/')}>
                  Retour à l'accueil
                </button>
              )
            ) : (
              <>
                <button className="ao-dark-btn-text hidden-on-mobile" onClick={() => navigate('/login')}>Se connecter</button>
                <button className="ao-dark-btn-primary hidden-on-mobile" onClick={() => navigate('/register')}>Déployer</button>
              </>
            )}
            
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
              <div className="ao-brand-link" onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }}>
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
                    staggerChildren: 0.05,
                    delayChildren: 0.1
                  }
                }
              }}
            >
              <motion.div className="mobile-premium-nav" variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } }}>
                <a className="mobile-premium-link" onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }}>
                  <div className="icon-box"><Home size={20} /></div>
                  <span>Accueil</span>
                </a>
                
                <a className="mobile-premium-link" onClick={() => { setIsMobileMenuOpen(false); navigate('/platform'); }}>
                  <div className="icon-box"><Server size={20} /></div>
                  <span>Architecture Core</span>
                </a>
                
                <a className="mobile-premium-link" onClick={() => { setIsMobileMenuOpen(false); navigate('/modules'); }}>
                  <div className="icon-box"><Layout size={20} /></div>
                  <span>Écosystème & Modules</span>
                </a>
                
                <a className="mobile-premium-link" onClick={() => { setIsMobileMenuOpen(false); navigate('/services'); }}>
                  <div className="icon-box"><Cpu size={20} /></div>
                  <span>Alliance IA (Nos Services)</span>
                </a>
                
                <a className="mobile-premium-link highlight" onClick={() => { setIsMobileMenuOpen(false); navigate('/boost'); }}>
                  <div className="icon-box"><Zap size={20} /></div>
                  <span>Alliance Boost</span>
                </a>
                
                <a className="mobile-premium-link" onClick={() => { setIsMobileMenuOpen(false); navigate('/pricing'); }}>
                  <div className="icon-box"><CreditCard size={20} /></div>
                  <span>Tarifs & Abonnements</span>
                </a>
                
                <a className="mobile-premium-link" onClick={() => { setIsMobileMenuOpen(false); navigate('/settings'); }}>
                  <div className="icon-box"><Settings size={20} /></div>
                  <span>Paramètres</span>
                </a>

                <a className="mobile-premium-link" onClick={() => { setIsMobileMenuOpen(false); navigate('/contact'); }}>
                  <div className="icon-box"><Mail size={20} /></div>
                  <span>Nous Contacter</span>
                </a>
              </motion.div>
            </motion.div>
            
            <div className="mobile-sheet-footer">
              {isAuthenticated ? (
                location.pathname === '/' ? (
                  <button className="ao-dark-btn-primary w-full" onClick={() => { setIsMobileMenuOpen(false); navigate('/app'); }} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                    <LayoutDashboard size={18} /> Tableau de bord
                  </button>
                ) : (
                  <button className="ao-dark-btn-primary w-full" onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }}>
                    Retour à l'accueil
                  </button>
                )
              ) : (
                <>
                  <button className="ao-dark-btn-primary w-full" onClick={() => { setIsMobileMenuOpen(false); navigate('/register'); }}>
                    Déployer un Espace Gratuit
                  </button>
                  <button className="ao-dark-btn-text w-full mt-2" style={{ color: '#fff' }} onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}>
                    Se connecter
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
