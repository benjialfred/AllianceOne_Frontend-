/**
 * ALLIANCE ONE — LANDING PAGE (PUBLIC)
 * Placeholder structure for the public-facing landing page.
 * This will be fully built out after the Hero is validated.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import logoSrc from '../../assets/logo.png';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* ═══════ PUBLIC NAVBAR ═══════ */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-nav-brand" onClick={() => navigate('/')}>
            <img src={logoSrc} alt="Alliance One" className="landing-nav-logo" />
          </div>

          <div className="landing-nav-links">
            <a href="#modules" className="landing-nav-link">Modules</a>
            <a href="#ecosystem" className="landing-nav-link">Écosystème</a>
            <a href="#developers" className="landing-nav-link">Développeurs</a>
            <a href="#services" className="landing-nav-link">Services</a>
          </div>

          <div className="landing-nav-actions">
            <button
              className="landing-nav-login"
              onClick={() => navigate('/login')}
            >
              Se connecter
            </button>
            <button
              className="landing-nav-cta"
              onClick={() => navigate('/register')}
            >
              Créer mon environnement
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-hero-content">
            <div className="hero-label">
              <span className="hero-label-dot" />
              ALLIANCE ONE · BUSINESS OPERATING SYSTEM
            </div>

            <h1 className="landing-hero-title">
              Un seul environnement.<br />
              <span className="hero-title-accent">Tout votre écosystème.</span>
            </h1>

            <p className="landing-hero-subtitle">
              Alliance One réunit vos applications métier, vos données, vos équipes,
              vos automatisations et vos services dans un environnement unifié
              conçu pour faire évoluer votre organisation.
            </p>

            <div className="landing-hero-actions">
              <button
                className="hero-cta-primary"
                onClick={() => navigate('/register')}
              >
                Créer mon environnement
                <ArrowRight size={16} />
              </button>
              <button
                className="hero-cta-secondary"
                onClick={() => {
                  const el = document.getElementById('modules');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Découvrir Alliance One
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="landing-hero-login-link">
              Déjà membre ?{' '}
              <a onClick={() => navigate('/login')}>Se connecter</a>
            </div>
          </div>

          {/* HeroOS visual placeholder — will be built as interactive SVG animation */}
          <div className="landing-hero-visual">
            <div className="hero-os-diagram">
              {/* Core node */}
              <div className="hero-node hero-node-core">
                <span className="hero-node-label">Alliance Core</span>
              </div>

              {/* Application nodes */}
              <div className="hero-node hero-node-app" style={{ '--node-delay': '0.8s', '--node-color': '#4f46e5' } as React.CSSProperties}>
                <span className="hero-node-icon">📚</span>
                <span className="hero-node-label">Éducation</span>
              </div>
              <div className="hero-node hero-node-app" style={{ '--node-delay': '1.2s', '--node-color': '#059669' } as React.CSSProperties}>
                <span className="hero-node-icon">💰</span>
                <span className="hero-node-label">Finance</span>
              </div>
              <div className="hero-node hero-node-app" style={{ '--node-delay': '1.6s', '--node-color': '#0ea5e9' } as React.CSSProperties}>
                <span className="hero-node-icon">📦</span>
                <span className="hero-node-label">Inventaire</span>
              </div>
              <div className="hero-node hero-node-app" style={{ '--node-delay': '2.0s', '--node-color': '#8b5cf6' } as React.CSSProperties}>
                <span className="hero-node-icon">📋</span>
                <span className="hero-node-label">Projets</span>
              </div>

              {/* Infrastructure nodes */}
              <div className="hero-node hero-node-infra" style={{ '--node-delay': '2.8s' } as React.CSSProperties}>
                <span className="hero-node-label">AI</span>
              </div>
              <div className="hero-node hero-node-infra" style={{ '--node-delay': '3.2s' } as React.CSSProperties}>
                <span className="hero-node-label">Automation</span>
              </div>
              <div className="hero-node hero-node-infra" style={{ '--node-delay': '3.6s' } as React.CSSProperties}>
                <span className="hero-node-label">Cloud</span>
              </div>

              {/* Connectors (will be SVG lines in final version) */}
              <svg className="hero-connectors" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="250" y1="100" x2="100" y2="200" className="hero-connector-line" style={{ '--line-delay': '1.5s' } as React.CSSProperties} />
                <line x1="250" y1="100" x2="200" y2="200" className="hero-connector-line" style={{ '--line-delay': '1.8s' } as React.CSSProperties} />
                <line x1="250" y1="100" x2="300" y2="200" className="hero-connector-line" style={{ '--line-delay': '2.1s' } as React.CSSProperties} />
                <line x1="250" y1="100" x2="400" y2="200" className="hero-connector-line" style={{ '--line-delay': '2.4s' } as React.CSSProperties} />
                <line x1="250" y1="100" x2="150" y2="320" className="hero-connector-line" style={{ '--line-delay': '3.0s' } as React.CSSProperties} />
                <line x1="250" y1="100" x2="250" y2="320" className="hero-connector-line" style={{ '--line-delay': '3.3s' } as React.CSSProperties} />
                <line x1="250" y1="100" x2="350" y2="320" className="hero-connector-line" style={{ '--line-delay': '3.6s' } as React.CSSProperties} />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ MODULES SECTION (placeholder) ═══════ */}
      <section id="modules" className="landing-section">
        <div className="landing-section-inner">
          <span className="section-kicker">MODULES</span>
          <h2 className="section-title">
            Les outils dont votre organisation a besoin.<br />
            <span className="section-title-accent">Dans un seul environnement.</span>
          </h2>
        </div>
      </section>
    </div>
  );
};
