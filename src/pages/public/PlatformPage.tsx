import React from 'react';
import { motion } from 'framer-motion';
import { Server, Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { PublicHeader } from '../landing/components/PublicHeader';
import { PublicFooter } from '../landing/components/PublicFooter';
import { PublicAICopilot } from '../landing/components/PublicAICopilot';
import './ResourcesPages.css';

export const PlatformPage: React.FC = () => {
  const features = [
    { title: "Architecture Distribuée", desc: "Des micro-services scalables assurant une haute disponibilité (99.99%).", icon: <Server size={24} /> },
    { title: "Sécurité Zero-Trust", desc: "Chiffrement de bout-en-bout, authentification multifacteur et audits continus.", icon: <Shield size={24} /> },
    { title: "Temps Réel", desc: "Synchronisation instantanée des données à travers tous les modules métier.", icon: <Zap size={24} /> },
    { title: "Déploiement Global", desc: "Hébergement multirégion pour une latence minimale où que vous soyez.", icon: <Globe size={24} /> }
  ];

  return (
    <div className="public-page-wrapper">
      <PublicHeader />
      <main className="resource-page-main">
        <section className="resource-hero">
          <div className="resource-hero-bg"></div>
          <motion.div className="resource-hero-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="resource-hero-badge">INFRASTRUCTURE CORE</span>
            <h1>La Plateforme Alliance One</h1>
            <p>Le système nerveux central de votre organisation. Une architecture robuste, sécurisée et évolutive conçue pour les opérations critiques.</p>
          </motion.div>
        </section>

        <section className="resource-grid-section">
          <div className="resource-grid">
            {features.map((feature, i) => (
              <motion.div key={i} className="resource-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * i }}>
                <div className="resource-card-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
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
