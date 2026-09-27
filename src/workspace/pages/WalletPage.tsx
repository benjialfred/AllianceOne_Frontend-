import React, { useState } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownRight, Shield, Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import { PaymentsApi } from '../../core/api/payments';
import { usePlatformStore } from '../../core/stores/platformStore';

export const WalletPage: React.FC = () => {
  const currentOrg = usePlatformStore(s => s.currentOrganization);
  
  // Fake state for wallet balance (would normally come from API)
  const [balance, setBalance] = useState(1500000); // 1.5M XAF
  const [pinCode, setPinCode] = useState(localStorage.getItem('ao_wallet_pin') || '');
  const [isPinSetup, setIsPinSetup] = useState(!!localStorage.getItem('ao_wallet_pin'));
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showSetup, setShowSetup] = useState(!localStorage.getItem('ao_wallet_pin'));

  // Modals for Deposit / Withdraw
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetupPin = () => {
    if (pinInput.length === 4) {
      localStorage.setItem('ao_wallet_pin', pinInput);
      setPinCode(pinInput);
      setIsPinSetup(true);
      setShowSetup(false);
      setIsUnlocked(true);
      setPinInput('');
    }
  };

  const handleUnlock = () => {
    if (pinInput === pinCode) {
      setIsUnlocked(true);
      setPinInput('');
    } else {
      alert("Code PIN incorrect");
    }
  };

  const handleTransaction = async (type: 'deposit' | 'withdraw') => {
    setLoading(true);
    try {
      const val = parseInt(amount, 10);
      if (isNaN(val) || val <= 0) throw new Error("Montant invalide");
      
      const description = type === 'deposit' 
        ? `Recharge du Portefeuille Alliance (${val} XAF)` 
        : `Demande de Retrait Portefeuille (${val} XAF)`;

      const response = await PaymentsApi.initiateCheckout(
        val,
        description,
        `${window.location.origin}/app/wallet?status=success`,
        `${window.location.origin}/app/wallet?status=cancelled`
      );

      // Rediriger vers la page Nelsius Checkout pour finaliser (Recharge ou Retrait via leur interface hébergée)
      window.location.href = response.checkout_url;
      
    } catch (error: any) {
      console.error(error);
      alert("Erreur d'initialisation de l'opération via Nelsius : " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ecosystem-page-root" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '2rem' }}>
        <div style={{ width: '48px', height: '48px', background: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CreditCard size={24} color="#4f46e5" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'var(--ao-font-serif)', fontSize: '24px', margin: 0 }}>Portefeuille & Finances</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Gérez les fonds de {currentOrg?.name || 'votre organisation'}</p>
        </div>
      </div>

      {!isPinSetup || showSetup ? (
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <Shield size={48} color="#4f46e5" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Sécurisez votre portefeuille</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Créez un code PIN à 4 chiffres pour protéger l'accès à votre solde et valider vos transactions.</p>
          <input 
            type="password"
            maxLength={4}
            value={pinInput}
            onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
            placeholder="****"
            style={{ fontSize: '24px', letterSpacing: '8px', textAlign: 'center', width: '120px', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', marginBottom: '24px' }}
          />
          <br />
          <button 
            onClick={handleSetupPin}
            disabled={pinInput.length !== 4}
            style={{ padding: '12px 32px', background: pinInput.length === 4 ? 'var(--color-primary)' : '#cbd5e1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: pinInput.length === 4 ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
          >
            Créer mon code PIN
          </button>
        </div>
      ) : !isUnlocked ? (
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <Lock size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Portefeuille verrouillé</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Entrez votre code PIN pour afficher le solde.</p>
          <input 
            type="password"
            maxLength={4}
            value={pinInput}
            onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
            placeholder="****"
            style={{ fontSize: '24px', letterSpacing: '8px', textAlign: 'center', width: '120px', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', marginBottom: '24px' }}
          />
          <br />
          <button 
            onClick={handleUnlock}
            disabled={pinInput.length !== 4}
            style={{ padding: '12px 32px', background: pinInput.length === 4 ? 'var(--color-primary)' : '#cbd5e1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: pinInput.length === 4 ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
          >
            Déverrouiller
          </button>
        </div>
      ) : (
        <>
          <div style={{ 
            background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)', 
            borderRadius: '24px', 
            padding: '32px', 
            color: 'white', 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
          }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Solde de l'entreprise
                <button onClick={() => setIsUnlocked(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                  <EyeOff size={16} />
                </button>
              </div>
              <div style={{ fontSize: '48px', fontWeight: 700, fontFamily: 'var(--ao-font-serif)' }}>
                {balance.toLocaleString('fr-FR')} <span style={{ fontSize: '24px', color: 'rgba(255,255,255,0.8)' }}>XAF</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => setShowDeposit(true)}
                style={{ padding: '12px 24px', background: 'white', color: '#4f46e5', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ArrowDownRight size={18} />
                Recharger
              </button>
              <button 
                onClick={() => setShowWithdraw(true)}
                style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ArrowUpRight size={18} />
                Retirer
              </button>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#0f172a' }}>Dernières transactions Nelsius</h3>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {[1,2,3].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: i !== 3 ? '1px solid #e2e8f0' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 color="#16a34a" size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>Abonnement Module Éducation</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>24 Sep 2026 • Réf: NELS-847294</div>
                  </div>
                </div>
                <div style={{ fontWeight: 600, color: '#ef4444' }}>- 15 000 XAF</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* DEPOSIT MODAL */}
      {showDeposit && (
        <div className="ao-marketing-modal-backdrop" style={{ zIndex: 10000 }}>
          <div className="ao-marketing-modal" style={{ padding: '32px', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Recharger le compte</h2>
            <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>Vous serez redirigé vers Nelsius pour finaliser le paiement (Mobile Money, Carte).</p>
            <input 
              type="number" 
              placeholder="Montant (XAF)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '24px', fontSize: '16px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowDeposit(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Annuler</button>
              <button onClick={() => handleTransaction('deposit')} disabled={!amount || loading} style={{ flex: 1, padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                {loading ? 'Redirection...' : 'Continuer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {showWithdraw && (
        <div className="ao-marketing-modal-backdrop" style={{ zIndex: 10000 }}>
          <div className="ao-marketing-modal" style={{ padding: '32px', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Retirer des fonds</h2>
            <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>Les fonds seront transférés vers votre compte Mobile Money ou bancaire configuré sur Nelsius.</p>
            <input 
              type="number" 
              placeholder="Montant (XAF)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '24px', fontSize: '16px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowWithdraw(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Annuler</button>
              <button onClick={() => handleTransaction('withdraw')} disabled={!amount || loading} style={{ flex: 1, padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                {loading ? 'Traitement...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
