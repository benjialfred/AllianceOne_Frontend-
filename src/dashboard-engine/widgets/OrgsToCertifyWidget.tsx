import React from 'react';
import { Building2, CheckCircle2, Clock } from 'lucide-react';

const pendingOrgs = [
  { id: 1, name: 'Clinique Horizon', type: 'Santé', date: '02 Août 2026' },
  { id: 2, name: 'Tech University', type: 'Éducation', date: '01 Août 2026' },
];

export const OrgsToCertifyWidget: React.FC = () => {
  return (
    <div style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-primary)' }}>Organisations à Certifier</h3>
        <span style={{ backgroundColor: 'var(--color-warning)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>
          {pendingOrgs.length} en attente
        </span>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {pendingOrgs.map(org => (
          <div key={org.id} style={{ 
            border: '1px solid var(--color-border)', 
            borderRadius: '8px', 
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-surface-hover)', borderRadius: '8px' }}>
                <Building2 size={20} color="var(--color-text-secondary)" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{org.name}</h4>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                  <span>{org.type}</span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={12}/> {org.date}</span>
                </div>
              </div>
            </div>
            
            <button style={{ 
              background: 'none', border: 'none', cursor: 'pointer', 
              color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.2rem',
              fontWeight: 600, fontSize: '0.85rem'
            }}>
              <CheckCircle2 size={18} />
              Certifier
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
