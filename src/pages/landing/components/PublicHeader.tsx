import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, BookOpen, Layers, Users, Rocket, Database, Code2, Cpu, LineChart, Globe, Zap, Network, Scale, Layout } from 'lucide-react';
import { AllianceLogo } from '../../../design-system/components/AllianceLogo';
import './PublicHeader.css';

export const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveMenu(null);
  }, [location.pathname]);

  const handleMouseEnter = (menu: string) => setActiveMenu(menu);
  const handleMouseLeave = () => setActiveMenu(null);

  // Animation variants
  const navContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const navItem = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.header 
      className={`ao-header ${scrolled ? 'ao-header-scrolled' : ''}`} 
      onMouseLeave={handleMouseLeave}
      initial="hidden"
      animate="show"
      variants={navContainer}
    >
      <div className="ao-header-inner">
        {/* LOGO */}
        <motion.div className="ao-header-brand" onClick={() => navigate('/')} variants={navItem}>
          <AllianceLogo size={28} />
          <span className="ao-brand-text">Alliance One</span>
        </motion.div>

        {/* NAVIGATION */}
        <nav className="ao-header-nav">
          {/* Produits */}
          <motion.div 
            className={`ao-nav-item ${activeMenu === 'produits' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('produits')}
            variants={navItem}
          >
            <span className="alliance-signal">Produits</span>
          </motion.div>

          {/* Réseau Alliance */}
          <motion.div 
            className="ao-nav-item" 
            onClick={() => navigate('/network')}
            variants={navItem}
          >
            <span className="alliance-signal">Réseau Alliance</span>
          </motion.div>

          {/* Solutions */}
          <motion.div 
            className={`ao-nav-item ${activeMenu === 'solutions' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('solutions')}
            variants={navItem}
          >
            <span className="alliance-signal">Solutions</span>
          </motion.div>

          {/* Ressources */}
          <motion.div 
            className={`ao-nav-item ${activeMenu === 'ressources' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('ressources')}
            variants={navItem}
          >
            <span className="alliance-signal">Ressources</span>
          </motion.div>

          {/* Fondateur */}
          <motion.div 
            className="ao-nav-item" 
            onClick={() => navigate('/founder')}
            variants={navItem}
          >
            <span className="alliance-signal">Fondateur</span>
          </motion.div>
        </nav>

        {/* ACTIONS */}
        <div className="ao-header-actions">
          <motion.button className="ao-btn-ghost" onClick={() => navigate('/pricing')} variants={navItem}>Tarifs</motion.button>
          <motion.button className="ao-btn-ghost" onClick={() => navigate('/login')} variants={navItem}>Connexion</motion.button>
          <motion.button className="ao-btn-primary" onClick={() => navigate('/register')} variants={navItem}>
            Découvrir
          </motion.button>
        </div>
      </div>

      {/* MEGA MENUS PANELS */}
      <AnimatePresence>
        {activeMenu === 'produits' && (
          <motion.div 
            className="ao-mega-menu"
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} // smooth spring-like
          >
            <div className="ao-mega-inner grid-produits">
              <div className="mega-col">
                <span className="micro-label mb-6">PLATFORM</span>
                <div className="mega-editorial-card" onClick={() => navigate('/platform')}>
                  <Layout className="mb-4 text-alliance-blue" size={24} />
                  <h4>Alliance One</h4>
                  <p>L'infrastructure centrale. Connectez vos données et vos équipes sans limites.</p>
                </div>
              </div>
              <div className="mega-col">
                <span className="micro-label mb-6">INTELLIGENCE</span>
                <div className="mega-editorial-card" onClick={() => navigate('/ai')}>
                  <Cpu className="mb-4 text-alliance-blue" size={24} />
                  <h4>Alliance AI</h4>
                  <p>Votre couche d'intelligence opérationnelle. Exécutez des tâches complexes nativement.</p>
                </div>
              </div>
              <div className="mega-col">
                <span className="micro-label mb-6">MODULES</span>
                <div className="mega-list">
                  <a onClick={() => navigate('/modules/education')}>Education</a>
                  <a onClick={() => navigate('/modules/finance')}>Finance</a>
                  <a onClick={() => navigate('/modules/inventory')}>Inventory</a>
                  <a onClick={() => navigate('/modules/hr')}>HR</a>
                  <a onClick={() => navigate('/modules/crm')}>CRM</a>
                  <a onClick={() => navigate('/modules/projects')}>Projects</a>
                </div>
              </div>
              <div className="mega-col bg-gray-50 p-6 -mr-6 -my-8 border-l border-gray-100">
                <span className="micro-label mb-6">ECOSYSTEM</span>
                <div className="mega-list mb-8">
                  <a onClick={() => navigate('/marketplace')}>Marketplace</a>
                  <a onClick={() => navigate('/developers')}>Developer Platform</a>
                  <a onClick={() => navigate('/integrations')}>Integrations</a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeMenu === 'solutions' && (
          <motion.div 
            className="ao-mega-menu"
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ao-mega-inner grid-solutions">
              <div className="mega-solution-card">
                <div className="ms-icon"><LineChart size={20} /></div>
                <div>
                  <h4>OPERATIONS</h4>
                  <p>Piloter votre organisation.</p>
                </div>
              </div>
              <div className="mega-solution-card">
                <div className="ms-icon"><Database size={20} /></div>
                <div>
                  <h4>FINANCE</h4>
                  <p>Connecter vos flux financiers.</p>
                </div>
              </div>
              <div className="mega-solution-card">
                <div className="ms-icon"><BookOpen size={20} /></div>
                <div>
                  <h4>EDUCATION</h4>
                  <p>Gérer votre établissement.</p>
                </div>
              </div>
              <div className="mega-solution-card">
                <div className="ms-icon"><Users size={20} /></div>
                <div>
                  <h4>PEOPLE</h4>
                  <p>Structurer vos équipes.</p>
                </div>
              </div>
              <div className="mega-solution-card">
                <div className="ms-icon"><BrainCircuit size={20} /></div>
                <div>
                  <h4>INTELLIGENCE</h4>
                  <p>Transformer vos données en décisions.</p>
                </div>
              </div>
              <div className="mega-solution-card">
                <div className="ms-icon"><Code2 size={20} /></div>
                <div>
                  <h4>DEVELOPERS</h4>
                  <p>Construire sur Alliance One.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeMenu === 'ressources' && (
          <motion.div 
            className="ao-mega-menu"
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ao-mega-inner grid-ressources">
              <div className="mega-col border-r border-gray-100 pr-8">
                <span className="micro-label mb-6">LEARN & BUILD</span>
                <div className="mega-list">
                  <a className="text-lg font-bold text-graphite mb-2" onClick={() => navigate('/docs')}>Documentation</a>
                  <a className="text-lg font-bold text-graphite" onClick={() => navigate('/help')}>Help Center</a>
                </div>
              </div>
              <div className="mega-col pl-4">
                <span className="micro-label mb-6">COMMUNITY</span>
                <div className="mega-list">
                  <a onClick={() => navigate('/guides')}>Guides</a>
                  <a onClick={() => navigate('/developer-center')}>Developer Center</a>
                  <a onClick={() => navigate('/insights')}>Insights</a>
                  <a onClick={() => navigate('/news')}>Actualités</a>
                </div>
              </div>
              <div className="mega-col bg-deep-navy text-white p-8 rounded-xl ml-8 flex flex-col justify-center">
                <h4 className="text-white mb-2 font-bold">Support Premium</h4>
                <p className="text-gray-400 text-sm mb-6">Une équipe d'ingénieurs dédiée à votre réussite.</p>
                <button className="text-alliance-blue font-bold flex items-center gap-2 text-sm">Contacter <ArrowRight size={14}/></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
