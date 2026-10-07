import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Mail, MessageSquare } from 'lucide-react';
import { PublicHeader } from '../landing/components/PublicHeader';
import { FounderAndFooter } from '../landing/components/FounderAndFooter';
import { SEO } from '../../core/components/SEO';
import './ContactPage.css';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    type: 'general',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ email: '', type: 'general', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="contact-page min-h-screen bg-[#000000] text-white font-sans selection:bg-white/20">
      <SEO 
        title="Contactez-nous" 
        description="Une question ou un projet sur-mesure ? L'équipe d'experts Alliance One est prête à vous accompagner." 
      />
      <PublicHeader />
      
      <main style={{ paddingTop: '160px', paddingBottom: '80px' }} className="relative overflow-hidden flex flex-col items-center min-h-screen">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none flex justify-center">
          <div className="contact-ambient-glow"></div>
        </div>

        <div className="max-w-2xl w-full mx-auto px-6 relative z-10 flex-grow">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
              Contactez-nous.
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Une question ? Un projet sur-mesure ? Notre équipe d'experts est prête à vous accompagner.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="contact-form-container relative"
          >
            <div className="contact-form-wrapper relative z-10 p-8 md:p-12">
            
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center py-20 px-8 text-center"
                >
                  <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight mb-4">Message envoyé</h3>
                  <p className="text-zinc-400 mb-10 text-lg">Nous avons bien reçu votre demande. Un expert vous contactera très prochainement.</p>
                  <button onClick={() => setStatus('idle')} className="ao-dark-btn-text">
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="flex flex-col gap-8"
                >
                  
                  {status === 'error' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-start gap-3">
                      <AlertCircle size={20} className="shrink-0 mt-0.5" />
                      <p className="text-sm">Une erreur est survenue lors de l'envoi. Veuillez réessayer.</p>
                    </motion.div>
                  )}

                  <div className="space-y-6">
                    <div className="form-group group">
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={20} />
                        <input 
                          type="email" 
                          id="email" 
                          required 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="contact-input-premium pl-14" 
                          placeholder="Votre adresse email"
                        />
                      </div>
                    </div>

                    <div className="form-group group">
                      <div className="relative">
                        <MessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={20} />
                        <select 
                          id="type" 
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                          className="contact-input-premium contact-select-premium pl-14"
                        >
                          <option value="general">Question générale</option>
                          <option value="sales">Déploiement & Ventes</option>
                          <option value="support">Support technique</option>
                          <option value="partnership">Partenariat</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <textarea 
                        id="message" 
                        required 
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="contact-input-premium resize-none" 
                        placeholder="Comment pouvons-nous vous aider ?"
                      ></textarea>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === 'loading' || !formData.email || !formData.message}
                    className="contact-btn-premium mt-4"
                  >
                    {status === 'loading' ? (
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Envoi en cours...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">Envoyer le message <Send size={18} /></div>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>
      
      <footer className="w-full py-8 border-t border-white/5 text-center text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} Alliance One. Tous droits réservés.</p>
      </footer>
    </div>
  );
};
