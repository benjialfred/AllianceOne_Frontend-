import React from 'react';
import { AlertCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import type { TaskPriority, TaskStatus } from '../types';

export const PriorityBadge: React.FC<{ priority: TaskPriority; showIcon?: boolean }> = ({ priority, showIcon = true }) => {
  const configs: Record<TaskPriority, { label: string; bg: string; color: string; border: string; icon: React.ReactNode }> = {
    URGENT: {
      label: 'Urgente',
      bg: '#fee2e2',
      color: '#dc2626',
      border: '#fca5a5',
      icon: <AlertCircle size={12} />
    },
    HIGH: {
      label: 'Haute',
      bg: '#ffedd5',
      color: '#ea580c',
      border: '#fdba74',
      icon: <ArrowUp size={12} />
    },
    MEDIUM: {
      label: 'Moyenne',
      bg: '#fef3c7',
      color: '#d97706',
      border: '#fde68a',
      icon: <Minus size={12} />
    },
    LOW: {
      label: 'Basse',
      bg: '#f1f5f9',
      color: '#64748b',
      border: '#e2e8f0',
      icon: <ArrowDown size={12} />
    }
  };

  const conf = configs[priority] || configs.MEDIUM;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '11px',
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: '6px',
      backgroundColor: conf.bg,
      color: conf.color,
      border: `1px solid ${conf.border}`,
      lineHeight: '16px'
    }}>
      {showIcon && conf.icon}
      {conf.label}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const configs: Record<TaskStatus, { label: string; bg: string; color: string; border: string }> = {
    BACKLOG: { label: 'Backlog', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
    TODO: { label: 'À faire', bg: '#e0e7ff', color: '#4338ca', border: '#c7d2fe' },
    IN_PROGRESS: { label: 'En cours', bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' },
    IN_REVIEW: { label: 'En révision', bg: '#fae8ff', color: '#a21caf', border: '#f5d0fe' },
    DONE: { label: 'Terminé', bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
    BLOCKED: { label: 'Bloqué', bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
    CANCELLED: { label: 'Annulé', bg: '#f3f4f6', color: '#6b7280', border: '#e5e7eb' },
  };

  const conf = configs[status] || { label: status, bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '11px',
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: '6px',
      backgroundColor: conf.bg,
      color: conf.color,
      border: `1px solid ${conf.border}`,
      lineHeight: '16px'
    }}>
      {conf.label}
    </span>
  );
};
