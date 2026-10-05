import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../core/stores/cartStore';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css'; // Import the new CSS file

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
            className="ao-cart-drawer-backdrop"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="ao-cart-drawer-panel"
          >
            {/* Header */}
            <div className="ao-cart-header">
              <div className="ao-cart-header-title">
                <ShoppingBag size={24} />
                <h2>Votre Panier</h2>
                <span className="ao-cart-badge">
                  {items.length}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ao-cart-close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="ao-cart-body">
              {items.length === 0 ? (
                <div className="ao-cart-empty">
                  <ShoppingBag size={64} style={{ opacity: 0.2 }} />
                  <p>Votre panier est vide.</p>
                  <button onClick={() => { setIsOpen(false); navigate('/modules'); }}>
                    Explorer les modules
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="ao-cart-item">
                    <div className="ao-cart-item-header">
                      <div>
                        <h4 className="ao-cart-item-title">{item.name}</h4>
                        <p className="ao-cart-item-desc">{item.description}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="ao-cart-item-remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="ao-cart-item-footer">
                      <span className="ao-cart-item-type">
                        {item.isSubscription ? 'Abonnement / mois' : 'Paiement unique'}
                      </span>
                      <span className="ao-cart-item-price">{item.price === 0 ? 'Gratuit' : `${item.price} €`}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="ao-cart-footer">
                <div className="ao-cart-total">
                  <span className="ao-cart-total-label">Total estimé</span>
                  <span className="ao-cart-total-value">{getTotal()} € <span className="ao-cart-total-period">/mois</span></span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="ao-cart-checkout-btn"
                >
                  Commander <ArrowRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

