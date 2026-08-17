import React, { useEffect, useState } from 'react';
import { Factory, Plus, Play, CheckCircle2, Search, Warehouse as WarehouseIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { inventoryApi } from '../services/api';
import type { WorkOrder, BillOfMaterial, Warehouse } from '../types';

export const ManufacturingPage: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [boms, setBoms] = useState<BillOfMaterial[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Execution state
  const [executingOrder, setExecutingOrder] = useState<string | null>(null);
  const [executeQuantity, setExecuteQuantity] = useState<string>('1');

  const loadData = async () => {
    setLoading(true);
    try {
      const [woData, bomData, whData] = await Promise.all([
        inventoryApi.getWorkOrders(),
        inventoryApi.getBOMs(),
        inventoryApi.getWarehouses()
      ]);
      setWorkOrders(woData);
      setBoms(bomData);
      setWarehouses(whData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExecute = async (woId: string) => {
    try {
      await inventoryApi.executeWorkOrder(woId, executeQuantity);
      setExecutingOrder(null);
      setExecuteQuantity('1');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'exécution');
    }
  };

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Production & Fabrication (WMS)"
        subtitle="Ordres de fabrication, nomenclatures (BOM) et assemblage."
        breadcrumbs={[{ label: 'Stock & Logistique' }, { label: 'Fabrication' }]}
        actions={
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
              borderRadius: '8px', border: 'none', backgroundColor: '#0e121b', color: '#ffffff',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            <Plus size={14} /> Nouvel Ordre
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Work Orders List */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e4e9', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem', fontWeight: 600, color: '#0e121b' }}>
            Ordres de Fabrication en cours
          </h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9fb', borderBottom: '1px solid #e2e4e9', textAlign: 'left', color: '#525866' }}>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>N° Ordre</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Produit (BOM)</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Statut</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Progression</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((wo) => (
                <tr key={wo.id} style={{ borderBottom: '1px solid #f3f3f6' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#0e121b' }}>{wo.order_number}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600, color: '#0e121b' }}>{wo.product_name}</div>
                    <div style={{ fontSize: '12px', color: '#525866' }}>{wo.bom_name} - {wo.warehouse_name}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {wo.status === 'COMPLETED' ? (
                      <span style={{ backgroundColor: '#d1fae5', color: '#059669', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Terminé</span>
                    ) : wo.status === 'IN_PROGRESS' ? (
                      <span style={{ backgroundColor: '#dbeafe', color: '#2563eb', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>En cours</span>
                    ) : (
                      <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Planifié</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#0e121b' }}>
                    {wo.completed_quantity} / {wo.planned_quantity} {wo.unit_symbol}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {wo.status !== 'COMPLETED' && wo.status !== 'CANCELLED' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                        {executingOrder === wo.id ? (
                          <>
                            <input 
                              type="number" 
                              value={executeQuantity}
                              onChange={(e) => setExecuteQuantity(e.target.value)}
                              style={{ width: '60px', padding: '4px', border: '1px solid #e2e4e9', borderRadius: '4px', fontSize: '12px' }}
                            />
                            <button onClick={() => handleExecute(wo.id)} style={{ padding: '4px 8px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Valider</button>
                            <button onClick={() => setExecutingOrder(null)} style={{ padding: '4px 8px', backgroundColor: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>X</button>
                          </>
                        ) : (
                          <button
                            onClick={() => setExecutingOrder(wo.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            <Play size={12} /> Produire
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {workOrders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#868c98' }}>Aucun ordre de fabrication</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Nomenclatures */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e4e9', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#0e121b' }}>Nomenclatures (BOM)</h3>
            <button style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>+ Créer</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {boms.map(bom => (
              <div key={bom.id} style={{ border: '1px solid #e2e4e9', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 600, color: '#0e121b', fontSize: '13px' }}>{bom.name} (v{bom.version})</div>
                  <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>{bom.items.length} composants</div>
                </div>
                <div style={{ fontSize: '12px', color: '#525866' }}>
                  Produit fini : {bom.product_name}
                </div>
              </div>
            ))}
            {boms.length === 0 && (
              <div style={{ textAlign: 'center', padding: '12px', color: '#868c98', fontSize: '13px' }}>
                Aucune nomenclature définie
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
