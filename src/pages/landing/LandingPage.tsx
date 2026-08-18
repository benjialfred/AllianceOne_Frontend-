/**
 * ALLIANCE ONE — LANDING PAGE PUBLIQUE COMPLÈTE
 * 
 * Raconte l'histoire complète d'Alliance One :
 * Hero cinématique (animation 1) �' Vision �' Modules �' Universal Data �'
 * Alliance AI �' Automation �' Marketplace �' Developers �' Built for Africa �'
 * Trust & Security �' CTA Final (animation 5) �' Footer.
 */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
  Layers,
  GraduationCap,
  Landmark,
  Package,
  FolderKanban,
  BookOpen,
  Stethoscope,
  Users,
  BarChart3,
  FileText,
  Bell,
  Cloud,
  Terminal,
  Code2,
  Store,
  Building2,
  Wifi,
  WifiOff,
  Smartphone,
  CreditCard,
  Database,
  Activity,
  Eye,
  Server,
  Shield,
  Check,
  ExternalLink,
  ChevronDown,
  Play,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
import { HeroOS } from './components/HeroOS';
import logoSrc from '../../assets/logo.png';
import heroVideo from '../../assets/animation (1).mp4';
import ctaVideo from '../../assets/animation (5).mp4';
import './LandingPage.css';

