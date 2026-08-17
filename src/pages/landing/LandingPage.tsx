/**
 * ALLIANCE ONE — LANDING PAGE PUBLIQUE
 * 
 * Mode Référence : Light Mode institutionnel & technologique.
 * Palette : Ivoire/Blanc cassé (#FAF9F6), Graphite (#0F172A), Bleu Nuit Alliance (#0B2B5C), Or discret (#D4AF37).
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Menu, 
  X,
  Sparkles,
  Lock,
  Boxes,
  Cpu,
  Layers
} from 'lucide-react';
import { HeroOS } from './components/HeroOS';
import logoSrc from '../../assets/logo.png';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="landing-page">
      {/* ═══════════════════════════════════════════════
          1. PUBLIC OS NAVBAR
          ═══════════════════════════════════════════════ */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          {/* Brand */}
          <div className="landing-nav-brand" onClick={() => navigate('/')}>
            <img src={logoSrc} alt="Alliance One" className="landing-nav-logo" />
            <span className="landing-brand-badge">BUSINESS OS</span>
          </div>

          {/* Links (Desktop) */}
          <nav className="landing-nav-links">
            <a href="#vision" className="landing-nav-link">Vision</a>
            <a href="#modules" className="landing-nav-link">Applications</a>
            <a href="#universal-data" className="landing-nav-link">Données Unifiées</a>
            <a href="#ai" className="landing-nav-link">Intelligence</a>
            <a href="#developers" className="landing-nav-link">Développeurs</a>
          </nav>

          {/* Action CTAs */}
          <div className="landing-nav-actions">
            <button
              className="landing-nav-login-btn"
              onClick={() => navigate('/login')}
            >
              Se connecter
            </button>
            <button
              className="landing-nav-cta-btn"
              onClick={() => navigate('/register')}
            >
              <span>Créer mon environnement</span>
              <ArrowRight size={14} />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              className="landing-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div 
            className="landing-mobile-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <a href="#vision" onClick={() => setMobileMenuOpen(false)}>Vision</a>
            <a href="#modules" onClick={() => setMobileMenuOpen(false)}>Applications</a>
            <a href="#universal-data" onClick={() => setMobileMenuOpen(false)}>Données Unifiées</a>
            <a href="#ai" onClick={() => setMobileMenuOpen(false)}>Intelligence</a>
            <a href="#developers" onClick={() => setMobileMenuOpen(false)}>Développeurs</a>
            <div className="mobile-drawer-actions">
              <button className="mobile-login" onClick={() => navigate('/login')}>Se connecter</button>
              <button className="mobile-cta" onClick={() => navigate('/register')}>Créer mon environnement</button>
            </div>
          </motion.div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════
          2. HERO SECTION (CORE VALUE PROPOSITION)
          ═══════════════════════════════════════════════ */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          {/* Left Column: Value Proposition & CTAs */}
          <motion.div 
            className="landing-hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Precision Kicker Label */}
            <div className="hero-kicker-pill">
              <span className="kicker-pulse-dot" />
              <span className="kicker-text">ALLIANCE ONE · THE OPERATING SYSTEM FOR ORGANIZATIONS</span>
            </div>

            {/* Headline */}
            <h1 className="landing-hero-title">
              Un seul environnement.<br />
              <span className="hero-title-accent">Tout votre écosystème.</span>
            </h1>

            {/* Narrative Subtitle */}
            <p className="landing-hero-subtitle">
              Alliance One réunit vos applications métier, vos données, vos équipes, 
              vos automatisations et vos services dans un environnement unifié conçu 
              pour faire évoluer votre organisation.
            </p>

            {/* Dual CTAs */}
            <div className="landing-hero-actions">
              <button
                className="hero-primary-cta"
                onClick={() => navigate('/register')}
              >
                <span>Créer mon environnement</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="hero-secondary-cta"
                onClick={() => {
                  const el = document.getElementById('vision');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Découvrir Alliance One</span>
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Discreet Login Anchor */}
            <div className="landing-hero-login-anchor">
              <span>Déjà membre ?</span>
              <button onClick={() => navigate('/login')} className="login-link-btn">
                Se connecter
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Institutional Trust Footprint */}
            <div className="hero-trust-bar">
              <div className="trust-badge">
                <ShieldCheck size={14} color="#0B2B5C" />
                <span>Sécurité Certifiée Core</span>
              </div>
              <div className="trust-badge">
                <Zap size={14} color="#d4af37" />
                <span>Offline First & Synchro Locale</span>
              </div>
              <div className="trust-badge">
                <Globe size={14} color="#059669" />
                <span>Infrastructure Panafricaine & Mondiale</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: HeroOS Ecosystem Interactive Canvas */}
          <div className="landing-hero-visual-wrapper">
            <HeroOS />
          </div>
        </div>
      </section>
    </div>
  );
};
