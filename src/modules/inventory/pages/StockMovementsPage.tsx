import React, { useEffect, useState } from 'react';
import {
  History, Search, Filter, ArrowRightLeft, ArrowDownLeft,
  ArrowUpRight, RefreshCw, Calendar, FileText
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StockTransferModal } from '../components/StockTransferModal';
import { inventoryApi } from '../services/api';
import type { StockMovement, Warehouse } from '../types';

export const StockMovementsPage: React.FC = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mvtData, whData] = await Promise.all([
        inventoryApi.getStockMovements(),
        inventoryApi.getWarehouses()
      ]);
      setMovements(mvtData);
      setWarehouses(whData);
    } catch (err) {
      console.error('Failed to load stock movements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(val);
  };

  const filteredMovements = movements.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.product_sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.movement_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.reference_document && m.reference_document.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = !selectedType || m.movement_type === selectedType;
    const matchesWarehouse =
      !selectedWarehouse ||
      m.source_warehouse === selectedWarehouse ||
      m.target_warehouse === selectedWarehouse;

    return matchesSearch && matchesType && matchesWarehouse;
  });

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Journal des Mouvements de Stock"
        subtitle="Historique inaltérable de tous les flux physiques : entrées, sorties, transferts et régularisations."
        breadcrumbs={[{ label: 'Stock & Logistique' }, { label: 'Mouvements' }]}
        actions={
          <button
            onClick={() => setIsTransferOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#0e121b',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ArrowRightLeft size={14} />
            Nouveau Transfert
          </button>
        }
      />

      {/* Filters */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e4e9',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#f9f9fb',
          border: '1px solid #e2e4e9',
          borderRadius: '8px',
          padding: '6px 12px',
          flex: 1,
          minWidth: '220px'
        }}>
          <Search size={15} color="#868c98" />
          <input
            type="text"
            placeholder="Rechercher par article, SKU, N° mouvement ou référence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%' }}
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e4e9', fontSize: '13px', backgroundColor: '#ffffff' }}
        >
          <option value="">Tous les types de flux</option>
          <option value="ENTREE_RECEPTION">Entrées Réceptions Fournisseurs</option>
          <option value="ENTREE_AJUSTEMENT">Entrées Ajustements Positifs</option>
          <option value="SORTIE_VENTE">Sorties Ventes / Expéditions</option>
          <option value="SORTIE_AJUSTEMENT">Sorties Ajustements Négatifs</option>
          <option value="TRANSFERT_DEPOT">Transferts Inter-Dépôts</option>
          <option value="SORTIE_REBUT">Sorties Rebuts / Pertes</option>
        </select>

        <select
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e4e9', fontSize: '13px', backgroundColor: '#ffffff' }}
        >
          <option value="">Tous les entrepôts</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>

        <button
          onClick={loadData}
          style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e4e9', background: '#ffffff', color: '#525866', cursor: 'pointer' }}
          title="Rafraîchir"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Movements Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e4e9',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(14, 18, 27, 0.05)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9f9fb', borderBottom: '1px solid #e2e4e9', textAlign: 'left', color: '#525866' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Date & Heure</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>N° Mouvement</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Type de Flux</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Article</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Origine / Destination</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Quantité</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Coût Total</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Opérateur & Justification</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#868c98' }}>
                  Chargement des écritures...
                </td>
              </tr>
            ) : filteredMovements.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#868c98' }}>
                  <History size={36} style={{ margin: '0 auto 8px', color: '#cdd0d5' }} />
                  <div style={{ fontWeight: 600, color: '#0e121b' }}>Aucun mouvement trouvé</div>
                </td>
              </tr>
            ) : (
              filteredMovements.map((mvt) => {
                const isEntry = mvt.movement_type.startsWith('ENTREE');
                const isExit = mvt.movement_type.startsWith('SORTIE');
                return (
                  <tr key={mvt.id} style={{ borderBottom: '1px solid #f3f3f6' }}>
                    <td style={{ padding: '12px 16px', color: '#525866' }}>
                      {new Date(mvt.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0e121b' }}>
                      {mvt.movement_number}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: isEntry ? '#ecfdf5' : isExit ? '#fee2e2' : '#e0e7ff',
                        color: isEntry ? '#059669' : isExit ? '#dc2626' : '#4f46e5'
                      }}>
                        {mvt.movement_type_display}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#0e121b' }}>{mvt.product_name}</div>
                      <div style={{ fontSize: '11px', color: '#868c98' }}>SKU: {mvt.product_sku}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#525866' }}>
                      {mvt.source_warehouse_name && mvt.target_warehouse_name
                        ? `${mvt.source_warehouse_name} ➔ ${mvt.target_warehouse_name}`
                        : mvt.target_warehouse_name || mvt.source_warehouse_name || '-'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: isEntry ? '#059669' : isExit ? '#dc2626' : '#0e121b' }}>
                      {isEntry ? `+${mvt.quantity}` : isExit ? `-${mvt.quantity}` : mvt.quantity} {mvt.unit_symbol}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#0e121b' }}>
                      {formatCurrency(mvt.total_cost)}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#525866', fontSize: '12px' }}>
                      <div>Par: <strong>{mvt.performed_by_name || 'Système'}</strong></div>
                      <div style={{ color: '#868c98' }}>
                        {mvt.reference_document && `[${mvt.reference_document}] `}
                        {mvt.reason || ''}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <StockTransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};
