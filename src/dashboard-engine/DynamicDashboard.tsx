import React, { useEffect, useState, useRef } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Custom WidthProvider using ResizeObserver to bypass Vite CJS import issues
const FlexibleGridLayout = (props: any) => {
  const [width, setWidth] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentRect.width > 0) {
          setWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <GridLayout width={width} {...props} />
    </div>
  );
};
import 'react-resizable/css/styles.css';
import { apiClient } from '../core/api/client';
import { WIDGET_REGISTRY } from './WidgetRegistry';
import { Settings, Save, Plus } from 'lucide-react';

interface WidgetPlacement {
  id: string;
  widget_id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  config: any;
}

interface DashboardLayoutData {
  id: string;
  name: string;
  is_default: boolean;
  widgets: WidgetPlacement[];
}

export const DynamicDashboard: React.FC = () => {
  const [layoutData, setLayoutData] = useState<DashboardLayoutData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [layout, setLayout] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLayout();
  }, []);

  const fetchLayout = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<DashboardLayoutData>('/core/dashboards/layouts/my_dashboard/');
      setLayoutData(data);
      setLayout(data.widgets.map(w => ({
        i: w.id || w.widget_id,
        x: w.x,
        y: w.y,
        w: w.w,
        h: w.h
      })));
    } catch (e) {
      console.error("Error fetching dashboard layout", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLayoutChange = (newLayout: any[]) => {
    setLayout(newLayout);
  };

  const saveLayout = async () => {
    if (!layoutData) return;
    try {
      // Rebuild the widgets array based on new layout
      const updatedWidgets = layout.map(l => {
        const original = layoutData.widgets.find(w => w.id === l.i || w.widget_id === l.i);
        return {
          widget_id: original?.widget_id || l.i,
          x: l.x,
          y: l.y,
          w: l.w,
          h: l.h,
          config: original?.config || {}
        };
      });

      await apiClient.post(`/core/dashboards/layouts/${layoutData.id}/save_layout/`, {
        widgets: updatedWidgets
      });
      setIsEditing(false);
      // refetch to get updated IDs
      await fetchLayout();
    } catch (e) {
      console.error("Error saving layout", e);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Chargement du dashboard...</div>;
  }

  return (
    <div style={{ padding: '2rem', minHeight: '100%', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>{layoutData?.name || 'Dashboard'}</h1>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                style={{ padding: '0.5rem 1rem', background: 'var(--color-surface-hover)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Annuler
              </button>
              <button 
                onClick={saveLayout}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--color-primary-600)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                <Save size={16} /> Sauvegarder
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--color-surface-hover)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, color: 'var(--color-text-secondary)' }}
            >
              <Settings size={16} /> Personnaliser
            </button>
          )}
        </div>
      </div>

      <div style={{ margin: '0 -10px' }}>
        <FlexibleGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={60}
          onLayoutChange={(newLayout) => handleLayoutChange(newLayout)}
          isDraggable={isEditing}
          isResizable={isEditing}
          margin={[20, 20]}
        >
          {layoutData?.widgets.map(widget => {
            const registryEntry = WIDGET_REGISTRY[widget.widget_id];
            const Component = registryEntry ? registryEntry.component : () => <div>Widget {widget.widget_id} non trouvé</div>;
            
            return (
              <div 
                key={widget.id || widget.widget_id} 
                data-grid={{
                  x: widget.x,
                  y: widget.y,
                  w: widget.w,
                  h: widget.h,
                  minW: 2,
                  minH: 2
                }}
                style={{ 
                  backgroundColor: 'var(--color-surface-card)', 
                  borderRadius: '12px',
                  boxShadow: isEditing ? '0 0 0 2px var(--color-primary-500)' : 'var(--color-shadow-sm)',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  cursor: isEditing ? 'grab' : 'default'
                }}
              >
                <Component config={widget.config} />
              </div>
            );
          })}
        </FlexibleGridLayout>
      </div>
    </div>
  );
};
