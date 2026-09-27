/**
 * ALLIANCE ONE — SIGNATURE DIGITALE (HOMEPAGE)
 * White, modern, NelsiusPay inspired layout.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Moon, Globe, CheckCircle2 } from 'lucide-react';
import './LandingPage.css';
import { AllianceLogo } from '../../design-system/components/AllianceLogo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    if (activeDropdown === menu) setActiveDropdown(null);
    else setActiveDropdown(menu);
  };

  return (
    <div className="landing-page">
      {/* 1. HEADER (Top Navigation) */}
      <header className="landing-header">
        <div className="header-inner">
          {/* Logo */}
          <div className="header-brand" onClick={() => window.scrollTo(0, 0)}>
            <AllianceLogo size={28} color="#0f172a" />
            <span className="brand-name">ALLIANCE ONE</span>
          </div>

          {/* Navigation Links with Dropdowns */}
          <nav className="header-nav">
            <div className="nav-item" onMouseEnter={() => toggleDropdown('produits')} onMouseLeave={() => toggleDropdown('')}>
              <span>Produits <ChevronDown size={14} /></span>
              {activeDropdown === 'produits' && (
                <div className="dropdown-menu">
                  <a onClick={() => navigate('/register')}>Finance & Trésorerie</a>
                  <a onClick={() => navigate('/register')}>Stocks & Logistique</a>
                  <a onClick={() => navigate('/register')}>Ressources Humaines</a>
                  <a onClick={() => navigate('/register')}>Éducation & Santé</a>
                </div>
              )}
            </div>
            
            <div className="nav-item" onMouseEnter={() => toggleDropdown('reseau')} onMouseLeave={() => toggleDropdown('')}>
              <span>Réseau Alliance <ChevronDown size={14} /></span>
              {activeDropdown === 'reseau' && (
                <div className="dropdown-menu">
                  <a onClick={() => navigate('/app/confiance')}>Organisations Certifiées</a>
                  <a onClick={() => navigate('/app/confiance')}>Investisseurs</a>
                  <a onClick={() => navigate('/app/confiance')}>Partenariats Stratégiques</a>
                </div>
              )}
            </div>

            <div className="nav-item">
              <span>Ressources <ChevronDown size={14} /></span>
            </div>

            <div className="nav-item">
              <span>Tarifs</span>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="header-actions">
            <button className="icon-btn theme-btn">
              <Moon size={16} /> SOMBRE
            </button>
            <button className="icon-btn lang-btn">
              <Globe size={16} /> FR <ChevronDown size={14} />
            </button>
            <button className="cta-dashboard" onClick={() => navigate('/login')}>
              Tableau de bord
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-blur-bg blur-pink"></div>
        <div className="hero-blur-bg blur-blue"></div>
        <div className="hero-blur-bg blur-yellow"></div>
        
        <div className="hero-inner">
          <div className="hero-content">
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              L'infrastructure globale pour développer <span className="highlight-text">votre entreprise.</span>
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Gérez vos finances, vos stocks, et votre équipe avec une plateforme ERP modulaire conçue pour la vitesse et l'échelle. Rejoignez le réseau de confiance Alliance One.
            </motion.p>
            <motion.div 
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button className="btn-primary" onClick={() => navigate('/register')}>
                Démarrer maintenant <ArrowRight size={16} />
              </button>
              <button className="btn-secondary">
                Contacter l'équipe commerciale <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>

          <motion.div 
            className="hero-mockup"
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Abstract Dashboard Mockup */}
            <div className="mockup-frame">
              <div className="mockup-header">
                <div className="mockup-logo">
                  <AllianceLogo size={20} color="#4f46e5" />
                  <span>Alliance One</span>
                </div>
                <div className="mockup-user"></div>
              </div>
              <div className="mockup-body">
                <div className="mockup-balance">
                  <span className="balance-label">SOLDE DE L'ENTREPRISE</span>
                  <span className="balance-value">1 500 000 FCFA</span>
                </div>
                <div className="mockup-cards">
                  <div className="m-card visa"><span className="visa-logo">VISA</span></div>
                  <div className="m-card momo"><span className="momo-logo">MoMo</span></div>
                </div>
                <div className="mockup-form">
                  <div className="m-input"></div>
                  <div className="m-input"></div>
                  <div className="m-btn">Confirmer le paiement</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. PARTNERS TICKER */}
      <section className="partners-section">
        <h4 className="partners-title">RÉSEAUX ET PARTENAIRES INTERCONNECTÉS NATIVEMENT</h4>
        <div className="partners-ticker-wrapper">
          <div className="partners-ticker">
            <span className="partner-logo">VISA</span>
            <span className="partner-logo">NELSIUSPAY</span>
            <span className="partner-logo">GROK</span>
            <span className="partner-logo">Mastercard</span>
            <span className="partner-logo">PayPal</span>
            <span className="partner-logo" style={{ color: '#ff6600' }}>Orange Money</span>
            <span className="partner-logo" style={{ color: '#ffcc00' }}>MTN MoMo</span>
            <span className="partner-logo">OpenAI</span>
            
            {/* Duplicated for infinite scroll illusion */}
            <span className="partner-logo">VISA</span>
            <span className="partner-logo">NELSIUSPAY</span>
            <span className="partner-logo">GROK</span>
            <span className="partner-logo">Mastercard</span>
            <span className="partner-logo">PayPal</span>
            <span className="partner-logo" style={{ color: '#ff6600' }}>Orange Money</span>
            <span className="partner-logo" style={{ color: '#ffcc00' }}>MTN MoMo</span>
            <span className="partner-logo">OpenAI</span>
          </div>
        </div>
      </section>

      {/* 4. NETWORK SECTION */}
      <section className="network-section">
        <div className="network-inner">
          <div className="network-header">
            <h2 className="network-title">Le Réseau Alliance</h2>
            <p className="network-desc">Découvrez les organisations vérifiées et certifiées qui composent notre écosystème de confiance.</p>
          </div>
          
          <div className="network-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="network-card">
                <div className="n-card-header">
                  <div className="n-card-logo"></div>
                  <div className="n-card-info">
                    <h3>Organisation {i}</h3>
                    <span className="n-badge"><CheckCircle2 size={12} /> Certifié</span>
                  </div>
                </div>
                <p>Membre de l'Alliance depuis 2026. Secteur: Technologie et Finance.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 5. FOOTER */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <div className="footer-brand">
              <AllianceLogo size={24} color="#0f172a" />
              <span>ALLIANCE ONE</span>
            </div>
            <p>© {new Date().getFullYear()} — L'infrastructure d'élite.</p>
          </div>
          <div className="footer-links">
            <a href="#produits">Produits</a>
            <a href="#reseau">Réseau</a>
            <a href="#ressources">Ressources</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
