import React, { useEffect, useState } from 'react';
import { Settings, Plus, Tag, Scale, Check, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { inventoryApi } from '../services/api';
import type { Category, Unit } from '../types';

export const SettingsPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  // New Category
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // New Unit
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitSymbol, setNewUnitSymbol] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, unts] = await Promise.all([
        inventoryApi.getCategories(),
        inventoryApi.getUnits()
      ]);
      setCategories(cats);
      setUnits(unts);
    } catch (err) {
      console.error('Failed to load settings data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatCode) return;
    try {
      await inventoryApi.createCategory({
        name: newCatName,
        code: newCatCode,
        description: newCatDesc
      });
      setNewCatName('');
      setNewCatCode('');
      setNewCatDesc('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName || !newUnitSymbol) return;
    try {
      await inventoryApi.createUnit({
        name: newUnitName,
        symbol: newUnitSymbol
      });
      setNewUnitName('');
      setNewUnitSymbol('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Paramètres de Gestion des Stocks"
        subtitle="Classification des articles, nomenclature des unités de mesure et règles de valorisation."
        breadcrumbs={[{ label: 'Stock & Logistique' }, { label: 'Paramètres' }]}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        {/* Categories Manager */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e4e9',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Tag size={18} color="#6366f1" />
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#0e121b' }}>
              Catégories d'Articles ({categories.length})
            </h3>
          </div>

          <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
              <input
                type="text"
                placeholder="Code (ex: IT-ELEC)"
                value={newCatCode}
                onChange={(e) => setNewCatCode(e.target.value)}
                style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cdd0d5', fontSize: '12px' }}
              />
              <input
                type="text"
                placeholder="Libellé de la catégorie"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cdd0d5', fontSize: '12px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Description courte..."
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cdd0d5', fontSize: '12px' }}
              />
              <button
                type="submit"
                style={{ padding: '7px 14px', borderRadius: '6px', border: 'none', background: '#0e121b', color: '#ffffff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Ajouter
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#f9f9fb',
                  fontSize: '13px'
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, color: '#0e121b' }}>{cat.name}</span>
                  <span style={{ fontSize: '11px', color: '#868c98', marginLeft: '8px' }}>[{cat.code}]</span>
                </div>
                <span style={{ fontSize: '11px', color: '#525866', backgroundColor: '#ffffff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e2e4e9' }}>
                  {cat.products_count || 0} articles
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Units Manager */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e4e9',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Scale size={18} color="#059669" />
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#0e121b' }}>
              Unités de Mesure ({units.length})
            </h3>
          </div>

          <form onSubmit={handleCreateUnit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '8px', marginBottom: '1.25rem' }}>
            <input
              type="text"
              placeholder="Nom (ex: Carton de 12)"
              value={newUnitName}
              onChange={(e) => setNewUnitName(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cdd0d5', fontSize: '12px' }}
            />
            <input
              type="text"
              placeholder="Symbole (ex: ctn)"
              value={newUnitSymbol}
              onChange={(e) => setNewUnitSymbol(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cdd0d5', fontSize: '12px' }}
            />
            <button
              type="submit"
              style={{ padding: '7px 14px', borderRadius: '6px', border: 'none', background: '#0e121b', color: '#ffffff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              Ajouter
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {units.map((u) => (
              <div
                key={u.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#f9f9fb',
                  fontSize: '13px'
                }}
              >
                <span style={{ fontWeight: 600, color: '#0e121b' }}>{u.name}</span>
                <span style={{ fontWeight: 700, color: '#4f46e5', backgroundColor: '#eef2ff', padding: '2px 8px', borderRadius: '4px' }}>
                  {u.symbol}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
