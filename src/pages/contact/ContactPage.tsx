import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Mail, MessageSquare, Phone, MapPin, User, Briefcase, ArrowRight } from 'lucide-react';
import { PublicHeader } from '../landing/components/PublicHeader';
import { FounderAndFooter } from '../landing/components/FounderAndFooter';
import { SEO } from '../../core/components/SEO';
import './ContactPage.css';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    type: 'general',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // Connect to the new Django backend route
      const res = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', company: '', type: 'general', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="contact-page min-h-screen bg-[#000000] text-white font-sans selection:bg-white/20">
      <SEO 
        title="Contactez-nous | Alliance One" 
        description="Une question ou un projet sur-mesure ? L'équipe d'experts Alliance One est prête à vous accompagner." 
      />
      <PublicHeader />
      
      <main className="relative flex flex-col items-center justify-center min-h-screen pt-32 pb-20">
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="contact-ambient-glow" style={{ top: '-10%', left: '30%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 60%)' }}></div>
          <div className="contact-ambient-glow" style={{ bottom: '-10%', right: '20%', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 60%)' }}></div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl w-full mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8"
        >
          
          {/* LEFT SIDE: Contact Info */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-400 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Disponibles pour vous
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                Discutons de <br/>votre projet.
              </h1>
              <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                Que ce soit pour une intégration sur-mesure, une question technique ou une demande de partenariat, notre équipe d'ingénieurs et d'experts vous répondra dans les plus brefs délais.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="contact-bento-card">
                <div className="contact-icon-box"><Mail size={20} /></div>
                <h3>Email direct</h3>
                <p>contact@allianceone.io</p>
                <a href="mailto:contact@allianceone.io" className="contact-link">Écrire un mail <ArrowRight size={14} /></a>
              </div>
              
              <div className="contact-bento-card">
                <div className="contact-icon-box"><Phone size={20} /></div>
                <h3>Téléphone</h3>
                <p>+237 600 000 000</p>
                <a href="tel:+237600000000" className="contact-link">Appeler <ArrowRight size={14} /></a>
              </div>

              <div className="contact-bento-card sm:col-span-2">
                <div className="contact-icon-box"><MapPin size={20} /></div>
                <h3>Siège social</h3>
                <p>Alliance Hub, Centre-ville<br/>Douala, Cameroun</p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE: Contact Form */}
          <motion.div variants={itemVariants} className="lg:col-span-7">
            <div className="contact-form-wrapper relative z-10 p-8 md:p-10">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-tr from-green-500 to-emerald-400 text-white rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight mb-4">Message envoyé avec succès</h3>
                    <p className="text-zinc-400 mb-8 text-lg max-w-md">Nous avons bien reçu votre demande. Un expert prendra contact avec vous dans les prochaines 24h ouvrées.</p>
                    <button onClick={() => setStatus('idle')} className="contact-btn-premium" style={{ width: 'auto', padding: '12px 32px' }}>
                      Nouveau message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="flex flex-col gap-6"
                  >
                    <div className="mb-2">
                      <h2 className="text-2xl font-bold text-white mb-2">Envoyez-nous un message</h2>
                      <p className="text-zinc-400 text-sm">Remplissez le formulaire ci-dessous et nous vous recontacterons très vite.</p>
                    </div>
                    
                    {status === 'error' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-3">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <p className="text-sm">Une erreur est survenue lors de l'envoi. Veuillez réessayer ou utiliser l'adresse email directe.</p>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group group">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Nom complet *</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                          <input 
                            type="text" 
                            required 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="contact-input-premium pl-12" 
                            placeholder="Jean Dupont"
                          />
                        </div>
                      </div>

                      <div className="form-group group">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Email professionnel *</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                          <input 
                            type="email" 
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="contact-input-premium pl-12" 
                            placeholder="jean@entreprise.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group group">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Entreprise (Optionnel)</label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                          <input 
                            type="text" 
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            className="contact-input-premium pl-12" 
                            placeholder="Nom de l'entreprise"
                          />
                        </div>
                      </div>

                      <div className="form-group group">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Sujet *</label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                          <select 
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="contact-input-premium contact-select-premium pl-12"
                          >
                            <option value="general">Question générale</option>
                            <option value="sales">Déploiement & Ventes</option>
                            <option value="support">Support technique</option>
                            <option value="partnership">Partenariat</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="form-group group">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Votre Message *</label>
                      <textarea 
                        required 
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="contact-input-premium resize-none" 
                        placeholder="Comment pouvons-nous vous aider ?"
                        style={{ paddingLeft: '16px' }}
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={status === 'loading' || !formData.email || !formData.message || !formData.name}
                      className="contact-btn-premium mt-2"
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
                    <p className="text-center text-xs text-zinc-600 mt-2">
                      Vos données sont protégées et ne seront jamais partagées à des tiers.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </main>
      
      <FounderAndFooter />
    </div>
  );
};
