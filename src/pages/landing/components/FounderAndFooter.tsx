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
        <div className="eco-inner">
          <div className="founder-grid">
            
            {/* Visual Side */}
            <motion.div 
              className="founder-visual"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="founder-portrait-placeholder">
                <AllianceLogo size={80} color="rgba(255,255,255,0.1)" />
                <div className="founder-portrait-overlay"></div>
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
              <span className="micro-label text-champagne mb-6 block">LA VISION</span>
              <Quote size={32} className="text-alliance-blue opacity-50 mb-6" />
              <h3 className="font-display text-3xl font-bold text-white mb-8 leading-tight">
                "Nous ne construisons pas simplement un autre logiciel métier. Nous construisons le système nerveux central des organisations de demain."
              </h3>
              
              <div className="founder-bio">
                <h4 className="font-display text-xl text-white font-bold m-0">Adzessa Benjamin Fraide</h4>
                <p className="micro-label text-gray-400 mt-2 mb-6">Founder & Software Engineer</p>
                <p className="font-sans text-gray-400 mb-8 max-w-md">
                  Pensé, architecturé et développé depuis l'Afrique pour redéfinir les standards mondiaux de l'ingénierie logicielle d'entreprise.
                </p>
                <button 
                  className="ao-btn-ghost text-white border border-gray-700 px-6 py-3 rounded-md hover:bg-white hover:text-graphite transition-all"
                  onClick={() => navigate('/founder')}
                >
                  Découvrir l'histoire complète
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 02. FINAL CTA */}
      <section className="ff-cta-section bg-ivory">
        <div className="eco-inner">
          <motion.div 
            className="cta-block bg-alliance-blue text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="cta-content">
              <h2 className="font-display text-5xl font-bold mb-4">Prêt pour un nouveau standard ?</h2>
              <p className="font-sans text-lg text-white opacity-90 mb-8 max-w-xl mx-auto">
                Rejoignez les organisations qui opèrent déjà sur l'infrastructure Alliance One. Connectez vos équipes, sécurisez vos données, déployez l'intelligence.
              </p>
              <div className="flex gap-4 justify-center">
                <button className="ao-btn-primary bg-white text-alliance-blue hover:bg-gray-100 px-8 py-4 font-bold text-lg rounded-lg shadow-lg" onClick={() => navigate('/register')}>
                  Déployer Alliance One
                </button>
                <button className="ao-btn-ghost text-white border border-white/30 px-8 py-4 font-bold text-lg rounded-lg hover:bg-white/10" onClick={() => navigate('/pricing')}>
                  Voir les Tarifs
                </button>
              </div>
            </div>
            {/* Architectural subtle pattern inside CTA */}
            <div className="cta-pattern"></div>
          </motion.div>
        </div>
      </section>

      {/* 03. INSTITUTIONAL FOOTER */}
      <footer className="ff-footer bg-ivory">
        <div className="eco-inner">
          <div className="footer-grid">
            
            <div className="footer-brand">
              <div className="flex items-center gap-3 mb-6">
                <AllianceLogo size={24} color="var(--ao-graphite)" />
                <span className="font-display font-bold text-lg text-graphite tracking-wide">ALLIANCE ONE</span>
              </div>
              <p className="text-sm text-gray-500 font-sans max-w-xs leading-relaxed mb-8">
                Operating Infrastructure for Modern Organizations. Built in Africa. Designed for the world.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
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
