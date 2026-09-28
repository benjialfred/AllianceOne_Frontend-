import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PublicHeader } from '../landing/components/PublicHeader';
import { PublicFooter } from '../landing/components/PublicFooter';
import './GenericPublicPage.css';

interface GenericPublicPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const GenericPublicPage: React.FC<GenericPublicPageProps> = ({ title, subtitle, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="generic-public-page">
      <PublicHeader />
      
      <main className="generic-public-main">
        {/* Simple elegant hero for public pages */}
        <section className="generic-public-hero">
          <div className="eco-inner">
            <motion.div 
              className="generic-hero-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-display font-bold text-5xl text-graphite mb-4 tracking-tight">{title}</h1>
              {subtitle && <p className="font-sans text-xl text-gray-500 max-w-2xl">{subtitle}</p>}
            </motion.div>
          </div>
        </section>

        {/* Content Area */}
        <section className="generic-public-content">
          <div className="eco-inner">
            <motion.div 
              className="generic-content-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};
