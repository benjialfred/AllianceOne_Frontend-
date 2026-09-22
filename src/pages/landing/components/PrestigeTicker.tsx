import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe, CheckCircle2, ChevronRight } from 'lucide-react';

interface PromoMessage {
  tag: string;
  tagColor: string;
  text: string;
  highlight: string;
  ctaText?: string;
  ctaAction?: () => void;
}

const PROMO_MESSAGES: PromoMessage[] = [
  {
    tag: "PRIVILÈGE ALLIANCE",
    tagColor: "#f59e0b",
    text: "Bienvenue, cher futur membre de l'Alliance :",
    highlight: "Découvrez l'environnement conçu pour hisser votre organisation au plus haut niveau.",
    ctaText: "Rejoindre l'Alliance"
  },
  {
    tag: "LE SAVIEZ-VOUS ?",
    tagColor: "#38bdf8",
    text: "Savez-vous que vous pouvez unifier 100% de vos opérations",
    highlight: "sans jamais perdre une facture ni ressaisir une seule donnée client ?",
    ctaText: "Découvrir la suite"
  },
  {
    tag: "INNOVATION TERRAIN",
    tagColor: "#10b981",
    text: "Pannes de réseau ? Zéro arrêt :",
    highlight: "Alliance One fonctionne intégralement hors-ligne et synchronise vos flux dès le retour d'Internet.",
    ctaText: "En savoir plus"
  },
  {
    tag: "OFFRE DÉCOUVERTE",
    tagColor: "#a855f7",
    text: "Opérationnel en 3 minutes chrono :",
    highlight: "Commencez gratuitement sans carte bancaire et invitez vos premiers collaborateurs dès aujourd'hui.",
    ctaText: "Créer un compte"
  }
];

export const PrestigeTicker: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_MESSAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = PROMO_MESSAGES[currentIndex];

  return (
    <div className="prestige-ticker-container">
      <div className="prestige-ticker-inner">
        <div className="prestige-ticker-glow" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="prestige-ticker-content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span 
              className="prestige-ticker-badge"
              style={{ 
                color: current.tagColor, 
                borderColor: `${current.tagColor}33`,
                background: `${current.tagColor}12`
              }}
            >
              <Sparkles size={11} className="ticker-sparkle-icon" />
              {current.tag}
            </span>

            <span className="prestige-ticker-text">
              <span className="ticker-main-text">{current.text}</span>{" "}
              <strong className="ticker-highlight-text">{current.highlight}</strong>
            </span>

            <button 
              className="prestige-ticker-cta"
              onClick={onCtaClick}
              aria-label={current.ctaText}
            >
              <span>{current.ctaText}</span>
              <ChevronRight size={13} />
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Step dots */}
        <div className="prestige-ticker-dots">
          {PROMO_MESSAGES.map((_, i) => (
            <button
              key={i}
              className={`ticker-dot ${i === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Message ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
