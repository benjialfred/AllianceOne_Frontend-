/**
 * ALLIANCE HUB — ACTIVITY STREAM
 * Clean, chronological list of recent events.
 */
import React from 'react';
import { UserPlus, FileText, CheckCircle2 } from 'lucide-react';

const activities = [
  { id: 1, title: 'Nouvelle inscription validée', desc: 'Alice Kouadio a été inscrite en Terminale C.', time: 'Il y a 10 min', icon: UserPlus, color: '#4f46e5' },
  { id: 2, title: 'Facture #F-2023-114 payée', desc: 'Paiement reçu via Mobile Money.', time: 'Il y a 1h', icon: CheckCircle2, color: '#059669' },
  { id: 3, title: 'Rapport mensuel généré', desc: 'Le rapport financier d\'octobre est prêt.', time: 'Il y a 3h', icon: FileText, color: '#64748b' },
];

export const ActivityStream: React.FC = () => {
  return (
    <section className="ent-activity-section">
      <div className="ent-section-header">
        <h2>Activité récente</h2>
      </div>

      <div className="ent-activity-list">
        {activities.map((act) => (
          <div key={act.id} className="ent-activity-item">
            <div className="ent-activity-icon" style={{ backgroundColor: `${act.color}15`, color: act.color }}>
              <act.icon size={16} />
            </div>
            <div className="ent-activity-content">
              <h4>{act.title}</h4>
              <p>{act.desc}</p>
              <span className="ent-activity-time">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
