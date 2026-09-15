import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, BarChart3, Users, Eye, Download, Percent, AlertTriangle } from 'lucide-react';
import { founderApi, type FounderAnalytics as AnalyticsType } from '../../../core/api/founder';
import './FounderProfile.css';

export const FounderAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    founderApi.getAnalytics()
      .then((res) => setData(res))
      .catch((err) => {
        console.error("Analytics access denied", err);
        setError("Accès refusé ou données indisponibles. Cet espace est réservé au fondateur.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="founder-profile-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="founder-profile-root" style={{ padding: '4rem 2rem' }}>
        <div className="founder-container" style={{ textAlign: 'center' }}>
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Non autorisé</h2>
          <p className="founder-text">{error}</p>
          <button className="founder-btn founder-btn-primary" onClick={() => navigate('/app')}>
            Retour au Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="founder-profile-root">
      <div className="founder-container">
        
        <button 
          onClick={() => navigate('/app')} 
          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-text-muted)', marginBottom: '3rem', fontSize: '14px', fontWeight: 500 }}
        >
          <ChevronLeft size={16} /> Quitter Analytics
        </button>

        <header style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <BarChart3 size={32} color="var(--color-text-primary)" />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
              Founder Intelligence
            </h1>
          </div>
          <p className="founder-text">Vue d'ensemble de l'impact et de la portée de votre profil professionnel.</p>
        </header>

        {/* Overview Stats */}
        <section style={{ marginBottom: '4rem' }}>
          <h3 className="founder-subsection-title">Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            
            <div className="founder-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                <Eye size={16} /> <span>Profile Views</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{data.overview.profile_views}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {data.overview.unique_visitors} visiteurs uniques
              </div>
            </div>

            <div className="founder-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                <FileText size={16} /> <span>CV Views</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{data.overview.cv_views}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {data.overview.unique_cv_viewers} lecteurs uniques
              </div>
            </div>

            <div className="founder-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                <Percent size={16} /> <span>Conversion (View to CV)</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{data.overview.conversion_rate}%</div>
            </div>

            <div className="founder-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                <Download size={16} /> <span>CV Downloads</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{data.overview.downloads}</div>
            </div>

          </div>
        </section>

        {/* Activity Feed */}
        <section>
          <h3 className="founder-subsection-title">Recent Activity</h3>
          <div style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Action</th>
                  <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Utilisateur</th>
                  <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Organisation</th>
                  <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_activity.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Aucune activité récente</td>
                  </tr>
                ) : (
                  data.recent_activity.map((event, idx) => (
                    <tr key={event.id} style={{ borderBottom: idx === data.recent_activity.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', 
                          backgroundColor: event.event_type.includes('CV') ? '#e0e7ff' : '#f3f4f6',
                          color: event.event_type.includes('CV') ? '#4338ca' : '#4b5563'
                        }}>
                          {event.event_type}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{event.user}</td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{event.organization}</td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        {new Date(event.timestamp).toLocaleString('fr-FR', {
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};
