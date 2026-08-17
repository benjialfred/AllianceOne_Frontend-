/**
 * ALLIANCE ONE — SPATIAL DUAL SECTION (ACTIVITY STREAM & PRODUCT STORY)
 * Réunit le flux d'activité universel et la pause éditoriale cinématique Product Story.
 */
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Landmark, 
  Package, 
  FolderKanban, 
  BookOpen, 
  Clock, 
  ArrowUpRight, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import schoolVideo from '../../../assets/Cour_d_ecole_Duration_s.mp4';
import campusVideo from '../../../assets/Campus_Hero_Dashboard_prin.mp4';

interface ActivityEvent {
  id: string;
  module: 'Éducation' | 'Finance' | 'Stock' | 'Tâches' | 'Bibliothèque';
  action: string;
  subject: string;
  detail: string;
  timestamp: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  accentColor: string;
  routePath: string;
  badge?: string;
}

export const SpatialActivityAndStory: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Auto pause when scrolled off screen
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const events: ActivityEvent[] = [
    {
      id: 'evt-1',
      module: 'Éducation',
      action: 'Nouvelle Inscription',
      subject: 'Marc Aurèle Ndomo (1ère S1)',
      detail: 'Dossier académique validé. Reçu de scolarité généré.',
      timestamp: 'Il y a 14 min',
      icon: GraduationCap,
      accentColor: '#4f46e5',
      routePath: '/education/students',
      badge: 'Validé'
    },
    {
      id: 'evt-2',
      module: 'Finance',
      action: 'Paiement Reçu',
      subject: '120 000 FCFA — Tranche 2',
      detail: 'Règlement scolarité (Caisse Principale) élève Biya Christian.',
      timestamp: 'Il y a 32 min',
      icon: Landmark,
      accentColor: '#059669',
      routePath: '/finance/transactions',
      badge: 'Encaissé'
    },
    {
      id: 'evt-3',
      module: 'Stock',
      action: 'Mouvement Stock',
      subject: 'Entrée Bon #BC-2026-084',
      detail: '+500 Manuels de Mathématiques 3e au Dépôt Central.',
      timestamp: 'Il y a 1h 10m',
      icon: Package,
      accentColor: '#0ea5e9',
      routePath: '/inventory/stock-movements',
      badge: '+500 Unités'
    },
    {
      id: 'evt-4',
      module: 'Tâches',
      action: 'Jalon Terminé',
      subject: 'Calcul Moyennes Trimestre 1',
      detail: 'Validation des notes par le Directeur des Études.',
      timestamp: 'Il y a 2h 45m',
      icon: FolderKanban,
      accentColor: '#8b5cf6',
      routePath: '/tasks/board',
      badge: '100%'
    }
  ];

  return (
    <section className="hub-spatial-section">
      <div className="spatial-dual-grid">
        {/* LEFT COLUMN: UNIVERSAL ACTIVITY STREAM */}
        <div className="spatial-column-activity">
          <div className="spatial-column-header">
            <div>
              <span className="hub-section-kicker">FLUX EN DIRECT</span>
              <h3 className="spatial-column-title">Activité Universelle</h3>
            </div>
            <span className="live-dot-pill">Live</span>
          </div>

          <div className="activity-stream-compact-card">
            {events.map((evt) => {
              const Icon = evt.icon;
              return (
                <div
                  key={evt.id}
                  className="activity-compact-row"
                  onClick={() => navigate(evt.routePath)}
                >
                  <div 
                    className="activity-icon-bubble"
                    style={{ backgroundColor: `${evt.accentColor}18`, color: evt.accentColor }}
                  >
                    <Icon size={15} />
                  </div>

                  <div className="activity-meta-group">
                    <div className="activity-headline-line">
                      <span className="activity-module-name" style={{ color: evt.accentColor }}>
                        {evt.module}
                      </span>
                      <span className="activity-time-text">
                        <Clock size={10} /> {evt.timestamp}
                      </span>
                    </div>
                    <div className="activity-subject-text">{evt.subject}</div>
                    <div className="activity-detail-text">{evt.detail}</div>
                  </div>

                  <ArrowUpRight size={14} className="activity-arrow" />
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: EDITORIAL PRODUCT STORY */}
        <div className="spatial-column-story">
          <div className="spatial-column-header">
            <div>
              <span className="hub-section-kicker">RÉCIT PRODUIT</span>
              <h3 className="spatial-column-title">Alliance en Action</h3>
            </div>
          </div>

          <div className="editorial-story-card" onClick={togglePlay}>
            <video
              ref={videoRef}
              src={schoolVideo}
              className="editorial-story-video"
              loop
              muted={isMuted}
              playsInline
              autoPlay
              preload="metadata"
            />

            {/* Gradient Overlay */}
            <div className="editorial-story-vignette"></div>

            {/* Top Sound Control */}
            <div className="editorial-story-top-tools">
              <span className="story-category-tag">CAMPUS & ÉDUCATION</span>
              <button 
                className="story-audio-btn" 
                onClick={toggleSound}
                title={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>

            {/* Bottom Editorial Caption */}
            <div className="editorial-story-caption">
              <span className="caption-pretitle">EXPÉRIENCE ÉDUCATION</span>
              <h4 className="caption-headline">
                UNE PLATEFORME. TOUTE VOTRE ORGANISATION.
              </h4>
              <p className="caption-subtext">
                Centralisez les dossiers scolaires, les bulletins et le recouvrement en une interface fluide.
              </p>

              <button 
                className="story-explore-link" 
                onClick={(e) => { e.stopPropagation(); navigate('/education'); }}
              >
                <span>Découvrir l'Espace Éducation</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
