import React from 'react';
import { Activity, ShieldCheck, UserPlus, ServerCrash } from 'lucide-react';

const activities = [
  { id: 1, title: 'Nouvelle Organisation inscrite', time: 'Il y a 5 min', icon: ShieldCheck, color: '#10b981' },
  { id: 2, title: 'Pic de trafic détecté', time: 'Il y a 45 min', icon: Activity, color: '#f59e0b' },
  { id: 3, title: '150 étudiants importés (Alliance Academy)', time: 'Il y a 2 heures', icon: UserPlus, color: '#4f46e5' },
  { id: 4, title: 'Redémarrage du service d\'envoi d\'emails', time: 'Hier à 18:30', icon: ServerCrash, color: '#ef4444' },
];

export const RecentActivityWidget: React.FC = () => {
  return (
    <div style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', color: 'var(--color-text-primary)' }}>Activités Récentes</h3>
      
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ 
                width: 32, height: 32, borderRadius: '50%', 
                backgroundColor: `${act.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={16} color={act.color} />
              </div>
              <div>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  {act.title}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{act.time}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};
