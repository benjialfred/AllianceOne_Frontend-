import React from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Star, Download, ArrowRight } from 'lucide-react';
import { PublicHeader } from '../landing/components/PublicHeader';
import { PublicFooter } from '../landing/components/PublicFooter';
import { PublicAICopilot } from '../landing/components/PublicAICopilot';
import './ResourcesPages.css';

export const MarketplacePage: React.FC = () => {
  const apps = [
    { name: "Salesforce Connector", author: "Alliance Core", downloads: "12k", rating: 4.9 },
    { name: "Advanced Analytics Dashboards", author: "DataVision Inc.", downloads: "8.5k", rating: 4.7 },
    { name: "Stripe Billing Sync", author: "FinTech Solutions", downloads: "21k", rating: 4.8 },
    { name: "HR ATS Integration (Workday)", author: "Alliance Core", downloads: "5k", rating: 4.9 },
    { name: "Slack Notifications Hub", author: "Community", downloads: "45k", rating: 4.5 },
    { name: "Custom PDF Generator", author: "DocuTools", downloads: "18k", rating: 4.6 }
  ];

  return (
    <div className="public-page-wrapper">
      <PublicHeader />
      <main className="resource-page-main">
        <section className="resource-hero">
          <div className="resource-hero-bg"></div>
          <motion.div className="resource-hero-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="resource-hero-badge">ECOSYSTEM</span>
            <h1>Marketplace</h1>
            <p>Étendez les capacités d'Alliance One avec des centaines d'applications, plugins et intégrations créés par notre communauté et nos partenaires certifiés.</p>
          </motion.div>
        </section>

        <section className="resource-grid-section">
          <div className="resource-grid">
            {apps.map((app, i) => (
              <motion.div key={i} className="resource-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * i }}>
                <div className="resource-card-icon"><Package size={24} /></div>
                <h3>{app.name}</h3>
                <p>Développé par <strong>{app.author}</strong></p>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', color: 'var(--ao-text-tertiary)', fontSize: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Download size={14}/> {app.downloads}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} color="#F59E0B" /> {app.rating}</span>
                </div>
                <div className="resource-card-link">
                  Installer l'application <ArrowRight size={16} />
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
