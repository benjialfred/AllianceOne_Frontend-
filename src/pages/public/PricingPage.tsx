import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Info } from 'lucide-react';
import { PublicHeader } from '../landing/components/PublicHeader';
import { PublicFooter } from '../landing/components/PublicFooter';
import { PublicAICopilot } from '../landing/components/PublicAICopilot';
import './PricingPage.css';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const tiers = [
    {
      name: "Starter",
      description: "Pour les petites équipes et startups qui découvrent Alliance One.",
      priceMonthly: "49€",
      priceYearly: "39€",
      highlight: false,
      features: [
        "Jusqu'à 10 utilisateurs",
        "Modules de base inclus",
        "Stockage 50 Go",
        "Support par email",
        "SLA standard"
      ],
      notIncluded: [
        "Intelligence Artificielle Copilot",
        "SSO (SAML, OAuth)",
        "Support prioritaire 24/7",
        "Gouvernance avancée"
      ],
      cta: "Commencer gratuitement",
      ctaClass: "btn-outline"
    },
    {
      name: "Business",
      description: "La puissance d'Alliance One pour les PME en pleine croissance.",
      priceMonthly: "129€",
      priceYearly: "99€",
      highlight: true,
      badge: "Recommandé",
      features: [
        "Utilisateurs illimités",
        "Tous les modules métiers",
        "Stockage 500 Go",
        "Intelligence Artificielle Copilot",
        "Intégrations API (50k appels/mois)",
        "SSO (Google, Microsoft)",
        "Support chat & email"
      ],
      notIncluded: [
        "Hébergement dédié / On-premise",
        "Ingénieur de succès client dédié"
      ],
      cta: "Démarrer l'essai gratuit",
      ctaClass: "btn-primary"
    },
    {
      name: "Enterprise",
      description: "Le système nerveux complet, sécurisé et sur-mesure pour les grandes organisations.",
      priceMonthly: "Sur devis",
      priceYearly: "Sur devis",
      highlight: false,
      features: [
        "Utilisateurs illimités",
        "Stockage illimité",
        "IA Copilot (Modèles dédiés & Fine-tuning)",
        "SAML SSO & SCIM",
        "Déploiement VPC / On-premise",
        "Logs d'audit & conformité avancée",
        "Ingénieur de succès client dédié (CSM)",
        "SLA 99.99% garanti"
      ],
      notIncluded: [],
      cta: "Contacter les ventes",
      ctaClass: "btn-outline"
    }
  ];

  return (
    <div className="public-page-wrapper">
      <PublicHeader />

      <main className="pricing-main">
        <section className="pricing-hero">
          <div className="pricing-hero-bg"></div>
          <motion.div 
            className="pricing-hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Une tarification claire, adaptée à votre échelle.</h1>
            <p>Construisez le système nerveux central de votre organisation sans surprises. Commencez gratuitement, évoluez selon vos besoins.</p>
            
            <div className="billing-toggle">
              <span className={billingCycle === 'monthly' ? 'active' : ''}>Mensuel</span>
              <button 
                className="toggle-switch" 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              >
                <div className={`toggle-knob ${billingCycle === 'yearly' ? 'toggled' : ''}`} />
              </button>
              <span className={billingCycle === 'yearly' ? 'active' : ''}>
                Annuel <span className="discount-badge">Économisez 20%</span>
              </span>
            </div>
          </motion.div>
        </section>

        <section className="pricing-cards-section">
          <div className="pricing-cards-container">
            {tiers.map((tier, idx) => (
              <motion.div 
                key={tier.name}
                className={`pricing-card ${tier.highlight ? 'highlight' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * idx }}
              >
                {tier.badge && <div className="pricing-card-badge">{tier.badge}</div>}
                <div className="pricing-card-header">
                  <h3>{tier.name}</h3>
                  <p>{tier.description}</p>
                </div>
                <div className="pricing-card-price">
                  <span className="amount">
                    {billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly}
                  </span>
                  {tier.priceMonthly !== 'Sur devis' && (
                    <span className="period">/mois/utilisateur</span>
                  )}
                </div>
                <button className={`pricing-btn ${tier.ctaClass}`}>
                  {tier.cta}
                </button>
                <div className="pricing-card-features">
                  <span className="features-title">Inclus :</span>
                  <ul>
                    {tier.features.map(f => (
                      <li key={f}>
                        <Check className="feature-icon check" size={18} />
                        <span>{f}</span>
                      </li>
                    ))}
                    {tier.notIncluded.map(f => (
                      <li key={f} className="not-included">
                        <X className="feature-icon cross" size={18} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="pricing-faq">
          <div className="pricing-faq-container">
            <h2>Foire aux questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h4>Puis-je changer de forfait à tout moment ?</h4>
                <p>Oui, vous pouvez passer au forfait supérieur ou inférieur à tout moment. Les ajustements seront proratisés sur votre prochaine facture.</p>
              </div>
              <div className="faq-item">
                <h4>Qu'est-ce qu'un "utilisateur" ?</h4>
                <p>Un utilisateur est toute personne disposant d'un compte actif sur votre instance Alliance One (employé, partenaire, ou client invité).</p>
              </div>
              <div className="faq-item">
                <h4>L'intelligence artificielle utilise-t-elle nos données ?</h4>
                <p>Non. Les données de votre organisation ne sont jamais utilisées pour entraîner des modèles publics. Pour le forfait Enterprise, nous proposons le déploiement de modèles dédiés hermétiques.</p>
              </div>
              <div className="faq-item">
                <h4>Proposez-vous des tarifs pour les associations ou les écoles ?</h4>
                <p>Absolument. Contactez notre équipe commerciale pour découvrir nos offres spéciales dédiées aux ONG, écoles et startups en phase d'amorçage (Seed).</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicAICopilot />
      <PublicFooter />
    </div>
  );
};
