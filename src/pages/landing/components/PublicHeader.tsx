/**
 * ALLIANCE ONE — PUBLIC HEADER
 * Institutional, clean, precise. Contains Mega Menus for navigation.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Layout, BrainCircuit, Blocks, Globe, Building2, GraduationCap, Users, Terminal, LineChart, BookOpen, LifeBuoy, Newspaper } from 'lucide-react';
import { AllianceLogo } from '../../../design-system/components/AllianceLogo';
import './PublicHeader.css';

export const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mega menu on route change
  useEffect(() => {
    setActiveMenu(null);
  }, [location.pathname]);

  const toggleMenu = (menu: string) => {
    if (activeMenu === menu) setActiveMenu(null);
    else setActiveMenu(menu);
  };

  const handleMouseEnter = (menu: string) => setActiveMenu(menu);
  const handleMouseLeave = () => setActiveMenu(null);

  return (
    <header className={`public-header ${scrolled ? 'scrolled' : ''}`} onMouseLeave={handleMouseLeave}>
      <div className="ph-inner">
        {/* LOGO */}
        <div className="ph-brand" onClick={() => navigate('/')}>
          <AllianceLogo size={36} color="var(--ao-graphite)" />
          <span className="ph-brand-text">ALLIANCE ONE</span>
        </div>

        {/* MAIN NAVIGATION */}
        <nav className="ph-nav">
          {/* PRODUITS MEGA MENU */}
          <div 
            className={`ph-nav-item ${activeMenu === 'produits' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('produits')}
          >
            <span>Produits <ChevronDown size={14} className="ph-chevron" /></span>
          </div>

          {/* RÉSEAU ALLIANCE (Direct Link) */}
          <div className="ph-nav-item" onClick={() => { navigate('/network'); setActiveMenu(null); }}>
            <span>Réseau Alliance</span>
          </div>

          {/* SOLUTIONS MEGA MENU */}
          <div 
            className={`ph-nav-item ${activeMenu === 'solutions' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('solutions')}
          >
            <span>Solutions <ChevronDown size={14} className="ph-chevron" /></span>
          </div>

          {/* RESSOURCES MEGA MENU */}
          <div 
            className={`ph-nav-item ${activeMenu === 'ressources' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('ressources')}
          >
            <span>Ressources <ChevronDown size={14} className="ph-chevron" /></span>
          </div>

          {/* FONDATEUR (Direct Link) */}
          <div className="ph-nav-item" onClick={() => { navigate('/founder'); setActiveMenu(null); }}>
            <span>Fondateur</span>
          </div>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="ph-actions">
          <button className="ph-btn-ghost" onClick={() => navigate('/pricing')}>Tarifs</button>
          <button className="ph-btn-ghost" onClick={() => navigate('/login')}>Connexion</button>
          <button className="ph-btn-primary" onClick={() => navigate('/register')}>
            Découvrir Alliance One
          </button>
        </div>
      </div>

      {/* MEGA MENUS PANELS */}
      <AnimatePresence>
        {activeMenu === 'produits' && (
          <motion.div 
            className="mega-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => handleMouseEnter('produits')}
          >
            <div className="mega-menu-inner">
              <div className="mega-col">
                <div className="mega-section-title">PLATEFORME</div>
                <div className="mega-card" onClick={() => navigate('/platform')}>
                  <div className="m-card-icon"><Layout size={20} /></div>
                  <div className="m-card-content">
                    <h4>Business Operating System</h4>
                    <p>L'infrastructure centrale de votre organisation.</p>
                  </div>
                </div>

                <div className="mega-section-title mt-6">INTELLIGENCE</div>
                <div className="mega-card" onClick={() => navigate('/ai')}>
                  <div className="m-card-icon highlight"><BrainCircuit size={20} /></div>
                  <div className="m-card-content">
                    <h4>Alliance AI</h4>
                    <p>L'intelligence opérationnelle unifiée.</p>
                  </div>
                </div>
              </div>
              
              <div className="mega-col">
                <div className="mega-section-title">MODULES</div>
                <div className="mega-list">
                  <a onClick={() => navigate('/modules/education')}>Éducation</a>
                  <a onClick={() => navigate('/modules/finance')}>Finance & Trésorerie</a>
                  <a onClick={() => navigate('/modules/inventory')}>Logistique & Stocks</a>
                  <a onClick={() => navigate('/modules/hr')}>Ressources Humaines</a>
                  <a onClick={() => navigate('/modules/crm')}>CRM & Relations</a>
                  <a onClick={() => navigate('/modules/projects')}>Projets & Équipes</a>
                  <a onClick={() => navigate('/modules/health')}>Santé & Clinique</a>
                </div>
              </div>

              <div className="mega-col">
                <div className="mega-section-title">ÉCOSYSTÈME</div>
                <div className="mega-card" onClick={() => navigate('/marketplace')}>
                  <div className="m-card-icon"><Blocks size={20} /></div>
                  <div className="m-card-content">
                    <h4>Marketplace</h4>
                    <p>Applications et extensions certifiées.</p>
                  </div>
                </div>
                <div className="mega-card" onClick={() => navigate('/developers')}>
                  <div className="m-card-icon"><Terminal size={20} /></div>
                  <div className="m-card-content">
                    <h4>Developer Platform</h4>
                    <p>API, Webhooks et outils d'intégration.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeMenu === 'solutions' && (
          <motion.div 
            className="mega-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => handleMouseEnter('solutions')}
          >
            <div className="mega-menu-inner solutions-grid">
              <div className="mega-card vertical" onClick={() => navigate('/solutions/enterprise')}>
                <Building2 size={24} className="mb-2 text-deep-navy" />
                <h4>Pour les entreprises</h4>
                <p>Centraliser les opérations, piloter les équipes et gérer les finances.</p>
              </div>
              <div className="mega-card vertical" onClick={() => navigate('/solutions/education')}>
                <GraduationCap size={24} className="mb-2 text-deep-navy" />
                <h4>Pour l'éducation</h4>
                <p>Gérer les élèves, présences, notes et l'administration scolaire.</p>
              </div>
              <div className="mega-card vertical" onClick={() => navigate('/solutions/organizations')}>
                <Users size={24} className="mb-2 text-deep-navy" />
                <h4>Pour les organisations</h4>
                <p>Structurer les membres, processus et la communication interne.</p>
              </div>
              <div className="mega-card vertical" onClick={() => navigate('/solutions/developers')}>
                <Terminal size={24} className="mb-2 text-deep-navy" />
                <h4>Pour les développeurs</h4>
                <p>Construire et étendre via l'API, les SDKs et la Marketplace.</p>
              </div>
              <div className="mega-card vertical highlight-bg" onClick={() => navigate('/solutions/leaders')}>
                <LineChart size={24} className="mb-2 text-alliance-blue" />
                <h4>Pour les dirigeants</h4>
                <p>Pilotage global, intelligence de la donnée et performance.</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeMenu === 'ressources' && (
          <motion.div 
            className="mega-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => handleMouseEnter('ressources')}
          >
             <div className="mega-menu-inner resources-grid">
              <div className="mega-col">
                <div className="mega-section-title">APPRENDRE</div>
                <div className="mega-link-item" onClick={() => navigate('/resources/guides')}><BookOpen size={16}/> Guides d'utilisation</div>
                <div className="mega-link-item" onClick={() => navigate('/resources/help')}><LifeBuoy size={16}/> Centre d'aide</div>
                <div className="mega-link-item" onClick={() => navigate('/resources/tutorials')}><Layout size={16}/> Tutoriels vidéo</div>
              </div>
              <div className="mega-col">
                <div className="mega-section-title">PRODUIT & DÉVELOPPEURS</div>
                <div className="mega-link-item" onClick={() => navigate('/docs')}><BookOpen size={16}/> Documentation AO</div>
                <div className="mega-link-item" onClick={() => navigate('/docs/api')}><Terminal size={16}/> Documentation API</div>
                <div className="mega-link-item" onClick={() => navigate('/docs/ai')}><BrainCircuit size={16}/> Guides Alliance AI</div>
              </div>
              <div className="mega-col">
                <div className="mega-section-title">CONTENU</div>
                <div className="mega-link-item" onClick={() => navigate('/blog')}><Newspaper size={16}/> Actualités & Blog</div>
                <div className="mega-link-item" onClick={() => navigate('/case-studies')}><Building2 size={16}/> Études de cas</div>
                <div className="mega-link-item" onClick={() => navigate('/insights')}><LineChart size={16}/> Insights</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
