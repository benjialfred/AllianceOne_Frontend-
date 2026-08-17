/**
 * ALLIANCE ONE — SMART ONBOARDING LAYER
 * Couche de découverte progressive et astuces intelligentes du Business OS.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  X, 
  ChevronRight, 
  ArrowRight, 
  Lightbulb, 
  Command,
  Zap,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep {
  id: string;
  label: string;
  desc: string;
  isCompleted: boolean;
  actionPath?: string;
  actionLabel?: string;
}

export const SmartOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'step-1',
      label: 'Organisation & Établissement configurés',
      desc: 'Nom de l’école, logo 3D officiel et année académique active',
      isCompleted: true
    },
    {
      id: 'step-2',
      label: '5 Modules natifs initialisés',
      desc: 'Éducation Pro, Stocks & Logistique, Finances, Bibliothèque, Tâches',
      isCompleted: true
    },
    {
      id: 'step-3',
      label: 'Explorer la recherche universelle ⌘K',
      desc: 'Naviguez instantanément et trouvez n’importe quel élève ou facture',
      isCompleted: false,
      actionLabel: 'Essayer ⌘K',
      actionPath: '/'
    },
    {
      id: 'step-4',
      label: 'Consulter l’Universal Activity Stream',
      desc: 'Découvrez la timeline temps réel de vos opérations',
      isCompleted: false,
      actionLabel: 'Voir l’activité',
      actionPath: '/'
    },
    {
      id: 'step-5',
      label: 'Configurer une clé API Développeur',
      desc: 'Connectez vos scripts ou explorez la documentation REST',
      isCompleted: false,
      actionLabel: 'Ouvrir Developer Hub',
      actionPath: '/developers'
    }
  ]);

  const tips = [
    {
      icon: Command,
      tag: 'ASTUCE PRODUCTIVITÉ',
      title: 'Recherche Universelle Instantanée',
      content: 'Appuyez sur ⌘K (ou Ctrl+K) à tout moment pour chercher un élève, une classe, un article ou déclencher une action rapide.'
    },
    {
      icon: Zap,
      tag: 'AUTOMATISATION',
      title: 'Flux d’Approvisionnement Automatique',
      content: 'Le module Stock calcule automatiquement le seuil critique selon votre vitesse de rotation et génère les brouillons de commande.'
    },
    {
      icon: BookOpen,
      tag: 'ÉDUCATION CONFORME',
      title: 'Génération de Bulletins en 1 Clic',
      content: 'Les bulletins PDF intègrent le logo officiel de votre établissement, le récapitulatif par groupe et les signatures pré-calibrées.'
    }
  ];

  const completedCount = steps.filter((s) => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  if (isDismissed) return null;

  return (
    <section className="hub-onboarding-section">
      <div className="hub-onboarding-grid">
        {/* Onboarding Checklist Card */}
        <div className="onboarding-card checklist-card">
          <div className="onboarding-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="onboarding-icon-box">
                <Sparkles size={16} color="#d97706" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Bienvenue dans Alliance One 👋</h3>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Prise en main progressive du Business OS ({completedCount}/{steps.length} validés)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="onboarding-progress-badge">{progressPercent}%</span>
              <button 
                className="onboarding-dismiss-btn"
                onClick={() => setIsDismissed(true)}
                title="Masquer le panneau d'accueil"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="onboarding-progress-track">
            <div 
              className="onboarding-progress-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Steps List */}
          <div className="onboarding-steps-list">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`onboarding-step-row ${step.isCompleted ? 'completed' : ''}`}
              >
                <div className="step-check-icon">
                  {step.isCompleted ? (
                    <CheckCircle2 size={16} color="#059669" />
                  ) : (
                    <Circle size={16} color="var(--color-text-muted)" />
                  )}
                </div>

                <div className="step-content">
                  <div className="step-label">{step.label}</div>
                  <div className="step-desc">{step.desc}</div>
                </div>

                {step.actionLabel && (
                  <button 
                    className="step-action-btn"
                    onClick={() => step.actionPath && navigate(step.actionPath)}
                  >
                    <span>{step.actionLabel}</span>
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Tip Card */}
        <div className="onboarding-card tip-card">
          <div className="tip-header">
            <div className="tip-tag-pill">
              <Lightbulb size={12} color="#d97706" />
              <span>{tips[currentTipIndex].tag}</span>
            </div>
            <div className="tip-nav-dots">
              {tips.map((_, i) => (
                <button
                  key={i}
                  className={`tip-dot ${i === currentTipIndex ? 'active' : ''}`}
                  onClick={() => setCurrentTipIndex(i)}
                />
              ))}
            </div>
          </div>

          <div className="tip-body">
            <h4 className="tip-title">{tips[currentTipIndex].title}</h4>
            <p className="tip-content">{tips[currentTipIndex].content}</p>
          </div>

          <div className="tip-footer">
            <button 
              className="tip-next-btn"
              onClick={() => setCurrentTipIndex((prev) => (prev + 1) % tips.length)}
            >
              <span>Astuce suivante</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
