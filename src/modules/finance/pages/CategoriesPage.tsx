import React, { useEffect, useState } from 'react';
import {
  Tag, Plus, Sparkles, Edit, Trash2, ArrowDownRight,
  ArrowUpRight, Search
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { CategoryModal } from '../components/CategoryModal';
import { financeApi } from '../services/api';
import type { FinancialCategory } from '../types';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('ALL');
  const [search, setSearch] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<FinancialCategory | null>(null);
  const [initialType, setInitialType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await financeApi.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleGenerateDefaults = async () => {
    try {
      await financeApi.generateDefaultCategories();
      await loadCategories();
    } catch (err) {
      console.error('Failed to generate default categories:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Supprimer la catégorie "${name}" ?`)) return;
    try {
      await financeApi.deleteCategory(id);
      await loadCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  const openCreateModal = (type: 'INCOME' | 'EXPENSE' = 'EXPENSE') => {
    setCategoryToEdit(null);
    setInitialType(type);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: FinancialCategory) => {
    setCategoryToEdit(cat);
    setInitialType(cat.category_type);
    setIsModalOpen(true);
  };

  const filteredCategories = categories.filter(c => {
    const matchesTab = activeTab === 'ALL' || c.category_type === activeTab;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.code && c.code.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const expenseCount = categories.filter(c => c.category_type === 'EXPENSE').length;
  const incomeCount = categories.filter(c => c.category_type === 'INCOME').length;

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Catégories & Plan Analytique"
        subtitle="Classification comptable et analytique des flux entrants et sortants."
        badge={`${categories.length} Catégories`}
        actions={
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleGenerateDefaults}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #c7d2fe',
                backgroundColor: '#e0e7ff',
                color: '#4338ca',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Sparkles size={16} /> Générer le Plan Standard PME
            </button>

            <button
              onClick={() => openCreateModal('EXPENSE')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} /> Nouvelle Catégorie
            </button>
          </div>
        }
      />

      {/* Tabs & Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('ALL')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: activeTab === 'ALL' ? '1px solid #0f172a' : '1px solid #e2e8f0',
              backgroundColor: activeTab === 'ALL' ? '#0f172a' : '#ffffff',
              color: activeTab === 'ALL' ? '#ffffff' : '#64748b',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Toutes ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('EXPENSE')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: activeTab === 'EXPENSE' ? '1px solid #dc2626' : '1px solid #e2e8f0',
              backgroundColor: activeTab === 'EXPENSE' ? '#fef2f2' : '#ffffff',
              color: activeTab === 'EXPENSE' ? '#dc2626' : '#64748b',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Dépenses ({expenseCount})
          </button>
          <button
            onClick={() => setActiveTab('INCOME')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: activeTab === 'INCOME' ? '1px solid #059669' : '1px solid #e2e8f0',
              backgroundColor: activeTab === 'INCOME' ? '#ecfdf5' : '#ffffff',
              color: activeTab === 'INCOME' ? '#059669' : '#64748b',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Revenus ({incomeCount})
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Filtrer une catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Grid of Categories */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map(cat => {
            const isIncome = cat.category_type === 'INCOME';

            return (
              <div
                key={cat.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: `${cat.color}15`,
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isIncome ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                      {cat.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      {cat.code && (
                        <span style={{ fontFamily: 'monospace', backgroundColor: '#f1f5f9', padding: '1px 4px', borderRadius: '3px' }}>
                          {cat.code}
                        </span>
                      )}
                      <span>{cat.transactions_count || 0} opération(s)</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => openEditModal(cat)}
                    style={{ padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'pointer' }}
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    style={{ padding: '6px', borderRadius: '6px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1',
            color: '#64748b'
          }}>
            <Tag size={32} style={{ margin: '0 auto 12px auto', color: '#94a3b8' }} />
            <div style={{ fontWeight: 600, fontSize: '1rem', color: '#0f172a', marginBottom: '4px' }}>
              Aucune catégorie configurée
            </div>
            <p style={{ fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 16px auto' }}>
              Cliquez sur "Générer le Plan Standard PME" pour installer automatiquement les catégories usuelles de gestion d'entreprise (Salaires, Loyers, Prestations, etc.).
            </p>
            <button
              onClick={handleGenerateDefaults}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Générer le plan standard
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadCategories}
        categoryToEdit={categoryToEdit}
        initialType={initialType}
      />
    </div>
  );
};
