import React from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, Book, Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { PublicHeader } from '../landing/components/PublicHeader';
import { PublicFooter } from '../landing/components/PublicFooter';
import { PublicAICopilot } from '../landing/components/PublicAICopilot';
import './ResourcesPages.css';

export const HelpCenterPage: React.FC = () => {
  const supportOptions = [
    { title: "Base de Connaissance", desc: "Trouvez des réponses rapides dans nos articles et guides.", icon: <Book size={24} /> },
    { title: "Chat en Direct", desc: "Discutez avec notre équipe de support technique (disponible 24/7 pour Enterprise).", icon: <MessageCircle size={24} /> },
    { title: "Tickets de Support", desc: "Ouvrez un ticket pour un problème complexe nécessitant une investigation.", icon: <LifeBuoy size={24} /> },
    { title: "Contact Commercial", desc: "Pour les questions liées à la facturation ou aux upgrades de forfaits.", icon: <Mail size={24} /> }
  ];

  return (
    <div className="public-page-wrapper">
      <PublicHeader />
      <main className="resource-page-main">
        <section className="resource-hero">
          <div className="resource-hero-bg"></div>
          <motion.div className="resource-hero-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="resource-hero-badge">SUPPORT PREMIUM</span>
            <h1>Help Center</h1>
            <p>Notre équipe d'ingénieurs est dédiée à votre réussite. Découvrez comment nous pouvons vous aider à tirer le meilleur d'Alliance One.</p>
          </motion.div>
        </section>

        <section className="resource-grid-section">
          <div className="resource-grid">
            {supportOptions.map((opt, i) => (
              <motion.div key={i} className="resource-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * i }}>
                <div className="resource-card-icon">{opt.icon}</div>
                <h3>{opt.title}</h3>
                <p>{opt.desc}</p>
                <div className="resource-card-link">
                  Accéder <ArrowRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <PublicAICopilot />
      <PublicFooter />
    </div>
  );
};
