/**
 * ALLIANCE ONE — LANDING PAGE HAUTE FACTURE
 * 
 * Design épuré, prestigieux et professionnel :
 * Pas de vidéos lourdes, pas d'effets cyberpunk ni de clichés IA.
 * Typographie soignée, animations commerciales de conversion, fluidité mobile totale.
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
  Lock,
  Boxes,
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
  CheckCircle2,
  Building2,
  Wifi,
  WifiOff,
  Smartphone,
  CreditCard,
  Activity,
  Server,
  Shield,
  Check,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Sparkles,
  Award
} from 'lucide-react';
import { PrestigeTicker } from './components/PrestigeTicker';
import { InteractiveShowcase } from './components/InteractiveShowcase';
import { DeviceShowcase } from './components/DeviceShowcase';
import logoSrc from '../../assets/logo.png';
import './LandingPage.css';

/* ── Animated Section Wrapper (fade-in on scroll) ── */
const FadeSection: React.FC<{ children: React.ReactNode; className?: string; id?: string; delay?: number }> = ({ children, className, id, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 35 }}
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
        <ChevronDown size={18} className={`faq-chevron ${open ? 'rotated' : ''}`} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Modules Data ── */
const MODULES = [
  { icon: GraduationCap, name: 'Éducation Pro', desc: 'Inscriptions, notes, bulletins certifiés, suivi des présences et gestion financière académique en un clic.', color: '#6366f1', tag: 'Opérationnel' },
  { icon: Landmark, name: 'Finances & Caisses', desc: 'Gestion multi-caisses, facturation TVA, journaux de trésorerie analytiques et encaissements Mobile Money sécurisés.', color: '#10b981', tag: 'Opérationnel' },
  { icon: Package, name: 'Stocks & Logistique WMS', desc: 'Valorisation rigoureuse en PMP, traçabilité multi-dépôts, alertes d’épuisement et gestion des réceptions.', color: '#0ea5e9', tag: 'Opérationnel' },
  { icon: FolderKanban, name: 'Tâches & Projets', desc: 'Kanban synchronisé, jalons stratégiques, vélocité d’équipe et gouvernance fluide des activités.', color: '#a855f7', tag: 'Opérationnel' },
  { icon: BookOpen, name: 'Bibliothèque & CDI', desc: 'Catalogue numérique, indexation des ouvrages, gestion automatisée des prêts, retours et relances.', color: '#38bdf8', tag: 'Opérationnel' },
  { icon: Stethoscope, name: 'Santé & Clinique', desc: 'Dossiers patients confidentiels, consultations médicales, ordonnances et facturation des soins intégrée.', color: '#059669', tag: 'Disponible' },
  { icon: Users, name: 'Relations & Partenaires', desc: 'Fichier unifié des contacts, suivi des opportunités commerciales et historique consolidé des échanges.', color: '#f59e0b', tag: 'Disponible' },
  { icon: BarChart3, name: 'Ressources & Équipes', desc: 'Gestion des collaborateurs, fiches de paie, suivi des congés et évaluations de performance.', color: '#ef4444', tag: 'Disponible' },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 25);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">

      {/* ═══════════════════════════════════════════════
          1. PUBLIC NAVBAR (ÉPURÉE & TRANSPARENTE)
          ═══════════════════════════════════════════════ */}
      <header className={`landing-nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <div className="landing-nav-brand" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img src={logoSrc} alt="Alliance One" className="landing-nav-logo" />
            <span className="landing-brand-badge">SUITE D'ENTREPRISE</span>
          </div>

          <nav className="landing-nav-links">
            <a href="#modules" className="landing-nav-link">Applications</a>
            <a href="#experience" className="landing-nav-link">Expérience</a>
            <a href="#excellence" className="landing-nav-link">Excellence</a>
            <a href="#pricing" className="landing-nav-link">Tarifs</a>
            <a href="#faq" className="landing-nav-link">FAQ</a>
            <a onClick={() => navigate('/founder')} className="landing-nav-link founder-nav-link">Le Fondateur</a>
            <a href="#contact" className="landing-nav-link">Contact</a>
          </nav>

          <div className="landing-nav-actions">
            <button className="landing-nav-login-btn" onClick={() => navigate('/login')}>Se connecter</button>
            <button className="landing-nav-cta-btn" onClick={() => navigate('/register')}>
              <span>Créer mon environnement</span>
              <ArrowRight size={14} />
            </button>
            <button 
              className="landing-mobile-menu-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="landing-mobile-drawer" 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mobile-drawer-links">
                <a href="#modules" onClick={() => setMobileMenuOpen(false)}>Applications</a>
                <a href="#experience" onClick={() => setMobileMenuOpen(false)}>Expérience</a>
                <a href="#excellence" onClick={() => setMobileMenuOpen(false)}>Excellence Opérationnelle</a>
                <a href="#africa" onClick={() => setMobileMenuOpen(false)}>Conçu pour l'Afrique</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Tarifs & Abonnements</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)}>Questions Fréquentes</a>
                <a onClick={() => { setMobileMenuOpen(false); navigate('/founder'); }} className="mobile-founder-link">
                  ★ Rencontrer le Fondateur
                </a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact & Démonstration</a>
              </div>
              <div className="mobile-drawer-actions">
                <button className="mobile-login" onClick={() => navigate('/login')}>Se connecter</button>
                <button className="mobile-cta" onClick={() => navigate('/register')}>Créer mon environnement</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════════════════════════════════════
          2. ANNOUNCEMENT & PRESTIGE TICKER
          ═══════════════════════════════════════════════ */}
      <PrestigeTicker onCtaClick={() => navigate('/register')} />

      {/* ═══════════════════════════════════════════════
          3. HERO — ARCHITECTURAL SOPHISTICATION (NO VIDEO)
          ═══════════════════════════════════════════════ */}
      <section className="landing-hero">
        {/* Ambient Silk Light Canvas */}
        <div className="hero-ambient-canvas">
          <div className="hero-radial-glow hero-glow-gold" />
          <div className="hero-radial-glow hero-glow-navy" />
          <div className="hero-radial-glow hero-glow-slate" />
          <div className="hero-architectural-grid" />
        </div>

        <div className="landing-hero-inner">
          <motion.div 
            className="landing-hero-content"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-prestige-badge">
              <span className="badge-sparkle-dot" />
              <span className="badge-label">ALLIANCE ONE · SUITE LOGICIELLE DE PRESTIGE POUR ORGANISATIONS</span>
            </div>

            <h1 className="landing-hero-title">
              L'art de diriger avec clarté.<br />
              <span className="hero-title-gradient">Un seul environnement d'exception.</span>
            </h1>

            <p className="landing-hero-subtitle">
              Alliance One réunit vos applications métier, vos finances, vos stocks et vos équipes dans un espace d'une pureté et d'une rigueur incomparables. Conçu pour inspirer confiance et accélérer vos décisions.
            </p>

            <div className="landing-hero-actions">
              <button className="hero-primary-cta" onClick={() => navigate('/register')}>
                <span>Créer mon environnement</span>
                <ArrowRight size={16} />
              </button>
              <button 
                className="hero-secondary-cta" 
                onClick={() => { document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                <span>Découvrir la suite</span>
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="hero-trust-row">
              <div className="trust-pill"><CheckCircle2 size={13} color="#10b981" /> Démarrage à 0 FCFA</div>
              <div className="trust-pill"><CheckCircle2 size={13} color="#10b981" /> 100% Hors-Ligne Inclus</div>
              <div className="trust-pill"><CheckCircle2 size={13} color="#10b981" /> Prêt en moins de 3 minutes</div>
            </div>
          </motion.div>

          {/* Interactive Live Showcase Console */}
          <motion.div 
            className="landing-hero-visual-wrapper"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <InteractiveShowcase onExploreClick={() => navigate('/register')} />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. DEVICE SHOWCASE (PC & MOBILE PURIFIÉ)
          ═══════════════════════════════════════════════ */}
      <div id="experience">
        <DeviceShowcase />
      </div>

      {/* ═══════════════════════════════════════════════
          5. VISION — "PLUS QU'UN LOGICIEL. UN STANDARD."
          ═══════════════════════════════════════════════ */}
      <FadeSection id="vision" className="landing-section section-vision">
        <div className="section-inner">
          <div className="section-header-centered">
            <span className="section-kicker">VISION & ARCHITECTURE</span>
            <h2 className="section-heading">
              Plus qu'un logiciel.<br />
              <span className="heading-muted">Un standard d'excellence.</span>
            </h2>
            <p className="section-lead">
              Alliance One a été bâti pour en finir avec le morcellement des outils. Chaque brique est pensée pour communiquer sans friction avec les autres, garantissant une cohérence absolue pour toute votre organisation.
            </p>
          </div>

          <div className="vision-pillars-grid">
            {[
              { title: 'Alliance ID', desc: 'Une identité unique, sécurisée et souveraine pour chaque membre et collaborateur.', icon: Shield, color: '#f59e0b' },
              { title: 'Workspace Unifié', desc: 'Un tableau de bord épuré qui s’adapte automatiquement à votre rôle et vos priorités.', icon: Layers, color: '#6366f1' },
              { title: 'Applications Natives', desc: 'Des modules complets (Éducation, Finances, Stocks, Projets) prêts dès le premier jour.', icon: Boxes, color: '#10b981' },
              { title: 'Automatisation Métier', desc: 'Vos processus s’exécutent automatiquement : facturation, alertes, relances, clôtures.', icon: Zap, color: '#38bdf8' },
              { title: 'Mode Hors-Ligne Absolu', desc: 'Poursuivez vos opérations même en cas de coupure réseau. Synchronisation transparente.', icon: WifiOff, color: '#a855f7' },
              { title: 'Plateforme Ouverte', desc: 'API documentées, exportations universelles et évolutivité totale pour vos équipes.', icon: Globe, color: '#ef4444' },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div 
                  key={pillar.title}
                  className="pillar-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.6 }}
                >
                  <div className="pillar-icon-box" style={{ background: `${pillar.color}15`, color: pillar.color, borderColor: `${pillar.color}30` }}>
                    <Icon size={20} />
                  </div>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <p className="pillar-desc">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          6. APPLICATIONS — LES MODULES DU SUCCÈS
          ═══════════════════════════════════════════════ */}
      <FadeSection id="modules" className="landing-section section-modules">
        <div className="section-inner">
          <div className="section-header-centered">
            <span className="section-kicker">SUITE COMPLÈTE</span>
            <h2 className="section-heading">
              Tout ce dont votre organisation a besoin.<br />
              <span className="heading-muted">Dans un environnement unifié.</span>
            </h2>
            <p className="section-lead">
              Finies les passerelles complexes et les doublons de saisie. Activez les modules dont vous avez besoin selon l'évolution de votre activité.
            </p>
          </div>

          <div className="modules-grid">
            {MODULES.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <motion.div
                  key={mod.name}
                  className="module-card"
                  style={{ '--mod-color': mod.color } as React.CSSProperties}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, duration: 0.6 }}
                >
                  <div className="module-card-header">
                    <div className="module-icon-box" style={{ background: `${mod.color}15`, color: mod.color }}>
                      <Icon size={22} />
                    </div>
                    <span className="module-tag">{mod.tag}</span>
                  </div>
                  <h3 className="module-name">{mod.name}</h3>
                  <p className="module-desc">{mod.desc}</p>
                  <button className="module-discover-btn" onClick={() => navigate('/register')}>
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
          7. DONNÉES UNIFIÉES — ZÉRO RUPTURE
          ═══════════════════════════════════════════════ */}
      <FadeSection id="data" className="landing-section section-data">
        <div className="section-inner">
          <div className="section-header-centered">
            <span className="section-kicker">COHÉRENCE DES DONNÉES</span>
            <h2 className="section-heading">
              Une seule saisie.<br />
              <span className="heading-muted">Une mise à jour instantanée partout.</span>
            </h2>
            <p className="section-lead">
              Un paiement scolarité enregistré met automatiquement à jour le journal de caisse, le reçu de l'élève, les droits d'accès et le tableau de bord de direction.
            </p>
          </div>

          <div className="data-flow-visual">
            <div className="data-source-card">
              <div className="source-avatar">AO</div>
              <div className="source-info">
                <strong>Dossier Élève / Client</strong>
                <span>Entité centrale · Donnée Universelle</span>
              </div>
              <div className="source-pulse-status">Synchronisé</div>
            </div>

            <div className="data-branches-grid">
              {[
                { icon: GraduationCap, label: 'Éducation', detail: 'Validation pédagogique', color: '#6366f1' },
                { icon: Landmark, label: 'Trésorerie', detail: 'Écriture comptable & TVA', color: '#10b981' },
                { icon: BookOpen, label: 'Bibliothèque', detail: 'Statut des emprunts', color: '#38bdf8' },
                { icon: Bell, label: 'Notifications', detail: 'Avis parents / reçus SMS', color: '#f59e0b' },
                { icon: FileText, label: 'Documents', detail: 'Attestation & reçu certifié', color: '#a855f7' },
              ].map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={b.label} className="branch-card">
                    <div className="branch-icon" style={{ color: b.color }}><Icon size={18} /></div>
                    <div className="branch-text">
                      <strong>{b.label}</strong>
                      <span>{b.detail}</span>
                    </div>
                    <CheckCircle2 size={15} className="branch-check" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          8. EXCELLENCE OPÉRATIONNELLE (REPLACES AI)
          ═══════════════════════════════════════════════ */}
      <FadeSection id="excellence" className="landing-section section-excellence">
        <div className="section-inner">
          <div className="section-header-centered">
            <span className="section-kicker">EXCELLENCE OPÉRATIONNELLE</span>
            <h2 className="section-heading">
              Gagnez des heures précieuses chaque semaine.<br />
              <span className="heading-muted">L'efficacité sans complexité.</span>
            </h2>
            <p className="section-lead">
              Alliance One intègre des automatisations éprouvées pour sécuriser vos recettes, éliminer les erreurs humaines et offrir à votre direction une vue claire et nette à tout instant.
            </p>
          </div>

          <div className="excellence-cards-grid">
            {[
              {
                icon: Landmark,
                title: "Rapprochement Automatique des Caisses",
                desc: "Clôtures de journée en un clic. Chaque entrée et sortie est certifiée, sans écart de solde ni doute.",
                stat: "100% Traçable"
              },
              {
                icon: Bell,
                title: "Rappels et Facturation Programmée",
                desc: "Diffusion automatique des factures, relances des paiements et alertes de seuil avant toute rupture de stock.",
                stat: "Zéro Oubli"
              },
              {
                icon: ShieldCheck,
                title: "Contrôle d'Accès Sécurisé (RBAC)",
                desc: "Chaque agent ou enseignant accède uniquement aux dossiers de son périmètre, sous journal d'audit crypté.",
                stat: "Conforme & Sûr"
              },
              {
                icon: Activity,
                title: "Tableaux de Bord Décisionnels",
                desc: "Consultez vos marges, vos effectifs, vos flux monétaires et vos prévisions en un clin d’œil sans calcul manuel.",
                stat: "Temps Réel"
              },
              {
                icon: WifiOff,
                title: "Résilience Hors-Ligne Inégalée",
                desc: "Aucune coupure de courant ou de connexion Internet ne peut bloquer vos guichets. Vos données restent intègres.",
                stat: "Mode Offline"
              },
              {
                icon: Zap,
                title: "Export & Archivage Juridique",
                desc: "Générez des rapports certifiés en PDF et Excel pour vos conseils d'administration et audits ministériels.",
                stat: "Norme B2B"
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={item.title}
                  className="excellence-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <div className="excellence-card-top">
                    <div className="excellence-icon"><Icon size={20} /></div>
                    <span className="excellence-stat-badge">{item.stat}</span>
                  </div>
                  <h3 className="excellence-title">{item.title}</h3>
                  <p className="excellence-desc">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          9. CONÇU POUR L'AFRIQUE, PRÊT POUR LE MONDE
          ═══════════════════════════════════════════════ */}
      <FadeSection id="africa" className="landing-section section-africa">
        <div className="section-inner">
          <div className="section-header-centered">
            <span className="section-kicker">ORIGINE & ENGAGEMENT</span>
            <h2 className="section-heading">
              Bâti pour les réalités d'Afrique.<br />
              <span className="heading-muted">Calibré pour les standards mondiaux.</span>
            </h2>
            <p className="section-lead">
              Nous concevons des logiciels solides qui résistent aux aléas réels : faible bande passante, coupures réseau, et paiements mobiles locaux.
            </p>
          </div>

          <div className="africa-features-grid">
            {[
              { icon: WifiOff, label: 'Architecture Hors-Ligne', desc: 'Fonctionne sans Internet. Les transactions se synchronisent automatiquement au retour du réseau.' },
              { icon: Smartphone, label: 'Conception Mobile Native', desc: 'Une interface pensée pour la rapidité sur smartphone, pour les gestionnaires sur le terrain.' },
              { icon: CreditCard, label: 'Paiements Locaux Intégrés', desc: 'Prise en charge directe d’Orange Money, MTN Mobile Money, Wave et des virements bancaires.' },
              { icon: Building2, label: 'Écoles, Cliniques & PME', desc: 'Des modules spécifiquement calibrés pour répondre aux réglementations et réalités africaines.' },
              { icon: Lock, label: 'Sécurité & Souveraineté', desc: 'Vos données vous appartiennent. Chiffrement de niveau bancaire et sauvegardes redondantes.' },
              { icon: Globe, label: 'Ouverture Internationale', desc: 'Support multidevises (FCFA, EUR, USD), multilingue et compatible multi-fuseaux horaires.' },
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
                  <div className="africa-feat-icon"><Icon size={20} /></div>
                  <strong>{f.label}</strong>
                  <p>{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          10. SOCIAL PROOF — CHIFFRES CLÉS
          ═══════════════════════════════════════════════ */}
      <FadeSection className="landing-section section-proof">
        <div className="section-inner">
          <div className="proof-metrics-row">
            {[
              { value: '5+', label: 'Applications métier natives' },
              { value: '99.9%', label: 'Disponibilité garantie' },
              { value: '0', label: 'Donnée perdue en mode hors-ligne' },
              { value: '< 3 min', label: 'Pour créer son environnement' },
              { value: 'FCFA', label: 'Facturation & devises adaptées' },
              { value: '100%', label: 'Souveraineté des données' },
            ].map((m, idx) => (
              <motion.div
                key={m.label}
                className="proof-metric"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
              >
                <span className="proof-value">{m.value}</span>
                <span className="proof-label">{m.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          11. TARIFICATION — CLARTÉ & PRESTIGE
          ═══════════════════════════════════════════════ */}
      <FadeSection id="pricing" className="landing-section section-pricing">
        <div className="section-inner">
          <div className="section-header-centered">
            <span className="section-kicker">TARIFS & INVESTISSEMENT</span>
            <h2 className="section-heading">
              Un investissement rentable dès le 1er jour.<br />
              <span className="heading-muted">Clair, sans surprise, sans engagement.</span>
            </h2>
            <p className="section-lead">
              Commencez gratuitement pour tester l'environnement avec vos collaborateurs. Passez à la formule supérieure lorsque votre organisation grandit.
            </p>
          </div>

          <div className="pricing-grid">
            {/* Free Tier */}
            <div className="pricing-card">
              <span className="pricing-tier">Découverte</span>
              <div className="pricing-amount">
                <span className="pricing-price">0 FCFA</span>
                <span className="pricing-unit">Pour toujours</span>
              </div>
              <p className="pricing-desc">Pour tester la puissance d'Alliance One et démarrer sans risque.</p>
              <ul className="pricing-features">
                <li><Check size={15} /> 1 organisation active</li>
                <li><Check size={15} /> Jusqu'à 3 collaborateurs</li>
                <li><Check size={15} /> 2 modules au choix</li>
                <li><Check size={15} /> Mode hors-ligne complet</li>
                <li><Check size={15} /> Aucune carte bancaire requise</li>
              </ul>
              <button className="pricing-cta" onClick={() => navigate('/register')}>
                Démarrer gratuitement
              </button>
            </div>

            {/* Pro Tier (Featured) */}
            <div className="pricing-card pricing-featured">
              <div className="featured-ribbon">LE CHOIX PRIVILÈGE</div>
              <span className="pricing-tier">Professionnel</span>
              <div className="pricing-amount">
                <span className="pricing-price">15 000</span>
                <span className="pricing-unit">FCFA / mois</span>
              </div>
              <p className="pricing-desc">La formule complète pour unifier toutes les opérations de votre organisation.</p>
              <ul className="pricing-features">
                <li><Check size={15} color="#10b981" /> <strong>Utilisateurs illimités</strong></li>
                <li><Check size={15} color="#10b981" /> <strong>Tous les modules inclus</strong> (Éducation, Finances, Stocks, Projets)</li>
                <li><Check size={15} color="#10b981" /> Automatisations & Clôtures certifiées</li>
                <li><Check size={15} color="#10b981" /> Support prioritaire WhatsApp & Email</li>
                <li><Check size={15} color="#10b981" /> Sauvegardes cloud quotidiennes sécurisées</li>
                <li><Check size={15} color="#10b981" /> Import simplifié de vos données Excel</li>
              </ul>
              <button className="pricing-cta featured-cta" onClick={() => navigate('/register')}>
                <span>Choisir l'excellence Professionnelle</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="pricing-card">
              <span className="pricing-tier">Institutionnel / Grand Compte</span>
              <div className="pricing-amount">
                <span className="pricing-price">Sur Devis</span>
                <span className="pricing-unit">Personnalisé</span>
              </div>
              <p className="pricing-desc">Pour les réseaux d'écoles, cliniques privées et entreprises à succursales multiples.</p>
              <ul className="pricing-features">
                <li><Check size={15} /> Multi-établissements & multi-organisations</li>
                <li><Check size={15} /> Déploiement sur mesure (Cloud ou Local)</li>
                <li><Check size={15} /> Formations sur site de vos équipes</li>
                <li><Check size={15} /> SLA de disponibilité garanti 99.99%</li>
                <li><Check size={15} /> Ingénieur référent dédié</li>
              </ul>
              <button className="pricing-cta" onClick={() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
                Demander un devis privé
              </button>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          12. RENCONTRE AVEC LE FONDATEUR (PORTFOLIO LINK)
          ═══════════════════════════════════════════════ */}
      <FadeSection className="landing-section section-founder-spotlight">
        <div className="section-inner">
          <div className="founder-spotlight-card">
            <div className="founder-card-content">
              <span className="founder-kicker">L'INGÉNIERIE DERRIÈRE ALLIANCE ONE</span>
              <h3 className="founder-title">Une architecture conçue par un ingénieur passionné.</h3>
              <p className="founder-desc">
                Découvrez la vision technique, le parcours, la philosophie de conception et l'ensemble des projets logiciels menés par le créateur d'Alliance One.
              </p>
              <button className="founder-cta-btn" onClick={() => navigate('/founder')}>
                <span>Découvrir le profil du fondateur</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
            <div className="founder-card-badge">
              <Award size={32} color="#f59e0b" />
              <span>Conception & Architecture Système</span>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          13. FAQ — QUESTIONS FRÉQUENTES
          ═══════════════════════════════════════════════ */}
      <FadeSection id="faq" className="landing-section section-faq">
        <div className="section-inner">
          <div className="section-header-centered">
            <span className="section-kicker">RÉPONSES CLAIRES</span>
            <h2 className="section-heading">Questions fréquentes.</h2>
          </div>

          <div className="faq-list">
            <FAQItem
              question="Qu'est-ce qui différencie Alliance One des autres logiciels de gestion ?"
              answer="Alliance One a été pensé dès le départ comme un environnement unifié : vos données d'élèves, de finances, de stocks et de personnel communiquent naturellement entre elles sans aucun module payant superflu. De plus, il fonctionne à 100% hors-ligne pour garantir la continuité de service."
            />
            <FAQItem
              question="Est-ce adapté à mon école, mon entreprise ou ma clinique ?"
              answer="Parfaitement. Alliance One propose des modules spécialisés qui s'activent en fonction de votre secteur. Vous personnalisez votre espace en quelques secondes et n'utilisez que ce qui apporte de la valeur à votre métier."
            />
            <FAQItem
              question="Que se passe-t-il en cas de coupure d'Internet ou d'électricité ?"
              answer="Vos opérations continuent sans interruption grâce au mode Hors-Ligne complet. Vous pouvez enregistrer des paiements, inscrire des élèves ou valider des stocks. Dès que votre connexion est rétablie, les données se synchronisent automatiquement et en toute sécurité."
            />
            <FAQItem
              question="Puis-je importer mes anciennes données depuis Excel ?"
              answer="Oui. Alliance One dispose d'assistants d'importation simples pour transférer vos listes d'élèves, vos fichiers clients, vos inventaires et vos catalogues directement depuis des fichiers Excel ou CSV."
            />
            <FAQItem
              question="Comment s'effectue le paiement de l'abonnement ?"
              answer="Nous acceptons les moyens de paiement les plus accessibles en Afrique (Orange Money, MTN Mobile Money, Wave) ainsi que les cartes bancaires et les virements pour les formules Entreprise."
            />
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          14. CONTACT & DEMANDE DE DÉMO
          ═══════════════════════════════════════════════ */}
      <FadeSection id="contact" className="landing-section section-contact">
        <div className="section-inner">
          <div className="contact-grid">
            <div className="contact-text-col">
              <span className="section-kicker">ÉCHANGE PRIVÉ</span>
              <h2 className="section-heading">
                Prêt à faire grandir<br />
                <span className="heading-muted">votre organisation ?</span>
              </h2>
              <p className="section-lead" style={{ marginBottom: '32px' }}>
                Notre équipe est à votre écoute pour organiser une démonstration sur mesure ou répondre à vos questions techniques et administratives.
              </p>

              <div className="contact-info-list">
                <div className="contact-info-item">
                  <Mail size={18} />
                  <div>
                    <strong>Email direct</strong>
                    <span>contact@allianceone.io</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <Phone size={18} />
                  <div>
                    <strong>Ligne téléphonique</strong>
                    <span>+237 6XX XXX XXX</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <MapPin size={18} />
                  <div>
                    <strong>Siège opérationnel</strong>
                    <span>Douala, Cameroun</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-col">
              <div className="contact-form-card">
                <h3>Demander une présentation personnalisée</h3>
                <div className="contact-form-fields">
                  <input type="text" placeholder="Votre nom complet" className="contact-input" />
                  <input type="email" placeholder="Votre adresse email professionnelle" className="contact-input" />
                  <input type="text" placeholder="Nom de votre organisation" className="contact-input" />
                  <select className="contact-input">
                    <option value="">Votre type de structure</option>
                    <option>Établissement Scolaire / Université</option>
                    <option>PME / Entreprise Commerciale</option>
                    <option>Clinique / Centre de Santé</option>
                    <option>ONG / Association</option>
                    <option>Autre structure</option>
                  </select>
                  <textarea placeholder="Décrivez vos besoins principaux..." className="contact-input contact-textarea" rows={4} />
                </div>
                <button className="contact-submit-btn" onClick={() => navigate('/register')}>
                  <span>Envoyer ma demande</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ═══════════════════════════════════════════════
          15. CTA FINAL — ARCHITECTURAL GRANDEUR (NO VIDEO)
          ═══════════════════════════════════════════════ */}
      <section className="landing-section section-cta-final">
        <div className="cta-final-ambient-glow" />
        
        <div className="section-inner cta-final-inner">
          <div className="cta-final-badge">
            <Sparkles size={13} color="#f59e0b" />
            <span>ACCÈS IMMÉDIAT EN MOINS DE 3 MINUTES</span>
          </div>

          <motion.h2 
            className="cta-final-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Votre organisation mérite mieux<br />
            qu'une juxtaposition d'outils isolés.
          </motion.h2>

          <p className="cta-final-sub">
            Rejoignez dès aujourd'hui les organisations visionnaires qui ont choisi la clarté, la rigueur et l'élégance pour piloter leur avenir.
          </p>

          <div className="cta-final-actions">
            <button className="hero-primary-cta" onClick={() => navigate('/register')}>
              <span>Créer mon environnement gratuitement</span>
              <ArrowRight size={16} />
            </button>
            <button 
              className="hero-secondary-cta cta-light" 
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <span>Remonter en haut</span>
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="cta-final-login">
            Déjà membre de l'Alliance ? <button onClick={() => navigate('/login')} className="login-link-btn login-light">Accéder à mon espace <ChevronRight size={13} /></button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          16. FOOTER ÉPURÉ
          ═══════════════════════════════════════════════ */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand-col">
            <img src={logoSrc} alt="Alliance One" className="footer-logo" />
            <p className="footer-tagline">
              La suite logicielle unifiée des organisations modernes.<br />
              Conçue en Afrique. Calibrée pour le monde.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Applications</h4>
            <a href="#modules">Éducation Pro</a>
            <a href="#modules">Finances & Caisses</a>
            <a href="#modules">Stocks & Logistique</a>
            <a href="#modules">Tâches & Projets</a>
          </div>

          <div className="footer-links-col">
            <h4>Organisation</h4>
            <a onClick={() => navigate('/founder')} style={{ cursor: 'pointer' }}>Le Fondateur</a>
            <a href="#excellence">Excellence Opérationnelle</a>
            <a href="#africa">Mode Hors-Ligne</a>
            <a href="#pricing">Tarification</a>
          </div>

          <div className="footer-links-col">
            <h4>Accès & Sécurité</h4>
            <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Espace Connexion</a>
            <a onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>Inscription Gratuite</a>
            <a href="#faq">Questions Fréquentes</a>
            <a href="#contact">Contact Support</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Alliance One. Tous droits réservés. L'art de diriger avec clarté.</span>
        </div>
      </footer>
    </div>
  );
};
