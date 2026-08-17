import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { tasksApi } from '../services/api';
import type { Task, Project, TaskStatus, TaskPriority, TaskLabel } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialStatus?: TaskStatus;
  initialProject?: string;
  taskToEdit?: Task | null;
  projects: Project[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialStatus = 'TODO',
  initialProject = '',
  taskToEdit,
  projects
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(initialProject);
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('0');
  
  const [checklists, setChecklists] = useState<string[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setProjectId(taskToEdit.project || '');
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.due_date || '');
      setStartDate(taskToEdit.start_date || '');
      setEstimatedHours(taskToEdit.estimated_hours?.toString() || '0');
      setChecklists([]);
    } else {
      setTitle('');
      setDescription('');
      setProjectId(initialProject || (projects.length > 0 ? projects[0].id : ''));
      setStatus(initialStatus);
      setPriority('MEDIUM');
      setDueDate('');
      setStartDate('');
      setEstimatedHours('0');
      setChecklists([]);
    }
    setError(null);
  }, [taskToEdit, isOpen, initialStatus, initialProject, projects]);

  if (!isOpen) return null;

  const handleAddChecklist = () => {
    if (!newChecklistText.trim()) return;
    setChecklists([...checklists, newChecklistText.trim()]);
    setNewChecklistText('');
  };

  const handleRemoveChecklist = (index: number) => {
    setChecklists(checklists.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Le titre de la tâche est obligatoire.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (taskToEdit) {
        await tasksApi.updateTask(taskToEdit.id, {
          title,
          description,
          project: projectId || undefined,
          status,
          priority,
          due_date: dueDate || undefined,
          start_date: startDate || undefined,
          estimated_hours: parseFloat(estimatedHours) || 0
        });
      } else {
        const created = await tasksApi.createTask({
          title,
          description,
          project: projectId || undefined,
          status,
          priority,
          due_date: dueDate || undefined,
          start_date: startDate || undefined,
          estimated_hours: parseFloat(estimatedHours) || 0
        });

        // Add checklists if any
        for (const itemTitle of checklists) {
          await tasksApi.addChecklistItem(created.id, itemTitle);
        }
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde de la tâche.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(14, 18, 27, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        border: '1px solid #e2e4e9',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e4e9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#0e121b' }}>
              {taskToEdit ? 'Modifier la Tâche' : 'Créer une Nouvelle Tâche'}
            </h2>
            <p style={{ fontSize: '12px', color: '#525866', margin: '2px 0 0' }}>
              Renseignez les détails, échéances et sous-tâches.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#868c98' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              borderRadius: '8px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0e121b', marginBottom: '6px' }}>
              Titre de la tâche <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Rédiger le rapport d'audit trimestriel..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e4e9',
                fontSize: '13px',
                color: '#0e121b',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Project & Status Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                Projet associé
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #e2e4e9',
                  fontSize: '13px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="">Aucun projet</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>[{p.code}] {p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #e2e4e9',
                  fontSize: '13px',
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
          </div>

          {/* Priority & Estimated Hours */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #e2e4e9',
                  fontSize: '13px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="LOW">Basse</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Haute</option>
                <option value="URGENT">Urgente 🔴</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                Temps estimé (Heures)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #e2e4e9',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                Date de début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #e2e4e9',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                Échéance (Due Date)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #e2e4e9',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
              Description détaillée
            </label>
            <textarea
              rows={3}
              placeholder="Détails, consignes ou liens utiles..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e4e9',
                fontSize: '13px',
                color: '#0e121b',
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Checklists (Only for new tasks) */}
          {!taskToEdit && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '6px' }}>
                Checklist / Sous-tâches ({checklists.length})
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Ajouter une étape..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChecklist();
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #e2e4e9',
                    fontSize: '12px'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddChecklist}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #e2e4e9',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>

              {checklists.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {checklists.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        backgroundColor: '#f9f9fb',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    >
                      <span>• {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChecklist(idx)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#dc2626' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '12px',
            paddingTop: '16px',
            borderTop: '1px solid #e2e4e9'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e4e9',
                backgroundColor: '#ffffff',
                color: '#525866',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0e121b',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Enregistrement...' : taskToEdit ? 'Mettre à jour' : 'Créer la tâche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
