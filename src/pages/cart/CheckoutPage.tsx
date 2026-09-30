import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, ArrowRight, Package, CreditCard, Loader2 } from 'lucide-react';
import { useCartStore } from '../../core/stores/cartStore';
import { useNavigate } from 'react-router-dom';
import { PublicHeader } from '../landing/components/PublicHeader';
import { SEO } from '../../core/components/SEO';

export const CheckoutPage: React.FC = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleProcessPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#000] text-white font-sans flex flex-col items-center justify-center p-6 selection:bg-white/20">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, filter: 'blur(10px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg w-full bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl rounded-[2rem] p-12 text-center flex flex-col items-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200%] bg-gradient-to-b from-green-500/10 to-transparent rounded-full blur-3xl -z-10 opacity-50"></div>
          
          <div className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,255,255,0.4)]">
            <CheckCircle2 size={48} strokeWidth={1.5} />
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Commande Validée</h1>
          <p className="text-zinc-400 mb-10 text-lg leading-relaxed">
            Vos modules ont été ajoutés à votre espace de travail avec succès. L'infrastructure est en cours de configuration.
          </p>
          
          <button 
            onClick={() => navigate('/app')}
            className="w-full py-5 bg-white text-black font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all hover:bg-zinc-200 active:scale-[0.98]"
          >
            Accéder au Dashboard <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000] text-white font-sans selection:bg-white/20">
      <SEO 
        title="Paiement Sécurisé" 
        description="Finalisez votre commande sur Alliance One en toute sécurité." 
      />
      <PublicHeader />
      
      <main className="pt-40 pb-32 max-w-7xl mx-auto px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50"
        >
          Finaliser la commande
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            {/* Account Section */}
            <section className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl rounded-3xl p-8 md:p-10">
              <h2 className="text-2xl font-bold mb-8 tracking-tight">1. Informations de l'entreprise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Prénom</label>
                  <input type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white focus:bg-white/[0.06] focus:border-white/30 outline-none transition-all" placeholder="John" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Nom</label>
                  <input type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white focus:bg-white/[0.06] focus:border-white/30 outline-none transition-all" placeholder="Doe" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Email professionnel</label>
                  <input type="email" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white focus:bg-white/[0.06] focus:border-white/30 outline-none transition-all" placeholder="john@entreprise.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Nom de l'Espace de travail (Workspace)</label>
                  <input type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white focus:bg-white/[0.06] focus:border-white/30 outline-none transition-all" placeholder="Entreprise Corp" />
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl rounded-3xl p-8 md:p-10 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-2xl font-bold tracking-tight">2. Paiement Sécurisé</h2>
                <ShieldCheck className="text-white" size={24} />
              </div>
              <div className="bg-black/50 border border-white/10 rounded-2xl p-8 text-zinc-400 flex flex-col items-center justify-center min-h-[200px]">
                <CreditCard size={48} className="text-white/20 mb-4" />
                <p className="text-sm uppercase tracking-widest">Intégration Stripe (Simulation)</p>
              </div>
            </section>
          </motion.div>

          {/* Right Column: Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl rounded-3xl p-8 sticky top-32">
              <h2 className="text-2xl font-bold mb-8 tracking-tight">Résumé de la commande</h2>
              
              <div className="flex flex-col gap-6 mb-10">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center text-center p-6 text-zinc-500 border border-dashed border-white/10 rounded-2xl">
                    <Package size={32} className="mb-2 opacity-50" />
                    <p>Aucun module dans le panier.</p>
                  </div>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg text-white/90">{item.name}</p>
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-1">{item.isSubscription ? 'Abonnement mensuel' : 'Paiement unique'}</p>
                      </div>
                      <p className="font-bold text-lg">{item.price === 0 ? 'Gratuit' : `${item.price} €`}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-white/10 pt-8 mb-8 space-y-4">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Sous-total</span>
                  <span className="text-white">{getTotal()} €</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>TVA (20%)</span>
                  <span className="text-white">{(getTotal() * 0.2).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-extrabold pt-4 border-t border-white/5 mt-4">
                  <span>Total TTC</span>
                  <span>{(getTotal() * 1.2).toFixed(2)} € <span className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">/mois</span></span>
                </div>
              </div>

              <button 
                onClick={handleProcessPayment}
                disabled={items.length === 0 || isProcessing}
                className="w-full py-5 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    Confirmer & Payer 
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <p className="text-xs text-zinc-500 text-center mt-6 flex items-center justify-center gap-2 uppercase tracking-widest font-semibold">
                <ShieldCheck size={14} /> Paiement 256-bit sécurisé
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
