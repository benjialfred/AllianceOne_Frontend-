/**
 * ALLIANCE HUB — APPLICATIONS GRID
 * Clean, modern app launcher.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Boxes, Activity, Users, Settings } from 'lucide-react';

const apps = [
  { id: 'education', name: 'Éducation Pro', desc: 'Gestion scolaire, notes et présences.', icon: Users, color: '#4f46e5', route: '/app/education' },
  { id: 'finance', name: 'Finances', desc: 'Trésorerie, factures et paie.', icon: Activity, color: '#059669', route: '/app/finance' },
  { id: 'inventory', name: 'Stocks', desc: 'Logistique et inventaires.', icon: Boxes, color: '#0ea5e9', route: '/app/inventory' },
  { id: 'library', name: 'Bibliothèque', desc: 'Ouvrages et prêts.', icon: Boxes, color: '#8b5cf6', route: '/app/library' },
  { id: 'tasks', name: 'Projets', desc: 'Tâches et collaboration.', icon: Activity, color: '#f59e0b', route: '/app/tasks' },
  { id: 'settings', name: 'Paramètres', desc: 'Configuration du système.', icon: Settings, color: '#64748b', route: '/app/settings' },
];

export const MyApplicationsGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="ent-apps-section">
      <div className="ent-section-header">
        <h2>Vos Applications</h2>
        <button className="ent-btn-link" onClick={() => navigate('/app/marketplace')}>Découvrir plus d'apps</button>
      </div>

      <div className="ent-apps-grid">
        {apps.map((app) => (
          <button 
            key={app.id} 
            className="ent-app-card"
            onClick={() => navigate(app.route)}
          >
            <div className="ent-app-icon" style={{ backgroundColor: `${app.color}15`, color: app.color }}>
              <app.icon size={24} strokeWidth={2} />
            </div>
            <div className="ent-app-info">
              <h3>{app.name}</h3>
              <p>{app.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
