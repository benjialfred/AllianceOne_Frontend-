import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';

const data = [
  { name: 'Lun', users: 12 },
  { name: 'Mar', users: 19 },
  { name: 'Mer', users: 15 },
  { name: 'Jeu', users: 25 },
  { name: 'Ven', users: 32 },
  { name: 'Sam', users: 28 },
  { name: 'Dim', users: 45 },
];

export const NewUsersWidget: React.FC = () => {
  return (
    <div style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-primary)' }}>Nouveaux Utilisateurs</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Croissance cette semaine</p>
        </div>
        <div style={{ backgroundColor: 'var(--color-primary-50)', padding: '0.5rem', borderRadius: '8px' }}>
          <Users size={20} color="var(--color-primary-600)" />
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>+176</h2>
        <span style={{ color: 'var(--color-success)', fontSize: '0.9rem', fontWeight: 600 }}>+12%</span>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
            <Tooltip />
            <Area type="monotone" dataKey="users" stroke="var(--color-primary-600)" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex' }}>
          {[1,2,3].map(i => (
            <img 
              key={i}
              src={`https://i.pravatar.cc/150?img=${i+10}`} 
              alt="user" 
              style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid white', marginLeft: i > 1 ? -10 : 0 }}
            />
          ))}
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid white', marginLeft: -10, backgroundColor: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600 }}>
            +17
          </div>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Ont rejoint récemment</span>
      </div>
    </div>
  );
};
