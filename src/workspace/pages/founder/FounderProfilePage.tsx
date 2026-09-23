import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion';
import { Fingerprint, MonitorSmartphone, Code2, GitCommit, Heart } from 'lucide-react';
import { founderApi } from '../../../core/api/founder';
import './FounderProfile.css';

// Components
import { ContextualCursor, type CursorState } from './components/ContextualCursor';
import { ExperimentalHero } from './components/ExperimentalHero';
import { SystemicEngineering } from './components/SystemicEngineering';
import { AllianceOneClimax } from './components/AllianceOneClimax';
import { SelectedProjects } from './components/SelectedProjects';

/* ==========================================================================
   REUSABLE MOTION COMPONENTS
   ========================================================================== */
const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px 0px' });
  const isReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const LineDraw: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0 }}
      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ originX: 0, height: '1px', backgroundColor: 'var(--founder-border)', width: '100%', margin: '2rem 0' }}
    />
  );
};

/* ==========================================================================
   MAIN PAGE
   ========================================================================== */
export const FounderProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    founderApi.trackEvent({ event_type: 'PROFILE_VIEW' }).catch(console.error);
    window.scrollTo(0, 0);
  }, []);

  const handleCVClick = (e: React.MouseEvent) => {
    e.preventDefault();
    founderApi.trackEvent({ event_type: 'CV_CLICK' }).catch(console.error);
    navigate('/founder/cv');
  };

  const cursorHover = () => setCursorState('view');
  const cursorLeave = () => setCursorState('default');

  // How I Build Tracking
  const buildRef1 = useRef(null);
  const buildRef2 = useRef(null);
  const buildRef3 = useRef(null);
  const buildRef4 = useRef(null);
  const b1View = useInView(buildRef1, { margin: "-30% 0px -50% 0px" });
  const b2View = useInView(buildRef2, { margin: "-30% 0px -50% 0px" });
  const b3View = useInView(buildRef3, { margin: "-30% 0px -50% 0px" });
  const b4View = useInView(buildRef4, { margin: "-30% 0px -50% 0px" });

  // CV Transition Friction
  const cvRef = useRef(null);
  const { scrollYProgress: cvScroll } = useScroll({ target: cvRef, offset: ["start end", "end end"] });
  const cvOpacity = useTransform(cvScroll, [0, 0.8, 1], [0, 0.5, 1]);
  const cvScale = useTransform(cvScroll, [0, 1], [0.9, 1]);

  return (
    <motion.div 
      className="founder-profile-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      <ContextualCursor cursorState={cursorState} />
      
      {/* Absolute Header Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '2rem 1.5rem', zIndex: 10 }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={() => navigate('/')} 
            onMouseEnter={cursorHover}
            onMouseLeave={cursorLeave}
            className="founder-link-raw"
          >
            ← RETOUR
          </button>
          <div className="founder-micro" style={{ opacity: 0.5 }}>System ID: A1-FD</div>
        </div>
      </motion.nav>

      <div className="founder-container">
        
        {/* ================= HERO (Component) ================= */}
        <ExperimentalHero setCursorState={setCursorState} />

        <div className="founder-spacer"></div>

        {/* ================= 01 / IDENTITY ================= */}
        <section>
          <FadeUp>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem', alignItems: 'start' }}>
              <div>
                <div className="founder-micro" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Fingerprint size={16} color="var(--founder-accent)" /> 01 — Identité
                </div>
                <div className="founder-micro" style={{ color: 'var(--founder-text-display)', lineHeight: 2 }}>
                  INGÉNIEUR LOGICIEL<br/>
                  BÂTISSEUR DE PRODUITS<br/>
                  FONDATEUR
                </div>
              </div>
              <div>
                <h2 className="founder-section-title" style={{ marginBottom: '2rem' }}>L'ingénierie avec intention.</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', maxWidth: '800px' }}>
                  <p className="founder-body">
                    Je suis un ingénieur logiciel et bâtisseur de produits focalisé sur les systèmes numériques modernes. Ma conviction est que le code n'est qu'un vecteur de résolution : l'essentiel réside dans la traduction d'une complexité métier en solutions élégantes, fiables et scalables.
                  </p>
                  <p className="founder-body">
                    Une interface ne suffit pas à créer un produit robuste. L'architecture, la modélisation des données, la sécurité et la maintenabilité sont les fondations invisibles qui garantissent la viabilité d'un système à long terme. Je conçois des produits où l'excellence technique se met au service de l'utilisateur final.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
        </section>

        <div className="founder-spacer"></div>

        {/* ================= 02 / HOW I BUILD (Circuit Sequence) ================= */}
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
            <FadeUp>
              <div className="founder-micro" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GitCommit size={16} color="var(--founder-accent)" /> 02 — Méthodologie
              </div>
            </FadeUp>
            
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '6rem' }}>
              {/* Animated vertical circuit line */}
              <div style={{ position: 'absolute', left: '16px', top: '2rem', bottom: '2rem', width: '1px', backgroundColor: 'var(--founder-border-light)' }}>
                <motion.div 
                  style={{ width: '1px', backgroundColor: 'var(--founder-text-display)', height: '100%', originY: 0 }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ margin: "-10% 0px -50% 0px" }}
                  transition={{ duration: 2, ease: "linear" }}
                />
              </div>

              <motion.div ref={buildRef1} style={{ display: 'flex', gap: '4rem', alignItems: 'center', opacity: b1View ? 1 : 0.2, transition: 'opacity 0.6s', paddingLeft: '4rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--founder-text-display)', position: 'absolute', left: '12.5px' }} />
                <div className="founder-section-title">Comprendre</div>
                <div className="founder-body" style={{ maxWidth: '300px' }}>Comprendre précisément l'origine du problème, les contraintes métier et les objectifs avant d'écrire la moindre ligne de code. L'ingénierie commence par l'écoute.</div>
              </motion.div>

              <motion.div ref={buildRef2} style={{ display: 'flex', gap: '4rem', alignItems: 'center', opacity: b2View ? 1 : 0.2, transition: 'opacity 0.6s', paddingLeft: '4rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--founder-text-display)', position: 'absolute', left: '12.5px' }} />
                <div className="founder-section-title">Architecturer</div>
                <div className="founder-body" style={{ maxWidth: '300px' }}>Définir des fondations résilientes. Choisir les technologies pour leur adéquation avec les exigences de sécurité et de performance.</div>
              </motion.div>

              <motion.div ref={buildRef3} style={{ display: 'flex', gap: '4rem', alignItems: 'center', opacity: b3View ? 1 : 0.2, transition: 'opacity 0.6s', paddingLeft: '4rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--founder-text-display)', position: 'absolute', left: '12.5px' }} />
                <div className="founder-section-title">Construire</div>
                <div className="founder-body" style={{ maxWidth: '300px' }}>Exécuter avec précision. Écrire un code propre, testable et documenté. Chaque fonction doit avoir une raison d'exister.</div>
              </motion.div>

              <motion.div ref={buildRef4} style={{ display: 'flex', gap: '4rem', alignItems: 'center', opacity: b4View ? 1 : 0.2, transition: 'opacity 0.6s', paddingLeft: '4rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--founder-text-display)', position: 'absolute', left: '12.5px' }} />
                <div className="founder-section-title">Raffiner</div>
                <div className="founder-body" style={{ maxWidth: '300px' }}>Chercher la simplicité au-delà de la complexité initiale. L'excellence se trouve dans la soustraction.</div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="founder-spacer"></div>

        {/* ================= 03 / SYSTEMIC ENGINEERING (Component) ================= */}
        <SystemicEngineering setCursorState={setCursorState} />

      </div>

      {/* ================= 04 / ALLIANCE ONE CLIMAX (Component) ================= */}
      <AllianceOneClimax setCursorState={setCursorState} />

      <div className="founder-container">
        
        <div className="founder-spacer"></div>
        
        {/* ================= 05 / SELECTED WORK ================= */}
        <SelectedProjects setCursorState={setCursorState} />

        <div className="founder-spacer"></div>

        {/* ================= 06 / BEYOND CODE ================= */}
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
            <FadeUp>
              <div className="founder-micro" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={16} color="var(--founder-accent)" /> 06 — Au-delà du Code
              </div>
            </FadeUp>
            
            <div>
              <FadeUp delay={0.2}>
                <h2 className="founder-section-title" style={{ marginBottom: '4rem' }}>Dimensions de caractère.</h2>
              </FadeUp>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                <FadeUp delay={0.3}>
                  <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '1rem' }}>Discipline</div>
                  <div className="founder-body">Constance dans l'effort et exécution méthodique. La capacité à répéter l'effort jusqu'à la maîtrise, inspirée par la rigueur sportive (Workout, Basketball).</div>
                </FadeUp>
                <FadeUp delay={0.4}>
                  <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '1rem' }}>Réflexion</div>
                  <div className="founder-body">Profondeur de pensée et ancrage des valeurs fondamentales. Comprendre le 'pourquoi' avant d'optimiser le 'comment'.</div>
                </FadeUp>
                <FadeUp delay={0.5}>
                  <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '1rem' }}>Endurance</div>
                  <div className="founder-body">Capacité à maintenir le cap face à la complexité systémique prolongée sans compromettre la qualité.</div>
                </FadeUp>
                <FadeUp delay={0.6}>
                  <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '1rem' }}>Progression</div>
                  <div className="founder-body">Itération continue sur soi-même comme sur le code. La conviction qu'un système humain ou digital n'est jamais vraiment terminé.</div>
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

        <div className="founder-spacer" style={{ height: '30vh' }}></div>

        {/* ================= 07 / CV (Cinematic Transition) ================= */}
        <motion.section 
          ref={cvRef} 
          style={{ textAlign: 'center', opacity: cvOpacity, scale: cvScale }}
        >
          <div className="founder-micro" style={{ marginBottom: '2rem' }}>07 — Curriculum Vitae</div>
          <h2 className="founder-section-title" style={{ marginBottom: '3rem' }}>Un regard plus attentif sur le travail.</h2>
          
          <button 
            onClick={handleCVClick} 
            onMouseEnter={() => setCursorState('open')}
            onMouseLeave={cursorLeave}
            className="founder-link-raw" 
          >
            VOIR LE CURRICULUM VITAE
          </button>
        </motion.section>

      </div>
    </motion.div>
  );
};
