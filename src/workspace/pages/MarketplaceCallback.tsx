import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { ModulesApi } from '../../core/api/modules';

export const MarketplaceCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('Vérification de votre paiement...');

  const merchantRef = searchParams.get('ref');
  const nelsiusTx = searchParams.get('transaction_id'); // If Nelsius passes it in URL

  useEffect(() => {
    if (!merchantRef) {
      setStatus('failed');
      setMessage('Référence de paiement manquante.');
      return;
    }

    const verify = async () => {
      try {
        const res = await ModulesApi.verifyPayment(merchantRef, nelsiusTx || '');
        if (res.status === 'COMPLETED') {
          setStatus('success');
          setMessage('Paiement validé ! Le module a été installé avec succès.');
        } else if (res.status === 'PENDING') {
          setStatus('verifying');
          setMessage('Votre paiement est toujours en cours de validation par l\'opérateur. Veuillez patienter ou vérifier votre historique plus tard.');
        } else {
          setStatus('failed');
          setMessage('Le paiement a échoué ou a été annulé.');
        }
      } catch (err) {
        console.error(err);
        setStatus('failed');
        setMessage('Erreur lors de la vérification du paiement avec notre serveur.');
      }
    };

    verify();
  }, [merchantRef, nelsiusTx]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      {status === 'verifying' && (
        <>
          <Loader2 className="spinning" size={48} color="var(--color-primary)" style={{marginBottom: '1.5rem'}} />
          <h2 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>Traitement en cours...</h2>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle2 size={64} color="#10b981" style={{marginBottom: '1.5rem'}} />
          <h2 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>Félicitations !</h2>
        </>
      )}

      {status === 'failed' && (
        <>
          <XCircle size={64} color="#ef4444" style={{marginBottom: '1.5rem'}} />
          <h2 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>Échec de l'opération</h2>
        </>
      )}

      <p style={{color: 'var(--color-text-muted)', maxWidth: '400px', marginBottom: '2rem'}}>
        {message}
      </p>

      <button 
        onClick={() => navigate('/app/marketplace')}
        style={{
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 500
        }}
      >
        Retourner au Marketplace
      </button>
    </div>
  );
};
