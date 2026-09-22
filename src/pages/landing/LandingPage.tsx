/**
 * ALLIANCE ONE — SIGNATURE DIGITALE (HOMEPAGE)
 * 
 * Expérience éditoriale, technologique et architecturale.
 * Zéro composant SaaS générique. Zéro gradient superflu.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './LandingPage.css';

/* ── COMPOSANTS D'ANIMATION ── */
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

/* ── ANIMATION SIGNATURE AO (HERO) ── */
const AOSignature: React.FC = () => {
  const [isFormed, setIsFormed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsFormed(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="ao-signature-container">
      {/* Grille de construction (Fade out) */}
      <motion.svg className="ao-svg-layer" viewBox="0 0 400 400"
        animate={{ opacity: isFormed ? 0 : 1 }}
        transition={{ duration: 1 }}
      >
        <motion.path 
          className="ao-path" stroke="#E5E7EB" strokeWidth="1"
          d="M0 200 H400 M200 0 V400 M100 0 V400 M300 0 V400 M0 100 H400 M0 300 H400"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.svg>

      {/* Lignes structurelles de l'A et du O */}
      <motion.svg className="ao-svg-layer" viewBox="0 0 400 400">
        {/* Le 'A' stylisé */}
        <motion.path 
          className="ao-path"
          d="M 120 280 L 170 120 L 220 280 M 145 200 L 195 200"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Le 'O' parfait */}
        <motion.circle 
          className="ao-path"
          cx="280" cy="200" r="50"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.svg>

      {/* Nœuds de connexion animés */}
      <motion.div 
        style={{ position: 'absolute', width: 4, height: 4, background: '#111111', top: 118, left: 168 }}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.2, duration: 0.5 }}
      />
      <motion.div 
        style={{ position: 'absolute', width: 4, height: 4, background: '#111111', top: 278, left: 118 }}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.4, duration: 0.5 }}
      />
      <motion.div 
        style={{ position: 'absolute', width: 4, height: 4, background: '#111111', top: 278, left: 218 }}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.6, duration: 0.5 }}
      />
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Changement du thème de la navbar en fonction du défilement
  useEffect(() => {
    const handleScroll = () => {
      const archSection = document.getElementById('architecture');
      if (archSection) {
        const rect = archSection.getBoundingClientRect();
        // Si la section "Deep Navy" est en haut de l'écran, on passe la nav en dark mode
        if (rect.top <= 80 && rect.bottom >= 80) {
          setIsDarkMode(true);
        } else {
          setIsDarkMode(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* ═══════════════════════════════════════════════
          1. NAVIGATION (ÉDITORIALE)
          ═══════════════════════════════════════════════ */}
      <header className={`landing-nav ${isDarkMode ? 'dark-mode' : 'scrolled'}`}>
        <div className="landing-nav-inner">
          <div className="landing-nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="brand-text-logo">Alliance One</span>
          </div>
          <nav className="landing-nav-links">
            <a href="#thesis" className="landing-nav-link">Vision</a>
            <a href="#architecture" className="landing-nav-link">Architecture</a>
            <a href="#intelligence" className="landing-nav-link">Intelligence</a>
            <a onClick={() => navigate('/founder')} className="landing-nav-link">Fondateur</a>
          </nav>
          <button className="landing-nav-cta" onClick={() => navigate('/register')}>
            Initier le déploiement
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          2. HERO : LA GENÈSE
          ═══════════════════════════════════════════════ */}
      <section className="hero-genesis">
        <div className="hero-grid-bg" />
        
        <AOSignature />

        <motion.div 
          className="hero-text-overlay"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 3.5 }}
        >
          <h1 className="hero-editorial-title">
            L'art de diriger.<br />Élevé au rang de standard.
          </h1>
          <button className="hero-editorial-cta" onClick={() => {
            document.getElementById('thesis')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Découvrir l'infrastructure
            <ArrowRight size={14} />
          </button>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. LE MANIFESTE (THESIS)
          ═══════════════════════════════════════════════ */}
      <section id="thesis" className="section-thesis">
        <div className="thesis-container">
          <FadeIn>
            <span className="thesis-kicker">Le Manifeste</span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h2 className="thesis-statement">
              Nous n'avons pas créé un logiciel.<br />
              <span>Nous avons conçu l'infrastructure absolue pour les organisations qui refusent le compromis.</span>
            </h2>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. L'ARCHITECTURE (MACRO UI / DEEP NAVY)
          ═══════════════════════════════════════════════ */}
      <section id="architecture" className="section-architecture">
        <div className="arch-header">
          <FadeIn>
            <span className="arch-kicker">Maîtrise Technologique</span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h2 className="arch-title">
              Conçu avec la précision de l'horlogerie. La forme suit la fonction.
            </h2>
          </FadeIn>
        </div>

        <div className="macro-ui-grid">
          {/* Cell 1: Typographie et Entrée */}
          <FadeIn delay={0.3}>
            <div className="macro-ui-cell">
              <div className="macro-ui-visual">
                <div className="ui-perfect-input">
                  &gt; Saisie_Sécurisée_
                </div>
              </div>
              <div className="macro-ui-desc">
                <span className="macro-ui-label">Interaction</span>
                <p className="macro-ui-text">
                  Chaque composant d'interaction est dépouillé du superflu pour garantir une vitesse de saisie maximale, sans distraction.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Cell 2: Données Financières */}
          <FadeIn delay={0.4}>
            <div className="macro-ui-cell">
              <div className="macro-ui-visual" style={{ flexDirection: 'column', width: '100%', gap: '1px' }}>
                <div className="ui-perfect-table-row" style={{ opacity: 0.5 }}>
                  <span>TRX-00918</span><span>24/11/2026</span><span>+45 000</span>
                </div>
                <div className="ui-perfect-table-row">
                  <span>TRX-00919</span><span>24/11/2026</span><span>+120 000</span>
                </div>
                <div className="ui-perfect-table-row" style={{ opacity: 0.5 }}>
                  <span>TRX-00920</span><span>24/11/2026</span><span>-15 000</span>
                </div>
              </div>
              <div className="macro-ui-desc">
                <span className="macro-ui-label">Données</span>
                <p className="macro-ui-text">
                  La densité de l'information est calibrée mathématiquement. Vos finances et stocks sont lisibles instantanément, sans effort cognitif.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. L'INTELLIGENCE CONNEXE (DIAGRAMME)
          ═══════════════════════════════════════════════ */}
      <section id="intelligence" className="section-intelligence">
        <div className="intel-container">
          <div className="intel-content">
            <FadeIn>
              <h2>Une donnée saisie. Une vérité universelle.</h2>
              <p>
                L'architecture unifiée d'Alliance One éradique les silos. 
                Une opération financière met automatiquement à jour la comptabilité, 
                les inventaires, et les dossiers d'accès de votre personnel, en temps réel.
                Aucune passerelle. Aucune double saisie. L'intégrité absolue.
              </p>
            </FadeIn>
          </div>
          
          <div className="intel-diagram">
            {/* Lignes de connexion */}
            <div className="intel-line" style={{ width: '60%', height: 1, top: '15%', left: '20%' }} />
            <div className="intel-line" style={{ width: 1, height: '70%', top: '15%', left: '20%' }} />
            <div className="intel-line" style={{ width: '70%', height: 1, bottom: '25%', right: '10%' }} />
            <div className="intel-line" style={{ width: 1, height: '45%', bottom: '25%', right: '20%' }} />

            {/* Core */}
            <motion.div 
              className="intel-core"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              AO
            </motion.div>

            {/* Nodes */}
            <motion.div className="intel-node node-1" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }}>Opérations</motion.div>
            <motion.div className="intel-node node-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }}>Finances</motion.div>
            <motion.div className="intel-node node-3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.8 }}>Ressources Humaines</motion.div>
            <motion.div className="intel-node node-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.0 }}>Logistique & Stocks</motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. L'ÉPILOGUE (CTA)
          ═══════════════════════════════════════════════ */}
      <section className="section-epilogue">
        <div className="epilogue-bg-logo">AO</div>
        <div className="epilogue-content">
          <FadeIn>
            <h2 className="epilogue-title">
              Votre organisation est prête pour son nouveau standard.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <button className="epilogue-cta" onClick={() => navigate('/register')}>
              Initier le déploiement
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. FOOTER ÉPURÉ
          ═══════════════════════════════════════════════ */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div>
            <span className="footer-brand">ALLIANCE ONE</span>
            <span className="footer-copyright">© {new Date().getFullYear()} — L'infrastructure d'élite.</span>
          </div>
          <div className="footer-links">
            <a href="#thesis" className="footer-link">Vision</a>
            <a href="#architecture" className="footer-link">Technologie</a>
            <a onClick={() => navigate('/founder')} className="footer-link">Le Fondateur</a>
            <a href="mailto:contact@allianceone.io" className="footer-link">Contact Privé</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
