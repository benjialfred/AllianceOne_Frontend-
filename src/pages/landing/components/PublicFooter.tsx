import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AllianceLogo } from '../../../design-system/components/AllianceLogo';
import './PublicFooter.css';

export const PublicFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
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
            <a onClick={() => navigate('/privacy-policy')}>Confidentialité</a>
            <a onClick={() => navigate('/terms')}>Conditions d'utilisation</a>
            <a onClick={() => navigate('/legal')}>Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
