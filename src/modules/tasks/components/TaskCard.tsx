import React from 'react';
import { Calendar, CheckSquare, Clock, AlertTriangle, User } from 'lucide-react';
import { PriorityBadge } from './StatusBadge';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusChange?: (taskId: string, newStatus: any) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const formattedDue = formatDueDate(task.due_date);

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e4e9',
        borderRadius: '10px',
        padding: '14px',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#cbd5e1';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e2e4e9';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top row: Project / Number / Priority */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {task.project_code && (
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: task.project_color || '#4f46e5',
              backgroundColor: `${task.project_color || '#4f46e5'}15`,
              padding: '2px 6px',
              borderRadius: '4px',
              letterSpacing: '0.02em'
            }}>
              {task.task_number}
            </span>
          )}
          {!task.project_code && (
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#868c98' }}>
              {task.task_number}
            </span>
          )}
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Title */}
      <div style={{
        fontSize: '13px',
        fontWeight: 600,
        color: '#0e121b',
        lineHeight: 1.4,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {task.title}
      </div>

      {/* Labels */}
      {task.labels_details && task.labels_details.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {task.labels_details.map((lbl) => (
            <span
              key={lbl.id}
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: lbl.color,
                backgroundColor: `${lbl.color}15`,
                padding: '1px 6px',
                borderRadius: '4px'
              }}
            >
              {lbl.name}
            </span>
          ))}
        </div>
      )}

      {/* Bottom meta row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '8px',
        borderTop: '1px solid #f3f3f6',
        fontSize: '11px',
        color: '#525866',
        marginTop: '2px'
      }}>
        {/* Left items: Due date, checklist, timelog */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {formattedDue && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: task.is_overdue ? '#dc2626' : '#525866',
              fontWeight: task.is_overdue ? 700 : 500,
              backgroundColor: task.is_overdue ? '#fee2e2' : 'transparent',
              padding: task.is_overdue ? '1px 5px' : '0',
              borderRadius: '4px'
            }}>
              {task.is_overdue ? <AlertTriangle size={11} /> : <Calendar size={11} />}
              <span>{formattedDue}</span>
            </div>
          )}

          {task.checklist_total > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <CheckSquare size={11} color="#6366f1" />
              <span>{task.checklist_completed}/{task.checklist_total}</span>
            </div>
          )}

          {Number(task.logged_hours) > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Clock size={11} color="#10b981" />
              <span>{Number(task.logged_hours)}h</span>
            </div>
          )}
        </div>

        {/* Right item: Assignee avatar */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {task.assigned_to_name && task.assigned_to_name !== 'Non assigné' ? (
            <div
              title={task.assigned_to_name}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#0e121b',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'uppercase'
              }}
            >
              {task.assigned_to_name.substring(0, 2)}
            </div>
          ) : (
            <div
              title="Non assigné"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '1px dashed #cbd5e1',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <User size={12} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
