import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { tasksApi } from '../services/api';
import type { Project, ProjectStatus, TaskPriority } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectToEdit?: Project | null;
}

const COLOR_PALETTE = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4',
  '#0e121b', '#64748b'
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projectToEdit
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('ACTIVE');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [color, setColor] = useState('#3b82f6');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [budgetHours, setBudgetHours] = useState('0');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectToEdit) {
      setCode(projectToEdit.code);
      setName(projectToEdit.name);
      setDescription(projectToEdit.description || '');
      setStatus(projectToEdit.status);
      setPriority(projectToEdit.priority);
      setColor(projectToEdit.color || '#3b82f6');
      setStartDate(projectToEdit.start_date || '');
      setDueDate(projectToEdit.due_date || '');
      setBudgetHours(projectToEdit.budget_hours?.toString() || '0');
    } else {
      setCode('');
      setName('');
      setDescription('');
      setStatus('ACTIVE');
      setPriority('MEDIUM');
      setColor('#3b82f6');
      setStartDate('');
      setDueDate('');
      setBudgetHours('0');
    }
    setError(null);
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError('Le code et le nom du projet sont obligatoires.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (projectToEdit) {
        await tasksApi.updateProject(projectToEdit.id, {
          code: code.trim().toUpperCase(),
          name: name.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          color,
          start_date: startDate || undefined,
          due_date: dueDate || undefined,
          budget_hours: parseFloat(budgetHours) || 0
        });
      } else {
        await tasksApi.createProject({
          code: code.trim().toUpperCase(),
          name: name.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          color,
          start_date: startDate || undefined,
          due_date: dueDate || undefined,
          budget_hours: parseFloat(budgetHours) || 0
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde du projet.');
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
        maxWidth: '520px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        border: '1px solid #e2e4e9',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
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
              {projectToEdit ? 'Modifier le Projet' : 'Nouveau Projet'}
            </h2>
            <p style={{ fontSize: '12px', color: '#525866', margin: '2px 0 0' }}>
              Configurez le code préfixe, l'identité et le calendrier du projet.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#868c98' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

          {/* Code & Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                Code court <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                maxLength={8}
                placeholder="Ex: ERP"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #e2e4e9',
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                Nom du projet <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Refonte Plateforme Web"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e4e9',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Color palette */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '6px' }}>
              Couleur d'identification
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {COLOR_PALETTE.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: c,
                    border: color === c ? '2px solid #0e121b' : '2px solid transparent',
                    outline: color === c ? '2px solid #ffffff' : 'none',
                    cursor: 'pointer',
                    transform: color === c ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.15s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Status & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
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
                <option value="PLANNING">En planification</option>
                <option value="ACTIVE">En cours / Actif</option>
                <option value="ON_HOLD">En pause</option>
                <option value="COMPLETED">Terminé</option>
                <option value="ARCHIVED">Archivé</option>
              </select>
            </div>

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
                <option value="URGENT">Urgente</option>
              </select>
            </div>
          </div>

          {/* Dates & Budget Hours */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                Date début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid #e2e4e9',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                Date fin
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid #e2e4e9',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                Budget (Heures)
              </label>
              <input
                type="number"
                min="0"
                value={budgetHours}
                onChange={(e) => setBudgetHours(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid #e2e4e9',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
              Description du projet
            </label>
            <textarea
              rows={3}
              placeholder="Objectifs stratégiques, livrables attendus..."
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

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '8px',
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
              {loading ? 'Enregistrement...' : projectToEdit ? 'Mettre à jour' : 'Créer le projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
