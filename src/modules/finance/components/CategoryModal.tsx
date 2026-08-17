import React, { useState, useEffect } from 'react';
import { X, Tag, Folder } from 'lucide-react';
import { financeApi } from '../services/api';
import type { FinancialCategory } from '../types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: FinancialCategory | null;
  initialType?: 'INCOME' | 'EXPENSE';
}

const COLOR_OPTIONS = [
  '#10b981', '#059669', '#3b82f6', '#6366f1',
  '#ef4444', '#f97316', '#f59e0b', '#8b5cf6',
  '#ec4899', '#64748b'
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categoryToEdit,
  initialType = 'EXPENSE'
}) => {
  const [name, setName] = useState('');
  const [categoryType, setCategoryType] = useState<'INCOME' | 'EXPENSE'>(initialType);
  const [code, setCode] = useState('');
  const [color, setColor] = useState('#10b981');
  const [icon, setIcon] = useState('Folder');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        setName(categoryToEdit.name);
        setCategoryType(categoryToEdit.category_type);
        setCode(categoryToEdit.code || '');
        setColor(categoryToEdit.color || '#10b981');
        setIcon(categoryToEdit.icon || 'Folder');
        setDescription(categoryToEdit.description || '');
      } else {
        setName('');
        setCategoryType(initialType);
        setCode('');
        setColor(initialType === 'INCOME' ? '#10b981' : '#ef4444');
        setIcon('Folder');
        setDescription('');
      }
      setError(null);
    }
  }, [isOpen, categoryToEdit, initialType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Le nom de la catégorie est obligatoire.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<FinancialCategory> = {
        name: name.trim(),
        category_type: categoryType,
        code: code.trim() || undefined,
        color,
        icon,
        description: description.trim() || undefined
      };

      if (categoryToEdit) {
        await financeApi.updateCategory(categoryToEdit.id, payload);
      } else {
        await financeApi.createCategory(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde de la catégorie.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
        maxWidth: '480px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: categoryType === 'INCOME' ? '#ecfdf5' : '#fef2f2',
              color: categoryType === 'INCOME' ? '#059669' : '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Tag size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                {categoryToEdit ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Classification pour l'analyse budgétaire et comptable
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          {/* Category Type */}
          {!categoryToEdit && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setCategoryType('EXPENSE')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: categoryType === 'EXPENSE' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                  backgroundColor: categoryType === 'EXPENSE' ? '#fef2f2' : '#ffffff',
                  color: categoryType === 'EXPENSE' ? '#b91c1c' : '#64748b',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Dépense
              </button>
              <button
                type="button"
                onClick={() => setCategoryType('INCOME')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: categoryType === 'INCOME' ? '2px solid #10b981' : '1px solid #e2e8f0',
                  backgroundColor: categoryType === 'INCOME' ? '#ecfdf5' : '#ffffff',
                  color: categoryType === 'INCOME' ? '#047857' : '#64748b',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Revenu / Recette
              </button>
            </div>
          )}

          {/* Name & Code */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Intitulé de la Catégorie *
            </label>
            <input
              type="text"
              placeholder="Ex: Salaires, Ventes directes, Publicité Facebook..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Code Analytique / Plan comptable (facultatif)
            </label>
            <input
              type="text"
              placeholder="Ex: 641, 706, DEP-PUB..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
            />
          </div>

          {/* Color */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Couleur d'identification
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: c,
                    border: color === c ? '3px solid #0f172a' : '1px solid transparent',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Description / Instructions
            </label>
            <input
              type="text"
              placeholder="Ex: Dépenses liées aux serveurs AWS et licences SaaS..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                color: '#475569',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: categoryType === 'INCOME' ? '#059669' : '#dc2626',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Enregistrement...' : (categoryToEdit ? 'Mettre à jour' : 'Créer la Catégorie')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
