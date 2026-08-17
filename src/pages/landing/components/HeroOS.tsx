/**
 * ALLIANCE ONE — HERO OS (CINEMATIC ECOSYSTEM VISUALIZER)
 * 
 * Séquence d'animation orchestrée (4-7 secondes) :
 * 1. Alliance One Monogram & Brand Core (0.0s - 1.2s)
 * 2. Alliance Core & Nervous System (1.2s - 2.4s)
 * 3. Unified Workspace Layer (2.4s - 3.6s)
 * 4. Business Applications Tier (Education, Finance, Inventory, Tasks) (3.6s - 4.8s)
 * 5. Intelligence & Infrastructure Layer (AI Transverse, Automation, Cloud) (4.8s - 6.0s)
 * 6. Ambient Live Ecosystem Pulse (6.0s+)
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Landmark, 
  Package, 
  FolderKanban, 
  Cpu, 
  Zap, 
  Cloud, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  Activity
} from 'lucide-react';
import logoSrc from '../../../assets/logo.png';
import './HeroOS.css';

interface ModuleNodeInfo {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  statLabel: string;
  statValue: string;
  pulseEvent: string;
}

const BUSINESS_MODULES: ModuleNodeInfo[] = [
  {
    id: 'edu',
    name: 'Éducation Pro',
    category: 'Vertical Académique',
    icon: GraduationCap,
    color: '#4f46e5',
    statLabel: 'Élèves & Dossiers',
    statValue: 'Actifs en temps réel',
    pulseEvent: 'Nouvelle inscription validée'
  },
  {
    id: 'fin',
    name: 'Finances & Caisses',
    category: 'Trésorerie & Facturation',
    icon: Landmark,
    color: '#059669',
    statLabel: 'Flux Monétaires',
    statValue: 'Multi-devises & Mobile',
    pulseEvent: 'Paiement scolarité reçu'
  },
  {
    id: 'inv',
    name: 'Stocks & WMS',
    category: 'Logistique & PMP',
    icon: Package,
    color: '#0ea5e9',
    statLabel: 'Traçabilité Dépôts',
    statValue: 'Inventaires en direct',
    pulseEvent: 'Bon d’entrée stock approuvé'
  },
  {
    id: 'tsk',
    name: 'Tâches & Projets',
    category: 'Collaboration d’Équipe',
    icon: FolderKanban,
    color: '#8b5cf6',
    statLabel: 'Vélocité & Jalons',
    statValue: 'Kanban synchronisé',
    pulseEvent: 'Clôture de trimestre franchie'
  }
];

export const HeroOS: React.FC = () => {
  const [activeNode, setActiveNode] = useState<ModuleNodeInfo | null>(null);
  const [pulseIndex, setPulseIndex] = useState(0);

  // Periodic ambient pulse through modules
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % BUSINESS_MODULES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-os-stage">
      {/* ── Ambient Radial Glows (Precision Light Palette) ── */}
      <div className="hero-os-ambient-glow" />
      <div className="hero-os-gold-glow" />

      {/* ── Dynamic Connecting Neural Lines (SVG Canvas) ── */}
      <svg className="hero-os-neural-lines" viewBox="0 0 640 520" fill="none" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lineGradCoreToApps" x1="320" y1="90" x2="320" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B2B5C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0B2B5C" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="lineGradAppsToInfra" x1="320" y1="310" x2="320" y2="450" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B2B5C" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glowPulse">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Spine Trunk: Apex to Core */}
        <motion.path
          d="M320 80 L320 155"
          stroke="url(#lineGradCoreToApps)"
          strokeWidth="2"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.8, ease: "easeInOut" }}
        />

        {/* 2. Arteries from Core to 4 Business Nodes */}
        {/* Core to Node 0 (Education: x=80, y=240) */}
        <motion.path
          d="M320 185 C 320 220, 90 195, 90 240"
          stroke="rgba(79, 70, 229, 0.35)"
          strokeWidth="1.75"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 2.2, ease: "easeInOut" }}
        />
        {/* Core to Node 1 (Finance: x=240, y=240) */}
        <motion.path
          d="M320 185 C 320 215, 245 205, 245 240"
          stroke="rgba(5, 150, 105, 0.35)"
          strokeWidth="1.75"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 2.5, ease: "easeInOut" }}
        />
        {/* Core to Node 2 (Inventory: x=395, y=240) */}
        <motion.path
          d="M320 185 C 320 215, 395 205, 395 240"
          stroke="rgba(14, 165, 233, 0.35)"
          strokeWidth="1.75"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 2.8, ease: "easeInOut" }}
        />
        {/* Core to Node 3 (Tasks: x=550, y=240) */}
        <motion.path
          d="M320 185 C 320 220, 550 195, 550 240"
          stroke="rgba(139, 92, 246, 0.35)"
          strokeWidth="1.75"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 3.1, ease: "easeInOut" }}
        />

        {/* 3. Lines from Applications Down to Intelligence & Cloud Tier */}
        <motion.path
          d="M90 300 C 90 370, 160 380, 160 415"
          stroke="rgba(11, 43, 92, 0.15)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 4.2 }}
        />
        <motion.path
          d="M245 300 C 245 365, 320 370, 320 415"
          stroke="rgba(11, 43, 92, 0.15)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 4.5 }}
        />
        <motion.path
          d="M395 300 C 395 365, 320 370, 320 415"
          stroke="rgba(11, 43, 92, 0.15)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 4.8 }}
        />
        <motion.path
          d="M550 300 C 550 370, 480 380, 480 415"
          stroke="rgba(11, 43, 92, 0.15)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 5.1 }}
        />

        {/* Live Traveling Signal Particle */}
        <motion.circle
          r="3.5"
          fill="#d4af37"
          filter="url(#glowPulse)"
          initial={{ cx: 320, cy: 175, opacity: 0 }}
          animate={{
            cx: [320, 90, 160, 320, 550, 480, 320],
            cy: [175, 240, 415, 415, 240, 415, 175],
            opacity: [0, 1, 0.8, 1, 0.9, 0.8, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6.0
          }}
        />
      </svg>

      {/* ── TIER 1: APEX (Alliance One Identity) ── */}
      <motion.div 
        className="hero-os-tier tier-apex"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="apex-pill">
          <img src={logoSrc} alt="AO" className="apex-monogram" />
          <div className="apex-text-block">
            <span className="apex-title">ALLIANCE ONE</span>
            <span className="apex-sub">Business Operating System</span>
          </div>
          <span className="apex-badge">OS 2.4</span>
        </div>
      </motion.div>

      {/* ── TIER 2: ALLIANCE CORE (Nervous Engine) ── */}
      <motion.div 
        className="hero-os-tier tier-core"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="core-engine-card">
          <div className="core-icon-orb">
            <Database size={16} color="#0B2B5C" />
          </div>
          <div className="core-meta">
            <div className="core-headline">
              <span className="core-label">ALLIANCE CORE</span>
              <span className="core-status-dot" />
            </div>
            <span className="core-sub">Universal Data & Event Sourcing Bus</span>
          </div>
          <div className="core-telemetry-tag">
            <Activity size={10} color="#10b981" />
            <span>0 ms Rupture</span>
          </div>
        </div>
      </motion.div>

      {/* ── TIER 3: BUSINESS APPLICATIONS GRID ── */}
      <div className="hero-os-tier tier-apps">
        {BUSINESS_MODULES.map((mod, idx) => {
          const Icon = mod.icon;
          const isPulsing = pulseIndex === idx;
          const isHovered = activeNode?.id === mod.id;

          return (
            <motion.div
              key={mod.id}
              className={`app-node-card ${isPulsing ? 'is-pulsing' : ''} ${isHovered ? 'is-active' : ''}`}
              style={{ '--app-accent': mod.color } as React.CSSProperties}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.9, 
                delay: 2.2 + idx * 0.3, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              onMouseEnter={() => setActiveNode(mod)}
              onMouseLeave={() => setActiveNode(null)}
            >
              <div className="app-node-top">
                <div 
                  className="app-node-icon-box"
                  style={{ backgroundColor: `${mod.color}15`, color: mod.color }}
                >
                  <Icon size={18} />
                </div>
                <div className="app-node-category">{mod.category}</div>
              </div>

              <div className="app-node-body">
                <strong className="app-node-name">{mod.name}</strong>
                <span className="app-node-val">{mod.statValue}</span>
              </div>

              {/* Dynamic live event ribbon */}
              <div className="app-node-ribbon">
                <span className="ribbon-bullet" />
                <span className="ribbon-text">{mod.pulseEvent}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── TIER 4: TRANSVERSE INTELLIGENCE & INFRASTRUCTURE ── */}
      <motion.div 
        className="hero-os-tier tier-infra"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 4.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="infra-pill">
          <Sparkles size={13} color="#ec4899" />
          <span className="infra-label">Alliance AI (Transverse)</span>
        </div>

        <div className="infra-pill">
          <Zap size={13} color="#d4af37" />
          <span className="infra-label">Event-Driven Automation</span>
        </div>

        <div className="infra-pill">
          <Cloud size={13} color="#0B2B5C" />
          <span className="infra-label">Offline-First Engine</span>
        </div>
      </motion.div>

      {/* ── Active Node Floating Tooltip / Story Card ── */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            className="hero-os-inspector"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div className="inspector-badge" style={{ backgroundColor: `${activeNode.color}15`, color: activeNode.color }}>
              {activeNode.name}
            </div>
            <div className="inspector-text">
              <strong>Données universelles :</strong> Chaque événement de ce module alimente instantanément la trésorerie, la scolarité et les audits sans ressaisie.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
