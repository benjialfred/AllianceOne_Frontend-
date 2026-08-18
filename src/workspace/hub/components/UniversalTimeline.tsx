/**
 * ALLIANCE OS — UNIVERSAL TIMELINE
 * Chronological cross-module activity stream.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import './OsComponents.css';

const events = [
  { id: 1, time: '09:42', title: 'Nouvel élève inscrit', module: 'Éducation', colorClass: 'os-color-edu' },
  { id: 2, time: '09:31', title: 'Paiement reçu', module: 'Finance', colorClass: 'os-color-fin' },
  { id: 3, time: '09:18', title: 'Stock mis à jour', module: 'Stocks', colorClass: 'os-color-inv' },
  { id: 4, time: '08:54', title: 'Document ajouté', module: 'Cloud', colorClass: 'os-color-cloud' }
];

export const UniversalTimeline: React.FC = () => {
  return (
    <section className="os-section os-timeline-section">
      <h3 className="os-section-title">
        <Clock size={14} /> Activité récente
      </h3>
      
      <div className="os-timeline">
        {events.map((evt, i) => (
          <motion.div 
            key={evt.id}
            className="os-timeline-item"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <div className="os-tl-time">{evt.time}</div>
            <div className="os-tl-track">
              <div className={`os-tl-dot ${evt.colorClass}`} />
              {i !== events.length - 1 && <div className="os-tl-line" />}
            </div>
            <div className="os-tl-content">
              <h4>{evt.title}</h4>
              <span>{evt.module}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
