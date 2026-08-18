/**
 * ALLIANCE OS — MODULE SPACES
 * Semantic module panels. Not just links, but living application states.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, BarChart, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './OsComponents.css';

interface SpaceProps {
  id: string;
  title: string;
  statPrimary: string;
  statLabel: string;
  statSecondary?: string;
  icon: React.ElementType;
  route: string;
  colorClass: string;
  delay: number;
}

const spacesData: SpaceProps[] = [
  {
    id: 'edu',
    title: 'Éducation',
    statPrimary: '1 248',
    statLabel: 'élèves inscrits',
    statSecondary: '36 classes actives',
    icon: GraduationCap,
    route: '/app/education',
    colorClass: 'os-color-edu',
    delay: 0.1
  },
  {
    id: 'fin',
    title: 'Finance',
    statPrimary: '25,6 M',
    statLabel: 'FCFA · Trésorerie',
    statSecondary: '12 opérations ce jour',
    icon: BarChart,
    route: '/app/finance',
    colorClass: 'os-color-fin',
    delay: 0.2
  },
  {
    id: 'inv',
    title: 'Stocks',
    statPrimary: '1 580',
    statLabel: 'références',
    statSecondary: '3 alertes niveau bas',
    icon: Box,
    route: '/app/inventory',
    colorClass: 'os-color-inv',
    delay: 0.3
  }
];

export const ModulesSpaces: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="os-section">
      <h3 className="os-section-title">Mes Espaces</h3>
      <div className="os-spaces-grid">
        {spacesData.map((space) => (
          <motion.div 
            key={space.id}
            className="os-space-card os-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: space.delay, ease: "easeOut" }}
            onClick={() => navigate(space.route)}
          >
            <div className={`os-space-icon ${space.colorClass}`}>
              <space.icon size={20} />
            </div>
            <div className="os-space-content">
              <h4>{space.title}</h4>
              <div className="os-space-stat">
                <span className="os-stat-val">{space.statPrimary}</span>
                <span className="os-stat-lbl">{space.statLabel}</span>
              </div>
              {space.statSecondary && (
                <span className="os-space-substat">{space.statSecondary}</span>
              )}
            </div>
            <div className="os-space-action">
              <span>Ouvrir</span>
              <ArrowRight size={14} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
