/**
 * ALLIANCE ONE — STUDIO & SERVICES SHOWCASE
 * Vitrine de développement professionnel, expertises technologiques et portfolio.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Cpu, 
  Palette, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const StudioServicesShowcase: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Globe,
      color: '#4f46e5',
      title: 'Applications Web & Mobile Haute Performance',
      desc: 'Développement d’architectures logicielles modernes, scalables et résilientes (React, TypeScript, Django, PostgreSQL).'
    },
    {
      icon: Cpu,
      color: '#d97706',
      title: 'Intelligence Artificielle & Automatisation',
      desc: 'Intégration de modèles prédictifs, chatbots intelligents, OCR de factures et automatisation de processus métiers.'
    },
    {
      icon: Palette,
      color: '#ec4899',
      title: 'UI/UX Design Systems d’Entreprise',
      desc: 'Conception de logiciels professionnels à l’esthétique soignée, intuitifs et conformes aux plus hauts standards.'
    }
  ];

  return (
    <section className="hub-section">
      <div className="hub-section-header">
        <div>
          <div className="hub-section-pretitle">ALLIANCE STUDIO & SERVICES</div>
          <h2 className="hub-section-title">Ingénierie & Solutions sur Mesure</h2>
        </div>
        <button className="hub-header-link" onClick={() => navigate('/app/services')}>
          <span>Voir tout le portfolio</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="services-showcase-grid">
        {services.map((srv, i) => {
          const Icon = srv.icon;
          return (
            <div key={i} className="service-feature-card" onClick={() => navigate('/app/services')}>
              <div 
                className="service-icon-box"
                style={{ backgroundColor: `${srv.color}15`, color: srv.color }}
              >
                <Icon size={22} />
              </div>
              <h3 className="service-card-title">{srv.title}</h3>
              <p className="service-card-desc">{srv.desc}</p>
              <div className="service-card-footer">
                <span>En savoir plus</span>
                <ArrowRight size={13} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
