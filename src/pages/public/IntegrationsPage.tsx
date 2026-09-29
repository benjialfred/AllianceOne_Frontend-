import React from 'react';
import { motion } from 'framer-motion';
import { Link2, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { PublicHeader } from '../landing/components/PublicHeader';
import { PublicFooter } from '../landing/components/PublicFooter';
import { PublicAICopilot } from '../landing/components/PublicAICopilot';
import './ResourcesPages.css';

export const IntegrationsPage: React.FC = () => {
  const integrations = [
    { title: "Microsoft 365", desc: "Synchronisation native des calendriers, emails et documents SharePoint/OneDrive." },
    { title: "Google Workspace", desc: "Intégration fluide avec Google Drive, Docs, Meet et Google Calendar." },
    { title: "AWS & Google Cloud", desc: "Connectez vos buckets S3 ou GCS directement au module de gestion documentaire." },
    { title: "Okta & Auth0", desc: "Sécurisez les accès à votre instance avec le SSO et le provisionnement SCIM." }
  ];

  return (
    <div className="public-page-wrapper">
      <PublicHeader />
      <main className="resource-page-main">
        <section className="resource-hero">
          <div className="resource-hero-bg"></div>
          <motion.div className="resource-hero-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="resource-hero-badge">CONNECTIVITÉ NATIVE</span>
            <h1>Intégrations</h1>
            <p>Alliance One ne vit pas en silo. Connectez vos outils existants pour créer un flux de données ininterrompu à travers toute votre organisation.</p>
          </motion.div>
        </section>

        <section className="resource-grid-section">
          <div className="resource-grid">
            {integrations.map((item, i) => (
              <motion.div key={i} className="resource-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * i }}>
                <div className="resource-card-icon"><Link2 size={24} /></div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="resource-card-link">
                  Voir la documentation d'intégration <ArrowRight size={16} />
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
