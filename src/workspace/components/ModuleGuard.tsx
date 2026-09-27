import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ModulesApi } from '../../core/api/modules';
import { Lock, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PremiumUpgradeModal } from './PremiumUpgradeModal';

interface ModuleGuardProps {
  children: React.ReactNode;
  moduleSlug: string;
  moduleName: string;
  usageLimitReached?: boolean;
}

export const ModuleGuard: React.FC<ModuleGuardProps> = ({ children, moduleSlug, moduleName, usageLimitReached = false }) => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(usageLimitReached);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const installations = await ModulesApi.getInstallations();
        const hasModule = installations.some(i => i.module.slug === moduleSlug && i.status === 'ACTIVE');
        setIsAllowed(hasModule);
      } catch (err) {
        console.error("Error checking module access:", err);
        // On error, default to not allowed to enforce security
        setIsAllowed(false);
      }
    };
    checkAccess();
  }, [moduleSlug]);

  if (isAllowed === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
        <div className="spinning" style={{ width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%' }}></div>
      </div>
    );
  }

  if (usageLimitReached) {
    return (
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div className="ao-ai-upsell-panel" style={{ flexDirection: 'column', textAlign: 'center', padding: '48px', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '80px', height: '80px', background: '#fef2f2', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
            <AlertTriangle size={40} color="#ef4444" />
          </div>
          
          <h2 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '16px' }}>Volume de données atteint</h2>
          <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px auto', lineHeight: '1.6' }}>
            Vous avez atteint la limite de votre plan gratuit pour le module <strong>{moduleName}</strong>. Pour continuer à ajouter des données et développer votre activité, passez à l'abonnement Premium.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button 
              onClick={() => setShowPremiumModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <Zap size={18} />
              Payer l'abonnement
            </button>
          </div>
        </div>
        
        <PremiumUpgradeModal 
          isOpen={showPremiumModal} 
          onClose={() => setShowPremiumModal(false)} 
          featureName={moduleName} 
        />
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div className="ao-ai-upsell-panel" style={{ flexDirection: 'column', textAlign: 'center', padding: '48px', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
            <Lock size={40} color="#64748b" />
          </div>
          
          <h2 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '16px' }}>Module {moduleName} non installé</h2>
          <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px auto', lineHeight: '1.6' }}>
            Vous devez installer ce module depuis le Marketplace pour y accéder. L'installation de la version de base est gratuite pour la plupart de nos modules.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/marketplace')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(79, 70, 229, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <Zap size={18} />
              Aller au Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
