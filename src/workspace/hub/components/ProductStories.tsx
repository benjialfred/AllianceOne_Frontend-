/**
 * ALLIANCE ONE — PRODUCT STORIES
 * Stories cinématiques vidéo courtes, fluides et silencieuses présentant l'écosystème Alliance One.
 */
import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Play, Pause } from 'lucide-react';
import campusVideo from '../../../assets/Campus_Hero_Dashboard_prin.mp4';
import schoolVideo from '../../../assets/Cour_d_ecole_Duration_s.mp4';
import corpVideo from '../../../assets/Create_an_ultra_realistic_corp.mp4';

interface StoryItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  videoSrc: string;
}

export const ProductStories: React.FC = () => {
  const stories: StoryItem[] = [
    {
      id: 'story-1',
      tag: 'EXPÉRIENCE CAMPUS',
      title: 'Gestion Académique & Vie Scolaire',
      description: 'Centralisez les inscriptions, les bulletins officiels et le recouvrement en un flux fluide.',
      videoSrc: schoolVideo
    },
    {
      id: 'story-2',
      tag: 'DÉCISION TEMPS RÉEL',
      title: 'Cockpit & Tableaux de Bord Unifiés',
      description: 'Visualisez vos KPIs financiers, la valorisation de vos stocks et la performance d’équipe.',
      videoSrc: campusVideo
    },
    {
      id: 'story-3',
      tag: 'ARCHITECTURE OS',
      title: 'Conçu pour l’Entreprise Moderne',
      description: 'Multi-tenant, modulaire, sécurisé et pensé pour les standards internationaux.',
      videoSrc: corpVideo
    }
  ];

  return (
    <section className="hub-section">
      <div className="hub-section-header">
        <div>
          <div className="hub-section-pretitle">DÉCOUVRIR ALLIANCE ONE</div>
          <h2 className="hub-section-title">Product Stories</h2>
        </div>
        <p className="hub-section-subtitle-right">
          Aperçus cinématiques de notre technologie en action
        </p>
      </div>

      <div className="product-stories-grid">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
};

const StoryCard: React.FC<{ story: StoryItem }> = ({ story }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Auto pause when out of viewport
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
      { threshold: 0.4 }
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

  return (
    <div className="story-card-wrapper" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={story.videoSrc}
        className="story-video"
        loop
        muted={isMuted}
        playsInline
        autoPlay
        preload="metadata"
      />

      {/* Cinematic Gradient Vignette */}
      <div className="story-vignette"></div>

      {/* Controls Overlay */}
      <div className="story-controls-top">
        <span className="story-tag-pill">{story.tag}</span>
        <button className="story-sound-btn" onClick={toggleSound} title={isMuted ? 'Activer le son' : 'Couper le son'}>
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      {/* Bottom Text Overlay */}
      <div className="story-content-bottom">
        <h3 className="story-title">{story.title}</h3>
        <p className="story-desc">{story.description}</p>
      </div>
    </div>
  );
};
