import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Moon, Sun, Monitor, Globe, Bell, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../core/stores/authStore';
import { PublicHeader } from '../landing/components/PublicHeader';
import { FounderAndFooter } from '../landing/components/FounderAndFooter';
import { SEO } from '../../core/components/SEO';
import './PublicSettingsPage.css';

export const PublicSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  // Local state for public settings
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    // If the user is authenticated, redirect to the dashboard settings
    if (isAuthenticated) {
      navigate('/hub/settings'); // Assuming this is the dashboard settings route
    }
  }, [isAuthenticated, navigate]);

  // Apply theme dynamically to document body
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      // System logic can go here (simplified for demo)
      document.body.classList.remove('light-theme', 'dark-theme');
    }
  }, [theme]);

  // If authenticated, we are redirecting so return null briefly to avoid flash
  if (isAuthenticated) return null;

  return (
    <div className="public-settings-page min-h-screen bg-[#000000] text-white font-sans selection:bg-white/20">
      <SEO 
        title="Paramètres Globaux" 
        description="Gérez les paramètres d'apparence et de navigation publique sur Alliance One." 
      />
      <PublicHeader />
      
      <main className="pt-40 pb-32 relative">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Settings size={20} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Paramètres</h1>
            </div>
            <p className="text-zinc-400 text-lg">Personnalisez votre expérience de navigation publique. Connectez-vous pour accéder aux paramètres avancés de votre espace de travail.</p>
          </motion.div>

          <div className="space-y-8">
            
            {/* THEME SETTINGS */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="settings-section"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Moon size={18} className="text-zinc-400" /> Apparence</h2>
              
              <div className="settings-card">
                <div className="setting-row">
                  <div className="setting-info">
                    <h3>Thème de l'interface</h3>
                    <p>Choisissez le thème d'affichage de la plateforme.</p>
                  </div>
                  <div className="theme-toggles">
                    <button 
                      className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                      onClick={() => setTheme('dark')}
                    >
                      <Moon size={16} /> Sombre
                    </button>
                    <button 
                      className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                      onClick={() => setTheme('light')}
                    >
                      <Sun size={16} /> Clair
                    </button>
                    <button 
                      className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
                      onClick={() => setTheme('system')}
                    >
                      <Monitor size={16} /> Système
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* LANGUAGE SETTINGS */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="settings-section"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Globe size={18} className="text-zinc-400" /> Langue & Région</h2>
              
              <div className="settings-card">
                <div className="setting-row">
                  <div className="setting-info">
                    <h3>Langue d'affichage</h3>
                    <p>La langue préférée pour le contenu public.</p>
                  </div>
                  <div>
                    <select 
                      className="settings-select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="fr">Français (FR)</option>
                      <option value="en">English (US)</option>
                      <option value="es">Español (ES)</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* NOTIFICATIONS SETTINGS */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="settings-section"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Bell size={18} className="text-zinc-400" /> Préférences de Cookies</h2>
              
              <div className="settings-card">
                <div className="setting-row cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => alert('Ouverture du gestionnaire de cookies...')}>
                  <div className="setting-info">
                    <h3>Gérer les Cookies</h3>
                    <p>Contrôlez les cookies fonctionnels et analytiques utilisés sur le site public.</p>
                  </div>
                  <ChevronRight size={20} className="text-zinc-500" />
                </div>
              </div>
            </motion.section>
            
          </div>
          
          <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">Paramètres du Compte</h3>
              <p className="text-sm text-zinc-400">Vous devez être connecté pour gérer votre profil, votre facturation ou vos API.</p>
            </div>
            <button className="ao-dark-btn-primary whitespace-nowrap" onClick={() => navigate('/login')}>
              Se connecter
            </button>
          </div>

        </div>
      </main>
      
      <FounderAndFooter />
    </div>
  );
};
