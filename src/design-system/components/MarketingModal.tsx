import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, Zap, Gift, Calendar, Check } from 'lucide-react';
import { useMarketingStore } from '../../core/stores/marketingStore';
import { useNavigate } from 'react-router-dom';
import '../../workspace/hub/AllianceHub.css'; // Make sure styles are loaded

export const MarketingModal: React.FC = () => {
  const { isOpen, options, closeModal } = useMarketingStore();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const navigate = useNavigate();

  if (!options) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        closeModal();
        setStatus('idle');
        navigate('/register', { state: { email, autoSubmit: true } });
        setEmail('');
      }, 500);
    }, 500);
  };

  const getIcon = () => {
    switch (options.type) {
      case 'newsletter': return <Mail color="white" size={40} />;
      case 'offer': return <Gift color="white" size={40} />;
      case 'feature': return <Zap color="white" size={40} />;
      case 'event': return <Calendar color="white" size={40} />;
      default: return <Mail color="white" size={40} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="ao-marketing-modal-backdrop" onClick={() => options.isDismissible !== false && closeModal()}>
          <div className="ao-marketing-modal" onClick={e => e.stopPropagation()}>
            {options.isDismissible !== false && (
              <button className="ao-modal-close" onClick={closeModal}>
                <X size={18} />
              </button>
            )}
            
            <div className="ao-modal-banner">
              {getIcon()}
            </div>
            
            <div className="ao-modal-content">
              <h2>{options.title}</h2>
              <p className="ao-modal-subtitle">
                {options.description}
              </p>

              {options.type === 'newsletter' ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                    <input 
                      type="email" 
                      required
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '16px 16px 16px 48px',
                        color: '#0f172a',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={status === 'loading' || status === 'success'}
                    className="ao-modal-cta-primary"
                    style={{ opacity: (status === 'loading' || status === 'success') ? 0.7 : 1 }}
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
                  className="ao-modal-cta-primary"
                >
                  {options.primaryActionText}
                  <ArrowRight size={18} />
                </button>
              )}
              
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '24px', fontWeight: 500 }}>
                Nous respectons votre vie privée. Aucun spam.
              </p>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
