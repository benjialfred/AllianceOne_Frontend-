import React from 'react';
import { motion } from 'framer-motion';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, subtitle }) => {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--color-surface-card)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-surface-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </h3>
        {Icon && (
          <div style={{ 
            padding: '0.5rem', 
            backgroundColor: 'var(--color-primary-50)', 
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-accent-500)'
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
          {value}
        </div>
        
        {(trend || subtitle) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            {trend && (
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: trend.isPositive ? '#10b981' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: trend.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
            {subtitle && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
