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
      <section className="bg-graphite relative overflow-hidden py-32 border-t border-white/5">
        {/* Background ambient light */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-alliance-blue/10 blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full bg-white/5 blur-[100px]"></div>
        </div>

        <div className="eco-inner relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Visual Side with Large Enterprise Image */}
            <motion.div 
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl border border-white/10 group bg-deep-navy">
                {/* Enterprise/Infrastructure Image */}
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" 
                  alt="Modern Enterprise Infrastructure" 
                  className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/40 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="w-12 h-12 rounded-xl border border-white/20 flex items-center justify-center backdrop-blur-md bg-white/10 mb-6 shadow-lg">
                    <AllianceLogo size={24} color="white" />
                  </div>
                  <h4 className="font-display text-2xl lg:text-3xl text-white font-bold m-0 tracking-wide">Adzessa Benjamin Fraide</h4>
                  <p className="font-sans text-alliance-blue mt-2 font-medium tracking-wide uppercase text-xs">Founder & Software Engineer</p>
                </div>
              </div>
            </motion.div>

            {/* Content Side */}
            <motion.div 
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="h-[1px] w-12 bg-champagne"></div>
                <span className="font-sans text-champagne text-xs font-bold tracking-[0.2em] uppercase">LA VISION</span>
              </div>
              <Quote size={48} className="text-white/10 mb-8" />
              <h3 className="font-display text-4xl lg:text-5xl font-bold text-white mb-10 leading-tight">
                "Nous ne construisons pas simplement un autre logiciel métier. Nous construisons le <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">système nerveux central</span> des organisations de demain."
              </h3>
              
              <div className="pl-6 border-l-2 border-white/10">
                <p className="font-sans text-xl text-gray-400 mb-10 leading-relaxed max-w-lg">
                  Pensé, architecturé et développé depuis l'Afrique pour redéfinir les standards mondiaux de l'ingénierie logicielle d'entreprise.
                </p>
                <button 
                  className="group flex items-center gap-3 text-white font-sans font-medium text-lg pb-2 border-b border-white/30 hover:border-white transition-colors"
                  onClick={() => navigate('/founder')}
                >
                  Découvrir l'histoire complète
                  <ArrowRight size={18} className="transform transition-transform group-hover:translate-x-2 text-alliance-blue" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 02. FINAL CTA */}
      <section className="relative py-32 bg-white overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="eco-inner relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-alliance-blue/5 border border-alliance-blue/10 mb-8">
              <div className="w-2 h-2 rounded-full bg-alliance-blue animate-pulse"></div>
              <span className="font-sans text-alliance-blue text-xs font-bold tracking-[0.15em] uppercase">LE NOUVEAU STANDARD</span>
            </div>
            
            <h2 className="font-display text-5xl lg:text-7xl font-bold mb-8 text-graphite tracking-tight leading-tight">
              Prêt pour un nouveau <br/> standard ?
            </h2>
            <p className="font-sans text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Rejoignez les organisations qui opèrent déjà sur l'infrastructure Alliance One. Connectez vos équipes, sécurisez vos données, déployez l'intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="ao-btn-primary bg-graphite text-white hover:bg-black px-10 py-5 font-sans font-bold text-lg rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-xl transition-all w-full sm:w-auto flex items-center justify-center gap-2" onClick={() => navigate('/register')}>
                Déployer Alliance One <ArrowRight size={20} />
              </button>
              <button className="ao-btn-ghost text-graphite border border-gray-200 px-10 py-5 font-sans font-bold text-lg rounded-xl hover:bg-gray-50 transition-all w-full sm:w-auto" onClick={() => navigate('/pricing')}>
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