/* ── Animated Section Wrapper (fade-in on scroll) ── */
const FadeSection: React.FC<{ children: React.ReactNode; className?: string; id?: string; delay?: number }> = ({ children, className, id, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
};

/* ── FAQ Accordion Item ── */
const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'faq-open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="faq-question">
        <span>{question}</span>
        <ChevronDown size={16} className={`faq-chevron ${open ? 'rotated' : ''}`} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Module Card Data ── */
const MODULES = [
  { icon: GraduationCap, name: 'Éducation Pro', desc: 'Inscriptions, notes, bulletins, présences, cartes scolaires, revenus — tout dans un seul espace.', color: '#4f46e5', tag: 'Installé' },
  { icon: Landmark, name: 'Finances & Trésorerie', desc: 'Comptes, caisses, factures TVA, budgets analytiques, journal des opérations en temps réel.', color: '#059669', tag: 'Installé' },
  { icon: Package, name: 'Stocks & Logistique WMS', desc: 'Valorisation PMP, traçabilité multi-dépôts, bons de commande, fabrication BOM.', color: '#0ea5e9', tag: 'Installé' },
  { icon: FolderKanban, name: 'Tâches & Projets', desc: 'Kanban, jalons, attribution d\'équipe, suivi de vélocité, portefeuille de projets.', color: '#8b5cf6', tag: 'Installé' },
  { icon: BookOpen, name: 'Bibliothèque & CDI', desc: 'Catalogue d\'ouvrages, prêts, retours, statistiques de lecture.', color: '#3b82f6', tag: 'Installé' },
  { icon: Stethoscope, name: 'Santé & Clinique', desc: 'Dossiers patients, consultations, prescriptions, laboratoire.', color: '#10b981', tag: 'Bientôt' },
  { icon: Users, name: 'CRM & Relations', desc: 'Contacts, pipeline commercial, suivi client, opportunités.', color: '#f59e0b', tag: 'Bêta' },
  { icon: BarChart3, name: 'Ressources Humaines', desc: 'Employés, contrats, paie, congés, évaluations.', color: '#ef4444', tag: 'Bientôt' },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">

      {/* ═══════════════════════════════════════════════
          1. PUBLIC NAVBAR
          ═══════════════════════════════════════════════ */}
      <header className={`landing-nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <div className="landing-nav-brand" onClick={() => navigate('/')}>
            <img src={logoSrc} alt="Alliance One" className="landing-nav-logo" />
            <span className="landing-brand-badge">BUSINESS OS</span>
          </div>

          <nav className="landing-nav-links">
            <a href="#modules" className="landing-nav-link">Applications</a>
            <a href="#use-cases" className="landing-nav-link">Cas d'usage</a>
            <a href="#ai" className="landing-nav-link">Intelligence</a>
            <a href="#pricing" className="landing-nav-link">Tarifs</a>
            <a href="#faq" className="landing-nav-link">FAQ</a>
            <a href="#contact" className="landing-nav-link">Contact</a>
          </nav>

          <div className="landing-nav-actions">
            <button className="landing-nav-login-btn" onClick={() => navigate('/login')}>Se connecter</button>
            <button className="landing-nav-cta-btn" onClick={() => navigate('/register')}>
              <span>Créer mon environnement</span>
              <ArrowRight size={14} />
            </button>
            <button className="landing-mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div className="landing-mobile-drawer" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <a href="#vision" onClick={() => setMobileMenuOpen(false)}>Vision</a>
            <a href="#modules" onClick={() => setMobileMenuOpen(false)}>Applications</a>
            <a href="#universal-data" onClick={() => setMobileMenuOpen(false)}>Données</a>
            <a href="#ai" onClick={() => setMobileMenuOpen(false)}>Intelligence</a>
            <a href="#developers" onClick={() => setMobileMenuOpen(false)}>Développeurs</a>
            <a href="#africa" onClick={() => setMobileMenuOpen(false)}>Afrique</a>
            <div className="mobile-drawer-actions">
              <button className="mobile-login" onClick={() => navigate('/login')}>Se connecter</button>
              <button className="mobile-cta" onClick={() => navigate('/register')}>Créer mon environnement</button>
            </div>
          </motion.div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════
          2. HERO — CINEMATIC VIDEO BACKGROUND + VALUE PROP
          ═══════════════════════════════════════════════ */}
      <section className="landing-hero">
        {/* Full-screen background video (animation 1) */}
        <video className="hero-bg-video" src={heroVideo} autoPlay muted loop playsInline />
        <div className="hero-bg-overlay" />
        {/* Watermark mask for Gemini filigrane */}
        <div className="hero-watermark-mask">
          <img src={logoSrc} alt="AO" className="hero-watermark-logo" />
        </div>

        <div className="landing-hero-inner">
          <motion.div 
            className="landing-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-kicker-pill">
              <span className="kicker-pulse-dot" />
              <span className="kicker-text">ALLIANCE ONE · THE OPERATING SYSTEM FOR ORGANIZATIONS</span>
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
              <button className="hero-primary-cta" onClick={() => navigate('/register')}>
                <span>Créer mon environnement</span>
                <ArrowRight size={16} />
              </button>
              <button className="hero-secondary-cta" onClick={() => { document.getElementById('vision')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span>Découvrir Alliance One</span>
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="landing-hero-login-anchor">
              <span>Déjà membre ?</span>
              <button onClick={() => navigate('/login')} className="login-link-btn">Se connecter <ChevronRight size={13} /></button>
            </div>
          </motion.div>

          {/* HeroOS Ecosystem Diagram */}
          <motion.div 
            className="landing-hero-visual-wrapper"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroOS />
          </motion.div>
        </div>

        <div className="hero-scroll-indicator">
          <ChevronDown size={20} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. VISION — "PLUS QU'UN LOGICIEL. UN ÉCOSYSTÈME."
          ═══════════════════════════════════════════════ */}
      <FadeSection id="vision" className="landing-section section-vision">
        <div className="section-inner">
          <span className="section-kicker">LA VISION</span>
          <h2 className="section-heading">
            Plus qu'un logiciel.<br />
            <span className="heading-muted">Un écosystème.</span>
          </h2>
          <p className="section-lead">
            Alliance One n'est pas une application métier. C'est l'environnement dans lequel vos applications métier fonctionnent — connectées entre elles, alimentées par vos données, et augmentées par l\'intelligence artificielle.
          </p>

          <div className="vision-stack">
            {[
              { label: 'Alliance ID', desc: 'Identité unique pour chaque utilisateur', icon: Shield },
              { label: 'Workspace', desc: 'Votre espace de travail personnalisé', icon: Layers },
              { label: 'Modules Métier', desc: 'Les applications dont vous avez besoin', icon: Boxes },
              { label: 'Alliance AI', desc: 'Intelligence intégrée au système', icon: Sparkles },
              { label: 'Automation', desc: 'Vos processus travaillent ensemble', icon: Zap },
              { label: 'Marketplace', desc: 'Votre plateforme peut grandir avec vous', icon: Store },
              { label: 'Developer Platform', desc: 'Construisez au-dessus d\'Alliance One', icon: Terminal },
            ].map((layer, idx) => {
              const Icon = layer.icon;
              return (
                <motion.div 
                  key={layer.label}
                  className="vision-layer-card"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                >
                  <div className="vision-layer-icon"><Icon size={18} /></div>
                  <div className="vision-layer-text">
                    <strong>{layer.label}</strong>
                    <span>{layer.desc}</span>
                  </div>
                  {idx < 6 && <div className="vision-layer-connector" />}
                </motion.div>
              );
            })}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          4. MODULES — LES APPLICATIONS DU SYSTÈME
          ═══════════════════════════════════════════════ */}
      <FadeSection id="modules" className="landing-section section-modules">
        <div className="section-inner">
          <span className="section-kicker">APPLICATIONS</span>
          <h2 className="section-heading">
            Les outils dont votre organisation a besoin.<br />
            <span className="heading-muted">Dans un seul environnement.</span>
          </h2>

          <div className="modules-grid">
            {MODULES.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <motion.div
                  key={mod.name}
                  className="module-card"
                  style={{ '--mod-color': mod.color } as React.CSSProperties}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.6 }}
                >
                  <div className="module-card-header">
                    <div className="module-icon-box" style={{ background: `${mod.color}12`, color: mod.color }}>
                      <Icon size={22} />
                    </div>
                    <span className={`module-tag ${mod.tag === 'Installé' ? 'installed' : 'beta'}`}>{mod.tag}</span>
                  </div>
                  <h3 className="module-name">{mod.name}</h3>
                  <p className="module-desc">{mod.desc}</p>
                  <button className="module-discover-btn">
                    <span>Découvrir</span>
                    <ArrowRight size={13} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          5. UNIVERSAL DATA — "UNE DONNÉE. PLUSIEURS CONTEXTES."
          ═══════════════════════════════════════════════ */}
      <FadeSection id="universal-data" className="landing-section section-data">
        <div className="section-inner">
          <span className="section-kicker">DONNÉES UNIVERSELLES</span>
          <h2 className="section-heading">
            Une donnée.<br />
            Plusieurs contextes.<br />
            <span className="heading-muted">Zéro rupture.</span>
          </h2>
          <p className="section-lead">
            Dans Alliance One, chaque objet est universel. Un élève inscrit dans le module Éducation est automatiquement reconnu par la Finance, la Bibliothèque et les Communications — sans ressaisie, sans erreur, sans rupture.
          </p>

          <div className="data-flow-demo">
            <div className="data-flow-person">
              <div className="data-person-avatar">B</div>
              <div className="data-person-info">
                <strong>Benjamin Alfred</strong>
                <span>Objet Universel · Alliance ID</span>
              </div>
            </div>

            <div className="data-flow-arrow">
              <Activity size={14} />
            </div>

            <div className="data-flow-modules">
              {[
                { icon: GraduationCap, label: 'Éducation', detail: 'Dossier académique', color: '#4f46e5' },
                { icon: Landmark, label: 'Finance', detail: 'Historique paiements', color: '#059669' },
                { icon: BookOpen, label: 'Bibliothèque', detail: 'Prêts actifs', color: '#3b82f6' },
                { icon: Bell, label: 'Notifications', detail: 'Alertes & rappels', color: '#f59e0b' },
                { icon: FileText, label: 'Documents', detail: 'Bulletins & factures', color: '#8b5cf6' },
              ].map((mod, idx) => {
                const Icon = mod.icon;
                return (
                  <motion.div 
                    key={mod.label} 
                    className="data-module-chip"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                  >
                    <Icon size={14} color={mod.color} />
                    <div>
                      <strong>{mod.label}</strong>
                      <span>{mod.detail}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          6. ALLIANCE AI — INTELLIGENCE TRANSVERSE
          ═══════════════════════════════════════════════ */}
      <FadeSection id="ai" className="landing-section section-ai">
        <div className="section-inner">
          <span className="section-kicker">INTELLIGENCE</span>
          <h2 className="section-heading">
            L'intelligence intégrée<br />
            <span className="heading-muted">au système.</span>
          </h2>
          <p className="section-lead">
            Alliance AI n'est pas un chatbot ajouté après coup. C'est une couche d'intelligence transverse qui analyse, prédit, automatise et recommande à travers tous vos modules — en temps réel.
          </p>

          <div className="ai-capabilities-grid">
            {[
              { icon: Eye, label: 'Analyse', desc: 'Extraction de tendances et de signaux faibles dans vos opérations.' },
              { icon: BarChart3, label: 'Prévisions', desc: 'Anticipation des flux de trésorerie, des besoins en stock, des pics d\'inscription.' },
              { icon: FileText, label: 'OCR & Documents', desc: 'Numérisation et extraction automatique des données depuis vos documents papier.' },
              { icon: Sparkles, label: 'Recommandations', desc: 'Suggestions personnalisées pour optimiser vos processus et vos décisions.' },
              { icon: Zap, label: 'Automatisation', desc: 'Déclenchement intelligent d\'actions basées sur les événements du système.' },
              { icon: Shield, label: 'Conformité', desc: 'Détection proactive des anomalies et des risques dans vos données.' },
            ].map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <motion.div 
                  key={cap.label} 
                  className="ai-capability-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <div className="ai-cap-icon"><Icon size={20} /></div>
                  <strong>{cap.label}</strong>
                  <p>{cap.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          7. AUTOMATION — "VOS APPLICATIONS TRAVAILLENT ENSEMBLE"
          ═══════════════════════════════════════════════ */}
      <FadeSection className="landing-section section-automation">
        <div className="section-inner">
          <span className="section-kicker">AUTOMATISATION</span>
          <h2 className="section-heading">
            Faites travailler<br />
            <span className="heading-muted">vos applications ensemble.</span>
          </h2>

          <div className="automation-flow">
            {[
              { step: 'Événement', detail: 'Nouveau paiement reçu', icon: CreditCard },
              { step: 'Condition', detail: 'Montant > 50 000 FCFA', icon: Database },
              { step: 'Action', detail: 'Générer la facture + notifier', icon: Zap },
              { step: 'Résultat', detail: 'Dossier mis à jour automatiquement', icon: Check },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <React.Fragment key={s.step}>
                  <motion.div 
                    className="automation-step"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                  >
                    <div className="auto-step-icon"><Icon size={18} /></div>
                    <strong>{s.step}</strong>
                    <span>{s.detail}</span>
                  </motion.div>
                  {idx < 3 && <div className="automation-arrow"><ChevronDown size={16} /></div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          8. MARKETPLACE & DEVELOPER PLATFORM
          ═══════════════════════════════════════════════ */}
      <FadeSection id="developers" className="landing-section section-dev-market">
        <div className="section-inner">
          <div className="dev-market-grid">
            {/* Marketplace */}
            <div className="dev-market-card">
              <span className="section-kicker">MARKETPLACE</span>
              <h3 className="dm-heading">Votre plateforme peut grandir avec vous.</h3>
              <p className="dm-desc">Applications, extensions, connecteurs, widgets, templates et rapports — tout un écosystème d'outils prêts à installer.</p>
              <button className="dm-cta" onClick={() => navigate('/register')}>
                Explorer Alliance Store <ArrowRight size={14} />
              </button>
            </div>

            {/* Developer Platform */}
            <div className="dev-market-card dev-card">
              <span className="section-kicker">DÉVELOPPEURS</span>
              <h3 className="dm-heading">Construisez au-dessus d'Alliance One.</h3>
              <div className="dev-terminal">
                <div className="terminal-bar">
                  <span className="terminal-dot red" /><span className="terminal-dot yellow" /><span className="terminal-dot green" />
                  <span className="terminal-title">Terminal</span>
                </div>
                <div className="terminal-body">
                  <code><span className="t-prompt">$</span> alliance create-module pharmacy</code>
                  <code className="t-output">✓ Module créé �' Test �' Certification �' Marketplace</code>
                </div>
              </div>
              <div className="dev-stack-tags">
                <span>Alliance CLI</span><span>SDK</span><span>REST API</span><span>Webhooks</span><span>Sandbox</span>
              </div>
              <button className="dm-cta dev-cta" onClick={() => navigate('/register')}>
                Explorer Developer Platform <Code2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          9. BUILT FOR AFRICA
          ═══════════════════════════════════════════════ */}
      <FadeSection id="africa" className="landing-section section-africa">
        <div className="section-inner">
          <span className="section-kicker">ORIGINE</span>
          <h2 className="section-heading">
            Built for Africa.<br />
            <span className="heading-muted">Ready for the world.</span>
          </h2>
          <p className="section-lead">
            Nous partons de réalités africaines pour construire une infrastructure logicielle capable de servir le monde. Alliance One est conçu pour fonctionner là où d'autres échouent.
          </p>

          <div className="africa-features-grid">
            {[
              { icon: WifiOff, label: 'Offline First', desc: 'Fonctionne sans connexion. Synchronisation automatique dès le retour du réseau.' },
              { icon: Smartphone, label: 'Mobile Native', desc: 'Expérience conçue pour les smartphones, pas simplement adaptée.' },
              { icon: Wifi, label: 'Faible Connectivité', desc: 'Optimisé pour les réseaux 2G/3G et les zones à bande passante limitée.' },
              { icon: CreditCard, label: 'Paiements Locaux', desc: 'Orange Money, MTN Mobile Money, Wave, et les systèmes de paiement africains.' },
              { icon: Building2, label: 'PME & Écoles', desc: 'Adapté aux besoins réels des organisations africaines de toutes tailles.' },
              { icon: Globe, label: 'Ouverture Mondiale', desc: 'Architecture internationale, multi-devises, multi-langues et multi-fuseaux.' },
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div 
                  key={f.label} 
                  className="africa-feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <div className="africa-feat-icon"><Icon size={18} /></div>
                  <strong>{f.label}</strong>
                  <p>{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          10. TRUST & SECURITY
          ═══════════════════════════════════════════════ */}
      <FadeSection className="landing-section section-trust">
        <div className="section-inner">
          <span className="section-kicker">CONFIANCE</span>
          <h2 className="section-heading">
            Conçu pour les organisations<br />
            <span className="heading-muted">modernes.</span>
          </h2>
          <div className="trust-grid">
            {[
              { icon: Lock, label: 'Chiffrement AES-256' },
              { icon: Shield, label: 'Contrôle d\'accès RBAC / ABAC' },
              { icon: Eye, label: 'Audit & traçabilité complète' },
              { icon: Server, label: 'Sauvegardes automatiques' },
              { icon: Activity, label: 'Disponibilité 99.9%' },
              { icon: Layers, label: 'Architecture modulaire' },
              { icon: WifiOff, label: 'Mode hors ligne intégral' },
              { icon: Code2, label: 'API ouverte & extensible' },
            ].map((t, idx) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="trust-item-card">
                  <Icon size={18} />
                  <span>{t.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          11. COMMENT ÇA MARCHE — 3 ÉTAPES
          ═══════════════════════════════════════════════ */}
      <FadeSection className="landing-section section-how">
        <div className="section-inner">
          <span className="section-kicker">COMMENT ÇA MARCHE</span>
          <h2 className="section-heading">
            Opérationnel en 3 minutes.<br />
            <span className="heading-muted">Pas en 3 mois.</span>
          </h2>

          <div className="how-steps-row">
            {[
              { step: '01', title: 'Créez votre environnement', desc: "Inscrivez-vous gratuitement. Choisissez le nom de votre organisation, invitez vos premiers collaborateurs. Aucune carte bancaire requise.", icon: Users },
              { step: '02', title: 'Activez vos modules', desc: "Sélectionnez les applications dont vous avez besoin : Éducation, Finance, Stocks, Tâches… Chaque module est prêt à l'emploi.", icon: Boxes },
              { step: '03', title: 'Travaillez immédiatement', desc: "Vos données circulent entre les modules. Votre équipe collabore. Vos processus s'automatisent. Tout est connecté dès le premier jour.", icon: Zap },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  className="how-step-card"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.7 }}
                >
                  <span className="how-step-number">{s.step}</span>
                  <div className="how-step-icon"><Icon size={22} /></div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          12. CAS D'USAGE — "POUR QUI ?"
          ═══════════════════════════════════════════════ */}
      <FadeSection id="use-cases" className="landing-section section-usecases">
        <div className="section-inner">
          <span className="section-kicker">CAS D'USAGE</span>
          <h2 className="section-heading">
            Conçu pour votre réalité.<br />
            <span className="heading-muted">Pas pour un monde idéal.</span>
          </h2>

          <div className="usecases-grid">
            {[
              { icon: GraduationCap, title: 'Écoles & Universités', desc: "Inscriptions, notes, bulletins, présences, paiements de scolarité, cartes d'étudiant — le tout interconnecté dans un seul environnement.", color: '#4f46e5' },
              { icon: Stethoscope, title: 'Cliniques & Centres de Santé', desc: "Dossiers patients, consultations, prescriptions, laboratoire, facturation médicale et suivi épidémiologique.", color: '#10b981' },
              { icon: Building2, title: 'PME & Entreprises', desc: "Gestion commerciale, stocks multi-dépôts, trésorerie, projets internes, RH et automatisation des processus.", color: '#0ea5e9' },
              { icon: Store, title: 'ONG & Associations', desc: "Suivi de programmes, gestion des bénéficiaires, rapports bailleurs, comptabilité par projet et transparence.", color: '#f59e0b' },
            ].map((uc, idx) => {
              const Icon = uc.icon;
              return (
                <motion.div
                  key={uc.title}
                  className="usecase-card"
                  style={{ '--uc-color': uc.color } as React.CSSProperties}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="uc-icon" style={{ background: `${uc.color}12`, color: uc.color }}>
                    <Icon size={24} />
                  </div>
                  <h3>{uc.title}</h3>
                  <p>{uc.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          13. SOCIAL PROOF — CHIFFRES & CRÉDIBILITÉ
          ═══════════════════════════════════════════════ */}
      <FadeSection className="landing-section section-proof">
        <div className="section-inner">
          <div className="proof-metrics-row">
            {[
              { value: '5+', label: 'Modules métier natifs' },
              { value: '99.9%', label: 'Disponibilité garantie' },
              { value: '0', label: 'Données perdues' },
              { value: '< 3 min', label: 'Pour créer votre environnement' },
              { value: '∞', label: 'Utilisateurs par organisation' },
              { value: '100%', label: 'Offline-first compatible' },
            ].map((m, idx) => (
              <motion.div
                key={m.label}
                className="proof-metric"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <span className="proof-value">{m.value}</span>
                <span className="proof-label">{m.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          14. TARIFICATION — PLANS
          ═══════════════════════════════════════════════ */}
      <FadeSection id="pricing" className="landing-section section-pricing">
        <div className="section-inner">
          <span className="section-kicker">TARIFICATION</span>
          <h2 className="section-heading">
            Commencez gratuitement.<br />
            <span className="heading-muted">Évoluez sans limites.</span>
          </h2>

          <div className="pricing-grid">
            {/* Free */}
            <div className="pricing-card">
              <span className="pricing-tier">Découverte</span>
              <div className="pricing-amount"><span className="pricing-currency">Gratuit</span></div>
              <p className="pricing-desc">Pour découvrir Alliance One et tester avec votre équipe.</p>
              <ul className="pricing-features">
                <li><Check size={14} /> 1 organisation</li>
                <li><Check size={14} /> 3 utilisateurs</li>
                <li><Check size={14} /> 2 modules actifs</li>
                <li><Check size={14} /> Support communautaire</li>
                <li><Check size={14} /> 500 Mo stockage</li>
              </ul>
              <button className="pricing-cta" onClick={() => navigate('/register')}>Commencer gratuitement</button>
            </div>

            {/* Pro */}
            <div className="pricing-card pricing-featured">
              <span className="pricing-badge">POPULAIRE</span>
              <span className="pricing-tier">Professionnel</span>
              <div className="pricing-amount">
                <span className="pricing-price">15 000</span>
                <span className="pricing-unit">FCFA / mois</span>
              </div>
              <p className="pricing-desc">Pour les organisations en croissance qui veulent tout connecter.</p>
              <ul className="pricing-features">
                <li><Check size={14} /> Utilisateurs illimités</li>
                <li><Check size={14} /> Tous les modules</li>
                <li><Check size={14} /> Alliance AI intégré</li>
                <li><Check size={14} /> Automatisations</li>
                <li><Check size={14} /> Support prioritaire</li>
                <li><Check size={14} /> 50 Go stockage</li>
                <li><Check size={14} /> API & Webhooks</li>
              </ul>
              <button className="pricing-cta featured-cta" onClick={() => navigate('/register')}>
                Choisir Professionnel <ArrowRight size={14} />
              </button>
            </div>

            {/* Enterprise */}
            <div className="pricing-card">
              <span className="pricing-tier">Entreprise</span>
              <div className="pricing-amount"><span className="pricing-currency">Sur devis</span></div>
              <p className="pricing-desc">Pour les grandes organisations avec des besoins spécifiques.</p>
              <ul className="pricing-features">
                <li><Check size={14} /> Multi-organisations</li>
                <li><Check size={14} /> Modules personnalisés</li>
                <li><Check size={14} /> SLA dédié 99.99%</li>
                <li><Check size={14} /> Déploiement on-premise</li>
                <li><Check size={14} /> Formation & accompagnement</li>
                <li><Check size={14} /> Stockage illimité</li>
              </ul>
              <button className="pricing-cta" onClick={() => navigate('/register')}>Contacter les ventes</button>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          15. FAQ — QUESTIONS FRÉQUENTES
          ═══════════════════════════════════════════════ */}
      <FadeSection id="faq" className="landing-section section-faq">
        <div className="section-inner">
          <span className="section-kicker">FAQ</span>
          <h2 className="section-heading">
            Questions fréquentes.
          </h2>

          <div className="faq-list">
            {/* <FAQItem
              question="Qu'est-ce qu'Alliance One exactement ?"
              answer="Alliance One est un Business Operating System (OS métier). C'est un environnement unifié qui réunit vos applications professionnelles (éducation, finances, stocks, tâches, bibliothèque, etc.), vos données et vos processus dans une seule plateforme. Contrairement à un logiciel classique, Alliance One fonctionne comme un système d'exploitation pour votre organisation."
            />
            <FAQItem
              question="Est-ce adapté à mon école / ma PME / ma clinique ?"
              answer="Oui. Alliance One est conçu pour servir tous types d'organisations : écoles, universités, cliniques, PME, ONG, associations et entreprises. Les modules sont activables selon vos besoins — vous n'installez que ce dont vous avez besoin."
            />
            <FAQItem
              question="Faut-il une connexion Internet permanente ?"
              answer="Non. Alliance One est conçu en mode Offline-First. Vous pouvez travailler sans connexion — vos données se synchronisent automatiquement dès que le réseau revient. C'est une exigence fondamentale pour les réalités africaines et les zones à faible connectivité."
            />
            <FAQItem
              question="Combien coûte Alliance One ?"
              answer="Alliance One propose un plan Découverte entièrement gratuit pour commencer. Le plan Professionnel démarre à 15 000 FCFA/mois avec utilisateurs illimités et tous les modules. Un plan Entreprise sur devis est disponible pour les grandes organisations."
            />
            <FAQItem
              question="Mes données sont-elles sécurisées ?"
              answer="Absolument. Vos données sont chiffrées (AES-256), protégées par un contrôle d'accès granulaire (RBAC/ABAC), sauvegardées automatiquement et auditées. Alliance One respecte les normes de sécurité internationales et garantit une disponibilité de 99.9%."
            />
            <FAQItem
              question="Puis-je migrer depuis mon système actuel ?"
              answer="Oui. Alliance One propose des outils d'import (Excel, CSV) et une équipe d'accompagnement pour faciliter la migration depuis vos outils existants. Vos données historiques peuvent être intégrées."
            />
            <FAQItem
              question="Est-ce que je peux développer mes propres modules ?"
              answer="Oui. La Developer Platform d'Alliance One offre un SDK, une CLI, des API REST, des Webhooks et un environnement Sandbox pour créer, tester et publier vos propres modules sur la Marketplace."
            />
            <FAQItem
              question="Comment contacter le support ?"
              answer="Le plan Découverte inclut le support communautaire. Les plans Professionnel et Entreprise bénéficient d'un support prioritaire par email et chat. Une documentation complète et des tutoriels vidéo sont également disponibles."
            /> */}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          16. CONTACT / DEMANDER UNE DÉMO
          ═══════════════════════════════════════════════ */}
      <FadeSection id="contact" className="landing-section section-contact">
        <div className="section-inner">
          <div className="contact-grid">
            <div className="contact-text-col">
              <span className="section-kicker">CONTACT</span>
              <h2 className="section-heading">
                Une question ?<br />
                <span className="heading-muted">Parlons-en.</span>
              </h2>
              <p className="section-lead" style={{ marginBottom: '32px' }}>
                Notre équipe est disponible pour vous accompagner dans la découverte d'Alliance One, planifier une démonstration personnalisée, ou répondre à vos questions techniques.
              </p>

              <div className="contact-info-list">
                <div className="contact-info-item">
                  <Mail size={18} />
                  <div>
                    <strong>Email</strong>
                    <span>contact@allianceone.io</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <Phone size={18} />
                  <div>
                    <strong>Téléphone</strong>
                    <span>+237 6XX XXX XXX</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <MapPin size={18} />
                  <div>
                    <strong>Siège</strong>
                    <span>Douala, Cameroun</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-col">
              <div className="contact-form-card">
                <h3>Demander une démonstration</h3>
                <div className="contact-form-fields">
                  <input type="text" placeholder="Votre nom complet" className="contact-input" />
                  <input type="email" placeholder="Votre email professionnel" className="contact-input" />
                  <input type="text" placeholder="Nom de votre organisation" className="contact-input" />
                  <select className="contact-input">
                    <option value="">Type d'organisation</option>
                    <option>École / Université</option>
                    <option>PME / Entreprise</option>
                    <option>Clinique / Centre de santé</option>
                    <option>ONG / Association</option>
                    <option>Autre</option>
                  </select>
                  <textarea placeholder="Décrivez brièvement vos besoins..." className="contact-input contact-textarea" rows={4} />
                </div>
                <button className="contact-submit-btn" onClick={() => navigate('/register')}>
                  Envoyer ma demande <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          17. CTA FINAL — VIDEO BACKGROUND (animation 5)
          ═══════════════════════════════════════════════ */}
      <section className="landing-section section-cta-final">
        <video className="cta-bg-video" src={ctaVideo} autoPlay muted loop playsInline />
        <div className="cta-bg-overlay" />
        <div className="cta-watermark-mask">
          <img src={logoSrc} alt="AO" className="cta-watermark-logo" />
        </div>

        <div className="section-inner cta-final-inner">
          <motion.h2 
            className="cta-final-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Votre organisation mérite mieux<br />
            qu'une collection d'outils.
          </motion.h2>
          <p className="cta-final-sub">
            Découvrez un nouvel environnement conçu pour connecter vos équipes, vos données, vos applications et vos opérations.
          </p>
          <div className="cta-final-actions">
            <button className="hero-primary-cta" onClick={() => navigate('/register')}>
              <span>Créer mon environnement</span>
              <ArrowRight size={16} />
            </button>
            <button className="hero-secondary-cta cta-light" onClick={() => { document.getElementById('vision')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <span>Explorer Alliance One</span>
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="cta-final-login">
            Déjà membre ? <button onClick={() => navigate('/login')} className="login-link-btn login-light">Se connecter <ChevronRight size={13} /></button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          12. FOOTER
          ═══════════════════════════════════════════════ */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand-col">
            <img src={logoSrc} alt="Alliance One" className="footer-logo" />
            <p className="footer-tagline">The Business Operating System.<br />Built for Africa. Ready for the world.</p>
          </div>

          <div className="footer-links-col">
            <h4>Produit</h4>
            <a href="#vision">Alliance Hub</a>
            <a href="#modules">Modules</a>
            <a href="#ai">Alliance AI</a>
            <a href="#modules">Automation</a>
            <a href="#modules">Alliance Cloud</a>
          </div>

          <div className="footer-links-col">
            <h4>Développeurs</h4>
            <a href="#developers">Developer Platform</a>
            <a href="#">Documentation</a>
            <a href="#">SDK & CLI</a>
            <a href="#">API REST</a>
            <a href="#">Sandbox</a>
          </div>

          <div className="footer-links-col">
            <h4>Entreprise</h4>
            <a href="#">Services</a>
            <a href="#">Portfolio</a>
            <a href="#africa">Communauté</a>
            <a href="#">À propos</a>
            <a href="#">Contact</a>
          </div>

          <div className="footer-links-col">
            <h4>Légal</h4>
            <a href="#">Confidentialité</a>
            <a href="#">Conditions</a>
            <a href="#">Sécurité</a>
            <a href="#">Licences</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Alliance One. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
};

