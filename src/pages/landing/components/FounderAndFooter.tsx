import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';
import { AllianceLogo } from '../../../design-system/components/AllianceLogo';
import './FounderAndFooter.css';

export const FounderAndFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="founder-footer-wrapper">
      
      {/* 01. FOUNDER & VISION */}
      <section className="ff-founder-section">
        {/* Background ambient light */}
        <div className="ff-ambient-light">
          <div className="ff-ambient-blob blue-blob"></div>
          <div className="ff-ambient-blob white-blob"></div>
        </div>

        <div className="eco-inner" style={{ position: 'relative', zIndex: 10 }}>
          <div className="founder-grid">
            
            {/* Visual Side with Large Enterprise Image */}
            <motion.div 
              className="founder-visual"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="founder-image-container">
                {/* Enterprise/Infrastructure Image */}
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" 
                  alt="Modern Enterprise Infrastructure" 
                  className="founder-enterprise-img"
                />
                <div className="founder-img-overlay"></div>
                <div className="founder-img-caption">
                  <div className="founder-logo-mini">
                    <AllianceLogo size={24} color="white" />
                  </div>
                  <h4 className="font-display founder-name">Adzessa Benjamin Fraide</h4>
                  <p className="micro-label founder-title">Founder & Software Engineer</p>
                </div>
              </div>
            </motion.div>

            {/* Content Side */}
            <motion.div 
              className="founder-content"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="vision-label-wrapper">
                <div className="vision-line"></div>
                <span className="micro-label text-champagne">LA VISION</span>
              </div>
              <Quote size={48} className="vision-quote-icon" />
              <h3 className="font-display vision-headline">
                "Nous ne construisons pas simplement un autre logiciel métier. Nous construisons le <span className="vision-highlight">système nerveux central</span> des organisations de demain."
              </h3>
              
              <div className="founder-bio">
                <p className="font-sans vision-desc">
                  Pensé, architecturé et développé depuis l'Afrique pour redéfinir les standards mondiaux de l'ingénierie logicielle d'entreprise.
                </p>
                <button 
                  className="founder-btn-link"
                  onClick={() => navigate('/founder')}
                >
                  Découvrir l'histoire complète
                  <ArrowRight size={18} className="founder-btn-arrow" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 02. FINAL CTA */}
      <section className="ff-cta-section">
        <div className="cta-grid-pattern"></div>
        <div className="eco-inner" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div 
            className="cta-block-new"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="cta-pulse-label">
              <div className="pulse-dot"></div>
              <span className="micro-label text-alliance-blue">LE NOUVEAU STANDARD</span>
            </div>
            
            <h2 className="font-display cta-headline">
              Prêt pour un nouveau <br/> standard ?
            </h2>
            <p className="font-sans cta-desc">
              Rejoignez les organisations qui opèrent déjà sur l'infrastructure Alliance One. Connectez vos équipes, sécurisez vos données, déployez l'intelligence.
            </p>
            <div className="cta-actions">
              <button className="cta-btn-main" onClick={() => navigate('/register')}>
                Déployer Alliance One <ArrowRight size={20} />
              </button>
              <button className="cta-btn-secondary" onClick={() => navigate('/pricing')}>
                Voir les Tarifs
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 03. INSTITUTIONAL FOOTER */}
      <footer className="ff-footer bg-ivory">
        <div className="eco-inner">
          <div className="footer-grid">
            
            <div className="footer-brand">
              <div className="footer-brand-logo mb-6">
                <AllianceLogo size={24} color="var(--ao-graphite)" />
                <span className="font-display font-bold text-lg text-graphite tracking-wide">ALLIANCE ONE</span>
              </div>
              <p className="text-sm text-gray-500 font-sans max-w-xs leading-relaxed mb-8">
                Operating Infrastructure for Modern Organizations. Built in Africa. Designed for the world.
              </p>
              <div className="footer-socials">
                <div className="social-icon">X</div>
                <div className="social-icon">IN</div>
                <div className="social-icon">GH</div>
              </div>
            </div>

            <div className="footer-links-group">
              <span className="micro-label text-graphite mb-6 block">PLATFORM</span>
              <a onClick={() => navigate('/platform')}>Architecture Core</a>
              <a onClick={() => navigate('/modules')}>Modules Métier</a>
              <a onClick={() => navigate('/ai')}>Alliance AI</a>
              <a onClick={() => navigate('/security')}>Sécurité & Trust</a>
              <a onClick={() => navigate('/pricing')}>Tarification</a>
            </div>

            <div className="footer-links-group">
              <span className="micro-label text-graphite mb-6 block">ECOSYSTEM</span>
              <a onClick={() => navigate('/network')}>Réseau Alliance</a>
              <a onClick={() => navigate('/marketplace')}>Marketplace</a>
              <a onClick={() => navigate('/developers')}>Developer Platform</a>
              <a onClick={() => navigate('/docs')}>Documentation</a>
            </div>

            <div className="footer-links-group">
              <span className="micro-label text-graphite mb-6 block">COMPANY</span>
              <a onClick={() => navigate('/about')}>À propos</a>
              <a onClick={() => navigate('/founder')}>Le Fondateur</a>
              <a onClick={() => navigate('/news')}>Actualités</a>
              <a onClick={() => navigate('/careers')}>Carrières</a>
              <a onClick={() => navigate('/contact')}>Contact</a>
            </div>

          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Alliance One. Tous droits réservés.</p>
            <div className="footer-legal">
              <a onClick={() => navigate('/privacy')}>Confidentialité</a>
              <a onClick={() => navigate('/terms')}>Conditions d'utilisation</a>
              <a onClick={() => navigate('/legal')}>Mentions légales</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
