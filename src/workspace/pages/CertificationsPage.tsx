import React, { useState } from 'react';
import { ShieldCheck, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePlatformStore } from '../../core/stores/platformStore';

export const CertificationsPage: React.FC = () => {
  const currentOrg = usePlatformStore(s => s.currentOrganization);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus('pending');
    }, 1500);
  };

  return (
    <div className="ecosystem-page-root" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '2rem' }}>
        <div style={{ width: '48px', height: '48px', background: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck size={24} color="#4f46e5" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'var(--ao-font-serif)', fontSize: '24px', margin: 0 }}>Certifications & Vérifications</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Vérifiez l'identité légale de {currentOrg?.name || 'votre organisation'}</p>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        {/* STATUS BANNER */}
        <div style={{ 
          background: status === 'verified' ? '#dcfce7' : status === 'pending' ? '#fef3c7' : '#f1f5f9',
          border: `1px solid ${status === 'verified' ? '#bbf7d0' : status === 'pending' ? '#fde68a' : '#e2e8f0'}`,
          padding: '16px', 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {status === 'verified' && <CheckCircle2 color="#16a34a" size={24} />}
          {status === 'pending' && <AlertCircle color="#d97706" size={24} />}
          {status === 'unverified' && <ShieldCheck color="#64748b" size={24} />}
          
          <div>
            <h3 style={{ margin: 0, color: '#0f172a' }}>
              {status === 'verified' ? 'Organisation Vérifiée' : status === 'pending' ? 'Vérification en cours' : 'Non vérifiée'}
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#475569', fontSize: '14px' }}>
              {status === 'verified' 
                ? "Votre organisation bénéficie du badge de confiance et sera recommandée sur le Hub."
                : status === 'pending'
                ? "Vos documents sont en cours d'analyse par l'équipe Alliance One. (Délai estimé: 24h-48h)"
                : "Uploadez vos documents légaux pour obtenir le badge de confiance."}
            </p>
          </div>
        </div>

        {status === 'unverified' && (
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#1e293b' }}>Documents requis</h3>
            <ul style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', paddingLeft: '20px' }}>
              <li>Extrait Kbis ou Registre du Commerce</li>
              <li>Pièce d'identité du représentant légal</li>
              <li>Preuve d'agrément (pour les établissements de santé ou d'éducation)</li>
            </ul>

            <div style={{ 
              border: '2px dashed #cbd5e1', 
              borderRadius: '12px', 
              padding: '32px', 
              textAlign: 'center',
              cursor: 'pointer',
              background: '#f8fafc',
              transition: 'all 0.2s',
              position: 'relative'
            }}>
              <Upload size={32} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontWeight: 500, color: '#334155' }}>Cliquez ou glissez-déposez vos fichiers</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>PDF, JPG, PNG (Max 10MB)</div>
              <input type="file" multiple style={{ display: 'none' }} id="file-upload" onChange={handleUpload} />
              <label htmlFor="file-upload" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, cursor: 'pointer', opacity: 0 }} />
              
              {file && (
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#0f172a' }}>
                  <FileText size={16} color="#3b82f6" />
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{file.name}</span>
                </div>
              )}
            </div>

            <button 
              onClick={handleSubmit}
              disabled={!file || isSubmitting}
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '12px',
                background: file ? 'var(--color-primary)' : '#cbd5e1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: file ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? 'Soumission en cours...' : 'Soumettre pour vérification'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
