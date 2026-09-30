import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../core/stores/cartStore';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { isOpen, setIsOpen, items, removeItem, getTotal } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[101] shadow-2xl flex flex-col font-sans text-white"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-white" />
                <h2 className="text-xl font-bold">Votre Panier</h2>
                <span className="bg-white/10 text-white text-xs py-1 px-2 rounded-full font-bold">
                  {items.length}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
                  <ShoppingBag size={64} className="opacity-20" />
                  <p className="text-lg">Votre panier est vide.</p>
                  <button 
                    onClick={() => { setIsOpen(false); navigate('/modules'); }}
                    className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                  >
                    Explorer les modules
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-3 group transition-all hover:bg-white/[0.04]">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-lg tracking-tight">{item.name}</h4>
                        <p className="text-sm text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-500 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-all shrink-0 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-4 border-t border-white/[0.05]">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        {item.isSubscription ? 'Abonnement / mois' : 'Paiement unique'}
                      </span>
                      <span className="font-bold text-lg">{item.price === 0 ? 'Gratuit' : `${item.price} €`}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 md:p-8 border-t border-white/[0.05] bg-black/80 backdrop-blur-3xl">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Total estimé</span>
                  <span className="text-3xl font-extrabold tracking-tight">{getTotal()} € <span className="text-sm text-zinc-500 font-medium">/mois</span></span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-5 bg-white text-black font-bold rounded-2xl flex justify-center items-center gap-2 hover:bg-zinc-200 active:scale-[0.98] transition-all group"
                >
                  Commander <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
