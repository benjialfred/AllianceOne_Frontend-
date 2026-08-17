import React, { useState } from 'react';
import {
  X, Clock, Calendar, Plus,
  Trash2, Edit3, User, Send
} from 'lucide-react';
import { PriorityBadge } from './StatusBadge';
import { tasksApi } from '../services/api';
import type { Task, TaskStatus } from '../types';

interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onEdit: (task: Task) => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onEdit
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [newChecklist, setNewChecklist] = useState('');
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);

  const [logHours, setLogHours] = useState('1');
  const [logDesc, setLogDesc] = useState('');
  const [isLoggingTime, setIsLoggingTime] = useState(false);
  const [showTimeForm, setShowTimeForm] = useState(false);

  if (!isOpen || !task) return null;

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await tasksApi.changeTaskStatus(task.id, newStatus);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleChecklist = async (itemId: string) => {
    try {
      await tasksApi.toggleChecklistItem(task.id, itemId);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklist.trim()) return;
    try {
      await tasksApi.addChecklistItem(task.id, newChecklist.trim());
      setNewChecklist('');
      setIsAddingChecklist(false);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      await tasksApi.addComment(task.id, newComment.trim());
      setNewComment('');
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLogTime = async (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseFloat(logHours);
    if (!hours || hours <= 0) return;
    setIsLoggingTime(true);
    try {
      await tasksApi.logTime(task.id, {
        hours,
        description: logDesc.trim() || undefined
      });
      setLogHours('1');
      setLogDesc('');
      setShowTimeForm(false);
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingTime(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la tâche ${task.task_number} ?`)) return;
    try {
      await tasksApi.deleteTask(task.id);
      onClose();
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(14, 18, 27, 0.4)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '640px',
        height: '100%',
        backgroundColor: '#ffffff',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.2s ease-out'
      }}>
        {/* Top bar */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e2e4e9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f9f9fb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: task.project_color || '#4f46e5',
              backgroundColor: `${task.project_color || '#4f46e5'}15`,
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {task.task_number}
            </span>
            {task.project_name && (
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#525866' }}>
                {task.project_name}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => onEdit(task)}
              title="Modifier"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #e2e4e9',
                backgroundColor: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                color: '#0e121b',
                cursor: 'pointer'
              }}
            >
              <Edit3 size={13} />
              Modifier
            </button>

            <button
              onClick={handleDelete}
              title="Supprimer"
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid #fee2e2',
                backgroundColor: '#fff5f5',
                color: '#dc2626',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={14} />
            </button>

            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#868c98',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Title */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e121b', margin: 0, lineHeight: 1.4 }}>
            {task.title}
          </h2>

          {/* Quick Properties grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
            padding: '16px',
            backgroundColor: '#f9f9fb',
            borderRadius: '10px',
            border: '1px solid #e2e4e9'
          }}>
            {/* Status */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#868c98', marginBottom: '4px' }}>Statut</div>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="BACKLOG">Backlog</option>
                <option value="TODO">À faire</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="IN_REVIEW">En révision</option>
                <option value="DONE">Terminé</option>
                <option value="BLOCKED">Bloqué</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#868c98', marginBottom: '4px' }}>Priorité</div>
              <PriorityBadge priority={task.priority} />
            </div>

            {/* Assignee */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#868c98', marginBottom: '4px' }}>Assigné à</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#0e121b' }}>
                <User size={13} color="#868c98" />
                <span>{task.assigned_to_name}</span>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#868c98', marginBottom: '4px' }}>Échéance</div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: task.is_overdue ? 700 : 600,
                color: task.is_overdue ? '#dc2626' : '#0e121b'
              }}>
                <Calendar size={13} color={task.is_overdue ? '#dc2626' : '#868c98'} />
                <span>{task.due_date ? new Date(task.due_date).toLocaleDateString('fr-FR') : 'Non définie'}</span>
              </div>
            </div>
          </div>

          {/* Time Tracking Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e4e9',
            borderRadius: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={18} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0e121b' }}>
                  {Number(task.logged_hours)}h passées <span style={{ fontWeight: 400, color: '#868c98' }}>/ {Number(task.estimated_hours)}h estimées</span>
                </div>
                <div style={{ fontSize: '11px', color: '#525866' }}>
                  {Number(task.estimated_hours) > 0
                    ? `${Math.round((Number(task.logged_hours) / Number(task.estimated_hours)) * 100)}% du budget consommé`
                    : 'Aucun budget temps estimé'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTimeForm(!showTimeForm)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e4e9',
                backgroundColor: '#f9f9fb',
                fontSize: '12px',
                fontWeight: 600,
                color: '#0e121b',
                cursor: 'pointer'
              }}
            >
              <Plus size={13} />
              Saisir du temps
            </button>
          </div>

          {/* Time Log Input Popdown */}
          {showTimeForm && (
            <form onSubmit={handleLogTime} style={{
              padding: '14px',
              backgroundColor: '#f9f9fb',
              borderRadius: '8px',
              border: '1px solid #e2e4e9',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0e121b' }}>Ajouter une entrée de temps</div>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: '8px' }}>
                <input
                  type="number"
                  step="0.25"
                  min="0.25"
                  placeholder="Heures"
                  value={logHours}
                  onChange={(e) => setLogHours(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e4e9', fontSize: '12px' }}
                />
                <input
                  type="text"
                  placeholder="Description (ex: Révision de code...)"
                  value={logDesc}
                  onChange={(e) => setLogDesc(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e4e9', fontSize: '12px' }}
                />
                <button
                  type="submit"
                  disabled={isLoggingTime}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          )}

          {/* Description */}
          {task.description && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#868c98', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Description
              </div>
              <div style={{
                fontSize: '13px',
                color: '#333741',
                lineHeight: 1.6,
                backgroundColor: '#ffffff',
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid #e2e4e9',
                whiteSpace: 'pre-wrap'
              }}>
                {task.description}
              </div>
            </div>
          )}

          {/* Checklists */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#868c98', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Checklist & Sous-tâches ({task.checklist_completed}/{task.checklist_total})
              </div>
              <button
                onClick={() => setIsAddingChecklist(!isAddingChecklist)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#4f46e5',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={13} />
                Ajouter un item
              </button>
            </div>

            {/* Checklist progress bar */}
            {task.checklist_total > 0 && (
              <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e4e9', borderRadius: '3px', marginBottom: '12px', overflow: 'hidden' }}>
                <div style={{
                  width: `${task.progress_percentage}%`,
                  height: '100%',
                  backgroundColor: task.progress_percentage === 100 ? '#16a34a' : '#4f46e5',
                  transition: 'width 0.2s ease-in-out'
                }} />
              </div>
            )}

            {isAddingChecklist && (
              <form onSubmit={handleAddChecklist} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Nouvel élément..."
                  value={newChecklist}
                  onChange={(e) => setNewChecklist(e.target.value)}
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#0e121b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Ajouter
                </button>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {task.checklist_items && task.checklist_items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    backgroundColor: item.is_completed ? '#f9f9fb' : '#ffffff',
                    border: '1px solid #e2e4e9',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: item.is_completed ? '#868c98' : '#0e121b',
                    textDecoration: item.is_completed ? 'line-through' : 'none'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.is_completed}
                    onChange={() => {}}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ flex: 1 }}>{item.title}</span>
                </div>
              ))}

              {(!task.checklist_items || task.checklist_items.length === 0) && !isAddingChecklist && (
                <div style={{ padding: '12px', textAlign: 'center', color: '#868c98', fontSize: '12px', border: '1px dashed #e2e4e9', borderRadius: '8px' }}>
                  Aucun élément de checklist.
                </div>
              )}
            </div>
          </div>

          {/* Comments section */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#868c98', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Commentaires ({task.comments?.length || 0})
            </div>

            {/* Comments list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {task.comments && task.comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f9f9fb',
                    border: '1px solid #e2e4e9',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0e121b' }}>
                      {comment.author_name}
                    </span>
                    <span style={{ fontSize: '10px', color: '#868c98' }}>
                      {new Date(comment.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#333741', lineHeight: 1.4 }}>
                    {comment.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Comment input form */}
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Écrire un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e4e9',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isSubmittingComment || !newComment.trim()}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#0e121b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: !newComment.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Send size={13} />
                Publier
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
