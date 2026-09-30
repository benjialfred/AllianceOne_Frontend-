import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, Zap, Gift, Calendar } from 'lucide-react';
import { useMarketingStore } from '../../core/stores/marketingStore';

export const MarketingModal: React.FC = () => {
  const { isOpen, options, closeModal } = useMarketingStore();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  if (!options) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        closeModal();
        setStatus('idle');
        setEmail('');
      }, 2000);
    }, 1500);
  };

  const getIcon = () => {
    switch (options.type) {
      case 'newsletter': return <Mail className="text-white" size={24} />;
      case 'offer': return <Gift className="text-purple-400" size={24} />;
      case 'feature': return <Zap className="text-amber-400" size={24} />;
      case 'event': return <Calendar className="text-blue-400" size={24} />;
      default: return null;
    }
  };

  const getGradient = () => {
    switch (options.type) {
      case 'newsletter': return 'from-white/10 to-transparent';
      case 'offer': return 'from-purple-500/10 to-transparent';
      case 'feature': return 'from-amber-500/10 to-transparent';
      case 'event': return 'from-blue-500/10 to-transparent';
      default: return 'from-white/10 to-transparent';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => options.isDismissible !== false && closeModal()}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#050505] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl z-10"
          >
            {/* Ambient Background */}
            <div className={`absolute inset-0 bg-gradient-to-b ${getGradient()} opacity-50 pointer-events-none`} />
            
            <div className="relative p-8 md:p-10 flex flex-col items-center text-center">
              {options.isDismissible !== false && (
                <button 
                  onClick={closeModal}
                  className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
                >
                  <X size={20} />
                </button>
              )}
              
              <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                {getIcon()}
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-white">
                {options.title}
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                {options.description}
              </p>

              {options.type === 'newsletter' ? (
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                  <div className="relative w-full">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input 
                      type="email" 
                      required
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full bg-white text-black font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Inscription...' : status === 'success' ? 'Merci !' : options.primaryActionText}
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => {
                    options.onPrimaryAction?.();
                    closeModal();
                  }}
                  className="w-full bg-white text-black font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-zinc-200 transition-colors group"
                >
                  {options.primaryActionText}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              
              <p className="text-xs text-zinc-600 mt-6 font-medium">
                Nous respectons votre vie privée. Aucun spam.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
