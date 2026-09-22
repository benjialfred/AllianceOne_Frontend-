import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Download, FileText, Loader2 } from 'lucide-react';
import { founderApi, type FounderCV } from '../../../core/api/founder';
import cvImg from '../../../assets/CV.jpeg';
import './FounderProfile.css';

export const FounderCVViewer: React.FC = () => {
  const navigate = useNavigate();
  const [cvData, setCvData] = useState<FounderCV | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Track CV view on mount
    founderApi.trackEvent({ event_type: 'CV_VIEW' }).catch(console.error);

    // Fetch active CV
    founderApi.getActiveCV()
      .then((data) => {
        setCvData(data);
      })
      .catch((err) => {
        console.error("Failed to load CV", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDownload = () => {
    if (cvData?.file_url) {
      founderApi.trackEvent({ event_type: 'CV_DOWNLOAD' }).catch(console.error);
      window.open(cvData.file_url, '_blank');
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="cv-viewer-overlay">
      <header className="cv-viewer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileText size={20} color="var(--color-text-primary)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>
            {cvData ? cvData.title : 'Curriculum Vitae'}
          </h2>
          {cvData?.version && (
            <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'var(--color-bg-tertiary)', borderRadius: '4px', color: 'var(--color-text-secondary)' }}>
              v{cvData.version}
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={handleDownload}
            disabled={!cvData?.file_url}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              background: 'none', border: 'none', cursor: cvData?.file_url ? 'pointer' : 'not-allowed', 
              color: 'var(--color-text-primary)', fontSize: '0.875rem', fontWeight: 500,
              opacity: cvData?.file_url ? 1 : 0.5
            }}
          >
            <Download size={16} /> <span className="hide-mobile">Télécharger</span>
          </button>
          
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }}></div>
          
          <button 
            onClick={handleClose}
            style={{ 
              background: 'var(--color-bg-tertiary)', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--color-text-primary)'
            }}
          >
            <X size={18} />
          </button>
        </div>
      </header>

      <main className="cv-viewer-content">
        <div className="cv-iframe-container" style={{ overflow: 'auto', display: 'flex', justifyContent: 'center', background: 'var(--founder-bg-subtle)', padding: '2rem', height: '100%', alignItems: 'flex-start' }}>
          <img src={cvImg} alt="CV" style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }} />
        </div>
      </main>
    </div>
  );
};
