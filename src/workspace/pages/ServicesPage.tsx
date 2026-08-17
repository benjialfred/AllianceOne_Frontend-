/**
 * ALLIANCE ONE — SERVICES & ALLIANCE STUDIO PORTFOLIO
 * Vitrine de développement professionnel, études de cas et demande de prestation.
 */
import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  Cpu, 
  Palette, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Send, 
  Sparkles,
  ExternalLink,
  Code2,
  Server
} from 'lucide-react';
import './EcosystemPages.css';

export const ServicesPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'Benjamin Adzessa',
    email: 'benjaminadzessa@gmail.com',
    company: 'Collège & Lycée Bilingue Émergence',
    service: 'custom-web',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const caseStudies = [
    {
      title: 'Alliance One — Business Operating System',
      category: 'Système ERP Multi-Tenant',
      tech: ['React 19', 'TypeScript', 'Django REST', 'PostgreSQL', 'Docker'],
      desc: 'Architecture modulaire unifiée avec EventBus, contrôle d’accès ABAC et synchronisation temps réel pour les institutions scolaires et entreprises.',
      highlight: 'Temps de réponse < 40ms'
    },
    {
      title: 'Plateforme E-commerce & Logistique WMS',
      category: 'Supply Chain & Multi-Dépôts',
      tech: ['Next.js', 'FastAPI', 'Redis', 'TailwindCSS'],
      desc: 'Gestion des approvisionnements, valorisation PMP, alertes de réassort automatique et intégration des passerelles de paiement Mobile Money.',
      highlight: '+350k transactions traitées'
    },
    {
      title: 'Copilote IA & Analyse Documentaire OCR',
      category: 'Intelligence Artificielle',
      tech: ['Python', 'LangChain', 'OpenAI / Gemini', 'ChromaDB'],
      desc: 'Extraction instantanée des données comptables depuis des factures scannées et classification prédictive des écritures de trésorerie.',
      highlight: '99.2% de précision'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="ecosystem-page-root">
      {/* Header Banner */}
      <div className="ecosystem-header-banner">
        <div className="ecosystem-badge">
          <Building2 size={14} />
          <span>ALLIANCE STUDIO</span>
        </div>
        <h1 className="ecosystem-title">Ingénierie Logicielle & Solutions sur Mesure</h1>
        <p className="ecosystem-subtitle">
          Nous concevons et déployons des applications d'entreprise d'exception, alliant haute performance, design cinématique et robustesse technique.
        </p>
      </div>

      <div className="services-body-container">
        {/* Case Studies Grid */}
        <section className="services-section">
          <div className="section-title-row">
            <h2 className="section-title">Études de Cas & Réalisations</h2>
            <span className="section-count">{caseStudies.length} Projets Phares</span>
          </div>

          <div className="case-studies-grid">
            {caseStudies.map((study, idx) => (
              <div key={idx} className="case-study-card">
                <div className="study-category-badge">{study.category}</div>
                <h3 className="study-title">{study.title}</h3>
                <p className="study-desc">{study.desc}</p>

                <div className="study-tech-pills">
                  {study.tech.map((t) => (
                    <span key={t} className="tech-pill">{t}</span>
                  ))}
                </div>

                <div className="study-footer">
                  <span className="study-highlight">
                    <CheckCircle2 size={13} color="#10b981" /> {study.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact / Quote Form */}
        <section className="services-section" style={{ marginTop: '2rem' }}>
          <div className="quote-contact-card">
            <div className="quote-left-info">
              <div className="ecosystem-badge" style={{ marginBottom: '8px' }}>
                <Sparkles size={13} color="#d97706" />
                <span>COLLABORATION</span>
              </div>
              <h2 className="quote-title">Vous avez un projet d'envergure ?</h2>
              <p className="quote-desc">
                Discutez directement avec nos architectes logiciels pour élaborer votre solution sur mesure.
              </p>

              <div className="quote-bullets">
                <div className="quote-bullet-item">
                  <CheckCircle2 size={15} color="#10b981" />
                  <span>Audit d'architecture et cadrage technique sous 48h</span>
                </div>
                <div className="quote-bullet-item">
                  <CheckCircle2 size={15} color="#10b981" />
                  <span>Déploiement certifié Cloud (Render, Vercel, AWS)</span>
                </div>
                <div className="quote-bullet-item">
                  <CheckCircle2 size={15} color="#10b981" />
                  <span>Support et maintenance continue garantis</span>
                </div>
              </div>
            </div>

            <div className="quote-right-form">
              {submitted ? (
                <div className="form-success-state">
                  <CheckCircle2 size={36} color="#10b981" />
                  <h3>Message transmis avec succès !</h3>
                  <p>Notre équipe technique vous recontactera sous 24 heures ouvrées.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label>Nom complet</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Email professionnel</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Type de projet</label>
                    <select 
                      value={formData.service} 
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    >
                      <option value="custom-web">Application Web d'Entreprise</option>
                      <option value="mobile">Application Mobile iOS / Android</option>
                      <option value="ai">Intelligence Artificielle & OCR</option>
                      <option value="erp-migration">Migration & Extension ERP Alliance</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description des besoins</label>
                    <textarea 
                      rows={3} 
                      placeholder="Décrivez brièvement les objectifs de votre organisation..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="form-submit-btn">
                    <Send size={14} />
                    <span>Transmettre la demande de projet</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
