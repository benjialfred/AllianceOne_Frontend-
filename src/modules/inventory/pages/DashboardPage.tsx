import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Warehouse as WarehouseIcon, AlertTriangle, AlertCircle,
  TrendingUp, ArrowRightLeft, ShoppingCart, CheckCircle2,
  Boxes, RefreshCw, Plus, ArrowUpRight
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { IntelligenceAlerts } from '../components/IntelligenceAlerts';
import { StockTransferModal } from '../components/StockTransferModal';
import { inventoryApi } from '../services/api';
import type { DashboardKPIs, CategoryBreakdown, WarehouseBreakdown, IntelligenceAlert, StockMovement } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseBreakdown[]>([]);
  const [alerts, setAlerts] = useState<IntelligenceAlert[]>([]);
  const [timeline, setTimeline] = useState<StockMovement[]>([]);
  const [expiringBatches, setExpiringBatches] = useState<any[]>([]);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [kpiRes, alertRes, timelineRes, batchesRes] = await Promise.all([
        inventoryApi.getKPIs(),
        inventoryApi.getIntelligenceAlerts(),
        inventoryApi.getTimeline(),
        inventoryApi.getAllBatches({ status: 'expiring_soon' })
      ]);
      setKpis(kpiRes.kpis);
      setCategories(kpiRes.category_breakdown);
      setWarehouses(kpiRes.warehouse_breakdown);
      setAlerts(alertRes.alerts);
      setTimeline(timelineRes.timeline);
      setExpiringBatches(batchesRes);
    } catch (err) {
      console.error('Failed to load inventory dashboard data:', err);
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

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Tableau de Bord Logistique & Stocks"
        subtitle="Supervision en temps réel des flux physiques, valorisation PMP et niveaux de service."
        badge="Live API"
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsTransferOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #e2e4e9',
                backgroundColor: '#ffffff',
                color: '#0e121b',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <ArrowRightLeft size={15} />
              Transfert Inter-Dépôts
            </button>
            <button
              onClick={() => navigate('/app/inventory/products?new=1')}
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
              <Plus size={15} />
              Nouvel Article
            </button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Total Valuation */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e4e9',
          padding: '1.25rem',
          boxShadow: '0 1px 3px rgba(14, 18, 27, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#868c98', textTransform: 'uppercase' }}>
              Valeur du Stock (CUMP)
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0e121b', letterSpacing: '-0.02em' }}>
            {kpis ? formatCurrency(kpis.total_valuation_pmp) : '...'}
          </div>
          <div style={{ fontSize: '12px', color: '#525866', marginTop: '4px' }}>
            {kpis ? `${kpis.total_stock_units} unités au total` : ''}
          </div>
        </div>

        {/* Total Catalog & In Stock */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e4e9',
          padding: '1.25rem',
          boxShadow: '0 1px 3px rgba(14, 18, 27, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#868c98', textTransform: 'uppercase' }}>
              Articles au Catalogue
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0e121b', letterSpacing: '-0.02em' }}>
            {kpis?.total_products_count ?? '...'}
          </div>
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: 500, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> {kpis?.in_stock_count ?? 0} sains en stock
          </div>
        </div>

        {/* Alerts & Ruptures */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e4e9',
          padding: '1.25rem',
          boxShadow: '0 1px 3px rgba(14, 18, 27, 0.05)',
          cursor: 'pointer'
        }} onClick={() => navigate('/app/inventory/products?status=LOW_STOCK')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#868c98', textTransform: 'uppercase' }}>
              Ruptures & Alertes
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#dc2626' }}>
              {kpis?.out_of_stock_count ?? 0}
            </span>
            <span style={{ fontSize: '13px', color: '#d97706', fontWeight: 600 }}>
              + {kpis?.low_stock_count ?? 0} critiques
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#868c98', marginTop: '4px' }}>
            Nécessite réapprovisionnement
          </div>
        </div>

        {/* Pending POs */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e4e9',
          padding: '1.25rem',
          boxShadow: '0 1px 3px rgba(14, 18, 27, 0.05)',
          cursor: 'pointer'
        }} onClick={() => navigate('/app/inventory/purchase-orders')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#868c98', textTransform: 'uppercase' }}>
              Commandes d'Achat en cours
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0e121b', letterSpacing: '-0.02em' }}>
            {kpis?.pending_orders_count ?? 0}
          </div>
          <div style={{ fontSize: '12px', color: '#525866', marginTop: '4px' }}>
            {kpis ? `Attendu : ${formatCurrency(kpis.inbound_expected_value)}` : ''}
          </div>
        </div>
      </div>

      {/* Main Grid: Alerts + Stock distribution */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Left Column: Intelligence & Reorders */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e4e9',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0e121b' }}>
                Alertes & Recommandations Logistiques
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#525866' }}>
                Algorithme d'analyse des ruptures et commandes en retard
              </p>
            </div>
            <button
              onClick={loadData}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#868c98', padding: '4px' }}
              title="Rafraîchir"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {expiringBatches.length > 0 && (
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <AlertCircle size={20} color="#d97706" style={{ marginTop: '2px' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#92400e' }}>
                  Alerte de Péremption : {expiringBatches.length} lot(s) arrive(nt) à expiration
                </h4>
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#b45309', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {expiringBatches.slice(0, 3).map((b) => (
                    <div key={b.id}>
                      Lot <strong>{b.batch_number}</strong> ({b.product_name}) - Expire le {b.expiry_date}
                    </div>
                  ))}
                  {expiringBatches.length > 3 && (
                    <div style={{ fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                      + {expiringBatches.length - 3} autres lots...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <IntelligenceAlerts
            alerts={alerts}
            onActionClick={(alert) => {
              if (alert.product_id) {
                navigate(`/inventory/products/${alert.product_id}`);
              } else if (alert.order_id) {
                navigate('/app/inventory/purchase-orders');
              }
            }}
          />
        </div>

        {/* Right Column: Warehouses Breakdown */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e4e9',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0e121b' }}>
              Répartition par Entrepôt
            </h3>
            <button
              onClick={() => navigate('/app/inventory/warehouses')}
              style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Gérer
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {warehouses.map((wh) => {
              const maxVal = Math.max(...warehouses.map((w) => w.total_valuation), 1);
              const percentage = Math.round((wh.total_valuation / maxVal) * 100);

              return (
                <div key={wh.id} style={{ borderBottom: '1px solid #f3f3f6', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 500, color: '#0e121b', marginBottom: '4px' }}>
                    <span>{wh.name}</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(wh.total_valuation)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#868c98', marginBottom: '6px' }}>
                    <span>Code: {wh.code}</span>
                    <span>{wh.total_quantity} unités</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#f3f3f6', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#6366f1', borderRadius: '999px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Breakdown & Recent Timeline */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
        gap: '24px'
      }}>
        {/* Categories breakdown */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e4e9',
          padding: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600, color: '#0e121b' }}>
            Valorisation par Catégorie
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9fb',
                  fontSize: '13px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#0e121b' }}>{cat.name}</div>
                  <div style={{ fontSize: '11px', color: '#868c98' }}>{cat.items_count} références • {cat.total_quantity} u</div>
                </div>
                <div style={{ fontWeight: 700, color: '#0e121b' }}>
                  {formatCurrency(cat.total_valuation)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline of stock writes */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e4e9',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0e121b' }}>
              Flux Logistiques Récents
            </h3>
            <button
              onClick={() => navigate('/app/inventory/stock-movements')}
              style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Historique complet
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {timeline.slice(0, 6).map((mvt) => (
              <div
                key={mvt.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #f3f3f6',
                  fontSize: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: mvt.movement_type.startsWith('ENTREE') ? '#059669' : mvt.movement_type.startsWith('SORTIE') ? '#dc2626' : '#6366f1'
                  }} />
                  <div>
                    <span style={{ fontWeight: 600, color: '#0e121b' }}>{mvt.product_name}</span>
                    <span style={{ color: '#868c98', marginLeft: '6px' }}>({mvt.movement_number})</span>
                    <div style={{ fontSize: '11px', color: '#525866' }}>
                      {mvt.movement_type_display} • {mvt.target_warehouse_name || mvt.source_warehouse_name}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: mvt.movement_type.startsWith('ENTREE') ? '#059669' : '#0e121b' }}>
                    {mvt.movement_type.startsWith('ENTREE') ? `+${mvt.quantity}` : `-${mvt.quantity}`} {mvt.unit_symbol}
                  </div>
                  <div style={{ fontSize: '11px', color: '#868c98' }}>
                    {new Date(mvt.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Transfer Modal */}
      <StockTransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};
