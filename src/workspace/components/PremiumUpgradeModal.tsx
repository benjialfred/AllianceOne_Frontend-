import React, { useState } from 'react';
import { Zap, CheckCircle2, ShieldCheck, CreditCard, ArrowRight, X, Loader2 } from 'lucide-react';
import { PaymentsApi } from '../../core/api/payments';
import './PremiumUpgradeModal.css';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  price?: number;
  isUltra?: boolean;
}

export const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({ isOpen, onClose, featureName, price = 15000, isUltra = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const returnUrl = `${window.location.origin}/app/payment-success`;
      const cancelUrl = window.location.href; // return to current page
      
      const description = isUltra 
        ? 'Abonnement Alliance One ULTRA (Tous modules inclus)' 
        : featureName 
          ? `Abonnement Premium - Déblocage ${featureName}` 
          : 'Abonnement Alliance One PRO (Pack 5 Modules)';
      
      const response = await PaymentsApi.initiateCheckout(
        price,
        description,
        returnUrl,
        cancelUrl
      );
      
      if (response.checkout_url) {
        window.location.href = response.checkout_url;
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Une erreur est survenue lors de l'initialisation du paiement.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content">
        <button className="premium-modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="premium-modal-header">
          <div className="premium-modal-icon-wrapper">
            <Zap size={32} className="premium-modal-icon" />
          </div>
          <h2>Passez à la vitesse supérieure</h2>
          <p>
            {isUltra 
              ? 'Le summum de la plateforme. Aucun compromis.' 
              : featureName 
                ? `Le module "${featureName}" est exclusif aux membres Premium.` 
                : `Débloquez toute la puissance d'Alliance One avec un Pack de Modules sur-mesure.`}
          </p>
        </div>

        <div className="premium-modal-benefits">
          {isUltra ? (
            <>
              <div className="benefit-item">
                <CheckCircle2 size={18} className="benefit-icon" />
                <span>Accès absolu à TOUS les modules</span>
              </div>
              <div className="benefit-item">
                <CheckCircle2 size={18} className="benefit-icon" />
                <span>Développements sur-mesure inclus</span>
              </div>
              <div className="benefit-item">
                <CheckCircle2 size={18} className="benefit-icon" />
                <span>Support prioritaire ligne directe avec les devs</span>
              </div>
            </>
          ) : (
            <>
              <div className="benefit-item">
                <CheckCircle2 size={18} className="benefit-icon" />
                <span>Sélectionnez jusqu'à 5 modules au choix</span>
              </div>
              <div className="benefit-item">
                <CheckCircle2 size={18} className="benefit-icon" />
                <span>Support prioritaire 24/7 par IA</span>
              </div>
              <div className="benefit-item">
                <ShieldCheck size={18} className="benefit-icon" />
                <span>Sécurité et Sauvegarde dédiées</span>
              </div>
            </>
          )}
        </div>

        <div className="premium-modal-pricing">
          <span className="price-amount">{price.toLocaleString('fr-FR')}</span>
          <span className="price-currency">XAF / mois</span>
        </div>

        <button 
          className="premium-modal-action-btn"
          onClick={handleUpgrade}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="spinning" size={20} />
          ) : (
            <>
              <CreditCard size={20} />
              Passer Premium maintenant
              <ArrowRight size={20} />
            </>
          )}
        </button>
        
        <p className="premium-modal-secure-text">
          Paiement 100% sécurisé via Nelsius (Mobile Money & Cartes)
        </p>
      </div>
    </div>
  );
};
