import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Layout, Cpu, BookOpen, LineChart, Database, Users, Briefcase, Code2, ShieldCheck, Box, MessageCircle } from 'lucide-react';
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

  return (
    <header className={`ao-header ${activeMenu ? 'active-menu-open' : ''}`} onMouseLeave={handleMouseLeave}>
      <div className="ao-header-inner">
        {/* BRAND */}
        <div className="ao-header-brand" onClick={() => navigate('/')}>
          <AllianceLogo size={24} />
          <span className="ao-brand-text">Alliance One</span>
        </div>

        {/* NAVIGATION */}
        <nav className="ao-header-nav">
          <div 
            className={`ao-nav-item ${activeMenu === 'produits' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('produits')}
          >
            Plateforme <ChevronDown size={14} className="nav-chevron" />
          </div>
          <div 
            className={`ao-nav-item ${activeMenu === 'solutions' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('solutions')}
          >
            Solutions <ChevronDown size={14} className="nav-chevron" />
          </div>
          <div 
            className={`ao-nav-item ${activeMenu === 'ressources' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('ressources')}
          >
            Ressources <ChevronDown size={14} className="nav-chevron" />
          </div>
          <div 
            className="ao-nav-item" 
            onClick={() => navigate('/pricing')}
          >
            Tarifs
          </div>
        </nav>

        {/* ACTIONS */}
        <div className="ao-header-actions">
          <button className="ao-btn-text" onClick={() => navigate('/login')}>Connexion</button>
          <button className="ao-btn-outline" onClick={() => navigate('/contact')}>Contact</button>
          <button className="ao-btn-primary" onClick={() => navigate('/register')}>Démarrer</button>
        </div>
      </div>

      {/* MEGA MENUS - ATTACHED TO BOTTOM OF HEADER */}
      <AnimatePresence>
        {activeMenu === 'produits' && (
          <motion.div 
            className="ao-mega-menu-wrapper"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ao-mega-inner grid-produits">
              <div>
                <span className="micro-label mb-6">INFRASTRUCTURE CORE</span>
                <div className="mega-link-block" onClick={() => navigate('/platform')}>
                  <div className="ml-icon"><Layout size={18}/></div>
                  <div className="ml-content">
                    <h4>Plateforme Globale</h4>
                    <p>Découvrez l'architecture technique, la sécurité et la scalabilité du noyau.</p>
                  </div>
                </div>
                <div className="mega-link-block mt-4" onClick={() => navigate('/ai')}>
                  <div className="ml-icon"><Cpu size={18}/></div>
                  <div className="ml-content">
                    <h4>Alliance AI</h4>
                    <p>Le système nerveux central. Automatisation et analyse prédictive native.</p>
                  </div>
                </div>
                <div className="mega-link-block mt-4" onClick={() => navigate('/security')}>
                  <div className="ml-icon"><ShieldCheck size={18}/></div>
                  <div className="ml-content">
                    <h4>Sécurité & Conformité</h4>
                    <p>Protection Zero-Trust, chiffrement et souveraineté de vos données.</p>
                  </div>
                </div>
              </div>

              <div>
                <span className="micro-label mb-6">ÉCOSYSTÈME</span>
                <div className="mega-list">
                  <a onClick={() => navigate('/marketplace')}><Box size={16}/> Marketplace</a>
                  <a onClick={() => navigate('/integrations')}><ArrowRight size={16}/> Intégrations Natives</a>
                  <a onClick={() => navigate('/developer-center')}><Code2 size={16}/> Plateforme Développeur</a>
                  <a onClick={() => navigate('/network')}><Users size={16}/> Réseau Alliance One</a>
                </div>
              </div>

              <div className="support-card border-none bg-blue-50/50">
                <h4 className="text-graphite font-bold mb-2">Prêt à moderniser votre SI ?</h4>
                <p className="text-gray-500 text-sm mb-6">Nos experts vous accompagnent dans la migration de votre infrastructure actuelle.</p>
                <button className="ao-btn-primary w-full" onClick={() => navigate('/contact')}>Planifier une démo</button>
              </div>
            </div>
          </motion.div>
        )}

        {activeMenu === 'solutions' && (
          <motion.div 
            className="ao-mega-menu-wrapper"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ao-mega-inner">
              <span className="micro-label mb-6 text-center">MODULES MÉTIER</span>
              <div className="grid-solutions max-w-5xl mx-auto">
                <div className="mega-link-block" onClick={() => navigate('/modules/education')}>
                  <div className="ml-icon"><BookOpen size={18}/></div>
                  <div className="ml-content">
                    <h4>Education</h4>
                    <p>Universités, Écoles, Centres de formation.</p>
                  </div>
                </div>
                <div className="mega-link-block" onClick={() => navigate('/modules/finance')}>
                  <div className="ml-icon"><LineChart size={18}/></div>
                  <div className="ml-content">
                    <h4>Finance & Trésorerie</h4>
                    <p>Facturation, comptabilité, flux bancaires.</p>
                  </div>
                </div>
                <div className="mega-link-block" onClick={() => navigate('/modules/inventory')}>
                  <div className="ml-icon"><Database size={18}/></div>
                  <div className="ml-content">
                    <h4>Supply & Inventory</h4>
                    <p>Logistique, stocks, fournisseurs.</p>
                  </div>
                </div>
                <div className="mega-link-block" onClick={() => navigate('/modules/hr')}>
                  <div className="ml-icon"><Users size={18}/></div>
                  <div className="ml-content">
                    <h4>HR & People</h4>
                    <p>Talents, paie, plannings, congés.</p>
                  </div>
                </div>
                <div className="mega-link-block" onClick={() => navigate('/modules/crm')}>
                  <div className="ml-icon"><Briefcase size={18}/></div>
                  <div className="ml-content">
                    <h4>Sales & CRM</h4>
                    <p>Pipelines, relations clients, support.</p>
                  </div>
                </div>
                <div className="mega-link-block" onClick={() => navigate('/modules')}>
                  <div className="ml-icon"><ArrowRight size={18}/></div>
                  <div className="ml-content">
                    <h4>Voir tous les modules</h4>
                    <p>Découvrez l'intégralité de la suite.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeMenu === 'ressources' && (
          <motion.div 
            className="ao-mega-menu-wrapper"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ao-mega-inner grid-ressources">
              <div>
                <span className="micro-label mb-6">APPRENDRE</span>
                <div className="mega-list">
                  <a className="font-bold text-graphite" onClick={() => navigate('/docs')}>Documentation Officielle</a>
                  <a className="font-bold text-graphite" onClick={() => navigate('/guides')}>Guides & Tutoriels</a>
                  <a className="font-bold text-graphite" onClick={() => navigate('/help')}>Centre d'Aide (Support)</a>
                </div>
              </div>
              <div>
                <span className="micro-label mb-6">DÉCOUVRIR</span>
                <div className="mega-list">
                  <a onClick={() => navigate('/insights')}>Insights & Whitepapers</a>
                  <a onClick={() => navigate('/news')}>Actualités & Mises à jour</a>
                  <a onClick={() => navigate('/founder')}>La vision du Fondateur</a>
                  <a onClick={() => navigate('/about')}>À propos d'Alliance One</a>
                </div>
              </div>
              <div className="support-card flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 text-alliance-blue">
                  <MessageCircle size={24} />
                  <h4 className="font-bold">Besoin d'aide immédiate ?</h4>
                </div>
                <p className="text-gray-500 text-sm mb-6">Nos experts techniques sont disponibles 24/7 pour nos clients Enterprise.</p>
                <button className="ao-btn-outline w-fit" onClick={() => navigate('/help')}>Contacter le support</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
