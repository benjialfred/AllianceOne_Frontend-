import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Code, HeartPulse, Package } from 'lucide-react';
import allianceOneImg from '../../../../assets/alliance-one.png';
import prophetieCoutureImg from '../../../../assets/prophetie-couture.png';

const FadeUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px 0px' });
  const isReducedMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const INDIVIDUAL_PROJECTS = [
  {
    title: "Plateforme Alliance One",
    role: "Architecte Principal & Fullstack",
    year: "2024—PRÉS",
    description: "L'écosystème central. Une plateforme SaaS complète conçue pour la gestion unifiée des organisations modernes (écoles, cliniques, entreprises). Architecture modulaire, modélisation de données universelle, et intelligence artificielle intégrée pour automatiser les processus critiques de bout en bout.",
    tags: ["React", "Python", "Architecture Système", "IA"],
    image: allianceOneImg,
    link: "alliancefrontend.vercel.app",
  },
  {
    title: "Emergence School",
    role: "Créateur & Ingénieur",
    year: "2023",
    description: "Logiciel propriétaire complet pour la gestion d'un établissement scolaire. Le système digitalise et centralise l'ensemble du cycle de vie académique : des inscriptions à la génération des bulletins officiels, en passant par le suivi des présences et la gestion financière. Un outil vital qui a éliminé la paperasse et drastiquement accéléré la prise de décision administrative.",
    tags: ["EdTech", "Fullstack", "Base de données", "UI/UX"],
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    // Pas de lien pour un logiciel propriétaire
  },
  {
    title: "Prophétie Couture",
    role: "Développeur Fullstack",
    year: "2022",
    description: "Plateforme sur mesure conçue pour la gestion des ventes et des commandes en ligne d'un atelier de couture professionnel. Elle automatise la prise de mesures des clients, le suivi précis de la production des vêtements, et offre une vitrine e-commerce fluide. Une transformation digitale complète pour dynamiser l'artisanat local.",
    tags: ["E-commerce", "Automatisation", "Dashboard"],
    image: prophetieCoutureImg,
    link: "https://prophetiecouture.vercel.app",
  },
  {
    title: "Minimalist TodoApp",
    role: "Créateur",
    year: "2021",
    description: "Une application de gestion de tâches ultra-réactive et minimaliste. L'accent a été mis sur la performance brute, les micro-interactions et une expérience utilisateur sans aucune friction pour maximiser la productivité au quotidien.",
    tags: ["Productivité", "Frontend", "Temps Réel"],
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80",
    link: "#lien-todo-app-a-remplacer",
  }
];

const COLLABORATIONS = [
  {
    title: "Chezmoi",
    status: "En cours de développement",
    role: "Collaboration technique",
    icon: <Code size={20} color="var(--founder-accent)" />,
    description: "Plateforme innovante (PropTech) conçue pour simplifier la recherche et la gestion de biens immobiliers."
  },
  {
    title: "Plateforme de Don de Sang",
    status: "Hôpital Général de Douala",
    role: "Aide au développement",
    icon: <HeartPulse size={20} color="#ef4444" />,
    description: "Système critique de gestion des donneurs, des poches de sang et des besoins d'urgence pour optimiser la chaîne de solidarité médicale locale."
  },
  {
    title: "Plateforme de Gestion des Stocks",
    status: "Supply Chain",
    role: "Aide au développement",
    icon: <Package size={20} color="#eab308" />,
    description: "Outil technologique d'optimisation et de suivi des inventaires en temps réel, conçu pour réduire les pertes et automatiser les réapprovisionnements."
  }
];

interface SelectedProjectsProps {
  setCursorState: (state: any) => void;
}

export const SelectedProjects: React.FC<SelectedProjectsProps> = ({ setCursorState }) => {
  return (
    <section>
      <FadeUp>
        <div className="founder-micro" style={{ marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          05 — Projets Sélectionnés & Collaborations
        </div>
      </FadeUp>

      {/* INDIVIDUAL PROJECTS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem', marginBottom: '8rem' }}>
        {INDIVIDUAL_PROJECTS.map((project, idx) => (
          <FadeUp key={idx} delay={0.1}>
            <div 
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}
            >
              {/* Project Image */}
              <div style={{ display: 'block', overflow: 'hidden', borderRadius: '12px', position: 'relative', aspectRatio: '16/10', WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
                {project.link ? (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer"
                    onMouseEnter={() => setCursorState('view')}
                    onMouseLeave={() => setCursorState('default')}
                    style={{ display: 'block', width: '100%', height: '100%' }}
                  >
                    <motion.img 
                      src={project.image} 
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transformOrigin: 'center' }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.1)', pointerEvents: 'none' }} />
                  </a>
                ) : (
                  <div style={{ display: 'block', width: '100%', height: '100%' }}>
                    <motion.img 
                      src={project.image} 
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transformOrigin: 'center' }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.1)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.1)' }}>
                      Accès Privé
                    </div>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <div className="founder-micro" style={{ color: 'var(--founder-text-display)', marginBottom: '0.5rem' }}>{project.year} — {project.role}</div>
                    <h3 className="founder-section-title" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', color: 'var(--founder-text-display)' }}>{project.title}</h3>
                  </div>
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noreferrer"
                      onMouseEnter={() => setCursorState('explore')}
                      onMouseLeave={() => setCursorState('default')}
                      style={{ color: 'var(--founder-text-display)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', border: '1px solid var(--founder-border)', borderRadius: '50%', flexShrink: 0 }}
                    >
                      <ArrowUpRight size={20} />
                    </a>
                  )}
                </div>
                
                <p className="founder-body" style={{ marginBottom: '2rem' }}>
                  {project.description}
                </p>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {project.tags.map((tag, tIdx) => (
                    <span key={tIdx} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.4rem 0.8rem', border: '1px solid var(--founder-border-light)', borderRadius: '20px', color: 'var(--founder-text-secondary)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--founder-border)', width: '100%', marginBottom: '6rem' }} />

      {/* COLLABORATIONS */}
      <FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
          <div>
            <div className="founder-micro" style={{ color: 'var(--founder-text-display)' }}>Collaborations & Contributions</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {COLLABORATIONS.map((collab, idx) => (
              <motion.div 
                key={idx} 
                style={{ paddingBottom: '3rem', borderBottom: '1px solid var(--founder-border-light)' }}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                  <h4 className="founder-subtitle" style={{ color: 'var(--founder-text-display)', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {collab.icon} {collab.title}
                  </h4>
                  <span className="founder-micro">{collab.status}</span>
                </div>
                <div className="founder-sub" style={{ color: 'var(--founder-accent)', marginBottom: '1rem' }}>{collab.role}</div>
                <p className="founder-body" style={{ margin: 0 }}>{collab.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  );
};
